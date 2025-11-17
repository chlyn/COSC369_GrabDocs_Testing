/**
Login flow E2E test for Post-Meeting Implementation.
Validates the standard email/password login flow.
Uses environment variaables for user credential information.
Confirms redirect to dashboard after successful login.
Reflects key points covered in the meeting recording.
*/

describe('Login Flow (Post-Meeting Implementation)', () => {
    beforeEach(() => {
      cy.visit('/login');
    });
  
    it('logs in successfully with valid credentials', () => {
      cy.get('input[name="email"]').clear().type(Cypress.env('USER_EMAIL'));
      cy.get('input[name="password"]').clear().type(Cypress.env('USER_PASSWORD'));
      cy.get('button[type="submit"]').click();
  
      cy.url().should('include', '/dashboard');
      cy.contains('Welcome back').should('be.visible');
    });
  });

