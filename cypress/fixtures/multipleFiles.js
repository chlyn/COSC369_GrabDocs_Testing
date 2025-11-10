describe('Upload Test', () => {
  function verifyUploads(fnames) {
    const names = Array.isArray(fnames) ? fnames : [fnames];

    names.forEach((fname) => {
      cy.contains(fname, { matchCase: false, timeout: 3000 })
        .should('be.visible')
        .then(null, () => {
          cy.contains(/No document/i, { timeout: 1000 })
            .should('not.be.visible')
            .then(null, () => {
              cy.screenshot('upload_debug_screenshot', { capture: 'fullPage' });
              cy.document().then((doc) => {
                cy.writeFile('upload_debug_dom.html', doc.documentElement.outerHTML);
              });
              throw new Error(`Upload failed for ${fname}`);
            });
        });
    });
  }

  function makeFixture(filename, text) {
    const fpath = `cypress/fixtures/${filename}`;
    cy.writeFile(fpath, text);
    return fpath;
  }

  it('uploads a single file', () => {
    const fname = `upload_test_${Date.now()}.txt`;
    const fpath = makeFixture(fname, 'This is a test upload file.\n');

    cy.visit('https://app.grabdocs.com/upload');

    cy.get('input[type="file"]', { timeout: 10000 })
      .first()
      .selectFile(fpath, { force: true });

    verifyUploads(fname);
  });

  it('uploads multiple files', () => {
    const ts = Date.now();
    const files = [
      { name: `upload_multi_${ts}_a.txt`, body: 'File A content\n' },
      { name: `upload_multi_${ts}_b.txt`, body: 'File B content\n' },
      { name: `upload_multi_${ts}_c.txt`, body: 'File C content\n' },
    ];

    const paths = files.map(f => makeFixture(f.name, f.body));

    cy.visit('https://app.grabdocs.com/upload');
    cy.get('input[type="file"]', { timeout: 10000 })
      .first()
      .selectFile(paths, { force: true });
    verifyUploads(files.map(f => f.name));
  });
});