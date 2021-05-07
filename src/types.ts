export type Editor =
  | "vscode"
  | "vscodium"
  | "vscode-insiders"
  | "phpstorm"
  | "intellij-idea"
  | "webstorm"
  | "jetbrains-webserver"

type IconSize = 16 | 32 | 48 | 64 | 128

export const EDITORS: {
  [e in Editor]: { name: string; getIcon: (size: IconSize) => string }
} = {
  vscode: {
    name: "VS Code",
    getIcon: (size: IconSize) => `icons/vscode${size}.png`,
  },
  vscodium: {
    name: "VSCodium",
    getIcon: (size: IconSize) => `icons/vscodium${size}.png`,
  },
  "vscode-insiders": {
    name: "VS Code Insiders",
    getIcon: (size: IconSize) => `icons/vscode-insiders${size}.png`,
  },
  phpstorm: {
    name: "PhpStorm",
    getIcon: (size: IconSize) => `icons/phpstorm${size}.png`,
  },
  "intellij-idea": {
    name: "IntelliJ IDEA",
    getIcon: (size: IconSize) => `icons/intellij-idea${size}.png`,
  },
  webstorm: {
    name: "WebStorm",
    getIcon: (size: IconSize) => `icons/webstorm${size}.png`,
  },
  "jetbrains-webserver": {
    name: "JetBrains",
    getIcon: (size: IconSize) => `icons/jetbrains${size}.png`,
  },
}

export type ChromeStorage = {
  localPathForRepositories: string
  defaultIde: Editor
  showIconInFileTree: boolean
  showIconOnFileBlockHeaders: boolean
  showIconOnLineNumbers: boolean
  showDebugMessages: boolean
}

export const defaultChromeStorageOptions: ChromeStorage = {
  localPathForRepositories: "/home/changeMe",
  defaultIde: "vscode",
  showIconInFileTree: true,
  showIconOnFileBlockHeaders: true,
  showIconOnLineNumbers: true,
  showDebugMessages: false,
}
