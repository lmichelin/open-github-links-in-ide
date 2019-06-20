;(function() {
  const localPathInputElement = document.getElementById("localPathForRepositories")
  const defaultIdeSelectElement = document.getElementById("defaultIde")

  const checkboxes = [
    "showIconInFileTree",
    "showIconOnFileBlockHeaders",
    "showIconOnLineNumbers",
    "showDebugMessages",
  ]

  // set localPathForRepositories and defaultIde values
  chrome.storage.sync.get(
    {
      localPathForRepositories: "/home/changeMe", // default value
      defaultIde: "vscode", // default value
    },
    items => {
      localPathInputElement.value = items.localPathForRepositories
      defaultIdeSelectElement.value = items.defaultIde
    },
  )

  // add EventListener for localPathForRepositories
  localPathInputElement.addEventListener("input", event => {
    let localPathForRepositories = event.target.value
    if (localPathForRepositories.endsWith("/"))
      localPathForRepositories = localPathForRepositories.slice(0, -1)
    chrome.storage.sync.set({ [event.target.id]: localPathForRepositories })
  })

  // add EventListener for defaultIde
  defaultIdeSelectElement.addEventListener("change", event => {
    chrome.storage.sync.set({ [event.target.id]: event.target.value })
  })

  checkboxes.forEach(checkbox => {
    const checkboxElement = document.getElementById(checkbox)

    // set checkbox value
    chrome.storage.sync.get(
      {
        [checkbox]: checkbox !== "showDebugMessages", // set default value to true excepted for showDebugMessages
      },
      items => {
        checkboxElement.checked = items[checkbox]
      },
    )

    // add EventListener for checkbox
    checkboxElement.addEventListener("change", event => {
      chrome.storage.sync.set({ [event.target.id]: event.target.checked })
    })
  })

  document.getElementById("version").innerHTML = chrome.runtime.getManifest().version
})()
