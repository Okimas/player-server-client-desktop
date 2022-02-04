import React, { Component } from "react";
import "./App.css";
import Player from "./components/commons/Player";
import Dialog from "./components/commons/Dialog";
import About from "./components/pages/About";
import Preview from "./components/commons/Preview";
import Scanner from "./components/pages/Scanner";
import Preferences from "./components/pages/Preferences";
import Titlebar from "./components/main/Titlebar";
import Menubar from "./components/main/Menubar";
import Statusbar from "./components/main/Statusbar";
import Music from "./components/music/Music";
import Series from "./components/series/Series";
import Movies from "./components/movies/Movies";
import Books from "./components/books/Books";
import Courses from "./components/courses/Courses";
import Profile from "./components/pages/profile/Profile";
import {
  getElementOffset,
  isValidUrl,
  normalizeArrayOfString,
  normalizeString,
} from "./utils/utils";
import Working from "./components/commons/Working";

const { constants, ipcRenderer } = window.electron;

class App extends Component {
  state = {
    windowIsMaximized: false,
    prefs: null,
    config: null,
    localServer: null,
    scanner: null,
    player: null,
    volume: 100,
    lists: null,
    category: "music",
    component: { name: "main" },
    listsState: {
      music: {
        items: 0,
        playlists: 0,
        updates: 0,
      },
      series: {
        items: 0,
        updates: 0,
      },
      movies: {
        items: 0,
        updates: 0,
      },
      books: {
        items: 0,
        authors: 0,
        updates: 0,
      },
      courses: {
        items: 0,
        updates: 0,
      },
    },
  };

  closeMainMenu = (e) => {
    const menuElement = document.querySelector("#main-menu");
    const btnElement = document.querySelector("#main-menu-btn");
    try {
      if (
        !menuElement ||
        !menuElement.classList ||
        (menuElement.classList && menuElement.classList.contains("hidden")) ||
        btnElement.contains(e.target)
      )
        return;

      const fPos = getElementOffset(menuElement);
      const fW = menuElement.offsetWidth;
      const fH = menuElement.offsetHeight;
      const insideFilter =
        e.clientX >= parseInt(fPos.left) &&
        e.clientX <= parseInt(fPos.left) + fW &&
        e.clientY >= parseInt(fPos.top) &&
        e.clientY <= parseInt(fPos.top) + fH;

      if (!insideFilter) menuElement.classList.add("closed");
    } catch (error) {}

    const tagElement = document.querySelector("#tags");
    const tagBtnElement = document.querySelector("#hashtag");
    try {
      if (
        !tagElement ||
        !tagElement.classList ||
        (tagElement.classList && tagElement.classList.contains("hidden")) ||
        tagBtnElement.contains(e.target)
      )
        return;

      const fPos = getElementOffset(tagElement);
      const fW = tagElement.offsetWidth;
      const fH = tagElement.offsetHeight;
      const insideFilter =
        e.clientX >= parseInt(fPos.left) &&
        e.clientX <= parseInt(fPos.left) + fW &&
        e.clientY >= parseInt(fPos.top) &&
        e.clientY <= parseInt(fPos.top) + fH;

      if (!insideFilter) tagElement.classList.add("closed");
    } catch (error) {}
  };

  onKeyDown = (e) => {
    if (e.which === 27) {
      const menuMain = document.querySelector("#main-menu");
      if (menuMain && menuMain.classList) {
        menuMain.classList.add("closed");
      }
      const tags = document.querySelector("#tags");
      if (tags && tags.classList) {
        tags.classList.add("closed");
      }
      if (this.state.dialog) this.setState({ ...this.state, dialog: null });
      // else if (
      //   this.state.component &&
      //   (this.state.component.name === "imageviewer" ||
      //     this.state.component.name === "email")
      // )
      //   this.setState({ ...this.state, component: null });
    }
  };

