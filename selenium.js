const chrome = require("selenium-webdriver/chrome")
const firefox = require("selenium-webdriver/firefox")
require("chromedriver") // add chromedriver in PATH
require("geckodriver") // add geckodriver in PATH
const s = require("selenium-webdriver")
const fs = require("fs")

const firefoxOptions = new firefox.Options()
  .setPreference("xpinstall.signatures.required", false)
  .addExtensions("build/firefox.xpi")

const chromeOptions = new chrome.Options().addExtensions(
  fs.readFileSync("build/chrome.zip").toString("base64"),
)

const runTestsWithBrowser = async (browserName, browserOptions) => {
  const driver = new s.Builder()
    .forBrowser(browserName)
    .setChromeOptions(browserOptions)
    .setFirefoxOptions(browserOptions)
    .build()

  try {
    await driver.get("http://www.google.com/ncr")
    await driver.findElement(s.By.name("q")).sendKeys("webdriver", s.Key.RETURN)
    await driver.wait(s.until.titleIs("webdriver - Google Search"), 1000)
  } finally {
    await driver.quit()
  }
}

runTestsWithBrowser("firefox", firefoxOptions)
runTestsWithBrowser("chrome", chromeOptions)
