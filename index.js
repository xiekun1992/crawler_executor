const {
  app
} = require('electron')
const {
  createWindow
} = require('./window')

// list page
let page = 1
const entryUrl = `https://k6.7086xx.rocks/pw/thread.php?fid=3&page=${page}`
let isListPage = true
let detailPages = []

app.whenReady().then(() => {
  const win = createWindow(entryUrl)
  win.webContents.on('did-finish-load', async () => {
    try {
      // if navigate to the proper page, otherwise may reach the end
      const currentPage = await win.webContents.executeJavaScript(`
        Promise.resolve((function() {
          return +document.querySelector('.pages>b').textContent
        })())
      `)
      if (page === currentPage) {
        console.log(isListPage, detailPages)
        
        if (isListPage) {
          // find detail entry from list page
          const listResults = await win.webContents.executeJavaScript(`
            Promise.resolve((function(){
              return Array.prototype.slice.call(ajaxtable.querySelectorAll('.tr3>td>h3>a'))
                .map(item => ({
                  href: item.href.toString(),
                  title: item.textContent
                }))
                .filter(item => item.title.includes('卡通'))
            })())
          `)
          console.log(listResults)
          detailPages = listResults.slice(0)
          // goto detail page
          if (detailPages.length > 0) {
            isListPage = false
            win.loadURL(detailPages.shift().href)
          } else {
            // not found targets, goto next list page
            isListPage = true
            const entryUrl = `https://k6.7086xx.rocks/pw/thread.php?fid=3&page=${++page}`
            win.loadURL(entryUrl)
          }
        } else {
          // find data from detail page
          const detailResults = await win.webContents.executeJavaScript(`
            Promise.resolve((function() {
              let details = []
              read_tpc.childNodes.forEach((item) => {
                if (item.nodeName.toLowerCase() == '#text') {
                  details.push(item.textContent)
                } else if (item.nodeName.toLowerCase() == 'img') {
                  details.push(item.src)
                } else if (item.nodeName.toLowerCase() == 'a' && item.href == item.textContent) {
                  details.push(item.href)
                }
              })
              return details
            })())
          `)
          console.log(detailResults) // evaluate and persist
          // goto detail page
          if (detailPages.length > 0) {
            isListPage = false
            win.loadURL(detailPages.shift().href)
          } else {
            // goto next list page
            isListPage = true
            const entryUrl = `https://k6.7086xx.rocks/pw/thread.php?fid=3&page=${++page}`
            win.loadURL(entryUrl)
          }
        }
      }
    } catch(e) {
      console.log('error occur', e)
    }
  })
})