import React, { Component } from "react";
import icons from "../../../assets/images/icons.svg";
import playing from "../../../assets/images/playing.gif";
import { durationToTime, getProfileMedias } from "../../../utils/utils";

export default class Playlist extends Component {
  render() {
    const { medias, playingId, onChildAction } = this.props;
    return (
      <div className="medias nocollection">
        {medias.map((media, mediaIndex) => (
          <div
            key={media.id}
            className="media"
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
            <div className="media-track">
              {playingId === media.id ? "" : media.track}
            </div>
            <div className="media-texts">
              {media.aka !== "" && <div className="media-aka">{media.aka}</div>}
              <div className="media-title">{media.title}</div>
              {playingId === media.id && (
                <img className="media-playing" src={playing} alt="playing" />
              )}
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
        ))}
      </div>
    );
  }
}
