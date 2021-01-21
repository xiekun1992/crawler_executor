const {
  BrowserWindow, session
} = require('electron')

let win
function createWindow(url) {
  win = new BrowserWindow({
    width: 1280,
    height: 720,
    webPreferences: {
      nodeIntegration: true
    }
  })
  win.loadURL(url)

  const filter = {
    urls: []
  }
  session.defaultSession.webRequest.onBeforeRequest(filter, (details, callback) => {
    // console.log(details)
    if (details.resourceType == 'mainFrame') { // image, script, mainFrame, stylesheet
      callback({})
    } else {
      callback({
        cancel: true
      })
    }
  })

  return win
}

module.exports = {
  createWindow
}