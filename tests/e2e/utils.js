const { By, until } = require("selenium-webdriver")

module.exports = {
  async querySelector(selector, driver, waitUntilTime = 10000) {
    const el = await driver.wait(until.elementLocated(By.css(selector)), waitUntilTime)
    return driver.wait(until.elementIsVisible(el), waitUntilTime)
  },
}
