const path = require("path")

module.exports = on => {
  on("before:browser:launch", (browser, launchOptions) => {
    launchOptions.extensions.push(path.join(__dirname, `../../dist/${browser.name}`))
    return launchOptions
  })
}
