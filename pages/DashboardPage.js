// pages/DashboardPage.js
// Page Object Model — built from real DOM inspection
// App: https://todoapplication-one-theta.vercel.app

class DashboardPage {
  constructor(page) {
    this.page = page;

    // — Todo Form ————————————————————————————————————
    this.titleInput        = page.locator('input[name="title"]');
    this.noteInput         = page.locator('textarea[name="note"]');
    this.prioritySelect    = page.locator('#todo-priority');  // select with options: low, medium, high
    this.addButton         = page.getByRole('button', { name: 'Add' });

    // — Sort ——————————————————————————————————————————
    this.sortSelect        = page.locator('#sort-order');
    // Sort values: 'none' | 'high-first' | 'low-first'

    // — Filter Buttons ————————————————————————————————
    this.filterAll         = page.getByRole('button', { name: 'All' });
    this.filterLow         = page.getByRole('button', { name: 'Low' });
    this.filterMedium      = page.getByRole('button', { name: 'Medium' });
    this.filterHigh        = page.getByRole('button', { name: 'High' });
    this.filterPending     = page.getByRole('button', { name: 'Pending' });
    this.filterInProgress  = page.getByRole('button', { name: 'In Progress' });
    this.filterCompleted   = page.getByRole('button', { name: 'Completed' });

    // — Auth ——————————————————————————————————————————
    this.signOutButton     = page.getByRole('button', { name: 'Sign Out' });
    this.userEmail         = page.locator('text=uzair@yopmail.com');
  }

  async goto() {
    await this.page.goto('/');
    await this.page.waitForSelector('#todo-priority');
  }

  // — Todo Actions ———————————————————————————————————

  async addTodo(title, priority = 'medium', note = '') {
    await this.titleInput.fill(title);
    if (note) await this.noteInput.fill(note);
    await this.prioritySelect.selectOption(priority);
    await this.addButton.click();
    // Wait for the todo to appear in the list before proceeding
    await this.page.locator(`text=${title}`).waitFor({ state: 'visible', timeout: 5000 });
  }

  async getDefaultPriority() {
    return this.prioritySelect.inputValue();
  }

  // — Priority Badge Helpers —————————————————————————

  getTodoPriorityBadge(todoTitle) {
    return this.page.locator(`text=${todoTitle}`).locator('..').locator('[class*="bg-red"], [class*="bg-yellow"], [class*="bg-green"], [class*="priority"], span:has-text("High"), span:has-text("Medium"), span:has-text("Low")').first();
  }

  getTodoCard(todoTitle) {
    return this.page.locator(`text=${todoTitle}`).first();
  }

  // — Filter Actions —————————————————————————————————

  async filterByPriority(priority) {
    const map = {
      'low':    this.filterLow,
      'medium': this.filterMedium,
      'high':   this.filterHigh,
      'all':    this.filterAll,
    };
    await map[priority].click();
    await this.page.waitForTimeout(500);
  }

  // — Sort Actions ———————————————————————————————————

  async sortBy(value) {
    await this.sortSelect.selectOption(value);
    await this.page.waitForTimeout(500);
  }

  // — Visible todos —————————————————————————————————

  async getVisibleTodoTitles() {
    return this.page.locator('text=/High|Medium|Low/').allTextContents();
  }

  // — Sign out ——————————————————————————————————————

  async signOut() {
    await this.signOutButton.click();
    await this.page.waitForURL('/login');
  }
}

module.exports = { DashboardPage };
