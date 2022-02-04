import React from "react";
import "./Titlebar.css";
import icons from "../../assets/images/icons.svg";

const Titlebar = ({ windowIsMaximized, onChildAction }) => {
  return (
    <div id="titlebar">
      <div className="logo"></div>
      <div className="appName">Media Learning Center</div>
      <div className="winCtrls">
        <div
          className="ctrl"
          onClick={() => {
            onChildAction({
              action: { name: "window-minimize" },
            });
          }}
        >
          <svg width="16" height="16">
            <use xlinkHref={`${icons}#minimize`} />
          </svg>
        </div>
        <div
          className="ctrl"
          onClick={() =>
            onChildAction({
              action: { name: "window-maximize" },
            })
          }
        >
          <svg width="16" height="16">
            <use
              xlinkHref={`${icons}#${
                windowIsMaximized ? "restore" : "maximize"
              }`}
            />
          </svg>
        </div>
        <div
          className="ctrl"
          onClick={() =>
            onChildAction({
              action: { name: "window-close" },
            })
          }
        >
          <svg width="16" height="16">
            <use xlinkHref={`${icons}#close`} />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Titlebar;
