Cypress.Commands.add("uploadFixture", (selector, fixturePath, mime = "text/plain") => {
  cy.get(selector).should("exist").then($input => {
    cy.fixture(fixturePath, "utf8").then(content => {
      const blob = new Blob([content], { type: mime });
      const file = new File([blob], fixturePath.split("/").pop(), { type: mime });

      const dt = new DataTransfer();
      dt.items.add(file);
      $input[0].files = dt.files;

      cy.wrap($input).trigger("change", { force: true });
    });
  });
});

Cypress.Commands.add("askChatbot", (question, selInput, selSendBtn) => {
  cy.get(selInput).should("be.enabled").clear().type(question);
  cy.get(selSendBtn).click();
});

Cypress.Commands.add("expectLastAssistantToInclude", (selAssistantMsg, expected) => {
  cy.get(selAssistantMsg).last().should("contain.text", expected);
});
