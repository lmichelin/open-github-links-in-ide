;(function() {
  const checkboxElements = {
    showIconInFileTree: document.getElementById("showIconInFileTree"),
    showIconOnFileBlockHeaders: document.getElementById("showIconOnFileBlockHeaders"),
    showIconOnLineNumbers: document.getElementById("showIconOnLineNumbers"),
    showDebugMessages: document.getElementById("showDebugMessages"),
  }

  const getCheckboxValues = () => {
    let checkboxValues = {}
    Object.keys(checkboxElements).forEach(checkbox => {
      checkboxValues[checkbox] = checkboxElements[checkbox].checked
    })
    return checkboxValues
  }

  function saveOptions(e) {
    e.preventDefault()

    let localPathForRepositories = document.getElementById("local-path").value
    if (localPathForRepositories.endsWith("/"))
      localPathForRepositories = localPathForRepositories.slice(0, -1)

    const defaultIde = document.getElementById("ide").value

    chrome.storage.sync.set(
      {
        localPathForRepositories,
        defaultIde,
        ...getCheckboxValues(),
      },
      function() {
        window.close()
      },
    )
  }

  function restoreOptions() {
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
      function(items) {
        document.getElementById("local-path").value = items.localPathForRepositories
        document.getElementById("ide").value = items.defaultIde
        for (const checkbox in checkboxElements) {
          checkboxElements[checkbox].checked = items[checkbox]
        }
      },
    )
  }

  document.addEventListener("DOMContentLoaded", restoreOptions)
  document.getElementById("options-form").addEventListener("submit", saveOptions)

  document.getElementById("version").innerHTML = chrome.runtime.getManifest().version
})()
