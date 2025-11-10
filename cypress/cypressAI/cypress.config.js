/* eslint-env node */
const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    specPattern: "cypress/e2e/**/*.cy.js",
    supportFile: "cypress/support/e2e.js",
    video: false,
    defaultCommandTimeout: 15000,
    pageLoadTimeout: 60000,
    env: {
      SEL_UPLOAD_INPUT: '[data-cy="upload-input"]',
      SEL_UPLOAD_DONE:  '[data-cy="doc-name"]',
      SEL_CHAT_INPUT:   '[data-cy="chat-input"]',
      SEL_SEND_BTN:     '[data-cy="send-btn"]',
      SEL_ASSIST_MSG:   '[data-cy="assistant-msg"]',
      API_UPLOAD: "/api/upload",
      API_ASK: "/api/ask"
    }
  }
});
