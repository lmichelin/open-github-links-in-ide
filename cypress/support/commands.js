Cypress.Commands.add("waitForNetworkIdle", () => {
  cy.window().then(window => new Cypress.Promise(resolve => window.requestIdleCallback(resolve)))
})
