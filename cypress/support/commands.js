Cypress.Commands.add('login', () => {

    // Loading user credentials and OTP bypass from fixture file
    cy.fixture('user').then((user) => {

        // Filling out the login form with valid credentials
        cy.get('input[name="username"]').type('chlynespined');
        cy.get('input[name="password"]').type('asdfghjkl');

        // Submiting the login form by selecting "Sign in"
        cy.contains('button', /Sign in/i).click();

        // Filling out verification form with OTP bypass
        cy.get('input[name="otpCode"]').type(user.otpBypass);

        // Submiting the verification form by selecting "Verify Code"
        cy.contains('button', /Verify Code/i).click();
    });
});
