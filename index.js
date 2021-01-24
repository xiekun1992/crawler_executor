const {
  app
} = require('electron')
const {
  createWindow
} = require('./window')
const {
  connect,
  Hyperlink,
  RawText,
  DetailPage,
  Record
} = require('./persist')

global.argv = {
  dev: process.argv.includes('--dev'), // use production config
  prod: process.argv.includes('--prod'), // use production config
  hide: process.argv.includes('--hide-win'), // hide browser window
  dropTables: process.argv.includes('--drop-tables') // drop existing databases
}

// list page
let pageIndex = 1
const entryUrl = `https://k6.7086xx.rocks/pw/thread.php?fid=3&page=${pageIndex}`
let isListPage = true
let detailPages = []
let crawlingDetailPage
let dbConfig
let win
if (global.argv.dev) {
  dbConfig = require('./config.json').db.dev
} else if (global.argv.prod) {
  dbConfig = require('./config.json').db.prod
}

app.whenReady().then(async () => {
  await connect(dbConfig, global.argv.dropTables)
  await Record.findOrCreate({
    where: {
      id: 1
    },
    defaults: {
      pageIndex
    }
  })  
  win = createWindow(entryUrl, !global.argv.hide)
  win.webContents.on('dom-ready', async () => {
    try {
      if (isListPage) {
        crawlListPage()
      } else {
        crawlDetailPage()
      }
    } catch(e) {
      console.log('error occur', e)
    }
  })
})

async function crawlListPage() {
  // if navigate to the proper page, otherwise may reach the end
  const currentPage = await win.webContents.executeJavaScript(`
    Promise.resolve((function() {
      return +document.querySelector('.pages>b').textContent
    })())
  `)
  if (pageIndex === currentPage) {
    console.log(isListPage, detailPages)
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
    for (const item of listResults) {
      const page = await DetailPage.findOne({
        where: {
          title: item.title,
          address: item.href
        }
      })
      if (!page) {
        await DetailPage.create({
          title: item.title,
          address: item.href
        })
        detailPages.push(item)
      } else if (!page.done) { // the detail page is not fully crawled
        detailPages.push(item)
      }
    }
    crawlNext()
  }
}
async function crawlDetailPage() {
  // find data from detail page
  const detailResults = await win.webContents.executeJavaScript(`
    Promise.resolve((function() {
      let details = []
      let video = {
        text: [],
        image: [],
        link: null
      }
      read_tpc.childNodes.forEach((item) => {
        if (item.nodeName.toLowerCase() == '#text') {
          video.text.push(item.textContent)
        } else if (item.nodeName.toLowerCase() == 'img') {
          video.image.push(item.src)
        } else if (item.nodeName.toLowerCase() == 'a' && item.href == item.textContent) {
          video.link = item.href
          details.push(video)
          video = {
            text: [],
            image: [],
            link: null
          }
        }
      })
      return details
    })())
  `)
  console.log(detailResults) // evaluate and persist
  const page = await DetailPage.findOne({
    where: {
      title: crawlingDetailPage.title,
      address: crawlingDetailPage.href
    }
  })
  for (const item of detailResults) {
    const rawText = await RawText.create({
      detailPageId: page.id,
      text: item.text.join('\n')
    })
    await Hyperlink.create({
      rawTextId: rawText.id,
      address: item.link,
      type: 'link'
    })
    for (const imgsrc of item.image) {
      await Hyperlink.create({
        rawTextId: rawText.id,
        address: imgsrc,
        type: 'image'
      })
    }
  }
  page.done = true
  await page.save()
  const pageIndexRecord = await Record.findOne({
    where: {
      id: 1
    }
  })
  if (pageIndexRecord) {
    pageIndexRecord.pageIndex = pageIndex
    await pageIndexRecord.save()
  }
  crawlNext()
}
function crawlNext() {
  // goto detail page
  if (detailPages.length > 0) {
    isListPage = false
    crawlingDetailPage = detailPages.shift()
    win.loadURL(crawlingDetailPage.href)
  } else {
    // goto next list page
    isListPage = true
    const entryUrl = `https://k6.7086xx.rocks/pw/thread.php?fid=3&page=${++pageIndex}`
    win.loadURL(entryUrl)
  }
}