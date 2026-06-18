// pages/SignupPage.js
// Page Object Model — built from real DOM inspection of http://localhost:3001

class SignupPage {
  constructor(page) {
    this.page = page;

    // ✅ Real locators from actual app DOM
    this.emailInput           = page.locator('#email');
    this.passwordInput        = page.locator('#password');
    this.confirmPasswordInput = page.locator('#confirmPassword');
    this.submitButton         = page.getByRole('button', { name: 'Create Account' });

    // Dashboard — Sign Out is a <button> and redirects to /login after click
    this.signOutButton        = page.getByRole('button', { name: 'Sign Out' });

    // Error messages
    this.errorMessage         = page.locator('[role="alert"], .error, [class*="error"], [class*="alert"]');
  }

  async goto() {
    await this.page.goto('/signup');
    await this.page.waitForSelector('#email');
  }

  async fillEmail(email) {
    await this.emailInput.clear();
    await this.emailInput.fill(email);
  }

  async fillPassword(password) {
    await this.passwordInput.clear();
    await this.passwordInput.fill(password);
  }

  async fillConfirmPassword(password) {
    await this.confirmPasswordInput.clear();
    await this.confirmPasswordInput.fill(password);
  }

  async submit() {
    await this.submitButton.click();
  }

  async signUp(email, password, confirmPassword = password) {
    await this.fillEmail(email);
    await this.fillPassword(password);
    await this.fillConfirmPassword(confirmPassword);
    await this.submit();
  }

  // Sign out and wait for redirect to /login
  async signOut() {
    await this.signOutButton.click();
    await this.page.waitForURL('/login');
  }
}

module.exports = { SignupPage };