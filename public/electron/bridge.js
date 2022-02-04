const { ipcRenderer, contextBridge } = require("electron");
const constants = require("./constants");

contextBridge.exposeInMainWorld("electron", {
  constants,
  ipcRenderer: {
    send: (channel, data) => {
      if (constants.isChannelValid(channel)) {
        ipcRenderer.send(channel, data);
      }
    },
    on: (channel, func) => {
      if (constants.isChannelValid(channel)) {
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    },
  },
});
