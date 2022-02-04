import React, { useEffect } from "react";
import "./Statusbar.css";
import icons from "../../assets/images/icons.svg";
import loading from "../../assets/images/loading.gif";
import playing from "../../assets/images/playing.gif";
import { getElementOffset } from "../../utils/utils";

const tagsRender = (category, onChildAction) => {
  return category.tags.map((tag) => (
    <div
      key={tag.label}
      className={`tag${tag.active ? " checked" : ""}`}
      onClick={(e) => {
        tag.active = !tag.active;
        onChildAction({
          action: { name: "category-" + category.code, value: category },
        });
      }}
    >
      <div>{tag.active && <span>✓</span>}</div>
      {tag.label}
    </div>
  ));
};

const Statusbar = ({ category, texts, status, onChildAction }) => {
  useEffect(() => {
    const pos = getElementOffset(document.querySelector("#statusbar"));
    document.querySelector("#main-menu").style.top =
      parseInt(pos.top) +
      document.querySelector("#statusbar").offsetHeight +
      1 +
      "px";
  }, []);

  const onInput = (e) => {
    category.terms = e.target.value;
    onChildAction({
      action: { name: "category-" + category.code, value: category },
    });
  };

  const onClear = () => {
    category.terms = "";
    onChildAction({
      action: { name: "category-" + category.code, value: category },
    });
  };

  const onToggleTags = () => {
    document.querySelector("#tags").classList.toggle("closed");
  };

  const onToggleMenu = () => {
    document.querySelector("#main-menu").classList.toggle("closed");
  };

  return (
    <div id="statusbar">
      <div className="status">
        {status.working && (
          <div className="ctrl">
            <div className="message">{status.working}</div>
            <img src={loading} alt="loading..." />
          </div>
        )}
        {status.playing && (
          <div className="ctrl">
            <img src={playing} alt="playing..." />
          </div>
        )}
        {status.casting && (
          <div className="ctrl">
            <svg
              width="16"
              height="16"
              style={{ marginTop: "2px", marginBottom: "-2px" }}
            >
              <use xlinkHref={`${icons}#casting`} />
            </svg>
          </div>
        )}
        {status.serving && status.serving.enabled && (
          <div className="ctrl">
            <svg width="12" height="12">
              <use xlinkHref={`${icons}#serving`} />
            </svg>
          </div>
        )}
        <div className="filter">
          <input
            type="text"
            value={category.terms}
            onInput={(e) => onInput(e)}
            spellCheck={false}
            placeholder={
              texts.find((text) => text.code === category.code + "-placeholder")
                .value
            }
          />
          <div className="buttons">
            {category.terms === "" ? (
              <button className={`noaction${false ? " positive" : ""}`}>
                <svg width="16" height="16">
                  <use xlinkHref={`${icons}#filter`} />
                </svg>
              </button>
            ) : (
              <button onClick={() => onClear()}>
                <svg width="12" height="12">
                  <use xlinkHref={`${icons}#close`} />
                </svg>
              </button>
            )}
            {category.tags.length > 0 && (
              <button
                id="hashtag"
                onClick={() => onToggleTags()}
                className={`${false ? " positive" : ""}`}
              >
                <svg width="17" height="17">
                  <use xlinkHref={`${icons}#hashtag`} />
                </svg>
              </button>
            )}
          </div>
          <div id="tags" className="closed">
            {tagsRender(category, onChildAction)}
          </div>
        </div>
        <div id="main-menu-btn" className="ctrl" onClick={() => onToggleMenu()}>
          <svg width="12" height="12">
            <use xlinkHref={`${icons}#menu-dots`} />
          </svg>
        </div>
      </div>
      <div id="main-menu" className="closed">
        <div
          className="menu-item"
          onClick={() => onChildAction({ component: { name: "prefs" } })}
        >
          <div>
            {texts.find((text) => text.code === "menu-preferences").value}
          </div>
          <div></div>
        </div>
        <div
          className="menu-item"
          onClick={() =>
            onChildAction({
              action: {
                name: "server-set",
                value: status.serving ? !status.serving.enabled : true,
              },
            })
          }
        >
          <div>
            {texts.find((text) => text.code === "menu-media-server").value}
          </div>
          {status.serving && status.serving.enabled ? (
            <div>{status.serving.url}</div>
          ) : (
            <div></div>
          )}
        </div>
        <div
          className="menu-item"
          onClick={() => onChildAction({ component: { name: "about" } })}
          // onClick={() =>
          //   onChildAction({
          //     action: {
          //       name: "dialog-about",
          //       value: "",
          //     },
          //   })
          // }
        >
          <div>{texts.find((text) => text.code === "menu-about").value}</div>
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default Statusbar;
