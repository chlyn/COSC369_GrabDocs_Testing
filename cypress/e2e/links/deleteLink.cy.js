// DELETE LINK E2E TEST //

// SUCCESS SCENARIOS //
// Verifying that the user can delete links

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

    // Monitoring the backend API request and response
    cy.intercept('DELETE', '**api/v1/web/upload-links/**').as('deleteLink');

    // Going to more actions 
    cy.contains('td', 'Unnamed Link')
      .parent('tr')
      .find('button[aria-label="Options"]')
      .click();

    // Sharing link by clicking "Share"
    cy.contains('button', /Delete/i).click();

    // Verifying that the backend receives and responds correctly
    cy.wait('@deleteLink').then(({request, response}) => {

      // Verifying the correct API endpoint and HTTP method was used for the request
      expect(request.url).to.include('api/v1/web/upload-links/');
      expect(request.method).to.eq('DELETE');

      // Verifying that the backend responded successfully
      expect(response.statusCode).to.eq(200);
      expect(response.body).to.include({
        message: 'Upload link deleted successfully',
        success: true
      });

    });

    // Verifying that link deleted successfully in the frontend
    cy.contains(/Upload link deleted successfully/i).should('be.visible');

  });

});