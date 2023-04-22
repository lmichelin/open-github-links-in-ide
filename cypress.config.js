const { defineConfig } = require("cypress")
const path = require("path")

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://github.com",
    video: false,
    setupNodeEvents(on, config) {
      on("before:browser:launch", (browser, launchOptions) => {
        launchOptions.extensions.push(path.resolve(__dirname, `dist/${browser.name}/`))

        return launchOptions
      })
    },
    supportFile: path.resolve(__dirname, "cypress/support/index.js"),
  },
})
