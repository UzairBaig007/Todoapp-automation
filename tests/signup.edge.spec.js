// tests/signup.edge.spec.js
// 🔬 Edge Cases — TC-11 to TC-17
// App: http://localhost:3001 | My Todo App

const { test, expect }  = require('@playwright/test');
const { SignupPage }     = require('../pages/SignupPage');
const { uniqueEmail, SECURITY_PAYLOADS } = require('./fixtures/signup.data');

test.describe('🔬 Edge Cases — Signup Feature', () => {

  // TC-11: Email case-insensitivity — treated as duplicate
  test('TC-11 | Should treat mixed-case email as duplicate', async ({ page }) => {
    const signupPage = new SignupPage(page);
    const base       = uniqueEmail('tc11');
    const upper      = base.charAt(0).toUpperCase() + base.slice(1);

    await signupPage.goto();
    await signupPage.signUp(base, 'Secure@123');
    await expect(page).toHaveURL('/');

    await signupPage.signOut();

    await signupPage.goto();
    await signupPage.signUp(upper, 'Secure@123');
    await expect(page).toHaveURL('/signup');
    await expect(page.locator('body')).toContainText(/already|exists|registered|taken/i);
  });

  // TC-12: Leading/trailing whitespace in email
  test('TC-12 | Should handle leading/trailing spaces in email gracefully', async ({ page }) => {
    const signupPage = new SignupPage(page);
    await signupPage.goto();

    await signupPage.fillEmail('  trimtest@example.com  ');
    await signupPage.fillPassword('Secure@123');
    await signupPage.fillConfirmPassword('Secure@123');
    await signupPage.submit();

    // Must not crash — either success (trimmed) or validation error
    await expect(page.locator('body')).not.toContainText(/500|internal server error/i);
  });

  // TC-13: Special characters in password
  test('TC-13 | Should accept password with special characters', async ({ page }) => {
    const signupPage = new SignupPage(page);
    await signupPage.goto();

    await signupPage.signUp(uniqueEmail('tc13'), 'P@$$w0rd!');

    await expect(page).toHaveURL('/');
  });

  // TC-14: Very long inputs — no crash
  test('TC-14 | Should handle very long inputs without crashing', async ({ page }) => {
    const signupPage = new SignupPage(page);
    const longPass   = 'A'.repeat(200) + 'b1!';

    await signupPage.goto();
    await signupPage.signUp(uniqueEmail('tc14'), longPass, longPass);

    await expect(page.locator('body')).not.toContainText(/500|internal server error/i);
  });

  // TC-15: Plain-text password must not appear in API responses
  test('TC-15 | Should not expose plain-text password in API response', async ({ page }) => {
    const signupPage = new SignupPage(page);
    const password   = 'PlainTextCheck1!';
    const responses  = [];

    page.on('response', async (res) => {
      const ct = res.headers()['content-type'] || '';
      if (ct.includes('application/json')) {
        const body = await res.text().catch(() => '');
        responses.push(body);
      }
    });

    await signupPage.goto();
    await signupPage.signUp(uniqueEmail('tc15'), password);

    for (const body of responses) {
      expect(body).not.toContain(password);
    }
  });

  // TC-16: SQL injection and XSS payloads
  for (const { label, value } of SECURITY_PAYLOADS) {
    test(`TC-16 | Should safely handle malicious input — ${label}`, async ({ page }) => {
      const signupPage = new SignupPage(page);
      await signupPage.goto();

      await signupPage.fillEmail(uniqueEmail('tc16'));
      await signupPage.fillPassword(value);
      await signupPage.fillConfirmPassword(value);
      await signupPage.submit();

      await expect(page.locator('body')).not.toContainText(/500|internal server error/i);
      const html = await page.locator('body').innerHTML();
      expect(html).not.toContain('<script>alert(1)</script>');
    });
  }

  // TC-17: Unicode/emoji in password
  test('TC-17 | Should handle unicode/emoji in password consistently', async ({ page }) => {
    const signupPage = new SignupPage(page);
    await signupPage.goto();

    await signupPage.signUp(uniqueEmail('tc17'), '🔐SecurePass', '🔐SecurePass');

    // No crash — either accepted or clear error
    await expect(page.locator('body')).not.toContainText(/500|internal server error/i);
  });

});
