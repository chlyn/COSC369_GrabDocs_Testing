// Common helpers for GrabDocs Playwright tests.
// TODO: replace URL and email/passwords with your real test accounts.

const { expect } = require('@playwright/test');

// Base URL of your GrabDocs web app.
// Example: 'https://seniorcapstone2025.atlassian.net'  (change to the real one)
const BASE_URL =
  process.env.GRABDOCS_BASE_URL || 'https://YOUR-GRABDOCS-URL-HERE'; // TODO

// Test users for different roles.
const users = {
  owner: {
    email: 'owner@example.com',      // TODO: owner email
    password: 'ownerPassword123',    // TODO: owner password
  },
  editor: {
    email: 'editor@example.com',     // TODO: editor email
    password: 'editorPassword123',   // TODO: editor password
  },
  viewer: {
    email: 'viewer@example.com',     // TODO: viewer email
    password: 'viewerPassword123',   // TODO: viewer password
  },
};

// Log in as a given role.
async function login(page, role) {
  const user = users[role];
  if (!user) throw new Error(`Unknown role: ${role}`);

  // Go to login page (change path if yours is different).
  await page.goto(`${BASE_URL}/login`); // TODO if login URL is different.

  // Fill login form – adjust selectors to match your page.
  await page.fill('[data-testid="email-input"], input[name="email"]', user.email);
  await page.fill('[data-testid="password-input"], input[name="password"]', user.password);

  await page.click(
    '[data-testid="login-submit-button"], button:has-text("Sign In"), button:has-text("Log in")'
  );

  await page.waitForLoadState('networkidle');
}

// Click a document in the list by its title text.
async function openDocumentByTitle(page, title) {
  await page.getByRole('link', { name: title }).click();
  await page.waitForLoadState('networkidle');
}

// Main document content area (adjust to your app).
function documentContentLocator(page) {
  return page.getByTestId('document-content'); // TODO: e.g. page.locator('.document-body')
}

// Buttons used when a user CAN edit/delete.
function editButtonLocator(page) {
  return page.locator(
    '[data-testid="edit-document"], button:has-text("Edit")'
  );
}

function deleteButtonLocator(page) {
  return page.locator(
    '[data-testid="delete-document"], button:has-text("Delete"), button[aria-label*="Delete"], button[aria-label*="Trash"]'
  );
}

// Open the "Share" / "Collaborators" dialog.
async function openShareDialog(page) {
  await page.click(
    '[data-testid="share-document"], button:has-text("Share"), button[aria-label*="Share"]'
  );
  await expect(
    page.locator('[data-testid="share-dialog"], [role="dialog"]')
  ).toBeVisible();
}

module.exports = {
  BASE_URL,
  users,
  login,
  openDocumentByTitle,
  documentContentLocator,
  editButtonLocator,
  deleteButtonLocator,
  openShareDialog,
};
