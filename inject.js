;(async function() {
  'use strict'

  const getOptions = async () => {
    return new Promise(resolve => {
      chrome.storage.sync.get(
        {
          localPathForRepositories: '/home/changeMeInOptions', // default value
        },
        resolve,
      )
    })
  }

  const OPTIONS = await getOptions()

  let vscodeSVGIcon = `<svg style="vertical-align: middle;" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 261 260" stroke-linejoin="round"><path d="M195.47461-0.005859375L195.47461 223.29688 0.49609375 194.33789 195.47461 259.99219 260.47461 232.95312 260.47461 31.064453 260.49609 31.054688 260.47461 31.011719 260.47461 27.035156 195.47461-0.005859375z" fill="#007acc"/><path d="M127.24219 38.037109L67.521484 97.070312 31.566406 69.992188 16.748047 74.941406 53.328125 111.10156 16.748047 147.25977 31.566406 152.21094 67.521484 125.13086 67.523438 125.13086 127.24023 184.16016 163.00781 168.96289 163.00781 53.234375 127.24219 38.037109zM127.24023 80.158203L127.24023 142.03711 86.154297 111.09766 127.24023 80.158203z" fill="#007acc"/></svg>`

  const filePathRegExp = /.+\/([^/]+)\/(blob|tree)\/[^/]+\/(.*)/

  const addVSCodeLinks = () => {
    let files = document.querySelectorAll(
      '.files.js-navigation-container > tbody tr.js-navigation-item .content .css-truncate',
    )

    files.forEach(fileElement => {
      if (fileElement.parentNode.querySelector('.open-in-vscode-link-file-explorer')) return

      let fileUrl = fileElement.querySelector('a').getAttribute('href')
      if (!filePathRegExp.test(fileUrl)) return

      const pathInfo = filePathRegExp.exec(fileUrl)
      const repo = pathInfo[1]
      const file = pathInfo[3]

      let vscodeLink = `vscode://file/${OPTIONS.localPathForRepositories}/${repo}/${file}`

      let vscodeLinkElement = document.createElement('span')
      vscodeLinkElement.classList.add('open-in-vscode-link-file-explorer')
      vscodeLinkElement.innerHTML = `<a href="${vscodeLink}" title="Open in VSCode">${vscodeSVGIcon}</a>`
      fileElement.parentNode.insertBefore(vscodeLinkElement, fileElement.nextSibling)
    })

    let grayDarkLinks = document.querySelectorAll('a.link-gray-dark[title]')

    grayDarkLinks.forEach(linkElement => {
      if (linkElement.parentNode.querySelector('.open-in-vscode-link-code-review')) return

      const file = linkElement.getAttribute('title')
      const repo = window.location.href.split('/')[4]

      let vscodeLink = `vscode://file/${OPTIONS.localPathForRepositories}/${repo}/${file}`

      const lineNumberNodes = linkElement.parentNode.parentNode.querySelectorAll(
        'td[data-line-number]',
      )

      try {
        const lineNumber = lineNumberNodes[lineNumberNodes.length - 1].getAttribute(
          'data-line-number',
        )
        vscodeLink += `:${lineNumber}`
      } catch (e) {}

      let vscodeLinkElement = document.createElement('span')
      vscodeLinkElement.classList.add('open-in-vscode-link-code-review')
      vscodeLinkElement.innerHTML = `<a href="${vscodeLink}" title="Open in VSCode">${vscodeSVGIcon}</a>`
      linkElement.parentNode.insertBefore(vscodeLinkElement, null)
    })
  }

  addVSCodeLinks()

  // set up an observer for the title element
  if (!window.titleChangeObserver) {
    window.titleChangeObserver = new MutationObserver(addVSCodeLinks)
    window.titleChangeObserver.observe(document.querySelector('head > title'), {
      childList: true,
    })
  }
})()
