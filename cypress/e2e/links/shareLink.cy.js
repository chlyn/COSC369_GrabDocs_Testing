// SHARE LINK E2E TEST //

// SUCCESS SCENARIOS //
// Verifying that the user can share links

describe('Success Scenarios', () => {

  // Logging in user and creating a form before each test
  beforeEach(() => {

    cy.visit('https://app.grabdocs.com/quick-links');
    cy.login();
    cy.get('button[title="Quick Apps"]').click();
    cy.contains(/Quick Links/i).click();
    cy.contains('button', /New Link/i).click();
    cy.contains('button', /Create Link/i).click();
  
  });

  it('share link', () => {

    // Going to more actions 
    cy.contains('td', 'Unnamed Link')
      .parent('tr')
      .find('button[aria-label="Options"]')
      .click();

    // Sharing link by clicking "Share"
    cy.contains('button', /Share/i).click();

    // Verifying share link form is present
    cy.contains(/Share Upload Link/i).should('be.visible');

    // Submitting share link form by clicking "Copy Link"
    cy.contains('button', /Copy Link/i).click();

    // Verifying that link copied successfully in the frontend
    cy.contains(/Copied to clipboard/i).should('be.visible');

  });

});