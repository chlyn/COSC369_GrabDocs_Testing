// Checking if all UI elements are visible upon page entry
describe('UI Verification', () => {
  
  beforeEach(() => {
    cy.visit('https://app.grabdocs.com/signup');    
  });

  it('displays the create account form', () => {
    cy.get('input[name="username"]').should('be.visible');
    cy.get('input[name="firstName"]').should('be.visible');
    cy.get('input[name="lastName"]').should('be.visible');
    cy.get('input[name="email"]').should('be.visible');
    cy.get('input[name="password"]').should('be.visible');
    cy.get('input[type="checkbox"]').should('be.visible');
    cy.contains('button', /Create Account/i).should('be.visible');
    
    // Alternative sign up methods
    cy.contains(/Continue with Google/i).should('be.visible');
    cy.contains(/Sign up with phone instead/i).should('be.visible');

    // Other links
    cy.contains(/Already have an account\? Log in/i).should('be.visible');
    cy.contains(/Forgot your password\?/i).should('be.visible');
  });
});


describe('Success Scenarios', () => {

  beforeEach(() => {
    cy.visit('https://app.grabdocs.com/signup');    
  });

  it('standard setup', () => {
    const unique = Date.now();
    const username = unique;
    const email = unique + '@example.com';

    cy.get('input[name="username"]').type(username);
    cy.get('input[name="firstName"]').type('Grab');
    cy.get('input[name="lastName"]').type('Docs');
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type('testest123');
    cy.get('input[type="checkbox"]').click();
    cy.contains('button', 'Create Account').click();
    cy.contains(/Account created successfully!/i).should('be.visible');
  });

  it('google setup', () => {
    cy.contains(/Continue with Google/i).click();
    cy.origin('https://accounts.google.com', () => {
      cy.location('hostname').should('eq', 'accounts.google.com');
    });
  });

  it('phone setup', () => {
    cy.contains(/Sign up with phone instead/i).click();
    cy.url().should('match', /phone-login/i);

    cy.get('select[name="countryCode"]').should('be.visible');
    cy.get('input[name="phoneNumber"]').should('be.visible');
    cy.get('input[type="checkbox"]').should('be.visible');
    cy.contains('button', /Send Verification Code/i).should('be.visible');
    cy.contains(/Don't have an account\? Sign up/i).should('be.visible');
    cy.contains(/Use traditional login instead/i).should('be.visible');
  });

});

describe('Alternative Scenarios', () => {

  beforeEach(() => {
    cy.visit('https://app.grabdocs.com/signup');    
  });

  it('select log in', () => {
    cy.contains(/Already have an account\? Log in/i).click();
    cy.url().should('match', /login/i);
    
    cy.get('input[name="username"]').should('be.visible');
    cy.get('input[name="password"]').should('be.visible');
    cy.get('input[type="checkbox"]').should('be.visible');
    cy.contains(/Forgot your password\?/i).should('be.visible');
    cy.contains('button', /Sign in/i).should('be.visible');
    cy.contains(/Continue with Google/i).should('be.visible');

  });

  it('select forgot password', () => {
    cy.contains(/Forgot your password\?/i).click();
    cy.url().should('match', /forgot-password/i);

    cy.get('input[name="email"]').should('be.visible');
    cy.contains('button', /Send Reset Link/i).should('be.visible');
    cy.contains(/Return to login/i).should('be.visible');
  });

});

describe('Error Validation', () => {

  beforeEach(() => {
    cy.visit('https://app.grabdocs.com/signup');    
  });

  it('register with all fields empty', () => {
    cy.contains('button', 'Create Account').click();

    cy.contains(/Username is required/i).should('be.visible');
    cy.contains(/First name is required/i).should('be.visible');
    cy.contains(/Last name is required/i).should('be.visible');
    cy.contains(/Email is required/i).should('be.visible');
    cy.contains(/Password is required/i).should('be.visible');
  });

  it('username with less than 3 characters', () => {
    cy.get('input[name="username"]').type('ab');
    cy.get('input[name="firstName"]').click();
    cy.contains(/Username must be at least 3 characters/i).should('be.visible');
  });

  it("invalid email", () => {
    cy.get('input[name="email"]').type('not-an-email');
    cy.get('input[name="password"]').click();
    cy.contains(/Invalid email/i).should('be.visible');
  });

  it('password with less than 3 characters', () => {
    cy.get('input[name="password"]').type('a');
    cy.get('input[type="checkbox"]').click();
    cy.contains(/Password must be at least 8 characters/i).should('be.visible');
  });

  it('username already exists', () => {
    cy.get('input[name="username"]').type('testgrabdocs');
    cy.get('input[name="firstName"]').type('Grab');
    cy.get('input[name="lastName"]').type('Docs');
    cy.get('input[name="email"]').type('testgrabdocs@gmail.com');
    cy.get('input[name="password"]').type('testest123');
    cy.get('input[type="checkbox"]').click();
    cy.contains('button', 'Create Account').click();
    cy.contains(/Username or email already exists/i).should('be.visible');
  });
})