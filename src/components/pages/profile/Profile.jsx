import React, { Component } from "react";
import "./Profile.css";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import icons from "../../../assets/images/icons.svg";
import Albums from "./Albums";
import Playlist from "./Playlist";
import Seasons from "./Seasons";
import Movie from "./Movie";
import Book from "./Book";
import Author from "./Author";
import Course from "./Course";

export default class Profile extends Component {
  checkScrollability = () => {
    document.querySelectorAll(".scrollbar").forEach((el) => {
      if (el.scrollHeight > el.clientHeight) el.classList.add("scrollbar");
      else el.classList.remove("scrollbar");
    });
  };

  componentDidMount() {
    window.addEventListener("resize", this.checkScrollability);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.checkScrollability);
  }

  render() {
    const {
      category,
      data,
      language,
      texts,
      playingId,
      onChildAction,
      serverURL,
    } = this.props;
    console.log("INFOS", data.infos);
    return (
      <div id="profile">
        <div className="ctrls">
          <div className="edit">
            <svg width="14" height="14">
              <use xlinkHref={`${icons}#edit`} />
            </svg>
          </div>
          <div
            className="close"
            onClick={() => onChildAction({ component: { name: "main" } })}
          >
            <svg width="16" height="16">
              <use xlinkHref={`${icons}#close`} />
            </svg>
          </div>
        </div>
        <header className="top">
          <div className="aka">{data.aka}</div>
          <div className="title">{data.title}</div>
          {category === "books" && data.medias && (
            <div className="subtitle">{data.subtitle}</div>
          )}
        </header>
        <div className="container">
          <div className="left">
            <div className="tags">
              {data.tags.map((tag, idx, arr) => (
                <span key={tag}>
                  {tag}
                  {idx < arr.length - 1 ? ", " : ""}
                </span>
              ))}
            </div>
            <div className="previews">
              {data.previews.length > 0 && (
                <img
                  className={`${data.previews.length < 2 ? "expanded" : ""}`}
                  src={`${
                    data.previews[0].type !== "url"
                      ? serverURL + "/api/image/"
                      : ""
                  }${data.previews[0].image
                    .replace(/\\/g, "%5C")
                    .replace(/\//g, "%5C")
                    .replace("#", "%23")}`}
                  alt={data.previews[0].type}
                  onClick={() => {
                    if (data.previews[0].image !== "") {
                      onChildAction({
                        preview: {
                          items: data.previews,
                          index: 0,
                        },
                      });
                    }
                  }}
                />
              )}
              {data.previews.length > 1 && (
                <div className="previews-items">
                  <Swiper
                    spaceBetween={0}
                    freeMode={false}
                    slidesPerView={"auto"}
                  >
                    {data.previews.map((preview, idx) => (
                      <SwiperSlide
                        style={{ width: "auto", overflow: "hidden" }}
                        key={idx}
                        onClick={() => {
                          if (data.previews[idx].image !== "") {
                            onChildAction({
                              preview: {
                                items: data.previews,
                                index: idx,
                              },
                            });
                          }
                        }}
                      >
                        <div
                          className="preview-item"
                          style={{
                            backgroundImage: `url("${
                              preview.type !== "url"
                                ? serverURL + "/api/image/"
                                : ""
                            }${preview.thumb
                              .replace(/\\/g, "%5C")
                              .replace(/\//g, "%5C")
                              .replace("#", "%23")}")`,
                          }}
                        ></div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              )}
            </div>
          </div>
          <div className="right">
            {data.infos[language.replace("-", "_")] && (
              <div className="infos">
                {data.infos[language.replace("-", "_")].map((pair) => (
                  <div key={pair.key} className="info">
                    <div>{pair.key}</div>
                    <div>{pair.value}</div>
                  </div>
                ))}
              </div>
            )}
            {data.description !== "" && (
              <div
                className={`description scrollbar${
                  data.medias && data.medias.length < 3 ? " greater" : ""
                }`}
              >
                {data.description}
              </div>
            )}
            <div className="collection-type">
              {data.medias && data.medias.length === 1
                ? ""
                : texts.find(
                    (text) =>
                      text.code ===
                      category + (data.collections ? "-collections" : "-items")
                  ).value +
                  " (" +
                  (data.collections
                    ? data.collections.length
                    : data.medias.length) +
                  ")"}
            </div>
            <div className="collection-container scrollbar">
              {category === "music" && data.collections && (
                <Albums
                  collections={data.collections}
                  playingId={playingId}
                  onChildAction={onChildAction}
                  serverURL={serverURL}
                />
              )}
              {category === "music" && data.medias && (
                <Playlist
                  medias={data.medias}
                  playingId={playingId}
                  onChildAction={onChildAction}
                />
              )}
              {category === "series" && (
                <Seasons
                  collections={data.collections}
                  playingId={playingId}
                  onChildAction={onChildAction}
                  serverURL={serverURL}
                />
              )}
              {category === "movies" && (
                <Movie
                  medias={data.medias}
                  playingId={playingId}
                  onChildAction={onChildAction}
                />
              )}
              {category === "books" && data.medias && (
                <Book medias={data.medias} onChildAction={onChildAction} />
              )}
              {category === "books" && data.collections && (
                <Author
                  collections={data.collections}
                  onChildAction={onChildAction}
                  serverURL={serverURL}
                />
              )}
              {category === "courses" && (
                <Course
                  collections={data.collections}
                  medias={data.medias}
                  playingId={playingId}
                  onChildAction={onChildAction}
                />
              )}
            </div>
          </div>
        </div>
        {data.links.length > 0 && (
          <div className="links">
            {data.links.map((link) => (
              <a
                key={link.name}
                href={'"#"'}
                onClick={(e) => {
                  e.preventDefault();
                  onChildAction({
                    action: {
                      name: "open-link",
                      value: link.url,
                    },
                  });
                }}
              >
                {link.name}
              </a>
            ))}
          </div>
        )}
      </div>
    );
  }
}
