const {
  app,
  BrowserWindow,
  ipcMain,
  nativeTheme,
  Tray,
  dialog,
  Notification,
  shell,
} = require("electron");
const { Worker } = require("worker_threads");
const path = require("path");
const axios = require("axios");
const constants = require("./electron/constants");
const menu = require("./electron/menu");
const logger = require("./electron/logger");
const { getValidUniqueFilename, isValidUrl } = require("./electron/utils");
const isDev = true;
const isMac = process.platform === "darwin";
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";

let win, tray;

const createTray = () => {
  tray = new Tray(
    isDev
      ? path.resolve(
          constants.paths.root,
          "src",
          "assets",
          "images",
          "logo-512x512.png"
        )
      : path.join(constants.paths.root, "logo.png")
  );

  tray.setToolTip("MLC");
  tray.setContextMenu(menu.getMenu(isDev));
  tray.on("click", () => {
    if (win) {
      win.isMinimized()
        ? win.restore()
        : win.isVisible()
        ? win.hide()
        : win.show();
    }
  });
};

const createWindow = () => {
  const stateWin = require("electron-window-state")({
    defaultWidth: 1024,
    defaultHeight: 580,
  });

  win = new BrowserWindow({
    x: stateWin.x,
    y: stateWin.y,
    width: stateWin.width,
    height: stateWin.height,
    minWidth: 960,
    minHeight: 560,
    show: false,
    frame: isMac,
    webPreferences: {
      preload: path.join(__dirname, "electron", "bridge.js"),
      webSecurity: false,
    },
  });

  if (!isDev) win.setMenu(null);

  win.on("closed", () => {
    win = null;
  });

  // win.once("show", async () => {});

  win.once("ready-to-show", () => {
    win.show();
  });

  win.on("maximize", (event, params) => {
    win.webContents.send(constants.CHANNELS.WINDOW_IS_MAXIMIZED, true);
  });

  win.on("unmaximize", (event, params) => {
    win.webContents.send(constants.CHANNELS.WINDOW_IS_MAXIMIZED, false);
  });

  if (isDev) win.loadURL("http://localhost:3000");
  else win.loadFile(path.join(__dirname, "..", "build", "index.html"));

  stateWin.manage(win);
};

