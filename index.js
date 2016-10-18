'use strict';
const electron = require('electron');

const app = electron.app;

// adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')();

// prevent window being garbage collected
let mainWindow;
let newWindow;

function onClosed() {
	// dereference the window
	// for multiple windows store them in an array
	mainWindow = null;
	newWindow = null;
}

function createMainWindow() {
	const win = new electron.BrowserWindow({
		width: 600,
		height: 400
	});

	win.loadURL(`file://${__dirname}/client/index.html`);
	win.on('closed', onClosed);

	return win;
}

/* TODO: fix this so that new window pops up when 'start' is clicked,
not on app open */
function createNewWindow() {
	const win = new electron.BrowserWindow({
		width: 600,
		height: 600
	});

	win.loadURL(`file://${__dirname}/client/newpage.html`);
	win.on('closed', onClosed);

	return win;
}

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (!mainWindow) {
		mainWindow = createMainWindow();
		newWindow = createNewWindow();

	}
});

app.on('ready', () => {
	newWindow = createNewWindow(); //sorry about this -_-
	mainWindow = createMainWindow();
	
});



