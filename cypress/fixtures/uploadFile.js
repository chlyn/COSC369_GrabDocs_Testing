describe('Upload Test', () => {
  function verifyUpload(fname){
    //looks for uploaded file name on the page
    cy.contains(fname, { matchCase: false, timeout: 3000 })
      .should('be.visible')
      .then(null, () => {
        //if the file name wasn't found it checks if the empty state message appears
        cy.contains(/No document uploaded/i, { timeout: 1000 })
          .should('not.be.visible')
          .then(null, () => {
            //if both checks fail it capture screenshot for debugging
            cy.screenshot('upload_debug_screenshot', { capture: 'fullPage' });
            cy.document().then((doc) => {
              cy.writeFile('upload_debug_dom.html', doc.documentElement.outerHTML);
            });
            throw new Error('Upload failed');
          });
      });
  }
  it('uploads a file', () => {
    const fname = `upload_test_${Date.now()}.txt`;
    const fpath = `cypress/fixtures/${fname}`;
    cy.writeFile(fpath, 'This is a test upload file.\n');
    cy.visit('https://app.grabdocs.com/upload');
    cy.get('input[type="file"]', { timeout: 10000 })
      .first()
      .selectFile(fpath, { force: true });
    verifyUpload(fname);
  });
});
