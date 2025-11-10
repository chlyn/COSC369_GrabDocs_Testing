// SIGN IN E2E TEST //

// UI VERIFICATION //
// Checking if all UI elements are visible upon page entry

describe('UI Verification', () => {
  
  beforeEach(() => {

    // Visiting the login page before each test
    cy.visit('https://app.grabdocs.com/login');    

  });

  it('displays the sign in form', () => {

    // Verifying each input fields and buttons are present
    cy.get('input[name="username"]').should('be.visible');
    cy.get('input[name="password"]').should('be.visible');
    cy.get('input[type="checkbox"]').should('be.visible');
    cy.contains('button', /Sign in/i).should('be.visible');
    
    // Alternative login methods
    cy.contains('button', /Continue with Google/i).should('be.visible');

    // Other links related to account sign in
    cy.contains(/Forgot your password\?/i).should('be.visible');
    cy.contains(/Don't have an account\? Sign up/i).should('be.visible');

  });

});


// SUCCESS SCENARIOS //
// Testing every successful user workflow

describe('Success Scenarios', () => {

  beforeEach(() => {

    // Visiting the login page before each test
    cy.visit('https://app.grabdocs.com/login');   

  });

  // Logging in using given form
  it('standard setup', () => {

    // Loading user credentials from fixture file
    cy.fixture('user').then((user) => {

      // Filling out the form with valid credentials
      cy.get('input[name="username"]').type(user.username);
      cy.get('input[name="password"]').type(user.password);

      // Submiting the form by selecting "Sign in"
      cy.contains('button', /Sign in/i).click();

      // Verifying that two-authenticator message is present
      cy.contains(/Verification code sent to/i).should('be.visible');

      // Verifying each input fields and buttons are present
      cy.contains(/Two-Factor Authentication/i).should('be.visible');
      cy.get('input[name="otpCode"]').should('be.visible');
      cy.get('input[type="checkbox"]').should('be.visible');
      cy.contains('button', /Verify Code/i).should('be.visible');
      cy.contains('button', /Back to Login/i).should('be.visible');

      // Filling out verfication code 
      cy.get('input[name="otpCode"]').type(user.otpBypass);

      // Submiting the verification form by selecting "Verify Code"
      cy.contains('button', /Verify Code/i).click();

      // Verifying that the user is navigated to upload/welcome page
      cy.url().should('match', /upload/i);
      cy.contains(/Home/i).should('be.visible');

    })

  });

  // Logging in using exisiting google account
  it('google setup', () => {

    // Selecting the "Continue with Google" button
    cy.contains('button', /Continue with Google/i).click();

    // Verifying that the user is redirected to Google's accounts page
    cy.origin('https://accounts.google.com', () => {
      cy.location('hostname').should('eq', 'accounts.google.com');
    });

  });

});


// ALTERNATIVE METHODS //
// Checking if user is navigated to the correct create account flow

describe('Alternative Scenarios', () => {

  beforeEach(() => {

    // Visiting the signup page before each test
    cy.visit('https://app.grabdocs.com/login');    

  });

  // Switching flow to forgot password flow
  it('select forgot password', () => {

    // Selecting the "Forgot your password" button
    cy.contains(/Forgot your password\?/i).click();

    // Verifying that the user is navigated to reset password page
    cy.url().should('match', /forgot-password/i);

    // Verifying each input fields and buttons for reset password are present
    cy.get('input[name="email"]').should('be.visible');
    cy.contains('button', /Send Reset Link/i).should('be.visible');
    cy.contains(/Return to login/i).should('be.visible');

  });

  // Switching flow to sign up flow
  it('select sign up', () => {

    // Selecting the "Sign up" button
    cy.contains(/Sign up/i).click();

    // Verifying that the user is navigated to sign up page
    cy.url().should('match', /signup/i);

    // Verifying each input fields and buttons are present
    cy.get('input[name="username"]').should('be.visible');
    cy.get('input[name="firstName"]').should('be.visible');
    cy.get('input[name="lastName"]').should('be.visible');
    cy.get('input[name="email"]').should('be.visible');
    cy.get('input[name="password"]').should('be.visible');
    cy.get('input[type="checkbox"]').should('be.visible');
    cy.contains('button', /Create Account/i).should('be.visible');
    cy.contains('button', /Continue with Google/i).should('be.visible');
    cy.contains(/Sign up with phone instead/i).should('be.visible');
    cy.contains(/Already have an account\? Log in/i).should('be.visible');
    cy.contains(/Forgot your password\?/i).should('be.visible');

  });

});


// ERROR VALIDATION //
// Checking if the system responds to invalid or incomplete user inputs

describe('Error Validation', () => {

  beforeEach(() => {

    // Visit the signup page before each test
    cy.visit('https://app.grabdocs.com/login');    

  });

  // Scenario where the user enters an empty field
  it('register with all fields empty', () => {

    // Trigger errors by selecting "Sign in" button
    cy.contains('button', /Sign in/i).click();

    // Verifying each error message are present
    cy.contains(/Username or phone number is required/i).should('be.visible');
    cy.contains(/Password is required/i).should('be.visible');

  });

  // Scenario where the user enters invalid credentials
  it('invalid credentials', () => {

    // Filling out the form
    cy.get('input[name="username"]').type('not-a-username');
    cy.get('input[name="password"]').type('not-a-password');

    // Triggering error by selecting "Sign in" button
    cy.contains('button', /Sign in/i).click();

    // Verifying hat the error message is present
    cy.contains(/Login failed. Please check your credentials./i).should('be.visible');

  });

});
