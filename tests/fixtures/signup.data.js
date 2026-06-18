// tests/fixtures/signup.data.js
// Centralized test data for signup tests

const { v4: uuidv4 } = require('uuid');

/**
 * Generates a unique email to avoid duplicate-account collisions across test runs.
 */
const uniqueEmail = (prefix = 'testuser') =>
  `${prefix}+${uuidv4().slice(0, 8)}@example.com`;

const VALID = {
  email: uniqueEmail('valid'),
  password: 'Secure@123',
};

const INVALID_EMAILS = [
  { label: 'missing @',          value: 'userexample.com' },
  { label: 'missing domain',     value: 'user@' },
  { label: 'missing local part', value: '@example.com' },
  { label: 'double @@',          value: 'user@@example.com' },
  { label: 'spaces in email',    value: 'us er@example.com' },
];

const INVALID_PASSWORDS = [
  { label: '7 chars (boundary-1)', value: '1234567' },
  { label: '1 char',              value: 'a' },
  { label: 'empty string',        value: '' },
];

const EDGE_CASE_PASSWORDS = [
  { label: 'special characters',  value: 'P@$$w0rd!' },
  { label: 'unicode characters',  value: 'Pässwörд1' },
  { label: 'emoji in password',   value: '🔐SecurePass' },
  { label: 'max length (256)',     value: 'A'.repeat(255) + '1' },
];

const SECURITY_PAYLOADS = [
  { label: 'SQL injection',       value: "' OR 1=1 --" },
  { label: 'XSS in email',        value: '<script>alert(1)</script>@evil.com' },
  { label: 'XSS in password',     value: '<img src=x onerror=alert(1)>' },
];

module.exports = {
  uniqueEmail,
  VALID,
  INVALID_EMAILS,
  INVALID_PASSWORDS,
  EDGE_CASE_PASSWORDS,
  SECURITY_PAYLOADS,
};
