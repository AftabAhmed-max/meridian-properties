import { test, expect, type Page } from '@playwright/test';
import seed from '../data/properties.json';

/**
 * FUNCTIONAL TESTS — Meridian Properties (live: meridian-properties-eta.vercel.app)
 *
 * Selectors and expectations are derived from the real source (Step 1):
 *  - Public site + /admin both read/write localStorage key `meridian_properties`,
 *    seeded from data/properties.json (32 records, none hidden).
 *  - Each test = fresh context = clean 32-record seed.
 *  - New properties created in /admin default to { hidden:false, featured:false },
 *    so they appear on the /properties listing (after reload, same context) but
 *    NOT on the homepage featured grid.
 */

// Seed size derived at runtime from data/properties.json — counts only the
// properties the public listing shows (hidden ones are filtered out).
const SEED_COUNT = (seed as Array<{ hidden?: boolean }>).filter(p => !p.hidden).length;
// A known-good seed id + name for the detail page.
const KNOWN_ID = 'azure-penthouse-marina';
const KNOWN_NAME = 'Azure Penthouse';

/** Desktop top-nav links (scoped to the <nav> .hidden-mobile container). */
function desktopNav(page: Page) {
  return page.locator('nav .hidden-mobile');
}

test.describe('Navigation', () => {
  test('every top-nav link routes correctly', async ({ page }) => {
    await page.goto('/');
    const nav = desktopNav(page);

    await nav.getByRole('link', { name: 'Properties', exact: true }).click();
    await expect(page).toHaveURL(/\/properties$/);
    await expect(page.getByRole('heading', { name: 'Properties', level: 1 })).toBeVisible();

    await nav.getByRole('link', { name: 'About', exact: true }).click();
    await expect(page).toHaveURL(/\/about$/);
    await expect(page.getByRole('heading', { name: 'About Meridian' })).toBeVisible();

    await nav.getByRole('link', { name: 'Contact', exact: true }).click();
    await expect(page).toHaveURL(/\/contact$/);
    await expect(page.getByRole('heading', { name: 'Contact Us', level: 1 })).toBeVisible();
  });

  test('logo returns to home from an inner page', async ({ page }) => {
    await page.goto('/about');
    await page.locator('nav a[href="/"]').first().click();
    await expect(page).toHaveURL('https://meridian-properties-eta.vercel.app/');
    await expect(page.getByRole('heading', { name: 'Where Vision Meets Value' })).toBeVisible();
  });
});

