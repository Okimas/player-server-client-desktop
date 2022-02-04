import React, { Component } from "react";
import icons from "../../../assets/images/icons.svg";
import { durationToTime, getProfileMedias } from "../../../utils/utils";
// import playing from "../../assets/images/playing.gif";

export default class Book extends Component {
  render() {
    const { medias, onChildAction } = this.props;
    return (
      <div className="medias nocollection">
        {medias.map((media, mediaIndex) => {
          let mediaType = "";
          switch (media.mime) {
            case "application/epub+zip":
              mediaType = "epub";
              break;
            case "application/pdf":
              mediaType = "pdf";
              break;
            case "MANGA":
              break;
            default:
              break;
          }
          return (
            <div
              key={media.id}
              className={`media${medias.length === 1 ? " hovered" : ""}`}
              // onClick={() =>
              //   onChildAction({
              //     player: {
              //       data: getProfileMedias({ medias }),
              //       mediaIndex,
              //       playingId: "",
              //     },
              //   })
              // }
              onClick={() => {
                if (media.duration) {
                  onChildAction({
                    player: {
                      medias: getProfileMedias({ medias }),
                      mediaIndex,
                      mediaPlayingId: "",
                    },
                  });
                } else
                  onChildAction({
                    action: {
                      name: "open-file",
                      value: media.url,
                    },
                  });
              }}
            >
              {media.track && medias.length > 1 && (
                <div className="media-track">{media.track}</div>
              )}
              <div className="media-texts">
                <div className="media-title">{media.title}</div>
              </div>
              <div className="media-extra">
                {media.texts && media.texts.length > 0 && (
                  <svg width="18" height="18">
                    <use xlinkHref={`${icons}#subtitles`} />
                  </svg>
                )}
                {media.chords && media.chords.length > 0 && (
                  <svg width="14" height="14">
                    <use xlinkHref={`${icons}#chords`} />
                  </svg>
                )}
                <div className="media-duration">
                  {media.duration
                    ? durationToTime(media.duration)
                    : media.language + " (" + mediaType + ")"}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}
