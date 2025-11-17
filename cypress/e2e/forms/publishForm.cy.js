// PUBLISH FORM E2E TEST //

// UI VERFICATION //
// Checking if all UI elements are visible upon page entry

describe('UI Verification', () => {

  // Logging in user and creating a form before each test
  beforeEach(() => {

    cy.visit('https://app.grabdocs.com/login?redirect=%2Fforms');
    cy.login();
    cy.contains(/Blank Form/i).click();
  
  });

  it('display field buttons', () => {

    cy.get('button[title="Publish Form"]').should('be.visible');

 });

});


// SUCCESS SCENARIOS //
// Verifying that the user can successfully publish 

describe('Success Scenarios', () => {

  // Logging in user and creating a form before each test
  beforeEach(() => {

    cy.visit('https://app.grabdocs.com/login?redirect=%2Fforms');
    cy.login();
    cy.contains(/Blank Form/i).click();
  
  });

  it('publish form', () => {

    // Monitoring the backend API request and response
    cy.intercept('PUT', '**api/v1/web/forms/**').as('publish');

    // Publishing form by clicking "Publish" button
    cy.get('button[title="Publish Form"]').click();

    // Verifying that the backend receives and responds correctly
    cy.wait('@publish').then(({request, response}) => {

      // Verifying the correct API endpoint and HTTP method was used for the request
      expect(request.url).to.include('/api/v1/web/forms/');
      expect(request.method).to.eq('PUT');

      // Verifying that the backend responded successfully
      expect(response.statusCode).to.eq(200);
      expect(response.body).to.have.property('success', true);
      expect(response.body.form).to.include({
        is_published: true
      });

    });

    // Verifying that success message is present in the UI
    cy.contains(/Form is Published!/i).should('be.visible');

  });

});