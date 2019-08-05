const firefox = require("selenium-webdriver/firefox")
require("geckodriver")
const webdriver = require("selenium-webdriver")
const { querySelector } = require("./utils")
const path = require("path")

// let driver

// let extensionBaseUrl

const firefoxManifestPath = path.join(process.cwd(), "dist/firefox/manifest.json")
const firefoxManifestContent = require(firefoxManifestPath)

const firefoxOptions = new firefox.Options()
  .setPreference("xpinstall.signatures.required", false)
  .addExtensions("build/firefox.xpi")

beforeAll(async () => {
  jest.driver = await new webdriver.Builder()
    .forBrowser("firefox")
    .setFirefoxOptions(firefoxOptions)
    .build()

  await jest.driver.get("about:debugging#addons")
  const extensionTitleElement = await querySelector(
    `[title='${firefoxManifestContent.name}']`,
    jest.driver,
  )
  const actualTitle = await extensionTitleElement.getText()
  expect(actualTitle).toEqual(firefoxManifestContent.name)

  const UUIDElement = await querySelector(
    `[data-addon-id='${firefoxManifestContent.browser_specific_settings.gecko.id}'] .internal-uuid > span[title]`,
    jest.driver,
  )
  const extensionUUID = await UUIDElement.getText()

  jest.extensionBaseUrl = `moz-extension://${extensionUUID}/`
})

afterAll(async () => jest.driver.quit())

it("get the extension internal UUID", async () => {
  await jest.driver.get(jest.extensionBaseUrl + "popup.html")
  const versionElement = await querySelector("[id='version']", jest.driver)
  const actualVersion = await versionElement.getText()

  expect(actualVersion).toEqual(process.env.npm_package_version)
})
