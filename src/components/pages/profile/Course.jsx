import React, { Component } from "react";
import icons from "../../../assets/images/icons.svg";
import playing from "../../../assets/images/playing.gif";
import { durationToTime, getProfileMedias } from "../../../utils/utils";

export default class Course extends Component {
  render() {
    const { collections, medias, playingId, onChildAction } = this.props;
    if (collections) {
      return (
        <>
          {collections.map((collection) => (
            <React.Fragment key={collection.title.replace(/ /g, "")}>
              <div className="topic">{collection.title}</div>
              <div className="medias nocollection">
                {collection.medias.map((media, idx2) => {
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
                      className="media"
                      onClick={() => {
                        if (media.duration) {
                          const medias = getProfileMedias({ collections });
                          const index = medias.findIndex(
                            (m) => m.id === media.id
                          );
                          onChildAction({
                            player: {
                              medias,
                              mediaIndex: index,
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
                      <div className="media-track">
                        {playingId === media.id ? "" : media.track}
                      </div>
                      <div className="media-texts">
                        {media.aka !== "" && (
                          <div className="media-aka">{media.aka}</div>
                        )}
                        <div className="media-title">{media.title}</div>
                        {playingId === media.id && (
                          <img
                            className="media-playing"
                            src={playing}
                            alt="playing"
                          />
                        )}
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
                          {collection.type === "files"
                            ? media.url.substring(
                                media.url.lastIndexOf(".") + 1
                              )
                            : media.duration
                            ? durationToTime(media.duration)
                            : media.language + " (" + mediaType + ")"}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </React.Fragment>
          ))}
        </>
      );
    } else {
      return (
        <div className="medias nocollection">
          {medias.map((media, mediaIndex) => {
            return (
              <div
                key={media.id}
                className={`media${medias.length === 1 ? " hovered" : ""}`}
                onClick={() =>
                  onChildAction({
                    player: {
                      medias: getProfileMedias({ medias }),
                      mediaIndex,
                      mediaPlayingId: "",
                    },
                  })
                }
              >
                {medias.length > 1 && (
                  <div className="media-track">
                    {playingId === media.id ? "" : media.track}
                  </div>
                )}
                <div className="media-texts">
                  <div className="media-title">{media.title}</div>
                </div>
                <div className="media-extra">
                  {media.texts.length > 0 && (
                    <svg width="18" height="18">
                      <use xlinkHref={`${icons}#subtitles`} />
                    </svg>
                  )}
                  {media.chords.length > 0 && (
                    <svg width="14" height="14">
                      <use xlinkHref={`${icons}#chords`} />
                    </svg>
                  )}
                  <div className="media-duration">
                    {durationToTime(media.duration)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      );
    }
  }
}
