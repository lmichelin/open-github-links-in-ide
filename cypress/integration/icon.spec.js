context("VS Code icon", () => {
  it("should be visible only once in file tree on hover", () => {
    cy.visit("/lmichelin/open-github-links-in-ide")
    cy.waitForNetworkIdle()
    cy.get("a[title='README.md']").trigger("mouseover")
    cy.get("span[title='Open README.md in VS Code']").should("be.visible")
    cy.get("a[title='.gitignore']").trigger("mouseover")
    cy.get("span[title='Open README.md in VS Code']").should("not.be.visible")
    cy.get("span[title='Open .gitignore in VS Code']").should("be.visible")
  })

  it("should be visible on file block headers in conversation", () => {
    cy.visit("/lmichelin/open-github-links-in-ide/pull/5")
    cy.get('.js-comment-container a[title=".circleci/config.yml"]').scrollIntoView()
    cy.get('.js-comment-container span[title="Open config.yml in VS Code at line 27"]').should("be.visible")
  })

  it("should not visible on file block headers in resolved conversation", () => {
    cy.visit("/lmichelin/open-github-links-in-ide/pull/5")
    cy.get('.js-comment-container a[title=".gitignore"]').scrollIntoView()
    cy.get('.js-comment-container span[title="Open .gitignore in VS Code at line 4"]').should("not.exist")
  })

  it("should be visible on file block headers in resolved conversation after click", () => {
    cy.visit("/lmichelin/open-github-links-in-ide/pull/5")
    cy.get('.js-comment-container a[title=".gitignore"]').scrollIntoView()
    cy.get('.js-comment-container a[title=".gitignore"]')
      .closest(".js-comment-container")
      .contains("Show resolved")
      .click()
    cy.get('.js-comment-container span[title="Open .gitignore in VS Code at line 4"]').should("be.visible")
  })

  it("should be present but hidden on file block lines in conversation", () => {
    cy.visit("/lmichelin/open-github-links-in-ide/pull/5")
    cy.get('.js-comment-container a[title=".circleci/config.yml"]').scrollIntoView()
    cy.get('table tr span[title="Open config.yml in VS Code at line 24"]').should("be.hidden")
    cy.get('table tr span[title="Open config.yml in VS Code at line 25"]').should("be.hidden")
    cy.get('table tr span[title="Open config.yml in VS Code at line 26"]').should("be.hidden")
    cy.get('table tr span[title="Open config.yml in VS Code at line 27"]').should("be.hidden")
  })

  it("should be present but hidden on file block lines in resolved conversation after click", () => {
    cy.visit("/lmichelin/open-github-links-in-ide/pull/5")
    cy.get('.js-comment-container a[title=".gitignore"]').scrollIntoView()
    cy.get('.js-comment-container a[title=".gitignore"]')
      .closest(".js-comment-container")
      .contains("Show resolved")
      .click()
    cy.get('table tr span[title="Open .gitignore in VS Code at line 1"]').should("be.hidden")
    cy.get('table tr span[title="Open .gitignore in VS Code at line 2"]').should("be.hidden")
    cy.get('table tr span[title="Open .gitignore in VS Code at line 3"]').should("be.hidden")
    cy.get('table tr span[title="Open .gitignore in VS Code at line 4"]').should("be.hidden")
  })

  it("should be visible on file block headers in files changed", () => {
    cy.visit("/lmichelin/open-github-links-in-ide/pull/5/files")
    cy.get(".file span[title='Open config.yml in VS Code at line 5']").should("be.visible")
    cy.get(".file a[title='package-lock.json']").scrollIntoView()
    cy.get(".file span[title='Open package-lock.json in VS Code']").should("be.visible")
    cy.get(".file a[title='tests/index.js']").scrollIntoView()
    cy.get(".file span[title='Open index.js in VS Code at line 1']").should("be.visible")
  })

  it("should be present but hidden when not hovering on file block lines in files changed", () => {
    cy.visit("/lmichelin/open-github-links-in-ide/pull/5/files")
    cy.get('.file a[title=".circleci/config.yml"]').scrollIntoView()
    cy.get('table tr span[title="Open config.yml in VS Code at line 2"]').should("be.hidden")
    cy.get('table tr span[title="Open config.yml in VS Code at line 3"]').should("be.hidden")
    cy.get('table tr span[title="Open config.yml in VS Code at line 26"]').should("be.hidden")
    cy.get('table tr span[title="Open config.yml in VS Code at line 27"]').should("be.hidden")
  })
})
