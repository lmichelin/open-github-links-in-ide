import { setExtensionIcon, getOptions } from "./utils"

chrome.runtime.onInstalled.addListener(async () => {
  const { defaultIde } = await getOptions()
  setExtensionIcon(defaultIde)
})
