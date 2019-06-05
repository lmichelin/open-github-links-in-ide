function saveOptions() {
  var localPathForRepositories = document.getElementById('local-path').value
  chrome.storage.sync.set(
    {
      localPathForRepositories,
    },
    function() {
      var status = document.getElementById('status')
      status.textContent = 'Options successfully saved.'
      setTimeout(function() {
        status.textContent = ''
      }, 1000)
    },
  )
}

function restoreOptions() {
  chrome.storage.sync.get(
    {
      localPathForRepositories: '/home/changeMe', // default value
    },
    function(items) {
      document.getElementById('local-path').value = items.localPathForRepositories
    },
  )
}
document.addEventListener('DOMContentLoaded', restoreOptions)
document.getElementById('save').addEventListener('click', saveOptions)
