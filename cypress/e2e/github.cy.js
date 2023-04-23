context("VS Code icon", () => {
  const commentInjectTsSelector =
    'a[href="/victorigualada/open-github-gitlab-links-in-ide/pull/1/files/7578ed26631663aff318d5f247a7c8c958592c4a#diff-fea34f0968e2cf9b37aaf0eb78d6240ccf0f7e1e6a67b99bd4b828bb36ac6d07"'

  it("should be visible only once in file tree on hover", { browser: "!firefox" }, () => {
    cy.visit("/victorigualada/open-github-gitlab-links-in-ide")
    cy.waitForNetworkIdle()
    cy.get("a[title='README.md']").realHover()
    cy.get("span[title='Open README.md in VS Code']").should("be.visible")
    cy.get("a[title='.gitignore']").realHover()
    cy.get("span[title='Open README.md in VS Code']").should("not.be.visible")
    cy.get("span[title='Open .gitignore in VS Code']").should("be.visible")
  })

  it("should be visible on file block headers in conversation", () => {
    cy.visit("/victorigualada/open-github-gitlab-links-in-ide/pull/1")
    cy.get(commentInjectTsSelector).scrollIntoView()
    cy.get('span[title="Open inject.ts in VS Code at line 101"]').should("be.visible")
  })

  it("should be present but hidden on file block lines in conversation", () => {
    cy.visit("/victorigualada/open-github-gitlab-links-in-ide/pull/1")
    cy.get(commentInjectTsSelector).scrollIntoView()
    cy.get('table tr span[title="Open inject.ts in VS Code at line 91"]').should("be.hidden")
    cy.get('table tr span[title="Open inject.ts in VS Code at line 92"]').should("be.hidden")
    cy.get('table tr span[title="Open inject.ts in VS Code at line 93"]').should("be.hidden")
    cy.get('table tr span[title="Open inject.ts in VS Code at line 94"]').should("be.hidden")
  })

  it("should be visible on file block headers in files changed", () => {
    cy.visit("/victorigualada/open-github-gitlab-links-in-ide/pull/1/files")
    cy.get('div[data-tagsearch-path=".circleci/config.yml"').scrollIntoView()
    cy.get(".file-info span[title='Open config.yml in VS Code at line 35']").should("be.visible")
    cy.get('div[data-tagsearch-path=".gitignore"]').scrollIntoView()
    cy.get(".file-info span[title='Open .gitignore in VS Code at line 4']").should("be.visible")
    cy.get('div[data-tagsearch-path="README.md"]').scrollIntoView()
    cy.get(".file-info span[title='Open README.md in VS Code at line 3']").should("be.visible")
  })

  it("should be present but hidden when not hovering on file block lines in files changed", () => {
    cy.visit("/victorigualada/open-github-gitlab-links-in-ide/pull/1/files")
    cy.get('div[data-tagsearch-path="README.md"]').scrollIntoView()
    cy.get('table tr span[title="Open README.md in VS Code at line 1"]').should("be.hidden")
    cy.get('table tr span[title="Open README.md in VS Code at line 5"]').should("be.hidden")
    cy.get('table tr span[title="Open README.md in VS Code at line 9"]').should("be.hidden")
    cy.get('table tr span[title="Open README.md in VS Code at line 12"]').should("be.hidden")
  })

  it("should be visible on file block headers in files changed after navigation", () => {
    cy.visit("/victorigualada/open-github-gitlab-links-in-ide/pull/1")
    cy.get("a[href='/victorigualada/open-github-gitlab-links-in-ide/pull/1/files']").click()
    cy.get('div[data-tagsearch-path=".circleci/config.yml"]').scrollIntoView()
    cy.get(".file-info span[title='Open config.yml in VS Code at line 35']").should("be.visible")
  })
})
