// RESET PASSWORD E2E TEST //

// UI VERIFICATION //
// Checking if all UI elements are visible upon page entry

describe('UI Verification', () => {
  
  beforeEach(() => {

    // Visiting the forgot password page before each test
    cy.visit('https://app.grabdocs.com/forgot-password');    

  });

  it('displays the reset password form', () => {

    // Verifying each input fields and buttons are present
    cy.get('input[name="email"]').should('be.visible');
    cy.contains('button', /Send Reset Link/i).should('be.visible');
    cy.contains(/Return to login/i).should('be.visible');

  });

});


// SUCCESS SCENARIOS //
// Testing every successful user workflow

describe('Success Scenarios', () => {

  beforeEach(() => {

    // Visiting the forgot password page before each test
    cy.visit('https://app.grabdocs.com/forgot-password');    

  });

  // Resetting password using given form
  it('standard setup', () => {

    // Filling out the form with valid credentials
    cy.get('input[name="email"]').type('testgrabdocs@gmail.com');

    // Submiting the form by selecting "Send Reset Link"
    cy.contains('button', /Send Reset Link/i).click();

    // Verifying that success message is present
    cy.contains(/If an account exists with this email, you will receive password reset instructions./i).should('be.visible');

  });

});


// ALTERNATIVE METHODS //
// Checking if user is navigated to the correct login flow

describe('Alternative Scenarios', () => {

  beforeEach(() => {

    // Visiting the forgot password page before each test
    cy.visit('https://app.grabdocs.com/forgot-password');    

  });

  // Switching flow to login flow
  it('select log in', () => {

    // Selecting the "Return to login" button
    cy.contains(/Return to login/i).click();

    // Verifying that the user is navigated to login page
    cy.url().should('match', /login/i);

    // Verifying each input fields and buttons for login page are present
    cy.get('input[name="username"]').should('be.visible');
    cy.get('input[name="password"]').should('be.visible');
    cy.get('input[type="checkbox"]').should('be.visible');
    cy.contains(/Forgot your password\?/i).should('be.visible');
    cy.contains('button', /Sign in/i).should('be.visible');
    cy.contains(/Continue with Google/i).should('be.visible');
    cy.contains(/Don't have an account\? Sign up/i).should('be.visible');

  });

});


// ERROR VALIDATION //
// Checking if the system responds to invalid or incomplete user inputs

describe('Error Validation', () => {

  beforeEach(() => {

    // Visiting the forgot password page before each test
    cy.visit('https://app.grabdocs.com/forgot-password');    

  });

  // Scenario where the user enters an empty field
  it('register with all fields empty', () => {

    // Trigger error by selecting "Send Reset Link" button
    cy.contains('button', /Send Reset Link/i).click();

    // Verifying that error message is present
    cy.contains(/Email is required/i).should('be.visible');

  });

  // Scenario where the user enters an invalid email
  it("invalid email", () => {

    // Filling out email field
    cy.get('input[name="email"]').type('not-an-email');

    // Trigger error by selecting "Send Reset Link" button
    cy.contains('button', /Send Reset Link/i).click();

    // Verifying that the error message is present
    cy.contains(/Invalid email/i).should('be.visible');

  });

});