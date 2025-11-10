// CREATE ACCOUNT E2E TEST //

// UI VERIFICATION //
// Checking if all UI elements are visible upon page entry

describe('UI Verification', () => {
  
  beforeEach(() => {

    // Visiting the signup page before each test
    cy.visit('https://app.grabdocs.com/signup');    

  });

  it('displays the create account form', () => {

    // Verifying each input fields and buttons are present
    cy.get('input[name="username"]').should('be.visible');
    cy.get('input[name="firstName"]').should('be.visible');
    cy.get('input[name="lastName"]').should('be.visible');
    cy.get('input[name="email"]').should('be.visible');
    cy.get('input[name="password"]').should('be.visible');
    cy.get('input[type="checkbox"]').should('be.visible');
    cy.contains('button', /Create Account/i).should('be.visible');
    
    // Alternative signup methods
    cy.contains('button', /Continue with Google/i).should('be.visible');
    cy.contains(/Sign up with phone instead/i).should('be.visible');

    // Other links related to account signin
    cy.contains(/Already have an account\? Log in/i).should('be.visible');
    cy.contains(/Forgot your password\?/i).should('be.visible');

  });

});


// SUCCESS SCENARIOS //
// Testing every successful user workflow

describe('Success Scenarios', () => {

  beforeEach(() => {

    // Visiting the signup page before each test
    cy.visit('https://app.grabdocs.com/signup');   

  });

  // Creating account using given form
  it('standard setup', () => {

    // Generating unqie credentials to create new accounts
    const unique = Date.now();
    const username = unique;
    const email = unique + '@example.com';

    // Filling out the form with valid credentials
    cy.get('input[name="username"]').type(username);
    cy.get('input[name="firstName"]').type('Grab');
    cy.get('input[name="lastName"]').type('Docs');
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type('testest123');
    cy.get('input[type="checkbox"]').click();

    // Submiting the form by selecting "Create Account"
    cy.contains('button', /Create Account/i).click();

    // Verifying that success message is present
    cy.contains(/Account created successfully!/i).should('be.visible');

  });

  // Creating account using exisiting google account
  it('google setup', () => {

    // Selecting the "Continue with Google" button
    cy.contains('button', /Continue with Google/i).click();

    // Verifying that the user is redirected to Google's accounts page
    cy.origin('https://accounts.google.com', () => {
      cy.location('hostname').should('eq', 'accounts.google.com');
    });

  });

  // Creating account using phone number
  it('phone setup', () => {

    // Selecting the "Sign up with phone instead" button
    cy.contains(/Sign up with phone instead/i).click();

    // Verifying that the user is navigated to phone login page
    cy.url().should('match', /phone-login/i);

    // Verifying each input fields and buttons for phone login page are present
    cy.get('select[name="countryCode"]').should('be.visible');
    cy.get('input[name="phoneNumber"]').should('be.visible');
    cy.get('input[type="checkbox"]').should('be.visible');
    cy.contains('button', /Send Verification Code/i).should('be.visible');
    cy.contains(/Don't have an account\? Sign up/i).should('be.visible');
    cy.contains(/Use traditional login instead/i).should('be.visible');

  });

});


// ALTERNATIVE METHODS //
// Checking if user is navigated to the correct signin flow

describe('Alternative Scenarios', () => {

  beforeEach(() => {

    // Visiting the signup page before each test
    cy.visit('https://app.grabdocs.com/signup');    

  });

  // Switching flow to login flow
  it('select log in', () => {

    // Selecting the "Already have an account? Log in" button
    cy.contains(/Already have an account\? Log in/i).click();

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

});


// ERROR VALIDATION //
// Checking if the system responds to invalid or incomplete user inputs

describe('Error Validation', () => {

  beforeEach(() => {

    // Visit the signup page before each test
    cy.visit('https://app.grabdocs.com/signup');    

  });

  // Scenario where the user enters an empty field
  it('register with all fields empty', () => {

    // Trigger errors by selecting "Create Account" button
    cy.contains('button', /Create Account/i).click();

    // Verifying each error message are present
    cy.contains(/Username is required/i).should('be.visible');
    cy.contains(/First name is required/i).should('be.visible');
    cy.contains(/Last name is required/i).should('be.visible');
    cy.contains(/Email is required/i).should('be.visible');
    cy.contains(/Password is required/i).should('be.visible');

  });

  // Scenario where the user enters a username less than 3 characters
  it('username with less than 3 characters', () => {

    // Filling out username field
    cy.get('input[name="username"]').type('ab');

    // Trigger error by selecting the first name field or anywhere else
    cy.get('input[name="firstName"]').click();

    // Verifying that the error message is present
    cy.contains(/Username must be at least 3 characters/i).should('be.visible');

  });

  // Scenario where the user enters an invalid email
  it("invalid email", () => {

    // Filling out email field
    cy.get('input[name="email"]').type('not-an-email');

    // Triggering error by selecting the password field or anywhere else
    cy.get('input[name="password"]').click();

    // Verifying that the error message is present
    cy.contains(/Invalid email/i).should('be.visible');

  });

  // Scenario where the user enters an password less than 8 characters
  it('password with less than 3 characters', () => {

    // Filling out password field
    cy.get('input[name="password"]').type('a');

    // Triggering error by selecting the checkbox field or anywhere else
    cy.get('input[type="checkbox"]').click();

    // Verifying that the error message is present
    cy.contains(/Password must be at least 8 characters/i).should('be.visible');

  });

  // Scenario where the user enters an existing username or email
  it('username already exists', () => {

    // Loading existing user credentials from fixture file
    cy.fixture('user').then((user) => {

      // Filling out the form 
      cy.get('input[name="username"]').type(user.username);
      cy.get('input[name="firstName"]').type(user.firstName);
      cy.get('input[name="lastName"]').type(user.lastName);
      cy.get('input[name="email"]').type(user.email);
      cy.get('input[name="password"]').type(user.password);
      cy.get('input[type="checkbox"]').click();
      
    })

    // Triggering error by selecting "Create Account" button
    cy.contains('button', /Create Account/i).click();

    // Verifying hat the error message is present
    cy.contains(/Username or email already exists/i).should('be.visible');

  });

})