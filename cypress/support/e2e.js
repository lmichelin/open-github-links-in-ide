import "cypress-real-events/support"

import "./commands"

Cypress.on("uncaught:exception", (err, runnable, promise) => {
  // Ignore this unhandled promise rejection error happening randomly on Firefox
  if (promise && err.message.includes("NetworkError when attempting to fetch resource.")) {
    return false
  }
  // we still want to ensure there are no other unexpected
  // errors, so we let them fail the test
})
