# Playwright Signup Tests — SCRUM-6

End-to-end automation for the **Signup Feature** covering all positive, negative, and edge cases from SCRUM-6.

---

## Project Structure

```
playwright-signup-tests/
├── pages/
│   └── SignupPage.js              # Page Object Model
├── tests/
│   ├── fixtures/
│   │   └── signup.data.js         # Centralized test data
│   ├── signup.positive.spec.js    # ✅ TC-01 to TC-03
│   ├── signup.negative.spec.js    # ❌ TC-04 to TC-10
│   └── signup.edge.spec.js        # 🔬 TC-11 to TC-17
├── playwright.config.js
├── package.json
└── README.md
```

---

## Setup

### 1. Install dependencies
```bash
npm install
npx playwright install
```

### 2. Set your app's base URL
Either set an environment variable:
```bash
export BASE_URL=http://localhost:3000
```
Or update `playwright.config.js` → `use.baseURL` directly.

---

## Running Tests

| Command | Description |
|---|---|
| `npm test` | Run all tests (headless) |
| `npm run test:positive` | Positive cases only |
| `npm run test:negative` | Negative cases only |
| `npm run test:edge` | Edge cases only |
| `npm run test:headed` | Run with browser visible |
| `npm run test:report` | Open last HTML report |
| `npm run test:ci` | CI mode (retries enabled) |

---

## Test Coverage

| TC ID | Title | Type |
|---|---|---|
| TC-01 | Successful signup with valid data | ✅ Positive |
| TC-02 | Password at minimum length (8 chars) | ✅ Positive |
| TC-03 | Valid email with plus-addressing | ✅ Positive |
| TC-04 | Duplicate email rejected | ❌ Negative |
| TC-05 | Invalid email formats (4 variants) | ❌ Negative |
| TC-07 | Password shorter than 8 chars | ❌ Negative |
| TC-08 | Empty email field | ❌ Negative |
| TC-09 | Empty password field | ❌ Negative |
| TC-10 | Both fields empty | ❌ Negative |
| TC-11 | Email case-insensitive duplicate | 🔬 Edge |
| TC-12 | Leading/trailing spaces in email | 🔬 Edge |
| TC-13 | Special characters in password | 🔬 Edge |
| TC-14 | Very long inputs (no crash) | 🔬 Edge |
| TC-15 | Plain-text password not in API response | 🔬 Edge |
| TC-16 | SQL injection / XSS payloads | 🔬 Edge |
| TC-17 | Unicode / emoji in password | 🔬 Edge |

---

## Notes

- **TC-15** (password hashing) intercepts API responses at runtime — it does **not** require DB access.
- **Locators** in `SignupPage.js` use accessible roles and labels by default. Adjust `data-testid` selectors to match your actual app's DOM.
- Tests run across **Chromium, Firefox, WebKit, and Mobile Chrome** by default. Remove projects from `playwright.config.js` if needed.
