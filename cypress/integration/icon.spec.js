context("VS Code icon", () => {
  it("should be visible only once in file tree on hover", () => {
    cy.visit("https://github.com/lmichelin/open-github-links-in-ide")
    cy.waitForNetworkIdle()
    cy.get("a[title='README.md']").trigger("mouseover")
    cy.get("span[title='Open README.md in VS Code']").should("be.visible")
    cy.get("a[title='.gitignore']").trigger("mouseover")
    cy.get("span[title='Open README.md in VS Code']").should("not.be.visible")
    cy.get("span[title='Open .gitignore in VS Code']").should("be.visible")
  })

  it("should be visible on file block headers in conversation", () => {
    cy.visit("https://github.com/lmichelin/open-github-links-in-ide/pull/5")
    cy.get('a[title=".circleci/config.yml"]').should("be.visible")
    cy.get('span[title="Open config.yml in VS Code at line 27"]').should("be.visible")
  })

  it("should be visible on file block headers in files changed", () => {
    cy.visit("https://github.com/lmichelin/open-github-links-in-ide/pull/5/files")
    cy.get("a[title='.circleci/config.yml']").should("be.visible")
    cy.get("span[title='Open config.yml in VS Code at line 5']").should("be.visible")
    cy.get("span[title='Open package-lock.json in VS Code']").should("be.visible")
    cy.get("span[title='Open index.js in VS Code at line 1']").should("be.visible")
  })
})
