import { ChromeStorage, defaultChromeStorageOptions, Editor, EDITORS } from "./types"

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

export const setExtensionIcon = (defaultIde: Editor): void => {
  chrome.action.setIcon({
    path: {
      16: EDITORS[defaultIde].getIcon(16),
      32: EDITORS[defaultIde].getIcon(32),
      48: EDITORS[defaultIde].getIcon(48),
      64: EDITORS[defaultIde].getIcon(64),
      128: EDITORS[defaultIde].getIcon(128),
    },
  })
}
