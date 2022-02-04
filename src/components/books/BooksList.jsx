import React, { Component } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Mousewheel } from "swiper";
import icons from "../../assets/images/icons.svg";
import "./BooksList.css";
// import { setAnimationClass } from "../../utils/util";
// const { constants } = window.electron;

export default class BooksList extends Component {
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
      last: listsState.books.items + 32,
    };
    const itemsRender = [];
    if (list.length === 0 && isFiltering) {
      itemsRender.push(
        <SwiperSlide style={{ width: "auto" }} key={"sr-item0"}>
          <div
            className="books-item"
            style={{ marginLeft: "32px", marginRight: "32px" }}
          >
            <div
              className="item-bg"
              // style={{ backgroundColor: theme === "dark" ? "#222" : "#AAA" }}
            ></div>
            <div className="item-title">
              {texts.find((text) => text.code === "lists-books-none").value}
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
          const thumb = item.thumb
            .replace(/\\/g, "%5C")
            .replace(/\//g, "%5C")
            .replace("#", "%23");
          return (
            <SwiperSlide
              style={{ width: "auto" }}
              key={"books-item" + index + item.title}
            >
              <div
                className="books-item"
                style={{
                  marginLeft: `${index === 0 ? "32px" : ""}`,
                  marginRight: `${index === arr.length - 1 ? "160px" : ""}`,
                }}
              >
                <img
                  loading="lazy"
                  className="swiper-lazy"
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
                          value: ["books", item.subtitle, item.title],
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
                  {item.file && (
                    <button
                      className="link rounded"
                      onClick={() =>
                        onChildAction({
                          action: {
                            name: "open-file",
                            value: item.file,
                          },
                        })
                      }
                    >
                      <svg width="14" height="14">
                        <use xlinkHref={`${icons}#playing`} />
                      </svg>
                      <span>
                        {
                          texts.find(
                            (text) => text.code === "lists-button-read"
                          ).value
                        }
                      </span>
                    </button>
                  )}
                  {/* <button
                    className="link rounded"
                    onClick={() =>
                      onChildAction({
                        action: {
                          name: "play-profile-medias",
                          profileId:
                            "books." +
                            item.subtitle +
                            "[#!/][#!/]" +
                            item.title,
                          mediaIndex: 0,
                          mediaId: "",
                        },
                      })
                    }
                  >
                    <svg width="14" height="14">
                      <use xlinkHref={`${icons}#playing`} />
                    </svg>
                    <span>Ler</span>
                  </button> */}
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
        })
      );

    return (
      <div id="lists" className={`books-items noscrollbar`}>
        {list.length > 0 && (
          <div className="list-label">
            {
              texts.find((text) => text.code === "lists-books-items-label")
                .value
            }{" "}
            ({list.length})
          </div>
        )}
        <Swiper
          modules={[Mousewheel]}
          spaceBetween={12}
          freeMode={true}
          slidesPerView={"auto"}
          mousewheel={{
            sensitivity: 3,
          }}
          preloadImages={false}
          lazy={true}
          grabCursor={true}
          onTouchStart={(e) => this.setAnimationClass("books", true)}
          onTouchEnd={(e) => this.setAnimationClass("books", false)}
          initialSlide={listsState.books.items}
          onActiveIndexChange={(swiper) => {
            listsState.books.items = swiper.activeIndex;
            onChildAction({ listsState });
          }}
        >
          {itemsRender}
        </Swiper>
      </div>
    );
  }
}
