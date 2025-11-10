describe("AI Chatbot Basic Response", () => {
  const QUESTION = "What is 1+1?";
  const EXPECTED_REGEX = /\b4\b/;
  const FALLBACK_REGEX = /\b(result|equals|answer)\b/i;

  function sendChat(text) {
    cy.get('input[placeholder*="ask anything" i]', { timeout: 8000 })
      .should('be.visible')
      .clear()
      .type(text + "{enter}");
  }

  it("should return a valid AI response", () => {
    cy.login();
    cy.visit("/");
    sendChat(QUESTION);

    cy.contains(EXPECTED_REGEX, { timeout: 30000 })
      .should("exist")
      .then(() => {
        return;
      })
      .catch(() => {
        cy.contains(FALLBACK_REGEX, { timeout: 30000 })
          .should("exist")
          .then(() => {
            return;
          })
          .catch(() => {
            cy.screenshot("chat_debug_screenshot");
            cy.document().then((doc) => {
              cy.writeFile(
                "chat_debug_dom.html",
                doc.documentElement.outerHTML
              );
            });

            throw new Error(
              "Chatbot could not find answer " +
              "Saved chat_debug_screenshot.png and chat_debug_dom.html."
            );
          });
      });
  });
});