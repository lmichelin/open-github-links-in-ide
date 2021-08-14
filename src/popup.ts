import "./milligram.css"
import { Editor } from "./types"
import { setExtensionIcon, getOptions } from "./utils"

const run = async () => {
  const OPTIONS = await getOptions()

  const localPathInputElement = document.getElementById("localPathForRepositories") as HTMLInputElement
  const defaultIdeSelectElement = document.getElementById("defaultIde") as HTMLSelectElement

  const checkboxes = [
    "showIconInFileTree",
    "showIconOnFileBlockHeaders",
    "showIconOnLineNumbers",
    "showDebugMessages",
  ] as const

  // set localPathForRepositories and defaultIde values
  localPathInputElement.value = OPTIONS.localPathForRepositories
  defaultIdeSelectElement.value = OPTIONS.defaultIde

  // add EventListener for localPathForRepositories
  localPathInputElement.addEventListener("input", event => {
    let localPathForRepositories = (event.target as HTMLInputElement).value
    if (localPathForRepositories.endsWith("/")) localPathForRepositories = localPathForRepositories.slice(0, -1)
    void chrome.storage.sync.set({ localPathForRepositories })
  })

  // add EventListener for defaultIde
  defaultIdeSelectElement.addEventListener("change", event => {
    const defaultIde = (event.target as HTMLSelectElement).value as Editor
    void chrome.storage.sync.set({ defaultIde })
    setExtensionIcon(defaultIde)
  })

  checkboxes.forEach(checkbox => {
    const checkboxElement = document.getElementById(checkbox) as HTMLInputElement

    checkboxElement.checked = OPTIONS[checkbox]

    // add EventListener for checkbox
    checkboxElement.addEventListener("change", event => {
      const eventTarget = event.target as HTMLInputElement
      void chrome.storage.sync.set({ [eventTarget.id]: eventTarget.checked })
    })
  })
  ;(document.getElementById("version") as HTMLSpanElement).innerText = chrome.runtime.getManifest().version
}

void run()
