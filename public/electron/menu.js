const { Menu, nativeTheme, dialog, Notification } = require("electron");
const files = require("./files");

let contextMenu;

const createMenu = (isDev) => {
  return Menu.buildFromTemplate([
    {
      label: "Light Theme",
      click: () => {
        setTrayMenuTheme("light");
      },
      type: "checkbox",
      checked: false,
    },
    {
      label: "Dark Theme",
      click: () => {
        setTrayMenuTheme("dark");
      },
      type: "checkbox",
      checked: false,
    },
    {
      label: "System Theme",
      click: () => {
        setTrayMenuTheme("system");
      },
      type: "checkbox",
      checked: false,
    },
    { type: "separator" },
    {
      label: "Some Option",
      click: () => {
        new Notification({
          title: "Option",
          body: 'Option clicked"',
        }).show();
      },
    },
    {
      label: "Another Option",
      click: () => {
        dialog
          .showMessageBox(null, {
            type: "none",
            title: "Dialog",
            message: 'Another Option clicked"',
            detail: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            buttons: ["OK"],
          })
          .then((result) => {})
          .catch((err) => {});
      },
    },
  ]);
};

const setTrayMenuTheme = (theme) => {
  files.setTheme(theme);
  nativeTheme.themeSource = theme;
  contextMenu.items[0].checked = nativeTheme.themeSource === "light";
  contextMenu.items[1].checked = nativeTheme.themeSource === "dark";
  contextMenu.items[2].checked = nativeTheme.themeSource === "system";
};

module.exports = {
  getMenu: (isDev) => {
    contextMenu = createMenu(isDev);
    return contextMenu;
  },
  setTrayMenuTheme,
};
