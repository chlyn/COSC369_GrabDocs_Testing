// CREATE FORM E2E TEST //

before(() => {
  cy.session('user', () => {
    cy.login();
  });
});

// UI VERIFICATION //
// Checking if all UI elements are visible upon page entry

describe('UI Verification', () => {

   // Loging in user before each test
  beforeEach(() => {
    cy.visit('https://app.grabdocs.com/forms');
  
  });

  it('displays create new forms buttons', () => {

    cy.contains(/Quick Forms/i).should('be.visible');
    cy.contains(/Select a Template to Create your Form/i).should('be.visible');

    cy.contains(/Blank Form/i).should('be.visible');
    cy.contains(/RSVP Form/i).should('be.visible');
    cy.contains(/Registration Form/i).should('be.visible');
    cy.contains(/Custom Order Form/i).should('be.visible');
    cy.contains(/Feedback Form/i).should('be.visible');
    cy.contains(/Product Order Form/i).should('be.visible');
    cy.contains(/Survey Form/i).scrollIntoView().should('be.visible');

    cy.contains(/Recent forms/i).should('be.visible');

  });

});


// SUCCESS SCENARIOS //
// Verifying that the user can create new forms

describe('Success Scenarios', () => {

   // Loging in user before each test
  beforeEach(() => {

    // Loading user credentials and OTP bypass from fixture file
    cy.fixture('user').then((user) => {

      cy.visit('https://app.grabdocs.com/forms');

    });
  
  });

  it('creating blank form', () => {

    // Monitoring the backend API request and response
    cy.intercept('POST', '**api/v1/web/forms').as('createBlank');

    // Creating the form by selecting "Blank Form"
    cy.contains(/Blank Form/i).click();

    // Verifying that the backend receives and responds correctly
    cy.wait('@createBlank').then(({request, response}) => {

      // Verifying the correct API endpoint, HTTP method, was used for the request
      expect(request.url).to.include('/api/v1/web/forms');
      expect(request.method).to.eq('POST');
      expect(request.body).to.have.property('title', 'Untitled Form');
      expect(request.body).to.have.property('type', 'Custom');

      // Verifying that the backend responded successfully
      expect(response.statusCode).to.eq(200);
      expect(response.body).to.have.property('success', true);
      expect(response.body.form).to.have.property('title', 'Untitled Form');
      expect(response.body.form).to.have.property('type', 'Custom');
    });

    // Verifying that the blank form was created in the frontend
    cy.get('input[placeholder="Form name"]').should('be.visible');

  });

  it('creating RSVP form', () => {

    // Selecting "RSVP Form" as a template
    cy.contains(/RSVP Form/i).click();

    // Verifying that the user is navigated to the RSVP template page
    cy.url().should('match', /template=1/i);

    // Monitoring the backend API request and response
    cy.intercept('POST', '**api/v1/web/forms').as('createRSVP');

    // Creating the form by saving it
    cy.get('button[title="Save Form"]').click();

    // Verifying that the backend receives and responds correctly
    cy.wait('@createRSVP').then(({request, response}) => {

      // Verifying the correct API endpoint, HTTP method, was used for the request
      expect(request.url).to.include('/api/v1/web/forms');
      expect(request.method).to.eq('POST');
      expect(response.body.form).to.have.property('title', 'Wedding RSVP');
      expect(response.body.form).to.have.property('type', 'RSVP');

      // Verifying that the backend responded successfully
      expect(response.statusCode).to.eq(200);
      expect(response.body).to.have.property('success', true);
      expect(response.body.form).to.have.property('title', 'Wedding RSVP');
      expect(response.body.form).to.have.property('type', 'RSVP');
    });

    // Verifying that form is created successfully in the frontend
    cy.contains(/Form created successfully/i).should('be.visible');

  });

  it('creating Registration form', () => {
     
     // Selecting "Registration Form" as a template
    cy.contains(/Registration Form/i).click();

    // Verifying that the user is navigated to the Registration template page
    cy.url().should('match', /template=2/i);

    // Monitoring the backend API request and response
    cy.intercept('POST', '**api/v1/web/forms').as('createRegistration');

    // Creating the form by saving it
    cy.get('button[title="Save Form"]').click();

    // Verifying that the backend receives and responds correctly
    cy.wait('@createRegistration').then(({request, response}) => {

      // Verifying the correct API endpoint, HTTP method, was used for the request
      expect(request.url).to.include('/api/v1/web/forms');
      expect(request.method).to.eq('POST');
      expect(response.body.form).to.have.property('title', 'Conference Registration');
      expect(response.body.form).to.have.property('type', 'Registration');

      // Verifying that the backend responded successfully
      expect(response.statusCode).to.eq(200);
      expect(response.body).to.have.property('success', true);
      expect(response.body.form).to.have.property('title', 'Conference Registration');
      expect(response.body.form).to.have.property('type', 'Registration');
    });

    // Verifying that form is created successfully in the frontend
    cy.contains(/Form created successfully/i).should('be.visible');

  })

  it('creating Order form', () => {
     
     // Selecting "Custom Order Form" as a template
    cy.contains(/Custom Order Form/i).click();

    // Verifying that the user is navigated to the Custom Order template page
    cy.url().should('match', /template=3/i);

    // Monitoring the backend API request and response
    cy.intercept('POST', '**api/v1/web/forms').as('createCustomOrder');

    // Creating the form by saving it
    cy.get('button[title="Save Form"]').click();

    // Verifying that the backend receives and responds correctly
    cy.wait('@createCustomOrder').then(({request, response}) => {

      // Verifying the correct API endpoint, HTTP method, was used for the request
      expect(request.url).to.include('/api/v1/web/forms');
      expect(request.method).to.eq('POST');
      expect(response.body.form).to.have.property('title', 'Custom T-Shirt Order');
      expect(response.body.form).to.have.property('type', 'Order');

      // Verifying that the backend responded successfully
      expect(response.statusCode).to.eq(200);
      expect(response.body).to.have.property('success', true);
      expect(response.body.form).to.have.property('title', 'Custom T-Shirt Order');
      expect(response.body.form).to.have.property('type', 'Order');
    });

    // Verifying that form is created successfully in the frontend
    cy.contains(/Form created successfully/i).should('be.visible');

  })

  it('creating Feedback form', () => {
     
     // Selecting "Feedback Form" as a template
    cy.contains(/Feedback Form/i).click();

    // Verifying that the user is navigated to the Feedback template page
    cy.url().should('match', /template=4/i);

    // Monitoring the backend API request and response
    cy.intercept('POST', '**api/v1/web/forms').as('createFeedback');

    // Creating the form by saving it
    cy.get('button[title="Save Form"]').click();

    // Verifying that the backend receives and responds correctly
    cy.wait('@createFeedback').then(({request, response}) => {

      // Verifying the correct API endpoint, HTTP method, was used for the request
      expect(request.url).to.include('/api/v1/web/forms');
      expect(request.method).to.eq('POST');
      expect(response.body.form).to.have.property('title', 'Customer Feedback');
      expect(response.body.form).to.have.property('type', 'Feedback');

      // Verifying that the backend responded successfully
      expect(response.statusCode).to.eq(200);
      expect(response.body).to.have.property('success', true);
      expect(response.body.form).to.have.property('title', 'Customer Feedback');
      expect(response.body.form).to.have.property('type', 'Feedback');
    });

    // Verifying that form is created successfully in the frontend
    cy.contains(/Form created successfully/i).should('be.visible');

  })

  it('creating Survey form', () => {
     
     // Selecting "Survey Form" as a template
    cy.contains(/Survey Form/i).click();

    // Verifying that the user is navigated to the Survey template page
    cy.url().should('match', /template=21/i);

    // Monitoring the backend API request and response
    cy.intercept('POST', '**api/v1/web/forms').as('createSurvey');

    // Creating the form by saving it
    cy.get('button[title="Save Form"]').click();

    // Verifying that the backend receives and responds correctly
    cy.wait('@createSurvey').then(({request, response}) => {

      // Verifying the correct API endpoint, HTTP method, was used for the request
      expect(request.url).to.include('/api/v1/web/forms');
      expect(request.method).to.eq('POST');
      expect(response.body.form).to.have.property('title', 'Custom Survey');
      expect(response.body.form).to.have.property('type', 'Sruvey');

      // Verifying that the backend responded successfully
      expect(response.statusCode).to.eq(200);
      expect(response.body).to.have.property('success', true);
      expect(response.body.form).to.have.property('title', 'Custom Survey');
      expect(response.body.form).to.have.property('type', 'Survey');
    });

    // Verifying that form is created successfully in the frontend
    cy.contains(/Form created successfully/i).should('be.visible');

  })
});