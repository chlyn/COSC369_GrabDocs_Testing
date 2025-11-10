import "./commands";

Cypress.on("window:before:load", (win) => {
  const origError = win.console.error;
  win.console.error = (...args) => {
    origError(...args);
  };
});
