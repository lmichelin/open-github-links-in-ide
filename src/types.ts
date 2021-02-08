export type Editor = "vscode" | "vscodium" | "vscode-insiders" | "phpstorm" | "intellij-idea" | "webstorm" | "pycharm"

export type ChromeStorage = {
  localPathForRepositories: string
  defaultIde: Editor
  showIconInFileTree: boolean
  showIconOnFileBlockHeaders: boolean
  showIconOnLineNumbers: boolean
  showDebugMessages: boolean
}

export type ChromeStorageKey = keyof ChromeStorage

export const defaultChromeStorageOptions: ChromeStorage = {
  localPathForRepositories: "/home/changeMe",
  defaultIde: "vscode",
  showIconInFileTree: true,
  showIconOnFileBlockHeaders: true,
  showIconOnLineNumbers: true,
  showDebugMessages: false,
}

export const chromeStorageKeys = Object.keys(defaultChromeStorageOptions) as ChromeStorageKey[]
