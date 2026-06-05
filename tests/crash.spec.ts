import { test, expect, type Page } from '@playwright/test';
import seed from '../data/properties.json';

/**
 * CRASH / ABUSE / SECURITY TESTS — Meridian Properties (live).
 *
 * Each test title is labelled [CRITICAL] / [WARNING] / [MINOR].
 *
 * Step 1 facts that shape these tests:
 *  - All public rendering uses JSX text interpolation -> React auto-escapes, so
 *    injected markup should render as inert text (we assert no script executes).
 *  - The /admin "Save Property" button is type="button" OUTSIDE the <form> and
 *    runs NO validation -> empty saves succeed and create an "Untitled" row.
 *    We assert that ACTUAL behavior (and flag it), rather than assuming a block.
 *  - loadProperties() wraps JSON.parse in try/catch (falls back to seed) but does
 *    NOT validate shape, so a valid-but-non-array store value is a real risk.
 *  - Data is localStorage-only; corrupting it should not white-screen the app.
 */

// Derived at runtime from data/properties.json — only the publicly-visible (non-hidden) records.
const SEED_COUNT = (seed as Array<{ hidden?: boolean }>).filter(p => !p.hidden).length;

/** Attach listeners that record dialogs (XSS alerts) and uncaught page errors. */
function watch(page: Page) {
  const dialogs: string[] = [];
  const errors: string[] = [];
  page.on('dialog', async d => {
    dialogs.push(d.message());
    await d.dismiss().catch(() => {});
  });
  page.on('pageerror', e => errors.push(e.message));
  return { dialogs, errors };
}

/** Block real Formspree network so abuse submissions don't spam the live inbox. */
async function blockFormspree(page: Page) {
  await page.route('**/formspree.io/**', route => route.abort());
}

