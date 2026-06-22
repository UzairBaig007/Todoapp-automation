// tests/signup.positive.spec.js
// ✅ Positive Test Cases — TC-01, TC-02, TC-03
// App: http://localhost:3001 | My Todo App

const { test, expect } = require('@playwright/test');
const { SignupPage }   = require('../pages/SignupPage');
const { uniqueEmail }  = require('./fixtures/signup.data');

test.describe('✅ Positive — Signup Feature', () => {

  // TC-01: Successful signup with valid unique email and password
  test('TC-01 | Should create account with valid unique email and password', async ({ page }) => {
    const signupPage = new SignupPage(page);
    const email      = uniqueEmail('tc01');

    await signupPage.goto();
    await signupPage.signUp(email, 'Secure@123');

    // After signup: redirected to dashboard at '/'
    await expect(page).toHaveURL('/');
    // User email displayed top-right confirms login
    await expect(page.locator(`text=${email}`)).toBeVisible();
  });

  // TC-02: Password exactly 8 characters (minimum boundary)
  test('TC-02 | Should accept password of exactly 8 characters (boundary)', async ({ page }) => {
    const signupPage = new SignupPage(page);
    const email      = uniqueEmail('tc02');

    await signupPage.goto();
    await signupPage.signUp(email, 'Exact8Ch'); // exactly 8 chars

    await expect(page).toHaveURL('/');
    await expect(page.locator(`text=${email}`)).toBeVisible();
  });

  // TC-03: Valid email with plus-addressing
  test('TC-03 | Should accept valid email with plus-addressing', async ({ page }) => {
    const signupPage = new SignupPage(page);
    const email      = `user+${Date.now()}`;

    await signupPage.goto();
    await signupPage.signUp(email, 'Secure@123');

    await expect(page).toHaveURL('/');
    await expect(page.locator(`text=${email}`)).toBeVisible();
  });

});
