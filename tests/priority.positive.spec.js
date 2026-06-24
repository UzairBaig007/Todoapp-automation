// tests/priority.positive.spec.js
// ✅ Positive Test Cases — Priority Levels Feature (TC-01 to TC-14)
// App: https://todoapplication-one-theta.vercel.app

const { test, expect }      = require('@playwright/test');
const { DashboardPage }     = require('../pages/DashboardPage');
const { LoginPage }         = require('../pages/LoginPage');
const { TEST_USER, PRIORITIES, SORT_VALUES } = require('./fixtures/priority.data');

test.beforeEach(async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(TEST_USER.email, TEST_USER.password);
});

test.describe('✅ Positive — Priority Levels Feature', () => {

  // TC-01: Create todo with High priority
  test('TC-01 | Should create todo with High priority', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.goto();

    const title = `TC01 High Todo ${Date.now()}`;
    await dashboard.addTodo(title, PRIORITIES.HIGH);

    await expect(dashboard.prioritySelect).toHaveValue(PRIORITIES.MEDIUM); // resets to default after add
    await expect(page.locator(`text=${title}`)).toBeVisible();
  });

  // TC-02: Create todo with Medium priority
  test('TC-02 | Should create todo with Medium priority', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.goto();

    const title = `TC02 Medium Todo ${Date.now()}`;
    await dashboard.addTodo(title, PRIORITIES.MEDIUM);

    await expect(page.locator(`text=${title}`)).toBeVisible();
  });

  // TC-03: Create todo with Low priority
  test('TC-03 | Should create todo with Low priority', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.goto();

    const title = `TC03 Low Todo ${Date.now()}`;
    await dashboard.addTodo(title, PRIORITIES.LOW);

    await expect(page.locator(`text=${title}`)).toBeVisible();
  });

  // TC-04: Default priority is Medium
  test('TC-04 | Should default priority to Medium when none selected', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.goto();

    const defaultPriority = await dashboard.getDefaultPriority();
    expect(defaultPriority).toBe(PRIORITIES.MEDIUM);
  });

  // TC-05: Priority select has all 3 options
  test('TC-05 | Should show Low, Medium, High options in priority dropdown', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.goto();

    const options = await dashboard.prioritySelect.locator('option').allTextContents();
    expect(options).toContain('Low');
    expect(options).toContain('Medium');
    expect(options).toContain('High');
    expect(options).toHaveLength(3);
  });

  // TC-06: Priority badge displays correct text — use case-insensitive match
  test('TC-06 | Should display priority text label on todo card', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.goto();

    const title = `TC06 Badge Todo ${Date.now()}`;
    await dashboard.addTodo(title, PRIORITIES.HIGH);

    await expect(page.locator('[class*="priority"], [class*="badge"], span').filter({ hasText: /high/i }).first()).toBeVisible();
  });

  // TC-07: Filter todos by High priority
  test('TC-07 | Should filter and show only High priority todos', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.goto();

    const ts = Date.now();
    await dashboard.addTodo(`TC07 High ${ts}`, PRIORITIES.HIGH);
    await dashboard.addTodo(`TC07 Low ${ts}`, PRIORITIES.LOW);

    await dashboard.filterByPriority('high');

    await expect(page.locator(`text=TC07 Low ${ts}`)).not.toBeVisible();
    await expect(page.locator(`text=TC07 High ${ts}`)).toBeVisible();
  });

  // TC-08: Filter todos by Medium priority
  test('TC-08 | Should filter and show only Medium priority todos', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.goto();

    const ts = Date.now();
    await dashboard.addTodo(`TC08 Medium ${ts}`, PRIORITIES.MEDIUM);
    await dashboard.addTodo(`TC08 High ${ts}`, PRIORITIES.HIGH);

    await dashboard.filterByPriority('medium');

    await expect(page.locator(`text=TC08 High ${ts}`)).not.toBeVisible();
    await expect(page.locator(`text=TC08 Medium ${ts}`)).toBeVisible();
  });

  // TC-09: Filter todos by Low priority
  test('TC-09 | Should filter and show only Low priority todos', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.goto();

    const ts = Date.now();
    await dashboard.addTodo(`TC09 Low ${ts}`, PRIORITIES.LOW);
    await dashboard.addTodo(`TC09 High ${ts}`, PRIORITIES.HIGH);

    await dashboard.filterByPriority('low');

    await expect(page.locator(`text=TC09 High ${ts}`)).not.toBeVisible();
    await expect(page.locator(`text=TC09 Low ${ts}`)).toBeVisible();
  });

  // TC-10: Clicking High filter again (toggle off) shows all priority todos
  test('TC-10 | Should show all priority todos after toggling High filter off', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.goto();

    const ts = Date.now();
    await dashboard.addTodo(`TC10 High ${ts}`, PRIORITIES.HIGH);
    await dashboard.addTodo(`TC10 Low ${ts}`, PRIORITIES.LOW);

    // Click High to filter
    await dashboard.filterByPriority('high');
    await expect(page.locator(`text=TC10 Low ${ts}`)).not.toBeVisible();

    // Click High again to uncheck/toggle off — restores all priorities
    await dashboard.filterByPriority('high');

    await expect(page.locator(`text=TC10 High ${ts}`)).toBeVisible();
    await expect(page.locator(`text=TC10 Low ${ts}`)).toBeVisible();
  });

  // TC-11: Sort by High first — use bounding box Y position instead of DOM index
  test('TC-11 | Should sort todos with High priority first', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.goto();

    const ts = Date.now();
    await dashboard.addTodo(`TC11 Low ${ts}`, PRIORITIES.LOW);
    await dashboard.addTodo(`TC11 High ${ts}`, PRIORITIES.HIGH);

    await dashboard.sortBy(SORT_VALUES.HIGH_FIRST);

    const highBox = await page.locator(`text=TC11 High ${ts}`).first().boundingBox();
    const lowBox  = await page.locator(`text=TC11 Low ${ts}`).first().boundingBox();
    expect(highBox.y).toBeLessThan(lowBox.y);
  });

  // TC-12: Sort by Low first — use bounding box Y position instead of DOM index
  test('TC-12 | Should sort todos with Low priority first', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.goto();

    const ts = Date.now();
    await dashboard.addTodo(`TC12 High ${ts}`, PRIORITIES.HIGH);
    await dashboard.addTodo(`TC12 Low ${ts}`, PRIORITIES.LOW);

    await dashboard.sortBy(SORT_VALUES.LOW_FIRST);

    const lowBox  = await page.locator(`text=TC12 Low ${ts}`).first().boundingBox();
    const highBox = await page.locator(`text=TC12 High ${ts}`).first().boundingBox();
    expect(lowBox.y).toBeLessThan(highBox.y);
  });

  // TC-13: Priority persists after page reload — wait for todo list, not just the form
  test('TC-13 | Should persist priority after page reload', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.goto();

    const title = `TC13 Persist ${Date.now()}`;
    await dashboard.addTodo(title, PRIORITIES.HIGH);

    await page.reload();
    await page.waitForSelector('#todo-priority');
    await page.waitForLoadState('networkidle');

    await expect(page.locator(`text=${title}`)).toBeVisible();
    await expect(page.locator('[class*="priority"], [class*="badge"], span').filter({ hasText: /high/i }).first()).toBeVisible();
  });

  // TC-14: Sort dropdown has correct options
  test('TC-14 | Should have correct sort options', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.goto();

    const options = await dashboard.sortSelect.locator('option').allTextContents();
    expect(options).toContain('Default');
    expect(options.some(o => o.toLowerCase().includes('high'))).toBeTruthy();
    expect(options.some(o => o.toLowerCase().includes('low'))).toBeTruthy();
  });

});
