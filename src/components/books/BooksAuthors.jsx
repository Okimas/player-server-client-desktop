import React, { Component } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Mousewheel } from "swiper";
import "./BooksAuthors.css";
// import { setAnimationClass } from "../../utils/util";
// const { constants } = window.electron;

export default class BooksAuthors extends Component {
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
      last: listsState.books.authors + 32,
    };
    const itemsRender = [];
    if (list.length === 0 && isFiltering) {
      itemsRender.push(
        <SwiperSlide style={{ width: "auto" }} key={"books-authors0"}>
          <div
            className="books-authors-item"
            style={{ marginLeft: "64px", marginRight: "64px" }}
          >
            <div className="item-bg"></div>
            <div className="item-title">
              {texts.find((text) => text.code === "lists-authors-none").value}
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
          const subtitle =
            JSON.parse(item.subtitle)[0] +
            " " +
            texts.find((text) => text.code === "lists-authors-collections")
              .value;
          const thumb = item.thumb
            .replace(/\\/g, "%5C")
            .replace(/\//g, "%5C")
            .replace("#", "%23");

          return (
            <SwiperSlide
              style={{ width: "auto" }}
              key={"books-authors" + item.title}
            >
              <div
                className="books-authors-item"
                style={{
                  marginLeft: `${index === 0 ? "64px" : ""}`,
                  marginRight: `${index === arr.length - 1 ? "128px" : ""}`,
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
                          value: ["books", item.title],
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
      <div className={`books-authors-items noscrollbar`}>
        {list.length > 0 && (
          <div className="list-label">
            {
              texts.find((text) => text.code === "lists-books-authors-label")
                .value
            }{" "}
            ({list.length})
          </div>
        )}
        <Swiper
          modules={[Mousewheel]}
          spaceBetween={10}
          freeMode={true}
          slidesPerView={"auto"}
          mousewheel={{
            sensitivity: 3,
          }}
          preloadImages={false}
          lazy={true}
          grabCursor={true}
          onTouchStart={(e) => this.setAnimationClass("books-authors", true)}
          onTouchEnd={(e) => this.setAnimationClass("books-authors", false)}
          initialSlide={listsState.books.authors}
          onActiveIndexChange={(swiper) => {
            listsState.books.authors = swiper.activeIndex;
            onChildAction({ listsState });
          }}
        >
          {itemsRender}
        </Swiper>
      </div>
    );
  }
}
