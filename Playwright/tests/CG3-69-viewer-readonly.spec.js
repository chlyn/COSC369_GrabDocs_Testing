// CG3-69: Viewers can view but not edit/delete a shared document.

const { test, expect } = require('@playwright/test');
const {
  login,
  openDocumentByTitle,
  documentContentLocator,
  editButtonLocator,
  deleteButtonLocator,
} = require('../utils/grabdocsTestHelpers');

// Document that has been shared to the viewer user with "view only" permission.
const SHARED_DOC_TITLE = 'CG3-69 Test Document'; // TODO: real document title

test.describe('CG3-69: Viewer read-only access', () => {
  test('viewer can open shared document and see content', async ({ page }) => {
    await login(page, 'viewer');
    await openDocumentByTitle(page, SHARED_DOC_TITLE);

    const content = documentContentLocator(page);
    await expect(content).toBeVisible();
  });

  test('viewer cannot see edit or delete controls', async ({ page }) => {
    await login(page, 'viewer');
    await openDocumentByTitle(page, SHARED_DOC_TITLE);

    const content = documentContentLocator(page);
    await expect(content).toBeVisible();

    await expect(editButtonLocator(page)).toHaveCount(0);
    await expect(deleteButtonLocator(page)).toHaveCount(0);
  });
});