  componentDidMount() {
    window.addEventListener("keydown", this.onKeyDown, false);
    window.addEventListener("click", this.closeMainMenu, false);

    ipcRenderer.send(constants.CHANNELS.INTERFACE_IS_READY);
    ipcRenderer.on(constants.CHANNELS.DIALOG, (dialog) => {
      this.setState({
        ...this.state,
        dialog: {
          title: dialog.title,
          message: dialog.message,
          buttons: [
            {
              label: dialog.ok,
              onClick: () => this.setState({ ...this.state, dialog: null }),
            },
          ],
          onClose: () => {
            this.setState({ ...this.state, dialog: null });
          },
        },
      });
    });
    ipcRenderer.on(constants.CHANNELS.WINDOW_IS_MAXIMIZED, (isMaximized) => {
      this.setState({ ...this.state, windowIsMaximized: isMaximized });
    });
    ipcRenderer.on(constants.CHANNELS.INIT, (data) => {
      let noFolders = false;
      // let noFolders = true;
      // const categories = data.config.categories;
      // for (let i = 0; i < categories.length; i++) {
      //   const category = categories[i];
      //   if (data.prefs.source.local[category.code].length > 0) {
      //     noFolders = false;
      //     break;
      //   }
      // }

      const newState = {
        ...this.state,
        prefs: data.prefs,
        config: data.config,
        localServer: data.localServer
          ? data.localServer
          : {
              protocol: "http",
              ip: "0.0.0.0",
              port: 7777,
              url: "",
              enabled: false,
            },
      };
      if (noFolders) {
        const text = data.config.texts.system[
          data.prefs.language.replace("-", "_")
        ].find((t) => t.code === "no-folders");
        newState.dialog = {
          title: text.title,
          message: text.message,
          buttons: [
            {
              label: text.buttons[0],
              onClick: () => this.setState({ ...this.state, dialog: null }),
            },
            {
              label: text.buttons[1],
              onClick: () =>
                this.setState({
                  ...this.state,
                  dialog: null,
                  component: { name: "prefs" },
                }),
            },
          ],
          onClose: () => {
            this.setState({ ...this.state, dialog: null });
          },
        };
      }
      this.setState(newState);
    });
    ipcRenderer.on(constants.CHANNELS.ERROR, (dialog) => {
      this.setState({
        ...this.state,
        dialog: {
          title: dialog.title,
          message: dialog.message,
          buttons: [
            {
              label: dialog.ok,
              onClick: () => this.setState({ ...this.state, dialog: null }),
            },
          ],
          onClose: () => {
            this.setState({ ...this.state, dialog: null });
          },
        },
      });
    });
    ipcRenderer.on(constants.CHANNELS.SCANNER_UPDATE, (status) => {
      this.setState({ ...this.state, scanner: status });
    });
    ipcRenderer.on(constants.CHANNELS.DATA, (result) => {
      const lists = result;
      const categories = this.state.config.categories;
      for (let i = 0; i < categories.length; i++) {
        const category = categories[i];
        category.terms = "";
        const tags = [];
        for (let j = 0; j < lists[category.code].tags.length; j++) {
          const tag = lists[category.code].tags[j];
          const foundedIdx = tags.findIndex((tg) => tg.label === tag);
          if (foundedIdx === -1) {
            tags.push({
              label: tag,
              active: false,
            });
          }
        }
        category.tags = tags;
      }
      this.setState({
        ...this.state,
        scanner: null,
        lists,
        categories,
      });
    });
    ipcRenderer.on(constants.CHANNELS.THEME_SET, (result) => {
      const prefs = this.state.prefs;
      prefs.theme = result;
      this.setState({ ...this.state, prefs });
    });
    ipcRenderer.on(constants.CHANNELS.LANGUAGE_SET, (result) => {
      const prefs = this.state.prefs;
      prefs.language = result;
      this.setState({ ...this.state, prefs });
    });
    ipcRenderer.on(constants.CHANNELS.PREFS_SET, (prefs) => {
      this.setState({
        ...this.state,
        prefs,
        lists: null,
        scanner: {
          music: {
            scanning: "",
            numbers: [0, 0, 0],
          },
          series: {
            scanning: "",
            numbers: [0, 0, 0],
          },
          movies: {
            scanning: "",
            numbers: [0, 0, 0],
          },
          books: {
            scanning: "",
            numbers: [0, 0, 0],
          },
          courses: {
            scanning: "",
            numbers: [0, 0, 0],
          },
        },
      });
    });
    ipcRenderer.on(constants.CHANNELS.SERVER_SET, (server) => {
      this.setState({ ...this.state, localServer: server });
    });
    ipcRenderer.on(constants.CHANNELS.LOAD_PROFILE, (profile) => {
      this.setState({ ...this.state, component: { name: "profile", profile } });
    });
    ipcRenderer.on(constants.CHANNELS.PLAY_PROFILE, (medias) => {
      this.setState({
        ...this.state,
        player: { medias: medias, mediaIndex: 0, mediaPlayingId: "" },
      });
    });
  }

