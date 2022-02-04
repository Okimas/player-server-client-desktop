import React, { Component } from "react";
import axios from "axios";
import Dialog from "../commons/Dialog";
import "./Preferences.css";
import icons from "../../assets/images/icons.svg";
import loading from "../../assets/images/loading.gif";
import { isValidUrl } from "../../utils/utils";

const { constants, ipcRenderer } = window.electron;

const FolderItem = ({ folder, placeholder, onEditFolder, onDeleteFolder }) => {
  return (
    <div className="folder">
      <input
        type="text"
        readOnly={true}
        value={folder}
        placeholder={placeholder}
        onClick={onEditFolder}
      />
      <div className="btns">
        <div className={`btn`} onClick={onEditFolder}>
          <svg
            width="16"
            height="16"
            style={{ marginTop: "2px", marginBottom: "-2px" }}
          >
            <use xlinkHref={`${icons}#edit`} />
          </svg>
        </div>
        <div
          className={`btn`}
          onClick={onDeleteFolder}
          // onClick={() => this.onDeleteFolder(category, index)}
        >
          <svg width="12" height="12">
            <use xlinkHref={`${icons}#delete`} />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default class Settings extends Component {
  state = {
    dialog: null,
    preferences: null,
    testingURL: false,
    validRemote: false,
  };
  original;

  constructor(props) {
    super(props);
    this.state.preferences = JSON.parse(JSON.stringify(props.preferences));
    this.original = JSON.parse(JSON.stringify(props.preferences));
  }

  componentDidMount() {
    this.checkScrollability();
    window.addEventListener("resize", this.checkScrollability);
    ipcRenderer.on(constants.CHANNELS.FOLDER_SELECT, (result) => {
      if (result.folder !== "") {
        const preferences = this.state.preferences;
        preferences.source.local[result.category][result.index] = result.folder;
        this.setState({ ...this.state, preferences });
      }
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const preferences = this.state.preferences;
    if (prevProps.preferences.theme !== prevState.preferences.theme) {
      preferences.theme = prevProps.preferences.theme;
      this.setState({ ...this.state, preferences });
    }
    if (prevProps.preferences.language !== prevState.preferences.language) {
      preferences.language = prevProps.preferences.language;
      this.setState({ ...this.state, preferences });
    }
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.checkScrollability);
  }

  checkScrollability = () => {
    const el = document.querySelector("#settings-scrollbar");
    if (el.scrollHeight > el.clientHeight) el.classList.add("scrollbar");
    else el.classList.remove("scrollbar");
  };

  showDialog = (title, errorMessage) => {
    this.setState({
      ...this.state,
      dialog: {
        title: title,
        message: errorMessage,
        buttons: [
          {
            label: "OK",
            onClick: () => {
              this.setState({ ...this.state, dialog: null });
            },
          },
        ],
        onClose: () => {
          this.setState({ ...this.state, dialog: null });
        },
      },
    });
  };

  onThemeChange = (e) => {
    this.props.onChildAction({
      action: { name: "theme-set", value: e.target.value },
    });
  };

  onLanguageChange = (e) => {
    if (this.state.dialog) this.setState({ ...this.state, dialog: null });
    this.props.onChildAction({
      action: { name: "language-set", value: e.target.value },
    });
  };

  onRemoteTest = () => {
    const texts = this.props.texts;
    let validRemote = this.state.validRemote;
    let remote = this.state.preferences.source.remote;
    if (remote.url.lastIndexOf("/") === remote.url.length - 1)
      remote.url = remote.url.substring(0, remote.url.lastIndexOf("/"));

    if (!isValidUrl(remote.url)) {
      this.showDialog(
        texts.find((text) => text.code === "prefs-atert-url-invalid").value,
        texts.find((text) => text.code === "prefs-atert-url-invalid-message")
          .value
      );
      return;
    }

    this.setState({ ...this.state, testingURL: true });
    axios
      .get(remote.url + "/api/lists")
      .then((response) => {
        if (response.data.error) {
          this.showDialog(
            texts.find((text) => text.code === "prefs-atert-url-error-response")
              .value,
            texts.find(
              (text) => text.code === "prefs-atert-url-error-response-message"
            ).value
          );
        } else {
          validRemote = true;
          this.showDialog(
            texts.find((text) => text.code === "prefs-atert-url-success").value,
            texts.find(
              (text) => text.code === "prefs-atert-url-success-message"
            ).value
          );
        }
      })
      .catch((error) => {
        this.showDialog(
          texts.find((text) => text.code === "prefs-atert-url-error-response")
            .value,
          texts.find(
            (text) => text.code === "prefs-atert-url-error-response-message"
          ).value
        );
      })
      .finally(() =>
        this.setState({ ...this.state, testingURL: false, validRemote })
      );
  };

  onRemoteInput = (e) => {
    const preferences = this.state.preferences;
    preferences.source.remote.url = e.target.value;
    this.setState({
      ...this.state,
      preferences,
      dialog: null,
      validRemote: false,
    });
  };

  onRemoteEnable = () => {
    const preferences = this.state.preferences;
    preferences.source.remote.enabled = !preferences.source.remote.enabled;
    this.setState({ ...this.state, preferences });
  };

  onAddFolder = (category) => {
    const preferences = this.state.preferences;
    preferences.source.local[category].push("");
    this.setState({ ...this.state, preferences });
  };

  onEditFolder = (category, index, folder) => {
    ipcRenderer.send(constants.CHANNELS.FOLDER_SELECT, {
      category: category,
      index: index,
      defaultPath: folder,
    });
  };

  onDeleteFolder = (category, index) => {
    const preferences = this.state.preferences;
    const nFolders = [];
    for (let i = 0; i < preferences.source.local[category].length; i++) {
      if (i !== index) nFolders.push(preferences.source.local[category][i]);
    }
    preferences.source.local[category] = nFolders;
    this.setState({ ...this.state, preferences });
  };

  onSave = () => {
    const { preferences, validRemote, testingURL } = this.state;
    if (testingURL) return;

    const changes = {};

    if (
      this.original.source.remote.url !== preferences.source.remote.url ||
      this.original.source.remote.enabled !== preferences.source.remote.enabled
    ) {
      console.log(preferences.source.remote, validRemote);
      if (preferences.source.remote.enabled && !validRemote) {
        const texts = this.props.texts;
        this.showDialog(
          texts.find((text) => text.code === "prefs-atert-url-invalid").value,
          texts.find((text) => text.code === "prefs-atert-url-invalid-message")
            .value
        );
        return;
      }
      changes.remote = preferences.source.remote;
    }

    // const reset = {
    //   music: document.querySelector("#reset-music").checked,
    //   series: document.querySelector("#reset-series").checked,
    //   movies: document.querySelector("#reset-movies").checked,
    //   books: document.querySelector("#reset-books").checked,
    //   courses: document.querySelector("#reset-courses").checked,
    // };
    const reset = {
      music: false,
      series: false,
      movies: false,
      books: false,
      courses: false,
    };

    // if (this.original.source.remote.url !== preferences.source.remote.url) {
    //   if (!validRemote && preferences.source.remote.url !== "") {
    //     this.showDialog(
    //       texts.find((text) => text.code === "prefs-atert-url-invalid").value,
    //       texts.find((text) => text.code === "prefs-atert-url-invalid-message")
    //         .value
    //     );
    //     return;
    //   }
    //   changes.remote = preferences.source.remote;
    // }

    if (
      JSON.stringify(this.original.source.local) !==
      JSON.stringify(preferences.source.local)
    ) {
      changes.folders = preferences.source.local;
    }

    if (JSON.stringify(reset).includes("true")) {
      changes.reset = reset;
    }

    if ("remote" in changes || "folders" in changes || "reset" in changes)
      this.props.onChildAction({
        action: { name: "prefs-set", value: changes },
      });

    this.props.onChildAction({
      component: { name: "main" },
    });
  };

  onCancel = () => {
    if (this.state.testingURL) return;
    const preferences = this.state.preferences;
    if (this.original.theme !== preferences.theme) {
      this.props.onChildAction({
        action: { name: "theme-set", value: this.original.theme },
      });
    }
    if (this.original.language !== preferences.language) {
      this.props.onChildAction({
        action: { name: "language-set", value: this.original.language },
      });
    }
    setTimeout(() => {
      this.props.onChildAction({
        component: { name: "main" },
      });
    }, 300);
  };

  render() {
    const { texts, categories, languages } = this.props;
    const { preferences, testingURL, validRemote, dialog } = this.state;
    return (
      <div id="settings">
        <div className="ctrls">
          <div className="close" onClick={() => this.onCancel()}>
            <svg width="16" height="16">
              <use xlinkHref={`${icons}#close`} />
            </svg>
          </div>
        </div>
        <header className="top">
          <div className="title">
            {texts.find((text) => text.code === "prefs-title").value}
          </div>
        </header>
        <main className="container">
          <div className="left">
            <div className="wrapper">
              <div className="label">
                {texts.find((text) => text.code === "prefs-theme").value}
              </div>
              <div className="options">
                <label>
                  <input
                    type="radio"
                    name="theme"
                    value={"light"}
                    checked={preferences.theme === "light"}
                    onChange={this.onThemeChange}
                  />
                  {
                    texts.find((text) => text.code === "prefs-theme-light")
                      .value
                  }
                </label>
                <label>
                  <input
                    type="radio"
                    name="theme"
                    value={"dark"}
                    checked={preferences.theme === "dark"}
                    onChange={this.onThemeChange}
                  />
                  {texts.find((text) => text.code === "prefs-theme-dark").value}
                </label>
                <label>
                  <input
                    type="radio"
                    name="theme"
                    value={"system"}
                    checked={preferences.theme === "system"}
                    onChange={this.onThemeChange}
                  />
                  {
                    texts.find((text) => text.code === "prefs-theme-system")
                      .value
                  }
                </label>
              </div>
              <div className="label">
                {texts.find((text) => text.code === "prefs-language").value}
              </div>
              <div className="options">
                {languages.map((language) => {
                  return (
                    <label key={language.code}>
                      <input
                        type="radio"
                        name="language"
                        value={language.code}
                        checked={preferences.language === language.code}
                        onChange={this.onLanguageChange}
                      />
                      {language.name}
                      {/* {
                        texts.find(
                          (text) => text.code === "prefs-language-pt-BR"
                        ).value
                      } */}
                    </label>
                  );
                })}
                {/* <label>
                  <input
                    type="radio"
                    name="language"
                    value={"pt-BR"}
                    checked={preferences.language.startsWith("pt")}
                    onChange={this.onLanguageChange}
                  />
                  {
                    texts.find((text) => text.code === "prefs-language-pt-BR")
                      .value
                  }
                </label>
                <label>
                  <input
                    type="radio"
                    name="language"
                    value={"en"}
                    checked={preferences.language.startsWith("en")}
                    onChange={this.onLanguageChange}
                  />
                  {
                    texts.find((text) => text.code === "prefs-language-en")
                      .value
                  }
                </label> */}
              </div>
              <div className="label">
                {texts.find((text) => text.code === "prefs-remote").value}
              </div>
              <div className="explanation">
                {
                  texts.find((text) => text.code === "prefs-remote-explanation")
                    .value
                }
              </div>
              <div className="options">
                <div className="folder remote">
                  <input
                    type="url"
                    value={preferences.source.remote.url}
                    placeholder={`{${
                      texts.find(
                        (text) => text.code === "prefs-remote-protocol"
                      ).value
                    }}://{ip}:{${
                      texts.find((text) => text.code === "prefs-remote-port")
                        .value
                    }}`}
                    onInput={this.onRemoteInput}
                  />
                  <div className="btns">
                    {testingURL ? (
                      <div className={`btn`}>
                        <img src={loading} alt="testing..." />
                      </div>
                    ) : (
                      <div
                        className={`btn${validRemote ? " positive" : ""}`}
                        onClick={this.onRemoteTest}
                      >
                        <svg
                          width="18"
                          height="18"
                          style={{ marginTop: "2px", marginBottom: "-2px" }}
                        >
                          <use xlinkHref={`${icons}#check`} />
                        </svg>
                      </div>
                    )}
                    <div
                      className={`btn${
                        preferences.source.remote.enabled ? " positive" : ""
                      }`}
                      onClick={this.onRemoteEnable}
                    >
                      <svg
                        width="16"
                        height="16"
                        style={{ marginTop: "1px", marginBottom: "-1px" }}
                      >
                        <use
                          xlinkHref={`${icons}#${
                            preferences.source.remote.enabled
                              ? "checked"
                              : "unchecked"
                          }`}
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              <div className="label">
                {texts.find((text) => text.code === "prefs-serving").value}
              </div>
              <div className="explanation">
                {
                  texts.find(
                    (text) => text.code === "prefs-serving-explanation"
                  ).value
                }
              </div>
              <div className="options">
                <div className="folder remote">
                  <input
                    type="text"
                    placeholder={`{${
                      texts.find((text) => text.code === "prefs-serving-port")
                        .value
                    }}`}
                  />
                </div>
              </div>
              {/* <div className="label">
                {texts.find((text) => text.code === "prefs-reset").value}
              </div>
              <div className="explanation">
                {
                  texts.find((text) => text.code === "prefs-reset-explanation")
                    .value
                }
              </div>
              <div className="options">
                <label>
                  <input type="checkbox" id="reset-music" />
                  {texts.find((text) => text.code === "music").value}
                </label>
                <label>
                  <input type="checkbox" id="reset-series" />
                  {texts.find((text) => text.code === "series").value}
                </label>
                <label>
                  <input type="checkbox" id="reset-movies" />
                  {texts.find((text) => text.code === "movies").value}
                </label>
                <label>
                  <input type="checkbox" id="reset-books" />
                  {texts.find((text) => text.code === "books").value}
                </label>
                <label>
                  <input type="checkbox" id="reset-courses" />
                  {texts.find((text) => text.code === "courses").value}
                </label>
              </div> */}
            </div>
          </div>
          <div className="right">
            <div className="label">
              {texts.find((text) => text.code === "prefs-local").value}
            </div>
            <div className="explanation">
              {
                texts.find((text) => text.code === "prefs-local-explanation")
                  .value
              }
            </div>
            <div id="settings-scrollbar">
              {categories.map((category) => {
                const folders = preferences.source.local[category.code];
                const addDisabled =
                  folders.length === 0 || folders[folders.length - 1] === "";
                return (
                  <div key={category.code} className="folder-wrapper">
                    <div className="folder-label">
                      <div
                        className={`btn${addDisabled ? " disabled" : ""}`}
                        onClick={() => {
                          if (!addDisabled) this.onAddFolder(category.code);
                        }}
                      >
                        <svg width="12" height="12">
                          <use xlinkHref={`${icons}#plus`} />
                        </svg>
                      </div>
                      <div>
                        {
                          texts.find((text) => text.code === category.code)
                            .value
                        }
                      </div>
                    </div>
                    {folders.length === 0 && (
                      <FolderItem
                        key={category.code + "-x"}
                        folder={""}
                        placeholder={""}
                        onEditFolder={() =>
                          this.onEditFolder(category.code, 0, "")
                        }
                      />
                    )}
                    {folders.map((f, idx) => (
                      <FolderItem
                        key={category.code + "-" + idx}
                        folder={f}
                        placeholder={""}
                        onEditFolder={() =>
                          this.onEditFolder(category.code, idx, f)
                        }
                        onDeleteFolder={() =>
                          this.onDeleteFolder(category.code, idx)
                        }
                      />
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </main>
        <footer className={`buttons${testingURL ? " disabled" : ""}`}>
          <button className="accent rounded" onClick={this.onSave}>
            <span>
              {texts.find((text) => text.code === "prefs-btn-save").value}
            </span>
          </button>
          <button
            className="accent rounded"
            // onClick={() =>
            //   onChildAction({
            //     component: { name: "main" },
            //   })
            // }
            onClick={this.onCancel}
            // disabled={testingURL}
          >
            <span>
              {texts.find((text) => text.code === "prefs-btn-cancel").value}
            </span>
          </button>
        </footer>
        {dialog && (
          <Dialog
            theme={preferences.theme}
            title={dialog.title}
            message={dialog.message}
            buttons={dialog.buttons}
            onClose={dialog.onClose}
          />
        )}
      </div>
    );
  }
}
