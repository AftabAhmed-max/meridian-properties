# Playwright Test Report — Meridian Properties

| | |
|---|---|
| **Run date/time** | Fri Jun 05 2026, 16:13 IST (2026-06-05T10:43Z) |
| **Live URL tested** | https://meridian-properties-eta.vercel.app |
| **Playwright version** | 1.60.0 |
| **Browser** | Chromium (Desktop Chrome device profile) |
| **Test files** | `tests/functional.spec.ts`, `tests/crash.spec.ts` |
| **Command** | `npx playwright test` |
| **Workers** | 6 |

---

## Summary

| Result | Count |
|---|---:|
| **Total** | 29 |
| **Passed** | 22 |
| **Failed** | 7 |
| **Skipped** | 0 |
| **Duration** | ~40.6s |

> **Headline:** All 7 failures are **FALSE ALARMS caused by test bugs**, not site defects.
> 6 of 7 trace to a single wrong constant (`SEED_COUNT = 32` — the real dataset has **31** properties) and the other 4 to **strict-mode selector ambiguity** (the footer reuses heading text that the home/contact pages also use). The live site behaved correctly in every case, including persistence and the localStorage-corruption recovery. **No CRITICAL site bug was found.**

---

## Passed tests (22)

Crash/abuse/security suite — **all passed**, including every `[CRITICAL]`:

- `[WARNING]` `/admin` reachable with no authentication
- `[CRITICAL]` `/properties/abc`, `/properties/-1`, `/properties/<script>` — no crash, no XSS reflection, no dialog, no pageerror (3 tests)
- `[CRITICAL]` Contact form XSS payload not executed
- `[CRITICAL]` Script injection in CMS name/description is escaped on the public detail page
- `[CRITICAL]` Valid-but-non-array localStorage value does not white-screen the listing
- `[MINOR]` Contact: empty submit blocked, 10k oversized input, rapid double-submit
- `[WARNING]` CMS empty required fields still save (validation bypass confirmed as designed)
- `[MINOR]` CMS huge strings don't crash; unknown route returns HTTP 404

Functional suite passes: about page, property detail (valid + invalid id 404), card → detail click-through, contact required-field validation, **real Formspree submit success**, `/admin` load, **full CMS CRUD (create/edit/delete)**, mobile 375px hamburger nav.

---

## Failures — full detail

### FAIL 1 — `[CRITICAL]` (label) localStorage tampering › malformed store falls back to seed, no white-screen
- **File:line:** `tests/crash.spec.ts:222`
- **Failed assertion:** `expect(page.locator('a.property-card')).toHaveCount(SEED_COUNT)`
- **Selector:** `locator('a.property-card')`
- **Error message + stack:**
  ```
  Error: expect(locator).toHaveCount(expected) failed
  Locator:  locator('a.property-card')
  Expected: 32
  Received: 31
  Timeout:  10000ms
  Call log:
    - Expect "toHaveCount" with timeout 10000ms
    - waiting for locator('a.property-card')
      22 × locator resolved to 31 elements
         - unexpected value "31"
      at C:\Users\siddi\Desktop\STACKWORK_PROJECTS\03_DEMOS\1-websites\meridian-properties\tests\crash.spec.ts:222:51
  ```
- **Note:** The line *before* this (`crash.spec.ts:221` — `a.property-card` first card visible) **passed**, proving the app did **not** white-screen and the seed fallback worked. Only the hardcoded count (32 vs 31) failed.

---

### FAIL 2 — Navigation › every top-nav link routes correctly
- **File:line:** `tests/functional.spec.ts:41`
- **Failed assertion:** `expect(page.getByRole('heading', { name: 'Contact Us' })).toBeVisible()`
- **Selector:** `getByRole('heading', { name: 'Contact Us' })`
- **Error message + stack:**
  ```
  Error: expect(locator).toBeVisible() failed
  Locator: getByRole('heading', { name: 'Contact Us' })
  Expected: visible
  Error: strict mode violation: getByRole('heading', { name: 'Contact Us' }) resolved to 2 elements:
      1) <h1 class="section-title-light">Contact Us</h1> aka locator('h1')
      2) <h4>Contact Us</h4> aka getByRole('contentinfo').getByRole('heading', { name: 'Contact Us' })
  Call log:
    - Expect "toBeVisible" with timeout 10000ms
    - waiting for getByRole('heading', { name: 'Contact Us' })
      at C:\Users\siddi\Desktop\STACKWORK_PROJECTS\03_DEMOS\1-websites\meridian-properties\tests\functional.spec.ts:41:69
  ```
- **Note:** The nav click + `toHaveURL(/\/contact$/)` (line 40) **passed** — routing works. The failure is the ambiguous heading selector (page `<h1>` vs footer `<h4>` both read "Contact Us").

---

