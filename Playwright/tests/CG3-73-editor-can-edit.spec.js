// CG3-73: Editor can edit an existing document.

const { test, expect } = require('@playwright/test');
const {
  login,
  openDocumentByTitle,
  documentContentLocator,
  editButtonLocator,
} = require('../utils/grabdocsTestHelpers');

const EDITABLE_DOC_TITLE = 'CG3-73 Editor Test Document'; // TODO: real doc title
const EDIT_MARKER = ' [CG3-73 automated edit]';

test.describe('CG3-73: Editor can edit', () => {
  test('editor can modify document content and save', async ({ page }) => {
    await login(page, 'editor');
    await openDocumentByTitle(page, EDITABLE_DOC_TITLE);

    const editButton = editButtonLocator(page);
    if (await editButton.count()) {
      await editButton.first().click();
    }

    const content = documentContentLocator(page);

    await content.click();
    await content.type(EDIT_MARKER);

    await page.click(
      '[data-testid="save-document"], button:has-text("Save")'
    ); // TODO: adjust selector if needed

    // Optionally wait for a success toast.
    // await expect(page.getByText('Document saved')).toBeVisible();

    // Reload and confirm the text is still there.
    await page.reload();
    await openDocumentByTitle(page, EDITABLE_DOC_TITLE);

    const updated = documentContentLocator(page);
    await expect(updated).toContainText(EDIT_MARKER);
  });
});
