// SIGN OUT E2E Tests //

// SUCCESS SCENARIOS //
// Verifying that the user can log out and return to the login page

describe('Success Scenarios', () => {

  // Loging in user before each test
  beforeEach(() => {

    // Loading user credentials and OTP bypass from fixture file
    cy.fixture('user').then((user) => {

      // Visiting the login page
      cy.visit('https://app.grabdocs.com/login');

      // Filling out the login form with valid credentials
      cy.get('input[name="username"]').type(user.username);
      cy.get('input[name="password"]').type(user.password);

      // Submiting the login form by selecting "Sign in"
      cy.contains('button', /Sign in/i).click();

      // Filling out verification form with OTP bypass
      cy.get('input[name="otpCode"]').type(user.otpBypass);

      // Submiting the verification form by selecting "Verify Code"
      cy.contains('button', /Verify Code/i).click();

    });

  });
  
  it('signs out successfully', () => {

    // Monitoring the backend API request and response
    cy.intercept('POST', '**/api/v1/web/logout').as('logout');

    // Triggering logout by selecting user profile button and "Sign Out" button
    cy.contains('button', /TU/i).click();
    cy.contains('button', /Sign Out/i).click();

    // Verifying that the backend receives and responds correctly
    cy.wait('@logout').then(({request, response}) => {

      // Verifying the correct API endpoint and HTTP method was used for the request
      expect(request.url).to.include('/api/v1/web/logout');
      expect(request.method).to.eq('POST');

      // Verifying that the backend responded successfully
      expect(response.statusCode).to.eq(200);
      expect(response.body).to.have.property('message', 'Logout successful');
      expect(response.body).to.have.property('success', true);
    })

    // Verifying that the user is navigated to login page in the frontend
    cy.url().should('contain', '/login');

    // Verifying each input fields and buttons for login page are present in the UI
    cy.get('input[name="username"]').should('be.visible');
    cy.get('input[name="password"]').should('be.visible');
    cy.get('input[type="checkbox"]').should('be.visible');
    cy.contains(/Forgot your password\?/i).should('be.visible');
    cy.contains('button', /Sign in/i).should('be.visible');
    cy.contains(/Continue with Google/i).should('be.visible');
    cy.contains(/Don't have an account\? Sign up/i).should('be.visible');

  });

});