### FAIL 3 — Navigation › logo returns to home from an inner page
- **File:line:** `tests/functional.spec.ts:48`
- **Failed assertion:** `expect(page.getByText('Meets Value')).toBeVisible()`
- **Selector:** `getByText('Meets Value')`
- **Error message + stack:**
  ```
  Error: expect(locator).toBeVisible() failed
  Locator: getByText('Meets Value')
  Expected: visible
  Error: strict mode violation: getByText('Meets Value') resolved to 2 elements:
      1) <em>Meets Value</em> aka getByText('Meets Value', { exact: true })
      2) <p>Where Vision Meets Value. Premium real estate adv…</p> aka getByText('Where Vision Meets Value.')
  Call log:
    - Expect "toBeVisible" with timeout 10000ms
    - waiting for getByText('Meets Value')
      at C:\Users\siddi\Desktop\STACKWORK_PROJECTS\03_DEMOS\1-websites\meridian-properties\tests\functional.spec.ts:48:49
  ```
- **Note:** The logo click + `toHaveURL('…/')` (line 47) **passed** — logo→home works. Failure is the ambiguous text selector (hero `<em>` vs footer tagline `<p>`).

---

### FAIL 4 — Pages render › home page loads with hero + featured section
- **File:line:** `tests/functional.spec.ts:55`
- **Failed assertion:** `expect(page.getByText('Where Vision')).toBeVisible()`
- **Selector:** `getByText('Where Vision')`
- **Error message + stack:**
  ```
  Error: expect(locator).toBeVisible() failed
  Locator: getByText('Where Vision')
  Expected: visible
  Error: strict mode violation: getByText('Where Vision') resolved to 2 elements:
      1) <h1 class="font-display">…</h1> aka getByRole('heading', { name: 'Where Vision Meets Value' })
      2) <p>Where Vision Meets Value. Premium real estate adv…</p> aka getByText('Where Vision Meets Value.')
  Call log:
    - Expect "toBeVisible" with timeout 10000ms
    - waiting for getByText('Where Vision')
      at C:\Users\siddi\Desktop\STACKWORK_PROJECTS\03_DEMOS\1-websites\meridian-properties\tests\functional.spec.ts:55:50
  ```
- **Note:** Same root cause as FAIL 3 — hero `<h1>` and footer tagline `<p>` both contain "Where Vision Meets Value".

---

### FAIL 5 — Pages render › contact page shows form + office info
- **File:line:** `tests/functional.spec.ts:73`
- **Failed assertion:** `expect(page.getByRole('heading', { name: 'Contact Us' })).toBeVisible()`
- **Selector:** `getByRole('heading', { name: 'Contact Us' })`
- **Error message + stack:**
  ```
  Error: expect(locator).toBeVisible() failed
  Locator: getByRole('heading', { name: 'Contact Us' })
  Expected: visible
  Error: strict mode violation: getByRole('heading', { name: 'Contact Us' }) resolved to 2 elements:
      1) <h1 class="section-title-light">Contact Us</h1> aka locator('h1')
      2) <h4>Contact Us</h4> aka getByRole('contentinfo').getByRole('heading', { name: 'Contact Us' })
  Call log:
    - Expect "toBeVisible" with timeout 10000ms
    - waiting for getByRole('heading', { name: 'Contact Us' })
      at C:\Users\siddi\Desktop\STACKWORK_PROJECTS\03_DEMOS\1-websites\meridian-properties\tests\functional.spec.ts:73:69
  ```
- **Note:** Same footer/heading collision as FAIL 2.

---

### FAIL 6 — Property listing › renders all seed cards, count label matches, each links to a detail page
- **File:line:** `tests/functional.spec.ts:88`
- **Failed assertion:** `expect(cards).toHaveCount(SEED_COUNT)`
- **Selector:** `locator('a.property-card')`
- **Error message + stack:**
  ```
  Error: expect(locator).toHaveCount(expected) failed
  Locator:  locator('a.property-card')
  Expected: 32
  Received: 31
  Timeout:  10000ms
  Call log:
    - Expect "toHaveCount" with timeout 10000ms
    - waiting for locator('a.property-card')
      22 × locator resolved to 31 elements
         - unexpected value "31"
      at C:\Users\siddi\Desktop\STACKWORK_PROJECTS\03_DEMOS\1-websites\meridian-properties\tests\functional.spec.ts:88:25
  ```
- **Note:** Listing renders fine (31 cards visible). Only the hardcoded `SEED_COUNT = 32` is wrong.

---

### FAIL 7 — Persistence › a CMS-created property appears on the public listing after reload
- **File:line:** `tests/functional.spec.ts:241`
- **Failed assertion:** `expect(page.locator('a.property-card')).toHaveCount(SEED_COUNT + 1)`
- **Selector:** `locator('a.property-card')`
- **Error message + stack:**
  ```
  Error: expect(locator).toHaveCount(expected) failed
  Locator:  locator('a.property-card')
  Expected: 33
  Received: 32
  Timeout:  10000ms
  Call log:
    - Expect "toHaveCount" with timeout 10000ms
    - waiting for locator('a.property-card')
      23 × locator resolved to 32 elements
         - unexpected value "32"
      at C:\Users\siddi\Desktop\STACKWORK_PROJECTS\03_DEMOS\1-websites\meridian-properties\tests\functional.spec.ts:241:51
  ```
