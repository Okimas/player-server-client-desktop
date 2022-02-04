module.exports = {
  log: (location, error) => {
    const fs = require("fs");
    const path = require("path");
    const logfolder = require("./constants").paths.log;
    if (!fs.existsSync(logfolder)) fs.mkdirSync(logfolder);

    const d = new Date();
    const filename =
      d.getFullYear() +
      "." +
      (d.getMonth() + 1).toString().padStart(2, "0") +
      "." +
      d.getDate().toString().padStart(2, "0") +
      ".txt";
    const filepath = path.resolve(logfolder, filename);

    const entryLine =
      "[" +
      d.getFullYear() +
      "/" +
      (d.getMonth() + 1).toString().padStart(2, "0") +
      "/" +
      d.getDate().toString().padStart(2, "0") +
      " " +
      d.getHours().toString().padStart(2, "0") +
      ":" +
      d.getMinutes().toString().padStart(2, "0") +
      '] "' +
      location +
      '" => ' +
      error.message +
      "\n";

    fs.access(filepath, (err) => {
      if (!err) {
        fs.appendFile(filepath, entryLine, (err) => {
          if (err)
            throw new Error("LOGGING: " + error.message + " : " + err.message);
        });
        return;
      }
      fs.writeFile(filepath, entryLine, (err, data) => {
        if (err)
          throw new Error("LOGGING: " + error.message + " : " + err.message);
      });
    });
  },
};
