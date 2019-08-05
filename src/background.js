import { setExtensionIcon, getOptions } from "./utils"

chrome.runtime.onInstalled.addListener(async () => {
  const { defaultIde } = await getOptions()
  setExtensionIcon(defaultIde)
})

window.open("popup.html", "extension_popup", "width=780,height=590")
