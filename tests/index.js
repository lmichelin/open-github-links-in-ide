module.exports = {
  "One VS Code icon should be visible in file tree on hover": function(browser) {
    browser
      .url("https://github.com/lmichelin/open-github-links-in-ide")
      .waitForElementVisible("a[title='README.md']")
      .moveToElement("a[title='README.md']", 150, 10)
      .waitForElementVisible("span[title='Open README.md in VS Code']")
      .moveToElement("a[title='.gitignore']", 150, 10)
      .waitForElementNotVisible("span[title='Open README.md in VS Code']")
      .waitForElementVisible("span[title='Open .gitignore in VS Code']")
      .end()
  },
}
