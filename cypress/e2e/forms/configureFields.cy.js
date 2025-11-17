// CONFIGURE FORM E2E TEST //

// UI VERIFICATION //
// Checking if all UI elements are visible upon page entry

describe('UI Verification', () => {

  // Logging in user and creating a form before each test
  beforeEach(() => {

    cy.visit('https://app.grabdocs.com/login?redirect=%2Fforms');
    cy.login();
    cy.contains(/Blank Form/i).click();
  
  });

  it('display field buttons', () => {

    cy.contains('button', /Text/i).should('be.visible');
    cy.contains('button', /Paragraph/i).should('be.visible');
    cy.contains('button', /Dropdown/i).should('be.visible');
    cy.contains('button', /Checkbox/i).should('be.visible');
    cy.contains('button', /Date & Time/i).should('be.visible');

 });

});


// SUCCESS SCENARIOS //
// Verifying that the user can add a field and configure it

describe('Success Scenarios', () => {

  // Logging in user and creating a form before each test
  beforeEach(() => {

    cy.visit('https://app.grabdocs.com/login?redirect=%2Fforms');
    cy.login();
    cy.contains(/Blank Form/i).click();
  
  });
  
  it('add fields', () => {

    // Monitoring the backend API request and response
    cy.intercept('PUT', '**api/v1/web/forms/**').as('addFields');

    cy.contains('button', /Text/i).click();
    cy.contains('button', /Paragraph/i).click();
    cy.contains('button', /Dropdown/i).click();
    cy.contains('button', /Checkbox/i).click();
    cy.contains('button', /Date & Time/i).click();

    cy.contains('h3', 'Edit Field')
      .siblings('button')
      .click();

    cy.get('button[title="Save Changes"]').click();

    cy.wait('@addFields').then(({request, response}) => {

      // Verifying the correct API endpoint and HTTP method was used for the request
      expect(request.url).to.include('/api/v1/web/forms/');
      expect(request.method).to.eq('PUT');

      expect(response.statusCode).to.eq(200);
      expect(response.body).to.have.property('success', true);

      const response_field_0 = response.body.json_fields[0];
      expect(response_field_0).to.include({
        title: 'New Textbox Field',
        type: 'textbox'
      });
      
      const response_field_1 = response.body.json_fields[1];
      expect(response_field_1).to.include({
        title: 'New Multiline textbox Field',
        type: 'multiline textbox'
      });

      const response_field_2 = response.body.json_fields[2];
      expect(response_field_2).to.include({
        title: 'New Dropdown Field',
        type: 'dropdown'
      });

      const response_field_3 = response.body.json_fields[3];
      expect(response_field_3).to.include({
        title: 'New Checkbox Field',
        type: 'checkbox'
      });

      const response_field_4 = response.body.json_fields[4];
      expect(response_field_4).to.include({
        title: 'New Datetime Field',
        type: 'datetime'
      });

    });

  });

})
