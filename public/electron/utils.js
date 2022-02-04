const path = require("path");

const isValidUrl = (string) => {
  let url;
  try {
    url = new URL(string);
  } catch (error) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
};

const getValidUniqueFilename = (profile, collection, title) => {
  let filename = "";
  if (profile && profile !== "") {
    profile = profile.replace(/-/g, "[ltx]");
    profile = profile.replace(/\</g, "[lt]");
    profile = profile.replace(/\>/g, "[gt]");
    profile = profile.replace(/\:/g, "[co]");
    profile = profile.replace(/\"/g, "[2q]");
    profile = profile.replace(/\//g, "[rs]");
    profile = profile.replace(/\\/g, "[ls]");
    profile = profile.replace(/\|/g, "[vb]");
    profile = profile.replace(/\?/g, "[qm]");
    profile = profile.replace(/\*/g, "[as]");
    filename = profile;
  }
  if (collection && collection !== "") {
    collection = collection.replace(/-/g, "[ltx]");
    collection = collection.replace(/\</g, "[lt]");
    collection = collection.replace(/\>/g, "[gt]");
    collection = collection.replace(/\:/g, "[co]");
    collection = collection.replace(/\"/g, "[2q]");
    collection = collection.replace(/\//g, "[rs]");
    collection = collection.replace(/\\/g, "[ls]");
    collection = collection.replace(/\|/g, "[vb]");
    collection = collection.replace(/\?/g, "[qm]");
    collection = collection.replace(/\*/g, "[as]");
    filename += (profile && profile !== "" ? "-" : "") + collection;
  }
  if (title && title !== "") {
    title = title.replace(/-/g, "[ltx]");
    title = title.replace(/\</g, "[lt]");
    title = title.replace(/\>/g, "[gt]");
    title = title.replace(/\:/g, "[co]");
    title = title.replace(/\"/g, "[2q]");
    title = title.replace(/\//g, "[rs]");
    title = title.replace(/\\/g, "[ls]");
    title = title.replace(/\|/g, "[vb]");
    title = title.replace(/\?/g, "[qm]");
    title = title.replace(/\*/g, "[as]");
    filename +=
      ((profile && profile !== "") || (collection && collection !== "")
        ? "-"
        : "") + title;
  }
  return filename;
};

const dynamicRequire = (moduleName, isDev) => {
  if (isDev) return require(moduleName);
  let modulePath = getModulePath(moduleName, isDev);
  let module = require(modulePath);
  return module;
};
const getModulePath = (moduleName, isDev) => {
  return isDev
    ? moduleName.includes("-static")
      ? path.join("node_modules", moduleName)
      : moduleName
    : path.join(
        process.cwd(),
        "resources\\app.asar.unpacked\\node_modules\\" + moduleName
      );
};

module.exports = {
  isValidUrl,
  getValidUniqueFilename,
  dynamicRequire,
};
