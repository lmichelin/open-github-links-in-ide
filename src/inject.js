;(async function() {
  "use strict"

  const debounce = (func, wait = 250) => {
    let timeout
    return function(...args) {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        func.apply(this, args)
      }, wait)
    }
  }

  const getOptions = async () => {
    return new Promise(resolve => {
      chrome.storage.sync.get(
        {
          localPathForRepositories: "/home/changeMeInOptions", // default value
          defaultIde: "vscode",
        },
        resolve,
      )
    })
  }

  const OPTIONS = await getOptions()

  const EDITORS = {
    vscode: {
      name: "Visual Studio Code",
      icon: "icons/vscode16.png",
      generateUrl: (repo, file, line) =>
        `vscode://file/${OPTIONS.localPathForRepositories}/${repo}/${file}:${line || 1}`,
    },
    "vscode-insiders": {
      name: "Visual Studio Code Insiders",
      icon: "icons/vscode-insiders16.png",
      generateUrl: (repo, file, line) =>
        `vscode-insiders://file/${OPTIONS.localPathForRepositories}/${repo}/${file}:${line || 1}`,
    },
  }

  const filePathRegExp = /.+\/([^/]+)\/(blob|tree)\/[^/]+\/(.*)/

  const addEditorLinks = () => {
    // repository content (files list)
    let files = document.querySelectorAll(
      ".files.js-navigation-container > tbody tr.js-navigation-item .content .css-truncate",
    )

    files.forEach(fileElement => {
      if (fileElement.parentNode.querySelector(".open-in-ide-link-file-explorer")) return

      let fileUrl = fileElement.querySelector("a").getAttribute("href")
      if (!filePathRegExp.test(fileUrl)) return

      const pathInfo = filePathRegExp.exec(fileUrl)
      const repo = pathInfo[1]
      const file = pathInfo[3]

      let editorLink = EDITORS[OPTIONS.defaultIde].generateUrl(repo, file)

      let editorLinkElement = document.createElement("span")
      editorLinkElement.classList.add("open-in-ide-link-file-explorer")
      editorLinkElement.innerHTML = `<a href="${editorLink}" title="Open in ${
        EDITORS[OPTIONS.defaultIde].name
      }"><img style="vertical-align: middle;" src="${chrome.extension.getURL(
        EDITORS[OPTIONS.defaultIde].icon,
      )}" /></a>`
      fileElement.parentNode.insertBefore(editorLinkElement, fileElement.nextSibling)
    })

    // file links (file changes view & discussions)
    let grayDarkLinks = document.querySelectorAll("a.link-gray-dark[title]")

    grayDarkLinks.forEach(linkElement => {
      if (linkElement.parentNode.querySelector(".open-in-ide-link-code-review")) return

      const file = linkElement.getAttribute("title")
      const repo = window.location.href.split("/")[4]

      let lineNumber

      try {
        // in discussion
        const lineNumberNodes = linkElement.parentNode.parentNode.querySelectorAll(
          "td[data-line-number]",
        )
        // get last line number
        lineNumber = lineNumberNodes[lineNumberNodes.length - 1].getAttribute("data-line-number")
      } catch (err1) {
        try {
          // in changed files
          const firstLineNumberNode = linkElement.parentNode.parentNode.parentNode.querySelector(
            "td[data-line-number]",
          )
          // get first line number
          lineNumber = firstLineNumberNode.getAttribute("data-line-number")
        } catch (err2) {
          // no line number available
        }
      }

      let editorLink = EDITORS[OPTIONS.defaultIde].generateUrl(repo, file, lineNumber)

      let editorLinkElement = document.createElement("span")
      editorLinkElement.classList.add("open-in-ide-link-code-review")
      editorLinkElement.innerHTML = `<a href="${editorLink}" title="Open in ${
        EDITORS[OPTIONS.defaultIde].name
      }"><img style="vertical-align: middle;" src="${chrome.extension.getURL(
        EDITORS[OPTIONS.defaultIde].icon,
      )}" /></a>`
      linkElement.parentNode.insertBefore(editorLinkElement, null)
    })
  }

  // set up an observer
  window.pageChangeObserver = new MutationObserver(
    debounce(() => {
      addEditorLinks()
      observeChanges()
    }),
  )

  // observe route change
  const title = document.querySelector("head > title")
  window.pageChangeObserver.observe(title, {
    childList: true,
  })

  // observe content changes
  const observeChanges = () => {
    let content = document.querySelector(".repository-content")

    if (content)
      window.pageChangeObserver.observe(content, {
        childList: true,
        subtree: true,
      })
  }

  addEditorLinks()
  observeChanges()
})()