  onChildAction = (object) => {
    const keys = Object.keys(object);
    if (keys[0] === "action") {
      switch (object[keys[0]].name) {
        case "window-hide":
          ipcRenderer.send(constants.CHANNELS.WINDOW_HIDE);
          break;
        case "window-minimize":
          ipcRenderer.send(constants.CHANNELS.WINDOW_MINIMIZE);
          break;
        case "window-maximize":
          ipcRenderer.send(constants.CHANNELS.WINDOW_MAXIMIZE);
          break;
        case "window-close":
          ipcRenderer.send(constants.CHANNELS.WINDOW_CLOSE);
          break;
        case "theme-set":
          ipcRenderer.send(constants.CHANNELS.THEME_SET, object[keys[0]].value);
          break;
        case "language-set":
          ipcRenderer.send(
            constants.CHANNELS.LANGUAGE_SET,
            object[keys[0]].value
          );
          break;
        case "prefs-set":
          ipcRenderer.send(constants.CHANNELS.PREFS_SET, object[keys[0]].value);
          break;
        case "server-set":
          ipcRenderer.send(
            constants.CHANNELS.SERVER_SET,
            object[keys[0]].value
          );
          break;
        case "load-profile":
          ipcRenderer.send(
            constants.CHANNELS.LOAD_PROFILE,
            object[keys[0]].value
          );
          break;
        case "play-profile":
          ipcRenderer.send(
            constants.CHANNELS.PLAY_PROFILE,
            object[keys[0]].value
          );
          break;
        case "open-file":
          ipcRenderer.send(constants.CHANNELS.OPEN_FILE, object[keys[0]].value);
          break;
        case "volume-set":
          this.setState({ ...this.state, volume: object[keys[0]].value });
          break;
        case "open-link":
          ipcRenderer.send(constants.CHANNELS.OPEN_LINK, object[keys[0]].value);
          break;
        default:
          const action = object[keys[0]].name;
          if (action.startsWith("category-")) {
            const categories = this.state.categories;
            categories[action.split("-")[1]] = object[keys[0]].value;
            this.setState({ ...this.state, categories });
          }
          break;
      }
    } else {
      const state = this.state;
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        state[key] = object[key];
      }
      this.setState(state);
    }
  };

  getActiveCategory = (categories) => {
    const keys = Object.keys(categories);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const category = categories[key];
      if (category.code === this.state.category) return category;
    }
    return null;
  };

  getFilteredList = () => {
    const { category, lists, categories } = this.state;
    if (!lists) return null;

    const categoryObject = categories.find((c) => c.code === category);
    const terms = normalizeString(categoryObject.terms.toLowerCase());
    const tags1 = categoryObject.tags
      .filter((tag) => tag.active && !tag.label.startsWith("#"))
      .map((tag) => tag.label);
    const tags2 = categoryObject.tags
      .filter((tag) => tag.active && tag.label.startsWith("#"))
      .map((tag) => tag.label);
    const isFiltering =
      categoryObject.terms !== "" || tags1.length > 0 || tags2.length > 0;
    const filtered = { totals: [] };
    const listTypes = ["items", "updates", "playlists", "authors"];
    for (let i = 0; i < listTypes.length; i++) {
      const listProp = listTypes[i];
      if (lists[category][listProp]) {
        filtered.totals.push(lists[category][listProp].length);
        filtered[listProp] = lists[category][listProp].filter((item) => {
          const hasTerms =
            terms === "" ||
            normalizeString(item.title.toLowerCase()).includes(terms) ||
            normalizeString(item.subtitle.toLowerCase()).includes(terms);

          let hasTags1 = tags1.length === 0;
          for (let j = 0; j < tags1.length; j++) {
            const tag = normalizeString(tags1[j].toLowerCase());
            const itemTags = normalizeArrayOfString(item.tags);
            if (itemTags.length > 0 && itemTags.includes(tag)) {
              hasTags1 = true;
              break;
            }
          }
          let hasTags2 = tags2.length === 0;
          for (let j = 0; j < tags2.length; j++) {
            const tag = normalizeString(tags2[j].toLowerCase());
            const itemTags = normalizeArrayOfString(item.tags);
            if (itemTags.length > 0 && itemTags.includes(tag)) {
              hasTags2 = true;
              break;
            }
          }

          return hasTerms && hasTags1 && hasTags2;
        });
      }
    }

    return { isFiltering, filtered };
  };

  render() {
    const {
      windowIsMaximized,
      category,
      categories,
      prefs,
      config,
      localServer,
      component,
      listsState,
      scanner,
      player,
      volume,
      dialog,
      preview,
    } = this.state;
    const lists = this.getFilteredList();
    return (
      <>
        {lists && (
          <div id="app">
            {component.name === "main" && (
              <>
                <header>
                  <Titlebar
                    windowIsMaximized={windowIsMaximized}
                    onChildAction={this.onChildAction}
                  />
                  <Menubar
                    active={category}
                    categories={categories}
                    texts={
                      config.texts.global[prefs.language.replace("-", "_")]
                    }
                    onChildAction={this.onChildAction}
                  />
                  <Statusbar
                    category={this.getActiveCategory(categories)}
                    status={{
                      working: false,
                      playing: player ? true : false,
                      casting: false,
                      serving: localServer,
                    }}
                    texts={[
                      ...config.texts.global[prefs.language.replace("-", "_")],
                      ...config.texts.main[prefs.language.replace("-", "_")],
                    ]}
                    onChildAction={this.onChildAction}
                  />
                </header>
                <main>
                  {category === "music" && (
                    <Music
                      texts={
                        config.texts.lists[prefs.language.replace("-", "_")]
                      }
                      lists={lists.filtered}
                      serverURL={
                        prefs.source.remote.enabled &&
                        isValidUrl(prefs.source.remote.url)
                          ? prefs.source.remote.url
                          : localServer.url
                      }
                      isFiltering={lists.isFiltering}
                      listsState={listsState}
                      onChildAction={this.onChildAction}
                    />
                  )}
                  {category === "series" && (
                    <Series
                      texts={
                        config.texts.lists[prefs.language.replace("-", "_")]
                      }
                      lists={lists.filtered}
                      serverURL={
                        prefs.source.remote.enabled &&
                        isValidUrl(prefs.source.remote.url)
                          ? prefs.source.remote.url
                          : localServer.url
                      }
                      isFiltering={lists.isFiltering}
                      listsState={listsState}
                      onChildAction={this.onChildAction}
                    />
                  )}
                  {category === "movies" && (
                    <Movies
                      texts={
                        config.texts.lists[prefs.language.replace("-", "_")]
                      }
                      lists={lists.filtered}
                      serverURL={
                        prefs.source.remote.enabled &&
                        isValidUrl(prefs.source.remote.url)
                          ? prefs.source.remote.url
                          : localServer.url
                      }
                      isFiltering={lists.isFiltering}
                      listsState={listsState}
                      onChildAction={this.onChildAction}
                    />
                  )}
                  {category === "books" && (
                    <Books
                      texts={
                        config.texts.lists[prefs.language.replace("-", "_")]
                      }
                      lists={lists.filtered}
                      serverURL={
                        prefs.source.remote.enabled &&
                        isValidUrl(prefs.source.remote.url)
                          ? prefs.source.remote.url
                          : localServer.url
                      }
                      isFiltering={lists.isFiltering}
                      listsState={listsState}
                      onChildAction={this.onChildAction}
                    />
                  )}
                  {category === "courses" && (
                    <Courses
                      texts={
                        config.texts.lists[prefs.language.replace("-", "_")]
                      }
                      lists={lists.filtered}
                      serverURL={
                        prefs.source.remote.enabled &&
                        isValidUrl(prefs.source.remote.url)
                          ? prefs.source.remote.url
                          : localServer.url
                      }
                      isFiltering={lists.isFiltering}
                      listsState={listsState}
                      onChildAction={this.onChildAction}
                    />
                  )}
                </main>
              </>
            )}
            {component.name === "prefs" && (
              <Preferences
                languages={config.languages}
                categories={categories}
                preferences={prefs}
                texts={[
                  ...config.texts.global[prefs.language.replace("-", "_")],
                  ...config.texts.preferences[prefs.language.replace("-", "_")],
                ]}
                onChildAction={this.onChildAction}
              />
            )}
            {component.name === "profile" && (
              <Profile
                language={prefs.language}
                texts={config.texts.global[prefs.language.replace("-", "_")]}
                category={category}
                data={component.profile}
                serverURL={
                  prefs.source.remote.enabled &&
                  isValidUrl(prefs.source.remote.url)
                    ? prefs.source.remote.url
                    : localServer.url
                }
                onChildAction={this.onChildAction}
                playingId={player ? player.mediaPlayingId : ""}
              />
            )}
            {component.name === "about" && (
              <About
                texts={config.texts.about[prefs.language.replace("-", "_")]}
                onChildAction={this.onChildAction}
              />
            )}
            {component.name === "playlist" && (
              <h1
                onClick={() =>
                  this.setState({
                    ...this.state,
                    dialog: null,
                    component: { name: "main" },
                  })
                }
              >
                NEW PLAYLIST
              </h1>
            )}
          </div>
        )}
        {!lists && scanner && (
          <Scanner
            status={scanner}
            categories={categories}
            texts={[
              ...config.texts.global[prefs.language.replace("-", "_")],
              ...config.texts.scanner[prefs.language.replace("-", "_")],
            ]}
            onChildAction={this.onChildAction}
          />
        )}
        {!lists && !scanner && (
          <Working
            message={
              config
                ? config.texts.global[prefs.language.replace("-", "_")].find(
                    (text) => text.code === "loading"
                  ).value
                : "loading"
            }
          />
        )}
        {dialog && (
          <Dialog
            theme={prefs.theme}
            title={dialog.title}
            message={dialog.message}
            buttons={dialog.buttons}
            onClose={dialog.onClose}
          />
        )}
        {preview && (
          <Preview
            items={preview.items}
            index={preview.index}
            onChildAction={this.onChildAction}
            serverURL={
              prefs.source.remote.enabled && isValidUrl(prefs.source.remote.url)
                ? prefs.source.remote.url
                : localServer.url
            }
          />
        )}
        {player && (
          <Player
            data={player.medias}
            mediaIndex={player.mediaIndex}
            playingId={player.mediaPlayingId}
            onChildAction={this.onChildAction}
            serverURL={
              prefs.source.remote.enabled && isValidUrl(prefs.source.remote.url)
                ? prefs.source.remote.url
                : localServer.url
            }
            volume={volume}
          />
        )}
      </>
    );
  }
}

export default App;
