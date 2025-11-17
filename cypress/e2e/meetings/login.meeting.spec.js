/**
Login flow E2E test for Post-Meeting Implementation.
Validates the standard email/password login flow.
Uses environment variaables for user credential information.
Confirms redirect to dashboard after successful login.
Reflects key points covered in the meeting recording.
*/

describe('Login Flow (Post-Meeting Implementation)', () => {
    // Runs before every individual test in this block
    beforeEach(() => {
        // Visits the login page route before each test
      cy.visit('/login');
    });
  
    it('logs in successfully with valid credentials', () => {
      cy.get('input[name="email"]').clear().type(Cypress.env('USER_EMAIL'));
        // Clear and type the email into the email input field
      cy.get('input[name="password"]').clear().type(Cypress.env('USER_PASSWORD'));
        //Clear and type the password into the password input field
      cy.get('button[type="submit"]').click();
      // Click the "Sign In" button to submit the login form
      cy.url().should('include', '/dashboard');
      cy.contains('Welcome back').should('be.visible');
    });
  });