- **Note (important):** The assertion at line 240 — `expect(page.locator('.property-name', { hasText: name })).toBeVisible()` — **passed**, which means **the newly created property DID appear on the public listing after reload**. Persistence works exactly as the requirement states. Result 31 + 1 = **32**, which is correct; the test wrongly expected 33 because of the same wrong base constant.

---

## REAL BUGS vs FALSE ALARMS

| # | Test | Verdict | Reason |
|---|------|---------|--------|
| 1 | crash: malformed store → seed fallback | **FALSE ALARM** | App recovered to the 31-record seed, cards rendered, no white-screen (line 221 passed). Only the wrong `32` count assertion failed. The `[CRITICAL]` recovery behavior is **correct**. |
| 2 | nav: top-nav links route | **FALSE ALARM (test bug)** | Routing + URL assertion passed. Heading selector `Contact Us` is ambiguous because the **footer** has an `<h4>Contact Us</h4>`. Site is fine. |
| 3 | nav: logo → home | **FALSE ALARM (test bug)** | Logo navigation + URL assertion passed. `getByText('Meets Value')` matches both the hero `<em>` and the footer tagline `<p>`. Site is fine. |
| 4 | home renders | **FALSE ALARM (test bug)** | `getByText('Where Vision')` matches hero `<h1>` and footer tagline `<p>`. Hero renders fine. |
| 5 | contact renders | **FALSE ALARM (test bug)** | Same footer `<h4>Contact Us</h4>` collision as #2. Contact page renders fine. |
| 6 | listing card count | **FALSE ALARM (test bug)** | Listing renders all 31 cards correctly. Constant `SEED_COUNT = 32` is wrong — the real dataset (`data/properties.json`) has **31** records (verified locally: `length === 31`, 0 hidden, 31 unique ids). |
| 7 | persistence after reload | **FALSE ALARM (test bug)** | **Persistence works** — created property appears after reload (line 240 passed). Count math used the wrong base (33 vs the correct 32). |

**Net assessment:** 0 real site bugs. 7/7 failures are defects in the **test code**, not the application. The site’s navigation, rendering, listing, detail, contact/Formspree, full CMS CRUD, persistence, XSS-escaping, and localStorage-corruption recovery all behave correctly.

### Secondary observation (not a failure, worth noting)
- The dataset size is **31**, not 32. My Step-1 estimate of 32 was a miscount of the JSON array; the deployed site and the local seed agree at 31. There is **no data drift between local and live** — both are 31.
- Re-confirmed design quirks (already covered by passing tests, not bugs but product decisions): `/admin` is **unauthenticated** `[WARNING]`, and the CMS "Save Property" button **bypasses required-field validation** so blank saves create an "Untitled" listing `[WARNING]`.

---

## RECOMMENDED FIXES (describe only — NOT applied)

These are all fixes to the **test code**; the application needs no changes for these failures.

1. **Correct the dataset constant (fixes FAIL 1, 6, 7).**
   In both spec files, `SEED_COUNT` is hardcoded to `32`. Change it to `31`, or — more robustly — derive it at runtime by importing `data/properties.json` and using `seed.filter(p => !p.hidden).length` so the test self-heals if the dataset changes. The persistence test should then expect `baseCount + 1` derived the same way.

2. **Disambiguate the heading selectors (fixes FAIL 2, 5).**
   `getByRole('heading', { name: 'Contact Us' })` matches both the page `<h1>` and the footer `<h4>`. Scope it to the page heading, e.g. `page.getByRole('heading', { name: 'Contact Us', level: 1 })` or `page.locator('h1', { hasText: 'Contact Us' })`. Apply the same pattern wherever a heading text is also reused in the footer.

3. **Disambiguate the hero-text selectors (fixes FAIL 3, 4).**
   `getByText('Where Vision')` / `getByText('Meets Value')` collide with the footer tagline paragraph "Where Vision Meets Value. Premium real estate advisory…". Use the hero heading instead, e.g. `page.getByRole('heading', { name: 'Where Vision Meets Value' })`, or scope to the hero section. Avoid asserting on substrings that appear in the footer on every page.

4. **(Optional, hardening) Make count assertions self-consistent rather than absolute.**
   Where possible, assert that the rendered `a.property-card` count equals the number parsed from the on-page "N properties" counter, instead of (or in addition to) a hardcoded number. This keeps the listing test meaningful even if the catalog grows.

5. **(Optional, product — not a test fix) Consider the two `[WARNING]` design items** surfaced by passing tests: gate `/admin` behind authentication before any real deployment, and enforce required-field validation on the CMS Save button (currently `type="button"` outside the `<form>`, so HTML5 validation never fires). These are intentional for a demo but are real-world risks.

---

*Report generated from a single `npx playwright test` run against the live URL. Raw console output retained at `playwright-run-output.txt`; HTML report at `playwright-report/` (`npx playwright show-report`).*