test.describe('Open admin access', () => {
  test('[WARNING] /admin is reachable with no authentication', async ({ page }) => {
    test.info().annotations.push({
      type: 'WARNING',
      description:
        'The CMS at /admin is fully open — anyone can create/edit/delete listings. ' +
        'Acceptable for a demo, but a real deployment must gate this behind auth.',
    });
    await page.goto('/admin');
    await expect(page.getByRole('heading', { name: 'Property Manager' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Add Property' })).toBeVisible();
    await expect(page.locator('input[type="password"]')).toHaveCount(0);
  });
});

test.describe('Malformed / hostile property ids', () => {
  for (const badId of ['abc', '-1', '%3Cscript%3Ealert(1)%3C%2Fscript%3E']) {
    test(`[CRITICAL] /properties/${badId} does not crash or reflect XSS`, async ({ page }) => {
      const { dialogs, errors } = watch(page);

      await page.goto(`/properties/${badId}`);

      // Graceful: 404 UI, app shell still rendered (footer present), no crash.
      await expect(page.locator('body')).toContainText(/404|could not be found/i);
      await expect(page.locator('footer')).toBeVisible();

      // No injected <script> element from the id should exist in the DOM.
      const injected = await page.locator('script:has-text("alert(1)")').count();
      expect(injected, 'hostile id reflected as an executable <script>').toBe(0);

      expect(dialogs, `XSS dialog fired: ${dialogs.join(' | ')}`).toHaveLength(0);
      expect(errors, `page errors: ${errors.join(' | ')}`).toHaveLength(0);
    });
  }
});

test.describe('Contact form abuse', () => {
  test('[MINOR] empty submit is blocked by validation (no success state)', async ({ page }) => {
    await page.goto('/contact');
    await page.getByRole('button', { name: 'Send Message' }).click();
    await expect(page.getByText('Message Sent!')).toHaveCount(0);
  });

  test('[CRITICAL] XSS payload in fields is not executed', async ({ page }) => {
    const { dialogs, errors } = watch(page);
    await blockFormspree(page); // don't ship the payload to the live inbox

    await page.goto('/contact');
    const xss = `<script>alert('xss')</script><img src=x onerror="alert(1)">`;
    await page.getByPlaceholder('Full Name').fill(xss);
    await page.getByPlaceholder('Email Address').fill('xss@example.com');
    await page.locator('select').selectOption('other');
    await page.getByPlaceholder(/Tell us more/).fill(xss);
    await page.getByRole('button', { name: 'Send Message' }).click();

    // Whatever the network result (we aborted it), the client must not execute JS.
    await page.waitForTimeout(1000);
    expect(dialogs, `XSS dialog fired: ${dialogs.join(' | ')}`).toHaveLength(0);
    expect(errors, `page errors: ${errors.join(' | ')}`).toHaveLength(0);
    await expect(page.getByPlaceholder('Full Name')).toBeVisible(); // page still alive
  });

  test('[MINOR] oversized input (10k chars) does not crash the form', async ({ page }) => {
    const { errors } = watch(page);
    await blockFormspree(page);

    await page.goto('/contact');
    await page.getByPlaceholder('Full Name').fill('A'.repeat(10_000));
    await page.getByPlaceholder('Email Address').fill('big@example.com');
    await page.locator('select').selectOption('other');
    await page.getByPlaceholder(/Tell us more/).fill('B'.repeat(10_000));
    await page.getByRole('button', { name: 'Send Message' }).click();

    await page.waitForTimeout(500);
    expect(errors, `page errors: ${errors.join(' | ')}`).toHaveLength(0);
    await expect(page.getByRole('button', { name: 'Send Message' })).toBeVisible();
  });

  test('[MINOR] rapid double-submit does not break the UI', async ({ page }) => {
    const { errors } = watch(page);
    // Mock a fast 200 so both clicks resolve deterministically (no real inbox spam).
    await page.route('**/formspree.io/**', route =>
      route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' })
    );

    await page.goto('/contact');
    await page.getByPlaceholder('Full Name').fill('Double Submit Test');
    await page.getByPlaceholder('Email Address').fill('double@example.com');
    await page.locator('select').selectOption('other');
    await page.getByPlaceholder(/Tell us more/).fill('rapid double submit');

    const btn = page.getByRole('button', { name: 'Send Message' });
    await btn.click();
    await btn.click({ timeout: 2000 }).catch(() => {}); // button may already be gone

    await expect(page.getByText('Message Sent!')).toBeVisible();
    expect(errors, `page errors: ${errors.join(' | ')}`).toHaveLength(0);
  });
});

test.describe('CMS field abuse', () => {
  test('[WARNING] empty required fields still save (validation is bypassed)', async ({ page }) => {
    test.info().annotations.push({
      type: 'WARNING',
      description:
        'The modal Save button is type="button" outside the <form>, so required ' +
        'fields are never enforced. Saving a blank form creates an "Untitled" row.',
    });
    await page.goto('/admin');
    await page.getByRole('button', { name: 'Add Property' }).click();
    await expect(page.getByRole('heading', { name: 'Add New Property' })).toBeVisible();
    await page.getByRole('button', { name: 'Save Property' }).click();

    // Actual behavior: a blank "Untitled" property is created (no crash, no block).
    await expect(page.locator('tr', { hasText: 'Untitled' })).toBeVisible();
  });

  test('[MINOR] huge strings in a property name do not crash the CMS', async ({ page }) => {
    const { errors } = watch(page);
    await page.goto('/admin');
    await page.getByRole('button', { name: 'Add Property' }).click();
    const huge = 'Z'.repeat(10_000);
    await page.getByPlaceholder('e.g. Azure Penthouse').fill(huge);
    await page.getByPlaceholder('e.g. Dubai Marina').fill('Huge String Town');
    await page.getByRole('button', { name: 'Save Property' }).click();

    await expect(page.locator('tr', { hasText: 'Huge String Town' })).toBeVisible();
    expect(errors, `page errors: ${errors.join(' | ')}`).toHaveLength(0);
  });

  test('[CRITICAL] script injection in name/description is escaped on the public detail page', async ({ page }) => {
    const { dialogs, errors } = watch(page);
    const marker = `XSSMARK${Date.now()}`;
    const payloadName = `<img src=x onerror="alert('${marker}')">${marker}`;
    const payloadDesc = `<script>alert('${marker}')</script>`;

    // Create the hostile property in /admin.
    await page.goto('/admin');
    await page.getByRole('button', { name: 'Add Property' }).click();
    await page.getByPlaceholder('e.g. Azure Penthouse').fill(payloadName);
    await page.getByPlaceholder('e.g. Dubai Marina').fill('Injection Bay');
    // Description textarea has no placeholder; it's the only <textarea> in the modal.
    await page.locator('textarea').first().fill(payloadDesc);
    await page.getByRole('button', { name: 'Save Property' }).click();
    await expect(page.locator('tr', { hasText: 'Injection Bay' })).toBeVisible();

    // Open it from the public listing (same context shares localStorage).
    await page.goto('/properties');
    await page.reload();
    const card = page.locator('a.property-card', { hasText: marker });
    await expect(card).toBeVisible();
    await card.click();

    // Detail page: the payload must appear as inert TEXT, never executed.
    await expect(page.locator('h1')).toContainText(marker);
    const injectedScript = await page.locator(`script:has-text("alert('${marker}')")`).count();
    expect(injectedScript, 'description rendered as an executable <script>').toBe(0);

    await page.waitForTimeout(500);
    expect(dialogs, `XSS dialog fired: ${dialogs.join(' | ')}`).toHaveLength(0);
    expect(errors, `page errors: ${errors.join(' | ')}`).toHaveLength(0);
  });
});

test.describe('Routing', () => {
  test('[MINOR] unknown top-level route returns a 404', async ({ page }) => {
    const resp = await page.goto('/this-route-does-not-exist-xyz');
    expect(resp?.status()).toBe(404);
    await expect(page.locator('body')).toContainText(/404|could not be found/i);
  });
});

test.describe('localStorage tampering', () => {
  test('[CRITICAL] malformed (unparseable) store falls back to seed, no white-screen', async ({ page }) => {
    const { errors } = watch(page);

    await page.goto('/'); // land on the origin so localStorage is writable
    await page.evaluate(() => localStorage.setItem('meridian_properties', '{ this is : not json'));

    await page.goto('/properties');
    await page.reload();

    // try/catch in loadProperties() should recover to the 32-record seed.
    await expect(page.locator('a.property-card').first()).toBeVisible();
    await expect(page.locator('a.property-card')).toHaveCount(SEED_COUNT);
    expect(errors, `page errors: ${errors.join(' | ')}`).toHaveLength(0);
  });

  test('[CRITICAL] valid-but-non-array store does not white-screen the listing', async ({ page }) => {
    test.info().annotations.push({
      type: 'CRITICAL',
      description:
        'loadProperties() only guards JSON.parse, not the shape. A valid JSON object ' +
        '(not an array) reaches properties.filter() and can throw. This test asserts ' +
        'the listing still renders; a failure here flags an unhandled-crash bug.',
    });

    await page.goto('/');
    await page.evaluate(() => localStorage.setItem('meridian_properties', '{"not":"an-array"}'));

    await page.goto('/properties');
    await page.reload();

    // App shell + content must survive (no blank/error page).
    await expect(page.locator('footer')).toBeVisible();
    await expect(page.locator('a.property-card').first()).toBeVisible();
  });
});
