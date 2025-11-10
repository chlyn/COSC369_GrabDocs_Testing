// CG3-74: Owner can add collaborators with correct roles.

const { test, expect } = require('@playwright/test');
const {
  login,
  openDocumentByTitle,
  openShareDialog,
  users,
} = require('../utils/grabdocsTestHelpers');

const OWNER_DOC_TITLE = 'CG3-74 Collaborators Test Document'; // TODO: real doc title

test.describe('CG3-74: Add collaborators', () => {
  test('owner can add editor and viewer collaborators', async ({ page }) => {
    await login(page, 'owner');
    await openDocumentByTitle(page, OWNER_DOC_TITLE);
    await openShareDialog(page);

    // Add editor collaborator
    await page.fill(
      '[data-testid="share-email-input"], input[name="shareEmail"]',
      users.editor.email
    );
    await page.selectOption(
      '[data-testid="share-role-select"], select[name="shareRole"]',
      'editor' // TODO: must match your <option value="">
    );
    await page.click(
      '[data-testid="share-add-button"], button:has-text("Add"), button:has-text("Invite")'
    );

    // Add viewer collaborator
    await page.fill(
      '[data-testid="share-email-input"], input[name="shareEmail"]',
      users.viewer.email
    );
    await page.selectOption(
      '[data-testid="share-role-select"], select[name="shareRole"]',
      'viewer' // TODO: must match your <option value="">
    );
    await page.click(
      '[data-testid="share-add-button"], button:has-text("Add"), button:has-text("Invite")'
    );

    // Verify collaborators list shows both users with roles
    const collaboratorsList = page.locator(
      '[data-testid="collaborators-list"]'
    ); // TODO if your app uses a different container
    await expect(collaboratorsList).toBeVisible();

    await expect(
      collaboratorsList.getByText(users.editor.email)
    ).toBeVisible();
    await expect(
      collaboratorsList.getByText(/editor/i)
    ).toBeVisible();

    await expect(
      collaboratorsList.getByText(users.viewer.email)
    ).toBeVisible();
    await expect(
      collaboratorsList.getByText(/viewer/i)
    ).toBeVisible();
  });
});

