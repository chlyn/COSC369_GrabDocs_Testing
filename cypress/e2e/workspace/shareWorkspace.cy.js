// SHARE WORKSPACE E2E TEST //

// SUCCESS SCENARIOS //
// Verifying that the user can share links

describe('Success Scenarios', () => {

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

  it('share workspace', () => {

    // Monitoring the backend API request and response
    cy.intercept('POST', '**api/v1/web/workspaces/*/invite').as('shareWorkspace');

    // Sharing workspace by clicking "Invite Member" button
    cy.get('button[title="Invite Member"]').click();

    // Verifying share workspace form is present
    cy.contains(/Invite to Testing Workspace/i).should('be.visible');

    // Filling out share workspace form
    cy.get('textarea').type('testgrabdocs@gmail.com');

    // Submitting share workspace form by clicking "Send Invitation" button
    cy.contains('button', /Send Invitation/i).click();

    // Verifying that the backend receives and responds correctly
    cy.wait('@shareWorkspace').then(({request, response}) => {

      // Verifying the correct API endpoint and HTTP method was used for the request
      expect(request.url).to.include('/api/v1/web/workspaces/');
      expect(request.url).to.include('/invite');
      expect(request.method).to.eq('POST');
      expect(request.body).to.include({
        email: 'testgrabdocs@gmail.com',
        role: 'member'
      });

      // Verifying that the backend responded successfully
      expect(response.statusCode).to.eq(200);
      expect(response.body).to.include({
        message: 'Invitation sent successfully to testgrabdocs@gmail.com',
        success: true
      });

      const response_invite_0 = response.body.invitations[0];
      expect(response_invite_0).to.include({
        email: 'testgrabdocs@gmail.com',
        email_sent: true
      });

    });

    // Verifying that workspace invited successfully in the frontend
    cy.contains(/Successfully sent 1 invitation/i).should('be.visible');

  })

});