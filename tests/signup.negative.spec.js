// tests/signup.negative.spec.js
// ❌ Negative Test Cases — TC-04 to TC-10
// App: http://localhost:3001 | My Todo App

const { test, expect } = require('@playwright/test');
const { SignupPage }   = require('../pages/SignupPage');
const { uniqueEmail, INVALID_EMAILS } = require('./fixtures/signup.data');

test.describe('❌ Negative — Signup Feature', () => {

  // TC-04: Duplicate email
  test('TC-04 | Should reject signup with an already registered email', async ({ page }) => {
    const signupPage = new SignupPage(page);
    const email      = uniqueEmail('tc04');

    // Step 1: First signup — should succeed
    await signupPage.goto();
    await signupPage.signUp(email, 'Secure@123');
    await expect(page).toHaveURL('/');

    // Step 2: Sign out — redirects to /login
    await signupPage.signOut();
    await expect(page).toHaveURL('/login');

    // Step 3: Try signup again with same email — should fail
    await signupPage.goto();
    await signupPage.signUp(email, 'Secure@123');

    // Step 4: Should stay on /signup with error
    await expect(page).toHaveURL('/signup');
    await expect(page.locator('body')).toContainText(/already|exists|registered|taken/i);
  });

  // TC-05: Invalid email formats (parameterized)
  for (const { label, value } of INVALID_EMAILS) {
    test(`TC-05 | Should reject invalid email — ${label}`, async ({ page }) => {
      const signupPage = new SignupPage(page);
      await signupPage.goto();

      await signupPage.fillEmail(value);
      await signupPage.fillPassword('Secure@123');
      await signupPage.fillConfirmPassword('Secure@123');
      await signupPage.submit();

      const emailInvalid = await signupPage.emailInput.evaluate(el => !el.validity.valid);
      const stillOnSignup = page.url().includes('/signup');

      expect(emailInvalid || stillOnSignup).toBeTruthy();
    });
  }

  // TC-07: Password shorter than 8 characters
  test('TC-07 | Should reject password shorter than 8 characters', async ({ page }) => {
    const signupPage = new SignupPage(page);
    await signupPage.goto();

    await signupPage.signUp(uniqueEmail('tc07'), '1234567', '1234567');

    await expect(page).toHaveURL('/signup');
    await expect(page.locator('body')).toContainText(/password|8|characters|minimum/i);
  });

  // TC-08: Empty email field
  test('TC-08 | Should reject signup with empty email field', async ({ page }) => {
    const signupPage = new SignupPage(page);
    await signupPage.goto();

    await signupPage.fillPassword('Secure@123');
    await signupPage.fillConfirmPassword('Secure@123');
    await signupPage.submit();

    const emailInvalid = await signupPage.emailInput.evaluate(el => !el.validity.valid);
    expect(emailInvalid || page.url().includes('/signup')).toBeTruthy();
  });

  // TC-09: Empty password field
  test('TC-09 | Should reject signup with empty password field', async ({ page }) => {
    const signupPage = new SignupPage(page);
    await signupPage.goto();

    await signupPage.fillEmail(uniqueEmail('tc09'));
    await signupPage.submit();

    await expect(page).toHaveURL('/signup');
  });

  // TC-10: Both fields empty
  test('TC-10 | Should reject signup when all fields are empty', async ({ page }) => {
    const signupPage = new SignupPage(page);
    await signupPage.goto();

    await signupPage.submit();

    await expect(page).toHaveURL('/signup');
    const emailInvalid = await signupPage.emailInput.evaluate(el => !el.validity.valid);
    expect(emailInvalid).toBeTruthy();
  });

  // TC-11b: Mismatched passwords
  test('TC-11b | Should reject signup when passwords do not match', async ({ page }) => {
    const signupPage = new SignupPage(page);
    await signupPage.goto();

    await signupPage.signUp(uniqueEmail('mismatch'), 'Secure@123', 'Different@456');

    await expect(page).toHaveURL('/signup');
    await expect(page.locator('body')).toContainText(/match|password|confirm/i);
  });

});