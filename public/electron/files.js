const fs = require("fs");
const constants = require("./constants");
const logger = require("./logger");

const checkFilesAndFolder = () => {
  return new Promise((resolve, reject) => {
    try {
      if (!fs.existsSync(constants.paths.db)) fs.mkdirSync(constants.paths.db);
      if (!fs.existsSync(constants.paths.filePrefs))
        savePrefs(constants.prefsDefault);

      resolve(true);
    } catch (error) {
      logger.log("files checkFilesAndFolder", error);
      resolve(false);
    }
  });
};

const loadPrefs = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(
      constants.paths.filePrefs,
      { encoding: "utf8" },
      (error, data) => {
        if (error) {
          logger.log("files loadPrefs", error);
          resolve(constants.prefsDefault);
        } else resolve(JSON.parse(data));
      }
    );
  });
};

const savePrefs = (prefs) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(
      constants.paths.filePrefs,
      JSON.stringify(prefs, null, 2),
      (error) => {
        if (error) {
          logger.log("files savePrefs", error);
          resolve(false);
        } else resolve(true);
      }
    );
  });
};

const setTheme = async (theme) => {
  const prefs = await loadPrefs();
  prefs.theme = theme;
  const saved = await savePrefs(prefs);
  return saved;
};

const setLanguage = async (language) => {
  const prefs = await loadPrefs();
  prefs.language = language;
  const saved = await savePrefs(prefs);
  return saved;
};

module.exports = {
  checkFilesAndFolder,
  loadPrefs,
  savePrefs,
  setTheme,
  setLanguage,
};
