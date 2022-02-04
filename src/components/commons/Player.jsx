import React, { Component } from "react";
import "./Player.css";
import playingIcon from "../../assets/images/playing.gif";
import playingBackground from "../../assets/images/background.gif";
import PlayerControl from "./PlayerControl";
import icons from "../../assets/images/icons.svg";
import { setDraggable, unsetDraggable } from "../../utils/utils";

const clickDelay = 300;
export default class Player extends Component {
  state = {
    windowClass: "defaultplayer",
    progress: {
      current: 0,
      duration: 0,
    },
    status: {
      paused: false,
      prev: false,
      next: false,
      textIndex: -1,
    },
  };

  timer;
  clicked = false;
  mediaIndex = -1;
  textIndex = -1;
  isLoading;

  updateStatus = () => {
    const video = document.querySelector("#player-video video");
    if (video) {
      this.setState({
        ...this.state,
        status: {
          paused: video.paused,
          prev: this.mediaIndex > 0,
          next: this.mediaIndex < this.props.data.length - 1,
          textIndex: this.textIndex,
        },
      });
    }
  };

  togglePlay = () => {
    const controls = document.querySelector("#player .player-controls");
    const video = document.querySelector("#player-video video");

    if (video.paused) {
      video.play();
      controls.classList.remove("visible");
    } else {
      video.pause();
      controls.classList.add("visible");
    }
  };

  componentDidMount() {
    const { data, mediaIndex, onChildAction, volume } = this.props;
    this.mediaIndex = mediaIndex;
    const loading = document.querySelector("#player-loading");
    const videoContainer = document.querySelector("#player-video");
    const video = document.querySelector("#player-video video");

    video.volume = parseFloat(volume / 100);
    video.onclick = (e) => {
      if (this.clicked) {
        this.clicked = false;
        clearTimeout(this.timer);
        if (data[this.mediaIndex].mime.startsWith("video/")) {
          video.requestFullscreen();
        }
      } else {
        this.clicked = true;
        this.timer = setTimeout(() => {
          this.clicked = false;
          this.togglePlay();
        }, clickDelay);
      }
    };
    video.onloadedmetadata = () => {
      video.play();
      loading.classList.add("hidden");
      videoContainer.classList.remove("hidden");
      this.updateStatus();
      onChildAction({
        player: {
          medias: data,
          mediaIndex: this.mediaIndex,
          mediaPlayingId: data[this.mediaIndex].id,
        },
      });
    };
    video.onerror = (e) => {
      console.log(e.target.error, "XXX", video.error);
      if (e.target.error || video.error) {
        console.log(e.target.error, "YYY", video.error);
        this.mediaIndex++;
        this.play();
      }
    };
    video.onended = () => {
      this.mediaIndex++;
      this.play();
    };
    const context = this;
    video.onpause = function () {
      context.updateStatus();
    };
    video.onplay = function () {
      context.updateStatus();
    };
    this.play();
  }

