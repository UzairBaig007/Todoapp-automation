// tests/fixtures/priority.data.js
// Centralized test data for priority tests

const TEST_USER = {
  email:    'uzair@yopmail.com',
  password: '12345678',
};

const PRIORITIES = {
  LOW:    'low',
  MEDIUM: 'medium',
  HIGH:   'high',
};

const TODO_TITLES = {
  HIGH:   `High Priority Todo ${Date.now()}`,
  MEDIUM: `Medium Priority Todo ${Date.now()}`,
  LOW:    `Low Priority Todo ${Date.now()}`,
};

const SORT_VALUES = {
  DEFAULT:    'none',
  HIGH_FIRST: 'high-first',
  LOW_FIRST:  'low-first',
};

module.exports = {
  TEST_USER,
  PRIORITIES,
  TODO_TITLES,
  SORT_VALUES,
};
