import React, { Component } from "react";
import "./Scanner.css";

class Scanner extends Component {
  getPercentage = (numbers) => {
    return (100 * (numbers[0] + numbers[1])) / numbers[2];
  };

  render() {
    const { status, texts, onChildAction } = this.props;
    return (
      <div id="scanner">
        <header>
          <div className="title">
            {texts.find((text) => text.code === "title").value}
          </div>
          <div className="subtitle">
            {texts.find((text) => text.code === "subtitle").value}
          </div>
        </header>
        <main className="numbers">
          <div className="items">
            {status &&
              Object.keys(status).map((key) => {
                const item = status[key];
                return (
                  <div
                    key={"scanner-" + key}
                    className={`item${
                      item.numbers[2] === 0 ? " disabled" : ""
                    }`}
                  >
                    <div className="name">
                      {texts.find((text) => text.code === key).value}
                    </div>
                    <div className="labels">
                      <div className="label-number">
                        {item.numbers[0] + item.numbers[1]}
                      </div>
                      <div className="label-media">{item.scanning}</div>
                      <div
                        className={`label-total${
                          item.numbers[0] + item.numbers[1] ===
                            item.numbers[2] && item.numbers[2] !== 0
                            ? " finished"
                            : ""
                        }`}
                      >
                        {item.numbers[2]}
                      </div>
                    </div>
                    <div className="progress">
                      <div
                        style={{
                          width: `${this.getPercentage(item.numbers)}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}
          </div>
        </main>
        <footer className="buttons">
          <button
            className="accent rounded"
            onClick={() => {
              onChildAction({
                action: { name: "window-hide" },
              });
            }}
          >
            <span>
              {texts.find((text) => text.code === "go-background").value}
            </span>
          </button>
          <button
            className="danger rounded"
            onClick={() => {
              onChildAction({
                action: { name: "window-close" },
              });
            }}
          >
            <span>{texts.find((text) => text.code === "stop-exit").value}</span>
          </button>
        </footer>
      </div>
    );
  }
}
export default Scanner;
