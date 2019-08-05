const chrome = require("selenium-webdriver/chrome")
require("chromedriver")
const webdriver = require("selenium-webdriver")
const { querySelector } = require("./utils")
const fs = require("fs")
const path = require("path")

// let driver

const chromeManifestPath = path.join(process.cwd(), "dist/chrome/manifest.json")
const chromeManifestContent = require(chromeManifestPath)
chromeManifestContent.key =
  "MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCNSPP6N4d+Ls7dNQ74gaKO2PbBXlR7vzk/c2keqH6nJs2o05jYn+xxb/x+OCqjYd2EqDXJGehseQ52cD9/JAoe66R1bIkXDaFJkg9PsBUsDFGT0NTqStdor1pZsiKQh9warxyk6PpZy+A/ejs9FOb4XLaYF3pO6dfD2ew50G2VSOV6keQ16/ILIuvWxxFANBLjzehnQH+ocgdA7Wfp1x+BKK141sVgiAQ/cHky9zID5MZiXuvbbW/zj5Z9O3YMIEvgA8gf4dWBx2DHigW1Z6ZJmbb7s6IDdSGrol1lShRQSBYM2N2J8TPLqLqssfee+mhAqwpZ6w/mMSj+lsF3mf3lAgMBAAECggEAHThDTTKC0TP5EILSr86Pwh9ZGTDbJCSuQFMsIG0UlJlP22S3rcWVbviMLcaL+vJYkAEB7q9vBFAdD52zZCYd+bsebjKeP6hP/Rk6FW8DUfLSRFHiVvpXho0NkJNo1p9ihBpHQEv2yu+BV19+NOnHwwHZuabRYtS2DQla87IJl+AG9rmGISg3fJ4QzvaG8ABJbQwO3i6BCT1G6yQcLr4EY/QH2PdQjNEmvUHOHZlLEMj6OomoPOLaI6gOjLbIh7lM5Ap1ScDA4RSoJQ1RYVQVihpvXNwuQewpIUL2IG1a999ZhG1kZeWBxDOlpIaluqZZWVYbo2CWmodlAtCIxTaXmQKBgQDCUAQaQBhKjkWgqb2K5AXrB/ew8boBmIxVr6yDq9MKiBZGBfFpsnt9H8buLdgjELuHXw35fN2K9AG9ZSstoa5o8US9Asj6mhVZyl+lsKGWDrscaUvVDdXuf9Jrb41ADM69qLF56jEAUBxLHBFE+cErx3FctzK5io0ekIdysc+fcwKBgQC6I1Rkj0yihgOvCHvVVlcASIZTEWVqnOed/fzfM7zHiPxsQ+HRAYl1Ipkyyg17BauDKvtfQ5H9lH8cqJpJ4SL2loQ9nVeC9+jaa43AomsMJZClijeKgvemDihGNZY8FVhNx9y7Arj+ExMRdu90GoNQC/2iunnlWjSTb22jqEznRwKBgF9nC+ybhZGtcrAkRsSXmfRAcDM3K7022cgEPa5UQYTNNiphJptfn1Pas0Aj0Be/UmNvnxvcW6WqkeQcdOutk0VBGB+461ZnKo5wVy+xnlRfnSyg4jOT3HKB3Z0UIwTMhQEHf0O9YRunOY0DFdOI0HgfLyB3bfc8+HaGPYpplOfTAoGAEdhPP/DJDQ/CDKbIkHRdlOZfElmpmmX+gpQWCSQBpjOI16xOWuZF0lgFzeu3DSNHBSU6wjBNL71rzkiPuiN+YZueg/WwrRqtVTtYdK5diuWTD3vHxVy291GGJO0AQTReqd5OWBNzvs//VP5NCJl+G096+n3cL9PNFJFrNnRtIwMCgYEAqkIhvC8U3//plvbFdyrgMaGfTKn9LcA97rY2cz3UKpiS9TJ5CfBU1hBBkfNPq9DOZGp3V2Mtc4NDCXYoIThGONO1M3MI69D7Z59J4WZ6ktoY0WxxFfES8Y7yZ6Pb4VoHK1Rtl/d2QNUaZtbFqVTlXR1+7RBgAkYnHvWyOO4u1xk="
fs.writeFileSync(chromeManifestPath, JSON.stringify(chromeManifestContent))

jest.extensionBaseUrl = "chrome-extension://cakdcbddggbdnjfnngcjgcifpljimipc/"

const chromeOptions = new chrome.Options().addArguments(["--load-extension=dist/chrome"])

beforeAll(async () => {
  jest.driver = await new webdriver.Builder()
    .forBrowser("chrome")
    .setChromeOptions(chromeOptions)
    .build()
})

afterAll(async () => jest.driver.quit())

it("get the version", async () => {
  await jest.driver.get(jest.extensionBaseUrl + "popup.html")
  const anchor = await querySelector("[id='version']", jest.driver)
  const actual = await anchor.getText()

  expect(actual).toEqual(process.env.npm_package_version)
})
