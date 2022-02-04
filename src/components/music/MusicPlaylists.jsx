import React, { Component } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import icons from "../../assets/images/icons.svg";
import "./MusicPlaylists.css";
// import { setAnimationClass } from "../../utils/util";

export default class ListPlaylists extends Component {
  setAnimationClass = (prefix, stop) => {
    document.querySelectorAll("." + prefix + "-item").forEach((node) => {
      if (stop) node.classList.add("noanimation");
      else node.classList.remove("noanimation");
    });
  };

  render() {
    const { list, texts, onChildAction, isFiltering, serverURL, listsState } =
      this.props;
    const range = {
      first: 0,
      last: listsState.music.playlists + 32,
    };

    const itemsRender = [
      <SwiperSlide style={{ width: "auto" }} key={"playlist-1"}>
        <div className="playlist-item add" style={{ marginLeft: "64px" }}>
          <div className="button-container item-btns">
            <button
              className="gray rounded"
              onClick={() =>
                onChildAction({
                  component: { name: "playlist", value: null },
                })
              }
            >
              <svg width="12" height="12">
                <use xlinkHref={`${icons}#plus`} />
              </svg>
              <span>
                {
                  texts.find(
                    (text) => text.code === "lists-playlist-create-btn"
                  ).value
                }
              </span>
            </button>
          </div>
          <div className="item-bg">
            <svg width="24" height="24">
              <use xlinkHref={`${icons}#plus`} />
            </svg>
          </div>
          <div className="item-title">
            {texts.find((text) => text.code === "lists-playlist-new").value}
          </div>
          <div className="item-extra">
            {texts.find((text) => text.code === "lists-playlist-create").value}
          </div>
        </div>
      </SwiperSlide>,
    ];
    if (list.length === 0 && isFiltering) {
      itemsRender.push(
        <SwiperSlide style={{ width: "auto" }} key={"playlist-0"}>
          <div className="playlist-item" style={{ marginRight: "32px" }}>
            <div className="item-bg"></div>
            <div className="item-title">
              {texts.find((text) => text.code === "lists-playlists-none").value}
            </div>
            <div className="item-extra">
              {texts.find((text) => text.code === "lists-none-message").value}
            </div>
          </div>
        </SwiperSlide>
      );
    } else
      list.map((item, index, arr) => {
        if (index < range.first || index > range.last) return null;
        const thumb = item.thumb
          .replace(/\\/g, "%5C")
          .replace(/\//g, "%5C")
          .replace("#", "%23");
        return (
          <SwiperSlide
            style={{ width: "auto" }}
            key={"playlist" + index + item.title}
          >
            <div
              className="playlist-item"
              style={{
                marginRight: `${
                  index === list.length - 1 ? 96 + 32 + "px" : ""
                }`,
              }}
            >
              <img
                style={{ display: "none" }}
                src={`${serverURL}/api/image/${thumb}`}
                alt={item.title}
                onError={this.waitImageReady}
              />
              <div className="button-container item-btns">
                <button
                  className="link rounded"
                  onClick={() =>
                    onChildAction({
                      action: {
                        name: "load-profile",
                        value: ["playlist", item.title],
                      },
                    })
                  }
                >
                  <span>
                    {
                      texts.find((text) => text.code === "lists-button-details")
                        .value
                    }
                  </span>
                </button>
                <button
                  className="link rounded"
                  onClick={() =>
                    onChildAction({
                      action: {
                        name: "play-profile",
                        value: ["playlist", item.title],
                      },
                    })
                  }
                >
                  <svg width="14" height="14">
                    <use xlinkHref={`${icons}#playing`} />
                  </svg>
                  <span>
                    {
                      texts.find((text) => text.code === "lists-button-listen")
                        .value
                    }
                  </span>
                </button>
              </div>
              <div
                className="item-bg"
                style={{
                  backgroundImage: `url("${serverURL}/api/image/${thumb}")`,
                }}
              ></div>
              <div className="item-title">{item.title}</div>
              <div className="item-extra">{item.subtitle}</div>
            </div>
          </SwiperSlide>
        );
      });

    return (
      <div className="playlist-items">
        <div className="list-label">
          {
            texts.find((text) => text.code === "lists-music-playlists-label")
              .value
          }{" "}
          ({list.length})
        </div>
        <Swiper
          initialSlide={listsState.music.playlists}
          spaceBetween={10}
          freeMode={true}
          slidesPerView={"auto"}
          grabCursor={true}
          onTouchStart={(e) => this.setAnimationClass("playlist", true)}
          onTouchEnd={(e) => this.setAnimationClass("playlist", false)}
          onActiveIndexChange={(swiper) => {
            listsState.music.playlists = swiper.activeIndex;
            onChildAction({ listsState });
          }}
        >
          {itemsRender}
        </Swiper>
      </div>
    );
  }
}
