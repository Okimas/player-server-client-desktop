import React from "react";
import icons from "../../assets/images/icons.svg";
import "./Dialog.css";

const Dialog = ({ title, message, buttons, onClose, theme }) => {
  const closeDialog = () => {
    document.querySelector("#dialog").classList.add("hidden");
    onClose();
  };
  return (
    <div id="dialog" className={`${theme !== "dark" ? "" : theme}`}>
      <div className="close" onClick={closeDialog}>
        <svg width="16" height="16">
          <use xlinkHref={`${icons}#close`} />
        </svg>
      </div>
      <div className="wrapper">
        <div className="title">{title}</div>
        <div className="message">
          {message.split("\n").map((piece, idx) => (
            <div key={"message-" + idx}>{piece}</div>
          ))}
        </div>
        <div className="dialog-buttons">
          {buttons.map((button, idx) => {
            return (
              <button
                key={idx.toString()}
                onClick={() => {
                  button.onClick();
                }}
              >
                <span>{button.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dialog;
