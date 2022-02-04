import React, { Component } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import icons from "../../assets/images/icons.svg";
import "./MoviesList.css";
// import { setAnimationClass } from "../../utils/util";

export default class MoviesList extends Component {
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
      last: listsState.movies.items + 32,
    };

    const itemsRender = [];
    if (list.length === 0 && isFiltering) {
      itemsRender.push(
        <SwiperSlide style={{ width: "auto" }} key={"movies-item0"}>
          <div
            className="movies-item"
            style={{ marginLeft: "32px", marginRight: "32px" }}
          >
            <div className="item-bg"></div>
            <div className="item-title">
              {texts.find((text) => text.code === "lists-movies-none").value}
            </div>
            <div className="item-extra">
              {texts.find((text) => text.code === "lists-none-message").value}
            </div>
          </div>
        </SwiperSlide>
      );
    } else
      itemsRender.push(
        list.map((item, index, arr) => {
          if (index < range.first || index > range.last) return null;
          const numbers = JSON.parse(item.subtitle);
          const subtitle =
            numbers[0] +
            " " +
            texts.find((text) => text.code === "lists-movies-collections")
              .value +
            " " +
            numbers[0] +
            " " +
            texts.find((text) => text.code === "lists-movies-tracks").value;

          const thumb = item.thumb
            .replace(/\\/g, "%5C")
            .replace(/\//g, "%5C")
            .replace("#", "%23");

          return (
            <SwiperSlide
              style={{ width: "auto" }}
              key={"movies-item" + index + item.title}
            >
              <div
                className="movies-item"
                style={{
                  marginLeft: `${index === 0 ? "32px" : ""}`,
                  marginRight: `${index === arr.length - 1 ? "160px" : ""}`,
                }}
              >
                <img
                  style={{ display: "none" }}
                  src={`${serverURL}/api/image/${thumb}`}
                  alt={item.title}
                />
                <div className="button-container item-btns">
                  <button
                    className="link rounded"
                    onClick={() =>
                      onChildAction({
                        action: {
                          name: "load-profile",
                          value: ["movies", item.title],
                        },
                      })
                    }
                  >
                    <span>
                      {
                        texts.find(
                          (text) => text.code === "lists-button-details"
                        ).value
                      }
                    </span>
                  </button>
                  <button
                    className="link rounded"
                    onClick={() =>
                      onChildAction({
                        action: {
                          name: "play-profile",
                          value: ["movies", item.title],
                        },
                      })
                    }
                  >
                    <svg width="14" height="14">
                      <use xlinkHref={`${icons}#playing`} />
                    </svg>
                    <span>
                      {
                        texts.find((text) => text.code === "lists-button-watch")
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
                <div className="item-extra">{subtitle}</div>
              </div>
            </SwiperSlide>
          );
        })
      );

    return (
      <div className={`movies-items noscrollbar`}>
        {list.length > 0 && (
          <div className="list-label">
            {
              texts.find((text) => text.code === "lists-movies-items-label")
                .value
            }{" "}
            ({list.length})
          </div>
        )}
        <Swiper
          initialSlide={listsState.movies.items}
          spaceBetween={12}
          freeMode={true}
          slidesPerView={"auto"}
          grabCursor={true}
          onTouchStart={(e) => this.setAnimationClass("movies", true)}
          onTouchEnd={(e) => this.setAnimationClass("movies", false)}
          onActiveIndexChange={(swiper) => {
            listsState.movies.items = swiper.activeIndex;
            onChildAction({ listsState });
          }}
        >
          {itemsRender}
        </Swiper>
      </div>
    );
  }
}