  progressInterval;
  setTracks = (video, mediaTexts, index) => {
    this.textIndex = -1;
    const tracks = document.querySelectorAll("#player-video video track");
    for (let i = tracks.length - 1; i >= 0; i--) {
      tracks[i].parentNode.removeChild(tracks[i]);
    }

    if (mediaTexts.length > 0 && index !== -2) {
      for (let i = 0; i < mediaTexts.length; i++) {
        if (mediaTexts[i].language === window.navigator.language) {
          this.textIndex = i;
          break;
        }
      }
      for (let i = 0; i < mediaTexts.length; i++) {
        const text = mediaTexts[i];
        const track = document.createElement("track");
        track.kind = "subtitles";
        track.srclang = text.language;
        track.label = text.label;
        if (index === -1) {
          if (this.textIndex === -1) {
            track.default = i === 0 ? "default" : "";
            track.mode = i === 0 ? "showing" : "hidding";
            if (i === 0) this.textIndex = i;
          } else {
            track.default = i === this.textIndex ? "default" : "";
            track.mode = i === this.textIndex ? "showing" : "hidding";
          }
        } else {
          track.default = i === index ? "default" : "";
          track.mode = i === index ? "showing" : "hidding";
          this.textIndex = index;
        }
        // track.src = text.file;
        track.src =
          this.props.serverURL +
          "/api/file/" +
          text.file
            .replace(/\\/g, "%5C")
            .replace(/\//g, "%5C")
            .replace("#", "%23");
        video.appendChild(track);
      }
      if (index !== -1) this.updateStatus();
    }
    if (index === -2) {
      this.textIndex = -1;
      this.updateStatus();
    }
  };

  play = async () => {
    this.isLoading = true;
    const { data, serverURL } = this.props;
    if (this.mediaIndex < data.length) {
      const loading = document.querySelector("#player-loading");
      const videoContainer = document.querySelector("#player-video");
      const video = document.querySelector("#player-video video");

      video.pause();
      video.currentTime = 0;
      loading.classList.remove("hidden");
      videoContainer.classList.add("hidden");

      const media = data[this.mediaIndex];
      if (media.mime.startsWith("audio/")) {
        video.poster = playingBackground;
        video.classList.add("audio");
      } else {
        video.poster = null;
        video.classList.remove("audio");
      }

      this.setTracks(video, media.texts, -1);
      video.type = media.mime;
      video.src =
        serverURL +
        "/api/media/" +
        media.url
          .replace(/\\/g, "%5C")
          .replace(/\//g, "%5C")
          .replace("#", "%23") +
        "/" +
        media.mime.replace("/", "-");

      clearInterval(this.progressInterval);
      this.progressInterval = setInterval(() => {
        this.setState({
          ...this.state,
          progress: {
            current: video.currentTime,
            duration: video.duration,
          },
        });
      }, 1000);
    } else this.props.onChildAction({ player: null });
    setTimeout(() => {
      this.isLoading = false;
    }, 300);
  };

  componentDidUpdate() {
    const { windowClass } = this.state;
    const dragElem = document.querySelector("#player");
    if (dragElem) {
      if (windowClass === "miniplayer") setDraggable(dragElem);
      else unsetDraggable(dragElem);
    }

    if (!this.isLoading) {
      const { playingId, mediaIndex } = this.props;
      if (playingId === "") {
        this.mediaIndex = mediaIndex;
        this.play();
      }
    }
  }

  componentWillUnmount() {
    clearInterval(this.progressInterval);
    const video = document.querySelector("#player-video video");
    video.pause();
    video.currentTime = 0;
  }

  onWindowControlClick = (className) => {
    if (className === "close") this.props.onChildAction({ player: null });
    else {
      const playerElem = document.querySelector("#player");
      if (className === "defaultplayer") {
        playerElem.style.top = "0px";
        playerElem.style.left = "0px";
      } else {
        playerElem.style.top = "auto";
        playerElem.style.left = "auto";
      }
      this.setState({
        ...this.state,
        windowClass: className,
      });
    }
  };

  onControlsAction = (key, value) => {
    const video = document.querySelector("#player-video video");
    switch (key) {
      case "pause":
        this.togglePlay();
        break;
      case "progress":
        video.currentTime = Math.round((value * video.duration) / 100);
        break;
      case "volume":
        video.volume = parseFloat(value / 100);
        this.props.onChildAction({
          action: { name: "volume-set", value },
        });
        break;
      case "preview":
        if (this.mediaIndex > 0) {
          this.mediaIndex--;
          this.play();
        }
        break;
      case "next":
        if (this.mediaIndex < this.props.data.length - 1) {
          this.mediaIndex++;
          this.play();
        }
        break;
      case "subtitle":
        this.setTracks(video, this.props.data[this.mediaIndex].texts, value);
        break;
      default:
        break;
    }
  };

  render() {
    const { data, volume } = this.props;
    const { windowClass, progress, status } = this.state;
    return (
      <div id="player" className={windowClass}>
        <div id="player-loading" className="hidden">
          <div>CARREGANDO</div>
        </div>
        <div id="player-video" className="hidden">
          <video controls={false} autoPlay={false}>
            <track
              src="#"
              kind="subtitles"
              srcLang="en"
              label={"Language"}
              mode={"showing"}
            />
          </video>
        </div>
        <div className="player-header">
          <div className="player-window">
            {windowClass === "minimized" && (
              <div id="minimized-playing">
                <img src={playingIcon} alt="playing" />
              </div>
            )}
            {/* {windowClass === "miniplayer" && (
              <div id="player-drag" className="ctrl">
                <svg width="16" height="16">
                  <use xlinkHref={`${icons}#music`} />
                </svg>
              </div>
            )} */}
            {windowClass !== "minimized" && (
              <div
                className="ctrl"
                onClick={() => this.onWindowControlClick("minimized")}
              >
                <svg width="16" height="16">
                  <use xlinkHref={`${icons}#minimize`} />
                </svg>
              </div>
            )}
            {windowClass !== "miniplayer" && (
              <div
                className="ctrl"
                onClick={() => this.onWindowControlClick("miniplayer")}
              >
                <svg width="16" height="16">
                  <use xlinkHref={`${icons}#miniplayer`} />
                </svg>
              </div>
            )}
            {windowClass !== "defaultplayer" && (
              <div
                className="ctrl"
                onClick={() => this.onWindowControlClick("defaultplayer")}
              >
                <svg width="16" height="16">
                  <use xlinkHref={`${icons}#defaultplayer`} />
                </svg>
              </div>
            )}
            <div
              className="ctrl"
              onClick={() => this.onWindowControlClick("close")}
            >
              <svg width="16" height="16">
                <use xlinkHref={`${icons}#close`} />
              </svg>
            </div>
          </div>
        </div>
        <div className="player-controls">
          {this.mediaIndex !== -1 && (
            <PlayerControl
              media={data[this.mediaIndex]}
              onControlsAction={this.onControlsAction}
              progress={progress}
              status={status}
              volume={volume}
            />
          )}
        </div>
      </div>
    );
  }
}
