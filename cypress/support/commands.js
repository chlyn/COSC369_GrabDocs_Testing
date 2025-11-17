Cypress.Commands.add('login', () => {

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
