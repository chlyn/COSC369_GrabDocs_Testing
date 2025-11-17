// UPLOAD STATS E2E TEST //

// SUCCESS SCENARIOS //
// Verifying that the dashboard

describe('Success Scenarios', () => {

  // Logging in user and creating a form before each test
  beforeEach(() => {

    cy.visit('https://app.grabdocs.com/analysis');
    cy.login();
  
  });

  it('Upload Stats', () => {

    // Monitoring the backend API request and response
    cy.intercept('GET', '**/api/v1/web/analysis/dashboard').as('initialStats');

    // Navigating to Quick Analysis page
    cy.get('button[title="Quick Apps"]').click();
    cy.contains(/Analysis/i).click();

    let initialNumDoc;

    // Verifying that the backend receives correct initial stats
    cy.wait('@initialStats').then(({response}) => {

      initialNumDoc = response.body.data.overview.total_files;

    });

    // Navigating to Quick Files page
    cy.get('button[title="Quick Apps"]').click();
    cy.contains(/Files/i).click();

    // Monitoring the backend API request and response
    cy.intercept('GET', '**/api/v1/web/analysis/dashboard').as('newStats');
    cy.intercept('GET', '**/api/v1/web/files').as('processUpload');
    cy.intercept('GET', '**/api/v1/web/upload-progress/**').as('uploadProgress');

    // Triggering new stat by uploading new document
    cy.get('input#file-upload').selectFile('cypress/fixtures/testdoc.pdf', {force: true});

    // Recursively waiting for actual upload to finish
    cy.wait('@processUpload');

    function waitForCompletion() {

      cy.wait('@uploadProgress').then(({response}) => {

        if (response.body.progress !== 100 || response.body.status !== 'completed') {
          waitForCompletion();
        }

      });

    }

    waitForCompletion();

    // Navigating to Quick Analysis page
    cy.get('button[title="Quick Apps"]').click();
    cy.contains(/Analysis/i).click();

    // Verifying that the backend receives correct new stats
    cy.wait('@newStats').then(({response}) => {

      const newNumDoc = response.body.data.overview.total_files;
      expect(newNumDoc).to.eq(initialNumDoc + 1);

    });

  })

});