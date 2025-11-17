// CREATE LINK E2E TEST //

// UI VERIFICATION //
// Checking if all UI elements are visible upon page entry

describe('UI Verification', () => {

  // Logging in user and creating a form before each test
  beforeEach(() => {

    cy.visit('https://app.grabdocs.com/quick-links');
    cy.login();
    cy.get('button[title="Quick Apps"]').click();
    cy.contains(/Quick Links/i).click();
  
  });

  it('display content and buttons', () => {

    cy.url().should('match', /quick-links/i);
    cy.contains(/Quick Links/i).should('be.visible');
    cy.contains('button', /New Link/).should('be.visible');

  });

});


// SUCCESS SCENARIOS //
// Verifying that the user can create new link

describe('Success Scenarios', () => {

  // Logging in user and creating a form before each test
  beforeEach(() => {

    cy.visit('https://app.grabdocs.com/quick-links');
    cy.login();
    cy.get('button[title="Quick Apps"]').click();
    cy.contains(/Quick Links/i).click();
  
  });


  it('create link', () => {

    // Monitoring the backend API request and response
    cy.intercept('POST', '**api/v1/web/upload-links').as('createLink');

    // Creating new link by clicking "New Link" button
    cy.contains('button', /New Link/i).click();

    // Verifying create link form is present
    cy.contains(/Create Upload Link/i).should('be.visible');

    // Filling out create link form and submitting by clicking "Create Link" button 
    cy.get('input[placeholder="Enter link name"]').type('Testing Link');
    cy.contains('button', /Create Link/i).click();

    // Verifying that the backend receives and responds correctly
    cy.wait('@createLink').then(({request, response}) => {

      // Verifying the correct API endpoint and HTTP method was used for the request
      expect(request.url).to.include('api/v1/web/upload-links');
      expect(request.method).to.eq('POST');
      expect(request.body).to.include({
        link_name: 'Testing Link'
      });

      // Verifying that the backend responded successfully
      expect(response.statusCode).to.eq(200);
      expect(response.body).to.include({
        message: 'Upload link created successfully',
        success: true
      });

    });

    // Verifying that form is created successfully in the frontend
    cy.contains(/Upload link created successfully/i).should('be.visible');

  });

});

