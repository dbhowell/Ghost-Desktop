/* jshint node: true */
'use strict';

const electron         = require('electron');
const checkForUpdate   = require('./basic-update');
const fetchWindowState = require('./window-state');
const app              = electron.app;
const BrowserWindow    = electron.BrowserWindow;
const globalShortcut   = electron.globalShortcut;
const emberAppLocation = `file://${__dirname}/../dist/index.html`;


// Before we do anything else, handle Squirrel Events
if (require('./squirrel')) {
    return;
}

let mainWindow = null;
electron.crashReporter.start();

app.on('ready', function onReady() {
    let windowState, usableState, stateKeeper;

    // Instantiate the window with the existing size and position.
    try {
        windowState = fetchWindowState();
        usableState = windowState.usableState;
        stateKeeper = windowState.stateKeeper;

        mainWindow = new BrowserWindow(
            Object.assign(usableState, {show:false})
        );
    } catch (error) {
        // Window state keeper failed, let's still open a window
        console.log(error);
        mainWindow = new BrowserWindow({show:false});
    }


    delete mainWindow.module;

    // Letting the state keeper listen to window resizing and window moving
    // event, and save them accordingly.
    if (stateKeeper) {
        stateKeeper.manage(mainWindow);
    }

    // If you want to open up dev tools programmatically, call
    // mainWindow.openDevTools();
    mainWindow.loadURL(emberAppLocation);

    // If a loading operation goes wrong, we'll send Electron back to
    // Ember App entry point
    mainWindow.webContents.on('did-fail-load', () => mainWindow.loadURL(emberAppLocation));
    mainWindow.webContents.on('did-finish-load', () => mainWindow.show());

    // Chromium drag and drop events tend to navigate the app away, making the
    // app impossible to use without restarting. These events should be prevented.
    mainWindow.webContents.on('will-navigate', (event) => event.preventDefault());

    mainWindow.on('closed', () => app.quit());

    // Setup Dev Shortcut on Windows (on Mac, the App Menu will take care of it)
    if (process.platform === 'win32') {
        globalShortcut.register('Ctrl+Shift+I', () => mainWindow.toggleDevTools());
    }

    checkForUpdate();
});
