;(async function() {
  'use strict'

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
          localPathForRepositories: '/home/changeMeInOptions', // default value
        },
        resolve,
      )
    })
  }

  const OPTIONS = await getOptions()

  let vscodePngIcon = `<img style="vertical-align: middle;" src="data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAACglBMVEUAAAAAfr8ms/QAfL0AerwAkdYAeboAhMgAitMAcLIiqPIAbrEAhdAip/MAeMAAbLAAgtAAgdAAf9AAfc8gnvEAhcUAfL0JhsgirO0ntfUmtPUAfL4AfL0Ae7wms/QmsvQmsvQAerwAersAerslsfMAktcAktcAktcAebsAeboAeboAkNYAkNUAkNUAj9YAeLkAd7kAd7gAdrgGfMAiqu8AjtUAjtQAjtUAhswAc7UAdbcAdrcAdbcYmt8krfMAjdUAjNQAjNQAidEAeL0AdLYAdbcAO3gkrPQkq/IAjNUAidIAcbUAcrQjqvMjqfIAbrEAcbYAh9EAidQjqPMjqPIAb7IAb7IAbbIAfcYAh9EAhtEAhtIAY7Ejp/MipvIAbrEAbrAAbbAAcbgAhdEAhNAAhNAAhNAWmeYipfEAbbAAbK8AbbAAbrEAhdIAg9AAgtAAgs8Fg9QfoO8AbLAAbLAAbLAAg9EAgdAAgc8AgtEAgM8Af84goPEAgNIAfs4AfM0gn/Egn/EgoPEAidgAeswHf9McmOwgn/Ign/IFfcAhquwAersFfL8hqesmsfMmsfMAeboAeLkFer4hp+slsPQlr/Mlr/MAd7gAd7glrvMlrvMkrvMAjtQAdrcAdbckrPIkrPIkrPIAjNQAcbQAc7Ukq/Ikq/Ikq/IAitMAitMAiNEAe8IjqfIjqfIjqfIAf8cAiNIAiNIAiNIjqPIjqPIjp/IAbrEAhtEAhtEipvEipvEipvEAbrAAhNAAhNAipPEipPEipPEAgs8Ags8ho/Eho/Eho/EAgc8AgM4Ef9EdnOwhovEhofEhofEAfs4EftAcmuwgoPEgoPEEfM8cmev////jeiQ4AAAAiXRSTlMAAAAAAAAAAAAAAAAAAAAAAAAAAAABV+O9TQoCW+bwrEsFau7wBiIICXrzf9+PFg2K+PrD7d/9uUGY+/B/Lt5Czv/w+9hTAh7fLMu7Kx7fLMu8Kx7fQs7/8PvYUwIe39/9uUGY+/B/Lt5/344WDYr4+sPtBiIICXrzBWvu8AJb5vCsSwFX5L1NCgP8i/AAAAABYktHRNV+vDsTAAAAB3RJTUUH4wYFFAA5oLBFugAAAP9JREFUGNNjYIACRlExcQlJKSYYn1laRrazS05eAcpnUVRS7u7p7etXYVBVU2dlYNPQ1JowcdLkKVOnMWjr6Oqx6xsYTp9hZGwyc9ZsBtM5ZuYWllZz51nb2NrNX7CQwd5hkaOT8+IlLq5u7h5Lly1n4PD0WrFy1WpvH04uX781a9cxcPsHrN+wcVNgEA9vcMjmLVsZQsO2hUdEbt8RFR0TG7dz126G+D0JiUnJKXv3paalZ+w/cJAhMys7hy83L//Q4YLCoiNHjzEUl5TyMwiUlVccP3Hy1OkzZ6FOF6ysqj53/sLFSzUwzwnV1tVfvtLQ2AQTYBBubmlta+8QAQBQHFgzTDo1jwAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxOS0wNi0wNVQyMTozMTowMCswMjowMNNGE5YAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTktMDYtMDVUMjA6MDA6NTcrMDI6MDCE6k96AAAAAElFTkSuQmCC" />`

  const filePathRegExp = /.+\/([^/]+)\/(blob|tree)\/[^/]+\/(.*)/

  const addVSCodeLinks = () => {
    // repository content (files list)
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
      vscodeLinkElement.innerHTML = `<a href="${vscodeLink}" title="Open in VSCode">${vscodePngIcon}</a>`
      fileElement.parentNode.insertBefore(vscodeLinkElement, fileElement.nextSibling)
    })

    // file links (file changes view & discussions)
    let grayDarkLinks = document.querySelectorAll('a.link-gray-dark[title]')

    grayDarkLinks.forEach(linkElement => {
      if (linkElement.parentNode.querySelector('.open-in-vscode-link-code-review')) return

      const file = linkElement.getAttribute('title')
      const repo = window.location.href.split('/')[4]

      let vscodeLink = `vscode://file/${OPTIONS.localPathForRepositories}/${repo}/${file}`

      try {
        // in discussion
        const lineNumberNodes = linkElement.parentNode.parentNode.querySelectorAll(
          'td[data-line-number]',
        )
        // get last line number
        const lineNumber = lineNumberNodes[lineNumberNodes.length - 1].getAttribute(
          'data-line-number',
        )
        vscodeLink += `:${lineNumber}`
      } catch (err1) {
        try {
          // in changed files
          const firstLineNumberNode = linkElement.parentNode.parentNode.parentNode.querySelector(
            'td[data-line-number]',
          )
          // get first line number
          const lineNumber = firstLineNumberNode.getAttribute('data-line-number')
          vscodeLink += `:${lineNumber}`
        } catch (err2) {
          // no line number available
        }
      }

      let vscodeLinkElement = document.createElement('span')
      vscodeLinkElement.classList.add('open-in-vscode-link-code-review')
      vscodeLinkElement.innerHTML = `<a href="${vscodeLink}" title="Open in VSCode">${vscodePngIcon}</a>`
      linkElement.parentNode.insertBefore(vscodeLinkElement, null)
    })
  }

  // set up an observer
  window.pageChangeObserver = new MutationObserver(
    debounce(() => {
      addVSCodeLinks()
      observeChanges()
    }),
  )

  // observe route change
  const title = document.querySelector('head > title')
  window.pageChangeObserver.observe(title, {
    childList: true,
  })

  // observe content changes
  const observeChanges = () => {
    let content = document.querySelector('.repository-content')

    if (content)
      window.pageChangeObserver.observe(content, {
        childList: true,
        subtree: true,
      })
  }

  addVSCodeLinks()
  observeChanges()
})()
