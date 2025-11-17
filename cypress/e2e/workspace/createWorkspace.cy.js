// CREATE WORKSPACE E2E TEST //

// UI VERIFICATION //
// Checking if all UI elements are visible upon page entry

describe('UI Verification', () => {

  // Logging in user and going to workspaces page before each test
  beforeEach(() => {

    cy.visit('https://app.grabdocs.com/workspaces');
    cy.login();
    cy.get('button[title="Quick Apps"]').click();
    cy.contains(/Workspaces/i).click();
  
  });

  it('display content and buttons', () => {

    cy.url().should('match', /workspaces/i);
    cy.contains(/Workspaces/i).should('be.visible');
    cy.contains('button', /Create Workspace/).should('be.visible');

  });

});


// SUCCESS SCENARIOS //
// Verifying that the user can create new workspace

describe('Success Scenarios', () => {

  // Logging in user and going to workspaces page before each test
  beforeEach(() => {

    cy.visit('https://app.grabdocs.com/workspaces');
    cy.login();
    cy.get('button[title="Quick Apps"]').click();
    cy.contains(/Workspaces/i).click();
  
  });

  it('create workspace', () => {
    
    // Monitoring the backend API request and response
    cy.intercept('POST', '**api/v1/web/workspaces').as('createWorkspace');

    // Creating new workspace by clicking "Create Workspace" button
    cy.contains('button', /Create Workspace/).click();

    // Verifying create workspace form is present
    cy.contains(/Create New Workspace/i).should('be.visible');

    // Filling out create workspace form and submitting by clicking "Create" button
    cy.get('input[placeholder="Enter workspace name"]').type('Testing Workspace');
    cy.contains('h3', 'Create New Workspace')        
      .parents('div[class*="fixed inset-0"]')       
      .within(() => {
        cy.contains('button', /Create/i).click();
      });

    // Verifying that the backend receives and responds correctly
    cy.wait('@createWorkspace').then(({request, response}) => {

      // Verifying the correct API endpoint and HTTP method was used for the request
      expect(request.url).to.include('api/v1/web/workspaces');
      expect(request.method).to.eq('POST');
      expect(request.body).to.include({
        name: 'Testing Workspace'
      });

      // Verifying that the backend responded successfully
      expect(response.statusCode).to.eq(200);
      expect(response.body).to.have.property('success', true);
      expect(response.body.workspace).to.include({
        name: 'Testing Workspace',
        user_role: 'owner'
      });

    });

    // Verifying that workspace is created successfully in the frontend
    cy.contains(/Workspace created successfully/i).should('be.visible');
    
  });

});