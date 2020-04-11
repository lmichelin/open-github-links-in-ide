export const debounce = (func, wait = 250) => {
  let timeout
  return function (...args) {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      func.apply(this, args)
    }, wait)
  }
}

export const getOptions = async () => {
  return new Promise(resolve => {
    chrome.storage.sync.get(
      {
        // set default values
        localPathForRepositories: "/home/changeMe",
        defaultIde: "vscode",
        showIconInFileTree: true,
        showIconOnFileBlockHeaders: true,
        showIconOnLineNumbers: true,
        showDebugMessages: false,
      },
      resolve,
    )
  })
}

export const setExtensionIcon = defaultIde => {
  chrome.browserAction.setIcon({
    path: {
      16: `icons/${defaultIde}16.png`,
      32: `icons/${defaultIde}32.png`,
      48: `icons/${defaultIde}48.png`,
      64: `icons/${defaultIde}64.png`,
      128: `icons/${defaultIde}128.png`,
    },
  })
}
