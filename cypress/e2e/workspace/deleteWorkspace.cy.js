// DELETE WORKSPACE E2E TEST //

// SUCCESS SCENARIOS //
// Verifying that the user can delete workspaces

describe('UI Verification', () => {

  // Logging in user and going to workspaces page before each test
  beforeEach(() => {

    // Logging in user and going to workspaces page before each test
    cy.visit('https://app.grabdocs.com/workspaces');
    cy.login();
    cy.get('button[title="Quick Apps"]').click();
    cy.contains(/Workspaces/i).click();

    // Filling out create workspace form and submitting by clicking "Create" button
    cy.contains('button', /Create Workspace/).click();
    cy.get('input[placeholder="Enter workspace name"]').type('Testing Workspace');
    cy.contains('h3', 'Create New Workspace')        
      .parents('div[class*="fixed inset-0"]')       
      .within(() => {
        cy.contains('button', /Create/i).click();
      });
  
  });

  it('delete workspace', () => {

    // Monitoring the backend API request and response
    cy.intercept('DELETE', '**api/v1/web/workspaces/**').as('deleteWorkspace');

    // Deleting workspace by clicking "Delete" button
    cy.get('button[title="Delete Workspace"]').click();

    // Verifying that the backend receives and responds correctly
    cy.wait('@deleteWorkspace').then(({request, response}) => {

      // Verifying the correct API endpoint and HTTP method was used for the request
      expect(request.url).to.include('api/v1/web/workspaces/');
      expect(request.method).to.eq('DELETE');

      // Verifying that the backend responded successfully
      expect(response.statusCode).to.eq(200);
      expect(response.body).to.include({
        message: 'Workspace \"Testing Workspace\" deleted successfully',
        success: true
      });

    });

    // Verifying that link deleted successfully in the frontend
    cy.contains(/Workspace \"Testing Workspace\" deleted successfully/i).should('be.visible');

  });

});