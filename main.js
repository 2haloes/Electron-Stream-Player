const { app, BrowserWindow, Menu, dialog } = require('electron')
const shell = require('electron').shell;
const path = require('path');

// Hopefully this isn't a dumpster fire of an electron app, I promise that I'm doing my best

// Need to keep a refrence open for the window. If not, the window can close after being caught by garbage collection
let win

function createWindow() {
    // Create the window
    win = new BrowserWindow({ 
        webPreferences: {
            nodeIntegration: true
        }
    });

    // Open the index page
    win.loadFile('player.html');

    win.on('closed', () => {
        // When a window is closed, remove the refrence to it 
        win = null
    });

    // Sets up the menu bar
    var menuTemplate = Menu.buildFromTemplate([{
        label: 'File',
        submenu: [
            {
                label: 'Open File',
                click() {
                    win.webContents.send('file-open', dialog.showOpenDialog({
                        properties: [
                            'openFile'
                        ],
                        filters: [
                            {name: 'Video files', extensions: ['mp4', 'webm', 'm3u8', 'ts']}
                        ]
                    }));
                },
                accelerator: 'CmdOrCtrl+F'
            },
            {
                label: 'Go Fullscreen',
                click() {
                    win.webContents.send('fullscreen', null);
                }
            },
            {
                type: 'separator'
            },
            {
                label: 'Exit',
                click() {
                    app.quit();
                }
            }
        ]
    },
    {
        label: 'Help',
        submenu: [
            {
                label: 'Version: ' + app.getVersion()
            },
            {
                label: 'License: Mozilla Public License 2.0'
            },
            {
                type: 'separator'
            },
            {
                label: 'View on Github',
                click() {
                    shell.openExternal('https://github.com/2haloes/Electron-Stream-Player');
                }
            },
            {
                label: 'View and report issues',
                click() {
                    shell.openExternal('https://github.com/2haloes/Electron-Stream-Player/issues');
                }
            },
            {
                type: 'separator'
            },
            {
                label: 'Icon by Icons8',
                click() {
                    shell.openExternal('https://icons8.com/');
                }
            }
        ]
    }]);
    // Sets the menu to the above
    Menu.setApplicationMenu(menuTemplate);
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