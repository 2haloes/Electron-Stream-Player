const { app, BrowserWindow } = require('electron')

// This is the first shot I've made at an electron app, created in a hurry as a solution to my other program (RT Stream App) not working with most players due to changes out of my control
// So this probably won't be perfect on the first try but I'll do my best with it.

// Need to keep a refrence open for the window. If not, the window can close after being caught by garbage collection
let win

function createWindow() {
    // Create the window
    win = new BrowserWindow({ 
        webPreferences: {
            nodeIntegration: true
        }
    })

    // Open the index page
    win.loadFile('index.html')

    win.on('closed', () => {
        // When a window is closed, remove the refrence to it 
        win = null
    })
}

// Some APIs can only be used after the app has fully initialized
// I don't 100% think I need this but I want to be safe
app.on('ready', createWindow)

// Quit when all of the windows are closed
app.on('window-all-closed', () => {
    // On MacOS, applications can stay active until the user quits explicitly
    // I don't use a Mac so I'm taking the documentation's word for it
    if(process.platform !== 'darwin'){
        app.quit();
    }
})

app.on('activate', () => {
    // On MacOS, if the window is closed but the icon is clicked then the window needs to be opened
    if (win === null) {
        createWindow()
    }
})