/// <reference types="cypress" />

const SEL = {
  uploadInput: () => Cypress.env("SEL_UPLOAD_INPUT"),
  uploadDone:  () => Cypress.env("SEL_UPLOAD_DONE"),
  chatInput:   () => Cypress.env("SEL_CHAT_INPUT"),
  sendBtn:     () => Cypress.env("SEL_SEND_BTN"),
  assistant:   () => Cypress.env("SEL_ASSIST_MSG"),
};

const API = {
  upload: () => Cypress.env("API_UPLOAD"),
  ask:    () => Cypress.env("API_ASK"),
};

describe("AI Chatbot Q&A over Uploaded Document", () => {
  context("Stubbed fast path (no real backend)", () => {
    it("uploads a document, asks a question, and shows the AI's answer (stubbed)", () => {
      cy.intercept("POST", API.upload(), {
        statusCode: 200,
        body: { docId: "doc-abc123", name: "upload_test.txt" }
      }).as("uploadDoc");

      cy.intercept("POST", API.ask(), {
        statusCode: 200,
        body: {
          answer: "According to the uploaded file, the capital of France is Paris."
        }
      }).as("askDoc");

      cy.visit("/chat");

      cy.uploadFixture(SEL.uploadInput(), "upload_test.txt", "text/plain");
      cy.wait("@uploadDoc");
      cy.get(SEL.uploadDone()).should("contain.text", "upload_test.txt");

      cy.askChatbot(
        "What is the capital of France based on the document?",
        SEL.chatInput(),
        SEL.sendBtn()
      );

      cy.wait("@askDoc");
      cy.expectLastAssistantToInclude(SEL.assistant(), "Paris");
    });
  });
});