app.whenReady().then(async () => {
  // HERE YOU COULD SEPARATE THINGS IN FILES

  // check file system
  const files = require("./electron/files");
  const filesAndfolders = await files.checkFilesAndFolder();
  // load configs and prefs
  let prefs = await files.loadPrefs();
  const config = constants.config;
  // set local server
  const server = require("./electron/server");
  let localServer = await server.start(prefs.server);
  console.log("SERVER", localServer);
  // set theme before loading
  nativeTheme.themeSource = prefs.theme;

  // NON BLOCKING JOB
  // set scanner "worker thread"
  const scanner = new Worker(
    isDev
      ? path.join(__dirname, "electron", "scanner.js")
      : path.join(process.resourcesPath, "scanner", "worker.js"),
    { workerData: { isDev } }
  );
  scanner.on("message", (object) => {
    if ("error" in object) {
      win.webContents.send(constants.CHANNELS.DIALOG, {
        title: "Error",
        message: object.error.message,
        ok: "OK",
      });
    }
    if ("status" in object) {
      win.webContents.send(constants.CHANNELS.SCANNER_UPDATE, object.status);
    }
    if ("lists" in object) {
      win.webContents.send(constants.CHANNELS.DATA, object.lists);
    }
  });
  scanner.on("error", (error) => {
    console.log("error", error);
    logger.log("error", error);
    win.webContents.send(constants.CHANNELS.DIALOG, {
      title: "Error",
      message: error.message,
      ok: "OK",
    });
  });
  scanner.on("exit", (code) => {
    if (code !== 0) {
      console.log("exit", code);
      logger.log("EXIT", { message: "exit:" + code });
      win.webContents.send(constants.CHANNELS.DIALOG, {
        title: "Error",
        message: "EXIT: " + code,
        ok: "OK",
      });
    }
  });

  // init interface/system comunication
  ipcMain.on(constants.CHANNELS.WINDOW_CLOSE, () => {
    win.close();
  });
  ipcMain.on(constants.CHANNELS.WINDOW_MINIMIZE, () => {
    win.minimize();
  });
  ipcMain.on(constants.CHANNELS.WINDOW_MAXIMIZE, () => {
    if (win.isMaximized()) win.restore();
    else win.maximize();
  });
  ipcMain.on(constants.CHANNELS.WINDOW_HIDE, () => {
    win.hide();
  });
  ipcMain.on(constants.CHANNELS.FOLDER_SELECT, (event, params) => {
    const result = dialog.showOpenDialogSync(win, {
      defaultPath: params.defaultPath,
      properties: ["openDirectory"],
    });
    win.webContents.send(constants.CHANNELS.FOLDER_SELECT, {
      category: params.category,
      index: params.index,
      folder: result ? result[0] : "",
    });
  });
  ipcMain.on(constants.CHANNELS.THEME_SET, async (event, theme) => {
    const result = await files.setTheme(theme);
    if (!result) {
      const text = config.texts.system[prefs.language.replace("-", "_")].find(
        (t) => t.code === "error-theme-set"
      );
      new Notification({
        title: text.title,
        body: text.message,
      }).show();
      return;
    }
    prefs.theme = theme;
    nativeTheme.themeSource = theme;
    win.webContents.send(constants.CHANNELS.THEME_SET, theme);
  });
  ipcMain.on(constants.CHANNELS.LANGUAGE_SET, async (event, language) => {
    const result = await files.setLanguage(language);
    if (!result) {
      const text = config.texts.system[language.replace("-", "_")].find(
        (t) => t.code === "error-language-set"
      );
      new Notification({
        title: text.title,
        body: text.message,
      }).show();
      return;
    }
    prefs.language = language;
    win.webContents.send(constants.CHANNELS.LANGUAGE_SET, language);
  });
  ipcMain.on(constants.CHANNELS.PREFS_SET, async (event, changes) => {
    if ("remote" in changes) prefs.source.remote = changes.remote;
    if ("folders" in changes) prefs.source.local = changes.folders;
    const result = await files.savePrefs(prefs);
    if (!result) {
      const text = config.texts.system[prefs.language.replace("-", "_")].find(
        (t) => t.code === "error-prefs-set"
      );
      new Notification({
        title: text.title,
        body: text.message,
      }).show();
      return;
    }
    win.webContents.send(constants.CHANNELS.PREFS_SET, prefs);

    // NEW SCANNER REQUEST WITH DUMMY PARAMETERS
    scanner.postMessage({ url: "https://www.google.com", delay: 10000 });
  });
  ipcMain.on(constants.CHANNELS.SERVER_SET, async (event, enabled) => {
    localServer = server.setEnable(enabled);
    win.webContents.send(constants.CHANNELS.SERVER_SET, localServer);
  });
  ipcMain.on(constants.CHANNELS.LOAD_PROFILE, async (event, pieces) => {
    const url =
      (prefs.source.remote.enabled && isValidUrl(prefs.source.remote.url)
        ? prefs.source.remote.url
        : localServer.url) +
      "/api/profile/" +
      pieces[0] +
      "." +
      getValidUniqueFilename(...pieces.slice(1)).replace("#", "%23");

    let response;
    try {
      response = await axios.get(url);
    } catch (error) {}
    if (response && "data" in response)
      win.webContents.send(constants.CHANNELS.LOAD_PROFILE, response.data);
  });
  ipcMain.on(constants.CHANNELS.PLAY_PROFILE, async (event, pieces) => {
    const url =
      (prefs.source.remote.enabled && isValidUrl(prefs.source.remote.url)
        ? prefs.source.remote.url
        : localServer.url) +
      "/api/profile/" +
      pieces[0] +
      "." +
      getValidUniqueFilename(...pieces.slice(1)).replace("#", "%23") +
      "/medias";

    let response;
    try {
      response = await axios.get(url);
    } catch (error) {}
    if (response && "data" in response)
      win.webContents.send(constants.CHANNELS.PLAY_PROFILE, response.data);
  });
  ipcMain.on(constants.CHANNELS.OPEN_FILE, async (event, file) => {
    if (prefs.source.remote.enabled && isValidUrl(prefs.source.remote.url)) {
      /**
       * implementation needed (download or open remote file)
       */
      // const response = await axios.get(url);
      // shell.openExternal(url);
    } else shell.openPath(file);
  });
  ipcMain.on(constants.CHANNELS.OPEN_LINK, (event, url) => {
    shell.openExternal(url);
  });
  ipcMain.on(constants.CHANNELS.INTERFACE_IS_READY, async (event, params) => {
    createTray();
    menu.setTrayMenuTheme(prefs.theme);
    win.webContents.send(constants.CHANNELS.INIT, {
      prefs: prefs,
      config: config,
      localServer: localServer,
    });

    if (!filesAndfolders || localServer === null) {
      // FATAL ERROR
      win.webContents.send(constants.CHANNELS.DATA, constants.listsEmpty);
      const text = config.texts.system[prefs.language.replace("-", "_")].find(
        (t) =>
          t.code ===
          (localServer === null ? "error-server-invlaid" : "error-filesystem")
      );
      win.webContents.send(constants.CHANNELS.DIALOG, {
        title: text.title,
        message: text.message,
        ok: text.buttons[0],
      });
    } else {
      // SCANNER REQUEST WITH DUMMY PARAMETERS
      scanner.postMessage({
        url: "https://www.google.com",
        delay: 10000,
      });
    }
  });

  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (!isMac) app.quit();
});
