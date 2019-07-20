chrome.runtime.onInstalled.addListener(details => {
  // get defaultIde value
  chrome.storage.sync.get(
    {
      defaultIde: "vscode", // default value
    },
    items => {
      // set defaultIde icon
      chrome.browserAction.setIcon({
        path: {
          16: `icons/${items.defaultIde}16.png`,
          32: `icons/${items.defaultIde}32.png`,
          48: `icons/${items.defaultIde}48.png`,
          64: `icons/${items.defaultIde}64.png`,
          128: `icons/${items.defaultIde}128.png`,
        },
      })
    },
  )
})
