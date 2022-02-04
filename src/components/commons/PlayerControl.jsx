import React, { useEffect } from "react";
import "./PlayerControl.css";
import icons from "../../assets/images/icons.svg";
import { durationToTime, getElementOffset } from "../../utils/utils";

const PlayerControl = ({
  media,
  progress,
  status,
  volume,
  onControlsAction,
}) => {
  useEffect(() => {
    const container = document.querySelector("#player-control .container");
    document.querySelector("#player-control .subtitles").style.bottom =
      container.offsetHeight + 2 + "px";
  }, []);

  const onProgressClick = (e) => {
    document.querySelector("#player-control .volume").classList.add("closed");
    document
      .querySelector("#player-control .subtitles")
      .classList.add("closed");
    const progressbar = document.querySelector("#player-control .progress");
    const pos = getElementOffset(progressbar);
    onControlsAction(
      "progress",
      (100 * (e.clientX - pos.left)) / progressbar.clientWidth
    );
  };

  const onVolumeChange = (e) => {
    onControlsAction("volume", parseInt(e.target.value));
  };

  const onToggleSubs = () => {
    document.querySelector("#player-control .volume").classList.add("closed");
    document
      .querySelector("#player-control .subtitles")
      .classList.toggle("closed");
  };

  const onToggleVolume = (e) => {
    document
      .querySelector("#player-control .subtitles")
      .classList.add("closed");
    document
      .querySelector("#player-control .volume")
      .classList.toggle("closed");
    // const playerContainer = document.querySelector("#player-control");
    // const volumeContainer = document.querySelector("#player-control .volume");
    // const pos1 = getElementOffset(document.querySelector("#player-control"));
    // const pos2 = getElementOffset(document.querySelector("#volume-btn"));
    // volumeContainer.style.left = pos2.left - pos1.left + 2 + "px";
  };

  let timeout1;
  const onVolumeMouseOut = () => {
    clearTimeout(timeout1);
    timeout1 = setTimeout(() => {
      if (document.querySelector("#player-control .volume")) {
        document
          .querySelector("#player-control .volume")
          .classList.add("closed");
      }
    }, 3000);
  };
  let timeout2;
  const onSubtitlesMouseOut = () => {
    clearTimeout(timeout2);
    timeout2 = setTimeout(() => {
      if (document.querySelector("#player-control .subtitles")) {
        document
          .querySelector("#player-control .subtitles")
          .classList.add("closed");
      }
    }, 3000);
  };

  return (
    <div id="player-control">
      <div
        className={`prev${status.prev ? "" : " disabled"}`}
        onClick={() => onControlsAction("preview", "")}
      >
        <svg width="24" height="24">
          <use xlinkHref={`${icons}#skip-prev`} />
        </svg>
      </div>
      <div className="active">
        <div className="volume closed">
          <input
            id="volume-range"
            type="range"
            step={1}
            value={volume}
            min={0}
            max={100}
            onChange={(e) => onVolumeChange(e)}
            onMouseOut={onVolumeMouseOut}
          />
        </div>
        <div className="subtitles closed" onMouseOut={onSubtitlesMouseOut}>
          <div className="subtitles-label">Legendas</div>
          <div className="scroller">
            {media.texts.map((text, idx) => {
              return (
                <div
                  key={idx}
                  className={`subtitle${
                    idx === status.textIndex ? " checked" : ""
                  }`}
                  onClick={() => {
                    onToggleSubs();
                    onControlsAction(
                      "subtitle",
                      idx === status.textIndex ? -2 : idx
                    );
                  }}
                >
                  {text.label}
                </div>
              );
            })}
          </div>
        </div>
        {media.category !== "movies" && (
          <div className="profile">{media.profile}</div>
        )}
        <div className="container">
          <div className="ctrls">
            <div id="volume-btn" className="ctrl" onClick={onToggleVolume}>
              <svg width="16" height="16">
                <use xlinkHref={`${icons}#volume`} />
              </svg>
            </div>
            <div
              className="ctrl"
              onClick={() => {
                document
                  .querySelector("#player-control .subtitles")
                  .classList.add("closed");
                document
                  .querySelector("#player-control .volume")
                  .classList.add("closed");
                onControlsAction("pause", "");
              }}
            >
              <svg width="16" height="16">
                <use
                  xlinkHref={`${icons}#${status.paused ? "playing" : "pause"}`}
                />
              </svg>
            </div>
            {media.texts.length > 0 && (
              <div className="ctrl" onClick={onToggleSubs}>
                <svg width="16" height="16">
                  <use xlinkHref={`${icons}#subtitles`} />
                </svg>
              </div>
            )}
          </div>
          <div className="collection">
            {media.category === "movies" ? "" : media.collection}
          </div>
          <div className="title">{media.title}</div>
          <div className="progress" onClick={(e) => onProgressClick(e)}>
            <div
              className="progressbar"
              style={{
                width:
                  Math.round((progress.current / progress.duration) * 100) +
                  "%",
              }}
            ></div>
          </div>
          <div className="times">
            <div>{durationToTime(progress.current)}</div>
            <div>{durationToTime(progress.duration)}</div>
          </div>
        </div>
      </div>
      <div
        className={`next${status.next ? "" : " disabled"}`}
        onClick={() => onControlsAction("next", "")}
      >
        <svg width="24" height="24">
          <use xlinkHref={`${icons}#skip-next`} />
        </svg>
      </div>
    </div>
  );
};

export default PlayerControl;
