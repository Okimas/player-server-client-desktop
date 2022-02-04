import React, { Component } from "react";
import icons from "../../../assets/images/icons.svg";
import { durationToTime, getProfileMedias } from "../../../utils/utils";

export default class Author extends Component {
  render() {
    const { collections, onChildAction, serverURL } = this.props;
    return (
      <>
        {collections.map((collection) => (
          <React.Fragment key={collection.title.replace(/ /g, "")}>
            <div className="collection author">
              <div>
                <div className="collection-date">
                  {collection.firstdate === "" ? "---" : collection.firstdate}
                </div>
                <div className="collection-type">
                  {collection.date === "" ? "---" : collection.date}
                </div>
              </div>
              <div
                className="collection-image book"
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
                {/* <div className="collection-languages">
                  {collection.languages}
                </div> */}
                <div className="collection-aka">{collection.aka}</div>
                <div className="collection-title">{collection.title}</div>
                <div className="collection-description">
                  {collection.description}
                </div>
              </div>
            </div>
            <div className="medias author">
              {collection.medias.map((media) => {
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
                    // onClick={(e) => {
                    //   const medias = getProfileMedias({ collections });
                    //   const index = medias.findIndex((m) => m.id === media.id);
                    //   onChildAction({
                    //     player: {
                    //       data: medias,
                    //       mediaIndex: index,
                    //       playingId: "",
                    //     },
                    //   });
                    // }}
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
                    {media.track && collection.medias.length > 1 && (
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
          </React.Fragment>
        ))}
      </>
    );
  }
}
