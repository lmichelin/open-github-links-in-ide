"use strict"

chrome.runtime.onInstalled.addListener(details => {
  if (details.reason === "install") {
    chrome.runtime.openOptionsPage()
  }
})
