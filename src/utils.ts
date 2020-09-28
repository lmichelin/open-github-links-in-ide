import { ChromeStorage, defaultChromeStorageOptions } from "./types"

export const debounce = <F extends (...args: never[]) => void>(
  func: F,
  wait = 250,
): ((this: ThisParameterType<F>, ...args: Parameters<F>) => void) => {
  let timeout: number
  return function (...args) {
    clearTimeout(timeout)
    timeout = window.setTimeout(() => func.apply(this, args), wait)
  }
}

export const getOptions = (): Promise<ChromeStorage> =>
  new Promise(resolve =>
    chrome.storage.sync.get(defaultChromeStorageOptions, options => resolve(options as ChromeStorage)),
  )

export const setExtensionIcon = (defaultIde: string): void => {
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
