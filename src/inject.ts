import "./inject.css"
import { Editor, EDITORS } from "./types"
import { getOptions, debounce } from "./utils"

const run = async () => {
  const OPTIONS = await getOptions()

  function debug(...args: unknown[]) {
    // eslint-disable-next-line no-console
    if (OPTIONS.showDebugMessages) console.log.apply(null, ["[OPEN-IN-IDE EXTENSION]", ...args])
  }

  const HOSTS: { [h: string]: string } = {
    "github.com": "github",
    "gitlab.com": "gitlab",
  }

  const EDITOR_OPENERS: {
    [e in Editor]: (repo: string, file: string, line?: string) => string
  } = {
    vscode: (repo: string, file: string, line?: string) => {
      const url = `vscode://file/${OPTIONS.localPathForRepositories}/${repo}/${file}:${line ?? "1"}`
      location.href = url
      return url
    },
    "vscode-wsl": (repo: string, file: string, line?: string) => {
      const url = `vscode://vscode-remote/wsl+Ubuntu/${OPTIONS.localPathForRepositories}/${repo}/${file}:${
        line ?? "1"
      }:1`
      location.href = url
      return url
    },
    vscodium: (repo: string, file: string, line?: string) => {
      const url = `vscodium://file/${OPTIONS.localPathForRepositories}/${repo}/${file}:${line ?? "1"}`
      location.href = url
      return url
    },
    "vscodium-wsl": (repo: string, file: string, line?: string) => {
      const url = `vscodium://vscode-remote/wsl+Ubuntu/${OPTIONS.localPathForRepositories}/${repo}/${file}:${
        line ?? "1"
      }:1`
      location.href = url
      return url
    },
    "vscode-insiders": (repo: string, file: string, line?: string) => {
      const url = `vscode-insiders://file/${OPTIONS.localPathForRepositories}/${repo}/${file}:${line ?? "1"}`
      location.href = url
      return url
    },
    "vscode-insiders-wsl": (repo: string, file: string, line?: string) => {
      const url = `vscode-insiders://vscode-remote/wsl+Ubuntu/${OPTIONS.localPathForRepositories}/${repo}/${file}:${
        line ?? "1"
      }:1`
      location.href = url
      return url
    },
    phpstorm: (repo: string, file: string, line?: string) => {
      const url = `phpstorm://open?file=${OPTIONS.localPathForRepositories}/${repo}/${file}&line=${line ?? "1"}`
      location.href = url
      return url
    },
    "intellij-idea": (repo: string, file: string, line?: string) => {
      const url = `idea://open?file=${OPTIONS.localPathForRepositories}/${repo}/${file}&line=${line ?? "1"}`
      location.href = url
      return url
    },
    webstorm: (repo: string, file: string, line?: string) => {
      const url = `webstorm://open?file=${OPTIONS.localPathForRepositories}/${repo}/${file}&line=${line ?? "1"}`
      location.href = url
      return url
    },
    goland: (repo: string, file: string, line?: string) => {
      const url = `goland://open?file=${OPTIONS.localPathForRepositories}/${repo}/${file}&line=${line ?? "1"}`
      location.href = url
      return url
    },
    clion: (repo: string, file: string, line?: string) => {
      const url = `clion://open?file=${OPTIONS.localPathForRepositories}/${repo}/${file}&line=${line ?? "1"}`
      location.href = url
      return url
    },
    "jetbrains-webserver": (repo: string, file: string, line?: string) => {
      const url = `http://localhost:63342/api/file?file=${OPTIONS.localPathForRepositories}/${repo}/${file}&line=${
        line ?? "1"
      }`
      fetch(url).catch(() => alert(`Unable to open the file.\nIs the built-in web server started on localhost:63342 ?`))
      return url
    },
  }

  const addEditorIcons = () => {
    switch (HOSTS[location.host]) {
      case "github":
        addEditorIconsGithub()
        break
      case "gitlab":
        addEditorIconsGitlab()
        break
      default:
    }
  }

  const generateIconElement = (repo: string, file: string, lineNumber?: string | null) => {
    const editorIconSpanElement = document.createElement("span")
    const filename = file.split("/").pop() as string
    let iconTitle = `Open ${filename} in ${EDITORS[OPTIONS.defaultIde].name}`
    if (lineNumber) iconTitle = `${iconTitle} at line ${lineNumber}`
    editorIconSpanElement.title = iconTitle
    editorIconSpanElement.classList.add("open-in-ide-icon")
    editorIconSpanElement.setAttribute("data-path", file) // Adds this argument to ease comparison on Gitlab lazy reload

    const editorIconImgElement = document.createElement("img")
    editorIconImgElement.src = chrome.runtime.getURL(EDITORS[OPTIONS.defaultIde].getIcon(32))
    editorIconSpanElement.appendChild(editorIconImgElement)

    editorIconSpanElement.addEventListener("click", e => {
      e.preventDefault()
      const editorUrl = EDITOR_OPENERS[OPTIONS.defaultIde](repo, file, lineNumber ?? undefined)
      debug(`Opened ${editorUrl}`)
    })
    return editorIconSpanElement
  }

  const filePathRegExpGithub = /.+\/([^/]+)\/(blob|tree)\/[^/]+\/(.*)/
  const filePathRegExpGitlab = /\/([^\/]+)\/-\/(?:blob|tree)(?:\/[^\/]+)?\/(.+)$/

  const addEditorIconsGithub = () => {
    debug("Adding editor icons")

    let addedIconsCounter = 0

    // -------------------------------
    // repository content (files list)
    // -------------------------------

    if (OPTIONS.showIconInFileTree) {
      const files = document.querySelectorAll(
        '[aria-labelledby="files"].js-navigation-container > .Box-row.js-navigation-item .css-truncate',
      )

      files.forEach(fileElement => {
        // don't add a new icon if icon already exists
        if (fileElement.parentNode?.querySelector(".open-in-ide-icon")) return

        const fileUrl = fileElement.querySelector("a")?.getAttribute("href")
        if (!fileUrl || !filePathRegExpGithub.test(fileUrl)) return

        const pathInfo = filePathRegExpGithub.exec(fileUrl)
        const repo = pathInfo?.[1]
        const file = pathInfo?.[3]
        if (!repo || !file) return

        const editorIconElement = generateIconElement(repo, file)
        editorIconElement.classList.add("open-in-ide-icon-file-explorer")

        fileElement.parentNode?.insertBefore(editorIconElement, fileElement.nextSibling)
        addedIconsCounter++
      })
    }

    // --------------------------------------------
    // file links (files changed view & discussions)
    // --------------------------------------------

    if (OPTIONS.showIconOnFileBlockHeaders || OPTIONS.showIconOnLineNumbers) {
      let inFilesChangedView = true

      // select file blocks
      let primaryLinks = document.querySelectorAll(".file-info a.Link--primary") // in files changed view

      if (!primaryLinks.length) {
        primaryLinks = document.querySelectorAll("summary a.Link--primary") // in discussion
        inFilesChangedView = false
        debug(primaryLinks)
      }

      const repo = window.location.href.split("/")[4]

      primaryLinks.forEach(linkElement => {
        const file = linkElement.innerHTML

        // no file found
        if (!file) return

        let lineNumberForFileBlock

        const fileElement = linkElement.closest(inFilesChangedView ? ".file" : ".js-comment-container")

        if (fileElement) {
          if (!inFilesChangedView) {
            // in discussion
            const lineNumberNodes = fileElement.querySelectorAll("td[data-line-number]")

            if (lineNumberNodes.length === 0) return // length can be equal to zero in case of resolved comment for example

            // get last line number
            lineNumberForFileBlock = lineNumberNodes[lineNumberNodes.length - 1].getAttribute("data-line-number")
          } else {
            const firstLineNumberNode = fileElement.querySelector(
              "td.blob-num-deletion[data-line-number], td.blob-num-addition[data-line-number]",
            )
            // get first line number
            lineNumberForFileBlock = firstLineNumberNode?.getAttribute("data-line-number")
          }
        } else {
          // no line number available
        }

        if (
          OPTIONS.showIconOnFileBlockHeaders &&
          // don't add a new icon if icon already exists
          !linkElement.parentNode?.querySelector(".open-in-ide-icon")
        ) {
          const editorIconElement = generateIconElement(repo, file, lineNumberForFileBlock)

          linkElement.parentNode?.insertBefore(editorIconElement, null)
          addedIconsCounter++
        }

        // add icon on each line number
        if (OPTIONS.showIconOnLineNumbers && fileElement) {
          const clickableLineNumbersNodes = fileElement.querySelectorAll("td.blob-num[data-line-number]")

          clickableLineNumbersNodes.forEach(lineNumberNode => {
            // don't add a new icon if icon already exists
            if (lineNumberNode.querySelector(".open-in-ide-icon")) return

            const lineNumber = lineNumberNode.getAttribute("data-line-number")

            const editorIconElement = generateIconElement(repo, file, lineNumber)

            lineNumberNode.classList.add("js-open-in-ide-icon-added")
            lineNumberNode.appendChild(editorIconElement)
            addedIconsCounter++
          })
        }
      })
    }

    debug(`Added ${addedIconsCounter} new editor icons`)
  }

  // Gitlab lazy loads the file blocks, so we need to remove the old icon if it's not the same file
  const reloadIconIfMismatchesWithFile = (file: string, icon: Element | null) => {
    if (icon && icon.getAttribute("data-path") !== file) {
      debug("Removed mismatched icon for file: " + file)
      icon.remove()
    }
  }

  const addEditorIconsGitlab = () => {
    debug("Adding editor icons")

    let addedIconsCounter = 0

    // -------------------------------
    // repository content (files list)
    // -------------------------------

    if (OPTIONS.showIconInFileTree) {
      const files = document.querySelectorAll(".tree-item-file-name")
      files.forEach(fileData => {
        const fileElement = fileData.querySelector("a")
        if (!fileElement) return

        // don't add a new icon if icon already exists
        if (fileElement.parentNode?.querySelector(".open-in-ide-icon")) return
        const fileUrl = fileElement.getAttribute("href")
        if (!fileUrl || !filePathRegExpGitlab.test(fileUrl)) return

        const pathInfo = filePathRegExpGitlab.exec(fileUrl)
        const repo = pathInfo?.[1]
        const file = pathInfo?.[2]

        if (!repo || !file) return
        const editorIconElement = generateIconElement(repo, file)
        editorIconElement.classList.add("open-in-ide-icon-file-explorer")

        fileElement.parentNode?.insertBefore(editorIconElement, fileElement.nextSibling)
        addedIconsCounter++
      })
    }

    // --------------------------------------------
    // file links (files changed view & discussions)
    // --------------------------------------------

    if (OPTIONS.showIconOnFileBlockHeaders || OPTIONS.showIconOnLineNumbers) {
      const inFilesChangedView = document
        .querySelector(".merge-request-tabs")
        ?.querySelector(".active")
        ?.querySelector("a")
        ?.innerText.includes("Changes")

      // select file blocks
      const primaryLinks = document.querySelectorAll(".file-header-content")

      const repo = window.location.href.split("/-")[0]?.split("/").pop()

      primaryLinks.forEach(linkElement => {
        const file = linkElement.querySelector(".file-title-name")?.getAttribute("title")?.trim().split(" ")[0]

        // no file or repo found
        if (!repo || !file) return

        let lineNumberForFileBlock

        const fileElement = linkElement.closest(inFilesChangedView ? ".diff-file" : ".js-discussion-container")

        if (fileElement) {
          if (!inFilesChangedView) {
            // in discussion
            const lineNumberNodes = fileElement.querySelectorAll(".diff-line-num.new_line")

            if (lineNumberNodes.length === 0) return // length can be equal to zero in case of resolved comment for example

            // get last line number
            lineNumberForFileBlock = lineNumberNodes[lineNumberNodes.length - 1].innerHTML
          } else {
            const firstLineNumberNode = fileElement.querySelector("a[data-linenumber]")
            // get first line number
            lineNumberForFileBlock = firstLineNumberNode?.getAttribute("data-linenumber")
          }
        } else {
          // no line number available
        }

        if (OPTIONS.showIconOnFileBlockHeaders) {
          const existingIcon = linkElement.querySelector(".open-in-ide-icon")

          reloadIconIfMismatchesWithFile(file, existingIcon)

          if (existingIcon) return // don't add a new icon if icon already exists and matches the file

          const editorIconElement = generateIconElement(repo, file, lineNumberForFileBlock)

          linkElement.insertBefore(editorIconElement, null)
          addedIconsCounter++
        }

        if (OPTIONS.showIconOnLineNumbers && fileElement) {
          const clickableLineNumbersNodes = fileElement.querySelectorAll("a[data-linenumber]")

          clickableLineNumbersNodes.forEach(lineNumberNode => {
            const existingIcon = lineNumberNode.querySelector(".open-in-ide-icon")

            reloadIconIfMismatchesWithFile(file, existingIcon)

            if (existingIcon) return // don't add a new icon if icon already exists and matches the file

            const lineNumber = lineNumberNode.getAttribute("data-linenumber")
            const editorIconElement = generateIconElement(repo, file, lineNumber)

            lineNumberNode.classList.add("js-open-in-ide-icon-added")
            lineNumberNode.appendChild(editorIconElement)
            addedIconsCounter++
          })
        }
      })
    }

    debug(`Added ${addedIconsCounter} new editor icons`)
  }

  // observe content changes
  const observeChanges = () => {
    debug("Observing page changes")
    let content

    switch (HOSTS[location.host]) {
      case "github":
        content = document.querySelector(".repository-content")
        break
      case "gitlab":
        content = document.querySelector("#content-body")
        break
      default:
    }

    if (content)
      pageChangeObserver.observe(content, {
        childList: true,
        subtree: true,
      })
  }

  // inject CSS rules for GitHub elements
  const styleNode = document.createElement("style")

  if (OPTIONS.showIconOnLineNumbers)
    // hide file numbers on hover
    styleNode.innerHTML += `tr:hover > td.js-open-in-ide-icon-added::before {
      display: none;
    }`

  document.head.appendChild(styleNode)

  // set up an observer
  const pageChangeObserver = new MutationObserver(function (mutations) {
    mutations.forEach(
      debounce(function (mutation: MutationRecord) {
        // prevent recursive mutation observation
        if ((mutation.target as Element).querySelector(":scope > .open-in-ide-icon")) return
        debug("Detected page changes:")
        debug(mutation.target)
        addEditorIcons()
        observeChanges()
      }),
    )
  })

  addEditorIcons()
  observeChanges()

  // observe route change
  pageChangeObserver.observe(document.head, {
    childList: true,
  })
}

void run()
