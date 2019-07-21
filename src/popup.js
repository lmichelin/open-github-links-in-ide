import "./milligram.css"
import { setExtensionIcon, getOptions } from "./utils"

const run = async () => {
  const OPTIONS = await getOptions()

  const localPathInputElement = document.getElementById("localPathForRepositories")
  const defaultIdeSelectElement = document.getElementById("defaultIde")

  const checkboxes = [
    "showIconInFileTree",
    "showIconOnFileBlockHeaders",
    "showIconOnLineNumbers",
    "showDebugMessages",
  ]

  // set localPathForRepositories and defaultIde values
  localPathInputElement.value = OPTIONS.localPathForRepositories
  defaultIdeSelectElement.value = OPTIONS.defaultIde

  // add EventListener for localPathForRepositories
  localPathInputElement.addEventListener("input", event => {
    let localPathForRepositories = event.target.value
    if (localPathForRepositories.endsWith("/"))
      localPathForRepositories = localPathForRepositories.slice(0, -1)
    chrome.storage.sync.set({ localPathForRepositories })
  })

  // add EventListener for defaultIde
  defaultIdeSelectElement.addEventListener("change", event => {
    const defaultIde = event.target.value
    chrome.storage.sync.set({ defaultIde })
    setExtensionIcon(defaultIde)
  })

  checkboxes.forEach(checkbox => {
    const checkboxElement = document.getElementById(checkbox)

    checkboxElement.checked = OPTIONS[checkbox]

    // add EventListener for checkbox
    checkboxElement.addEventListener("change", event => {
      chrome.storage.sync.set({ [event.target.id]: event.target.checked })
    })
  })

  document.getElementById("version").innerHTML = chrome.runtime.getManifest().version
}

run()
