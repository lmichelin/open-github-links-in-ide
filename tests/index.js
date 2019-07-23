module.exports = {
  "One VS Code icon should be visible in file tree on hover"(browser) {
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
  "VS Code icon should be visible on file block headers in conversation"(browser) {
    browser
      .url("https://github.com/lmichelin/open-github-links-in-ide/pull/5")
      .waitForElementVisible("a[title='.circleci/config.yml']")
      .waitForElementVisible("span[title='Open config.yml in VS Code at line 27']")
      .end()
  },
  "VS Code icon should be visible on file block headers in files changed"(browser) {
    browser
      .url("https://github.com/lmichelin/open-github-links-in-ide/pull/5/files")
      .waitForElementVisible("a[title='.circleci/config.yml']")
      .waitForElementVisible("span[title='Open config.yml in VS Code at line 5']")
      .waitForElementVisible("span[title='Open package-lock.json in VS Code']")
      .waitForElementVisible("span[title='Open index.js in VS Code at line 1']")
      .end()
  },
}
