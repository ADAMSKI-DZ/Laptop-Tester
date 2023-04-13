console.time("app_startup_time");

/*------ Importing electron and some other things------*/
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const ipc = ipcMain;
const os = require("os");
const exec = require("child_process").exec;
const { autoUpdater } = require("electron-updater");

/*------ Optimizing tha app by v8 cache ------*/
require("v8-compile-cache");

/*------ Defining window and app name ------*/
const appName = "Laptop Tester";

/*------ Configuring window ------*/
let win;

const createMainWindow = () => {
  win = new BrowserWindow({
    minWidth: 1000,
    minHeight: 600,
    resizable: true,
    frame: false,
    fullscreenable: true,
    title: appName,
    show: true,
    icon: path.join(__dirname, "./asset/photos/icon.ico"),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  win.loadFile("./src/splash.html");
  //win.webContents.openDevTools({ mode: "detach" });

  /*------ Sending app name and pc username and app version to renderer process ------*/
  win.webContents.on("did-finish-load", () => {
    win.webContents.send("app_name", { title: appName });
    win.webContents.send("user_name", { userName: os.userInfo().username });
    win.webContents.send("app_version", { appVersion: app.getVersion() });
  });
};

/*------ Creating window when app started ------*/
app.whenReady().then(() => {
  createMainWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
  setTimeout(() => {
    win.loadFile("./src/index.html");
    ipc.on("app_is_online", () => {
      autoUpdater.checkForUpdates();
    });
  }, 1000);
  console.timeEnd("app_startup_time");
});

/*------ App quit functions------*/
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    autoUpdater.quitAndInstall();
  }
});

/*------ Close / Minimize / Maximize functions ------*/
ipc.on("close_the_app", () => {
  app.quit();
});
ipc.on("minimize_the_app", () => {
  win.minimize();
});
ipc.on("maximize_the_app", () => {
  if (win.isMaximized()) {
    win.restore();
  } else {
    win.maximize();
  }
});

/*------ Getting the app fullscreen when called from renderer process ------*/
ipc.on("get_fullscreen", () => {
  win.setFullScreen(true);
});
ipc.on("restore_screen", () => {
  win.setFullScreen(false);
});

/*------ New window for video ------*/
let videoWindow;
const createVideoWindow = () => {
  videoWindow = new BrowserWindow({
    fullscreen: true,
    frame: false,
    title: "Video 1",
    icon: path.join(__dirname, "./asset/photos/icon.ico"),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
};

/*------ Opening video window when called from renderer process ------*/
ipc.on("start_video1", () => {
  createVideoWindow();
  videoWindow.loadFile("./src/video-pages/video1.html");
});
ipc.on("start_video2", () => {
  createVideoWindow();
  videoWindow.loadFile("./src/video-pages/video2.html");
});

/*------ Closing video window ------*/
ipc.on("exit_video", () => {
  videoWindow.close();
});

let setDesktopDir = os.userInfo().homedir + "\\OneDrive\\Desktop";

function execute(command, callback) {
  exec(command, (error, stdout, stderr) => {
    callback(stdout);
  });
}
ipc.on("generate_battery_info", () => {
  execute(
    `cd ${setDesktopDir} && powercfg /batteryreport && start battery-report.html`,
    (output) => {
      console.log(output);
    }
  );
});

/*------ Update system ------*/

autoUpdater.autoDownload = false;

/*--- Check for an update ---*/
ipc.on("check_for_update", () => {
  autoUpdater.checkForUpdates();
});

/*--- Update available ---*/
autoUpdater.on("update-available", (info) => {
  win.webContents.send("update_available", {
    updateVersion: info.releaseName,
    releaseDate: info.releaseDate,
  });
});

/*--- Update not available ---*/
autoUpdater.on("update-not-available", () => {
  win.webContents.send("no_update_available");
});

/*--- Download progress info ---*/
autoUpdater.on("download-progress", (progressObj) => {
  win.webContents.send("download_progress", {
    percent: progressObj.percent,
    size: progressObj.total,
    speed: progressObj.bytesPerSecond,
  });
});

/*--- Update downloaded---*/
autoUpdater.on("update-downloaded", () => {
  win.webContents.send("update_downloaded");
});

/*--- Update get error ---*/
autoUpdater.on("error", (message) => {
  win.webContents.send("update_error", {
    error: message.stack.substring(0, 143),
  });
});

/*--- Download update when click btn ---*/
ipc.on("download_update", () => {
  autoUpdater.downloadUpdate();
});

/*--- Restart the app when click btn ---*/
ipc.on("restart_the_app", () => {
  autoUpdater.quitAndInstall(true, true);
});