test.describe('Pages render with expected content', () => {
  test('home page loads with hero + featured section', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Where Vision Meets Value' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Search' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Featured Properties' })).toBeVisible();
    // Featured grid renders only `featured` seed properties (>0, capped at 6).
    const featuredCards = page.locator('a.property-card');
    expect(await featuredCards.count()).toBeGreaterThan(0);
  });

  test('about page shows team + milestones', async ({ page }) => {
    await page.goto('/about');
    await expect(page.getByRole('heading', { name: 'About Meridian' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Meet Our Team' })).toBeVisible();
    await expect(page.getByText('Rajan Mehrotra')).toBeVisible();
  });

  test('contact page shows form + office info', async ({ page }) => {
    await page.goto('/contact');
    await expect(page.getByRole('heading', { name: 'Contact Us', level: 1 })).toBeVisible();
    await expect(page.getByPlaceholder('Full Name')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Send Message' })).toBeVisible();
    // Scope to <main> — the footer also lists this email (would be ambiguous).
    await expect(page.getByRole('main').getByText('hello@meridianproperties.ae')).toBeVisible();
  });
});

test.describe('Property listing', () => {
  test('renders all seed cards, count label matches, each links to a detail page', async ({ page }) => {
    await page.goto('/properties');

    const cards = page.locator('a.property-card');
    await expect(cards.first()).toBeVisible();

    // Card count equals the seed size.
    await expect(cards).toHaveCount(SEED_COUNT);

    // The "N properties" counter must agree with the number of rendered cards.
    const counterText = await page.getByText(/\d+\s+propert(y|ies)/).first().innerText();
    const counter = parseInt(counterText.match(/\d+/)![0], 10);
    expect(counter).toBe(SEED_COUNT);

    // Every card points at /properties/<id>.
    const hrefs = await cards.evaluateAll(els => els.map(e => (e as HTMLAnchorElement).getAttribute('href')));
    expect(hrefs.length).toBe(SEED_COUNT);
    for (const href of hrefs) {
      expect(href).toMatch(/^\/properties\/.+/);
    }
  });

  test('clicking a card opens its detail page', async ({ page }) => {
    await page.goto('/properties');
    const firstCard = page.locator('a.property-card').first();
    const href = await firstCard.getAttribute('href');
    await firstCard.click();
    await expect(page).toHaveURL(new RegExp(`${href}$`));
    await expect(page.getByRole('heading', { name: 'About This Property' })).toBeVisible();
  });
});

test.describe('Property detail', () => {
  test('valid id renders real property fields', async ({ page }) => {
    await page.goto(`/properties/${KNOWN_ID}`);
    await expect(page.getByRole('heading', { name: KNOWN_NAME, level: 1 })).toBeVisible();
    await expect(page.getByText('Dubai Marina, Dubai')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'About This Property' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Amenities & Features' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Request a Viewing' })).toBeVisible();
    // Agent inquiry form present.
    await expect(page.getByPlaceholder('Your Name')).toBeVisible();
  });

  test('invalid numeric id is handled gracefully (no crash, shows 404 UI)', async ({ page }) => {
    const pageErrors: string[] = [];
    page.on('pageerror', e => pageErrors.push(e.message));

    await page.goto('/properties/999999');
    // [id] is a dynamic route: server returns 200, client calls notFound() -> 404 UI.
    await expect(page.locator('body')).toContainText(/404|could not be found/i);
    expect(pageErrors, `Unexpected page errors: ${pageErrors.join(' | ')}`).toHaveLength(0);
  });
});

test.describe('Contact form', () => {
  test('required-field validation blocks empty submit', async ({ page }) => {
    await page.goto('/contact');
    await page.getByRole('button', { name: 'Send Message' }).click();

    // Native HTML5 validation: the form should NOT submit -> no success state.
    await expect(page.getByText('Message Sent!')).toHaveCount(0);
    // The required "Full Name" field reports invalid.
    const nameValid = await page
      .getByPlaceholder('Full Name')
      .evaluate(el => (el as HTMLInputElement).checkValidity());
    expect(nameValid).toBe(false);
  });

  test('valid submit hits the real Formspree endpoint and shows success', async ({ page }) => {
    await page.goto('/contact');

    // Clearly-marked test payload — this DOES land in the live Formspree inbox.
    await page.getByPlaceholder('Full Name').fill('PLAYWRIGHT E2E TEST — please ignore');
    await page.getByPlaceholder('Email Address').fill('playwright-e2e@example.com');
    await page.getByPlaceholder('Phone / WhatsApp').fill('+971501234567');
    await page.locator('select').selectOption('buying'); // subject (native select)
    await page
      .getByPlaceholder(/Tell us more/)
      .fill('Automated Playwright functional test submission — please disregard.');

    // Confirm the POST actually goes to the real Formspree endpoint.
    const [response] = await Promise.all([
      page.waitForResponse(r => r.url().includes('formspree.io/f/mlgzljgb'), { timeout: 20_000 }),
      page.getByRole('button', { name: 'Send Message' }).click(),
    ]);
    expect(response.request().method()).toBe('POST');

    // Success state from the app (depends on Formspree returning res.ok).
    await expect(page.getByText('Message Sent!')).toBeVisible({ timeout: 20_000 });
  });
});

test.describe('/admin CMS (open, no auth)', () => {
  test('admin page loads without authentication', async ({ page }) => {
    await page.goto('/admin');
    await expect(page.getByRole('heading', { name: 'Property Manager' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Add Property' })).toBeVisible();
    // No password / login gate exists.
    await expect(page.locator('input[type="password"]')).toHaveCount(0);
  });

  test('CRUD: create, verify, edit, delete a property', async ({ page }) => {
    await page.goto('/admin');
    await expect(page.getByRole('heading', { name: 'Property Manager' })).toBeVisible();

    const stamp = Date.now();
    const created = `PW Create ${stamp}`;
    const edited = `PW Edited ${stamp}`; // distinct, NOT a superset of `created`

    // CREATE -----------------------------------------------------------------
    await page.getByRole('button', { name: 'Add Property' }).click();
    await expect(page.getByRole('heading', { name: 'Add New Property' })).toBeVisible();
    await page.getByPlaceholder('e.g. Azure Penthouse').fill(created);
    await page.getByPlaceholder('e.g. Dubai Marina').fill('Test Community');
    await page.getByRole('button', { name: 'Save Property' }).click();

    // Row appears, marked Active.
    const createdRow = page.locator('tr', { hasText: created });
    await expect(createdRow).toBeVisible();
    await expect(createdRow.getByText('Active')).toBeVisible();

    // EDIT -------------------------------------------------------------------
    await createdRow.locator('button[title="Edit"]').click();
    await expect(page.getByRole('heading', { name: 'Edit Property' })).toBeVisible();
    await page.getByPlaceholder('e.g. Azure Penthouse').fill(edited);
    await page.getByRole('button', { name: 'Save Property' }).click();

    await expect(page.locator('tr', { hasText: edited })).toBeVisible();
    await expect(page.locator('tr', { hasText: created })).toHaveCount(0);

    // DELETE -----------------------------------------------------------------
    const editedRow = page.locator('tr', { hasText: edited });
    await editedRow.locator('button[title="Delete"]').click();
    await expect(page.getByRole('heading', { name: 'Delete property?' })).toBeVisible();
    // The confirm button has visible text "Delete"; the row icon button has none.
    await page.locator('button', { hasText: /^Delete$/ }).click();

    await expect(page.locator('tr', { hasText: edited })).toHaveCount(0);
  });
});

test.describe('Persistence (localStorage-backed, same browser context)', () => {
  test('a CMS-created property appears on the public listing after reload', async ({ page }) => {
    const name = `PW Persist ${Date.now()}`;

    // Create in /admin.
    await page.goto('/admin');
    await page.getByRole('button', { name: 'Add Property' }).click();
    await page.getByPlaceholder('e.g. Azure Penthouse').fill(name);
    await page.getByPlaceholder('e.g. Dubai Marina').fill('Persistence Bay');
    await page.getByRole('button', { name: 'Save Property' }).click();
    await expect(page.locator('tr', { hasText: name })).toBeVisible();

    // Same context shares the localStorage store with the public site.
    await page.goto('/properties');
    await page.reload();

    // New property is hidden:false -> shows on the listing.
    await expect(page.locator('.property-name', { hasText: name })).toBeVisible();
    await expect(page.locator('a.property-card')).toHaveCount(SEED_COUNT + 1);
  });
});

test.describe('Responsive (mobile 375px)', () => {
  test('hamburger menu opens and navigates; layout has no horizontal overflow', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');

    // Desktop nav hidden, hamburger visible.
    await expect(desktopNav(page)).toBeHidden();
    const burger = page.locator('button.show-mobile');
    await expect(burger).toBeVisible();

    // Open the mobile menu and navigate.
    await burger.click();
    await expect(page.locator('.mobile-nav')).toBeVisible();
    await page.locator('.mobile-nav-link', { hasText: 'Properties' }).click();
    await expect(page).toHaveURL(/\/properties$/);

    // No horizontal scroll (layout intact at 375px).
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    expect(overflow).toBeLessThanOrEqual(1);
  });
});
