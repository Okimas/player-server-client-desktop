import React, { Component } from "react";
import icons from "../../../assets/images/icons.svg";
import playing from "../../../assets/images/playing.gif";
import { durationToTime, getProfileMedias } from "../../../utils/utils";

export default class Seasons extends Component {
  render() {
    const { collections, playingId, onChildAction, serverURL } = this.props;
    return (
      <>
        {collections.map((collection) => (
          <React.Fragment key={collection.title.replace(/ /g, "")}>
            <div className="collection">
              <div>
                <div className="collection-date">{collection.date}</div>
                <div className="collection-type">{collection.type}</div>
              </div>
              <div
                className="collection-image season"
                style={{
                  backgroundImage: `url("${serverURL}/api/image/${collection.thumb
                    .replace(/\\/g, "%5C")
                    .replace(/\//g, "%5C")
                    .replace("#", "%23")}")`,
                }}
                onClick={() => {
                  if (collection.image !== "") {
                    onChildAction({
                      preview: {
                        items: [
                          {
                            type: "image",
                            image: collection.image,
                            thumb: collection.thumb,
                          },
                        ],
                        index: 0,
                      },
                    });
                  }
                }}
              ></div>
              <div className="collection-texts">
                <div className="collection-aka">{collection.aka}</div>
                <div className="collection-title">{collection.title}</div>
              </div>
            </div>
            <div className="medias">
              {collection.medias.map((media, idx2) => {
                return (
                  <div
                    key={idx2 + media.id}
                    className="media"
                    onClick={(e) => {
                      const medias = getProfileMedias({ collections });
                      const index = medias.findIndex((m) => m.id === media.id);
                      onChildAction({
                        player: {
                          medias,
                          mediaIndex: index,
                          mediaPlayingId: "",
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
          </React.Fragment>
        ))}
      </>
    );
  }
}
