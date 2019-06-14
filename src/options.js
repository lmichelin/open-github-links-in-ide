function saveOptions(e) {
  e.preventDefault()

  var localPathForRepositories = document.getElementById("local-path").value
  if (localPathForRepositories.endsWith("/"))
    localPathForRepositories = localPathForRepositories.slice(0, -1)

  var defaultIde = document.getElementById("ide").value

  chrome.storage.sync.set(
    {
      localPathForRepositories,
      defaultIde,
    },
    function() {
      window.close()
    },
  )
}

function restoreOptions() {
  chrome.storage.sync.get(
    {
      localPathForRepositories: "/home/changeMe", // default value
      defaultIde: "vscode", // default value
    },
    function(items) {
      document.getElementById("local-path").value = items.localPathForRepositories
      document.getElementById("ide").value = items.defaultIde
    },
  )
}

document.addEventListener("DOMContentLoaded", restoreOptions)
document.getElementById("options-form").addEventListener("submit", saveOptions)

document.getElementById("version").innerHTML = chrome.runtime.getManifest().version
