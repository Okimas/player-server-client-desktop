import React, { Component } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "./Preview.css";
import icons from "../../assets/images/icons.svg";

export default class Player extends Component {
  componentDidMount() {
    const loading = document.querySelector("#preview-loading");
    const videoContainer = document.querySelector("#preview-video");
    const video = document.querySelector("#preview-video video");
    video.onloadedmetadata = () => {
      video.play();
      loading.classList.add("hidden");
      videoContainer.classList.remove("hidden");
    };
    video.onerror = () => {};
    video.onended = () => {};
    this.play(this.props.index);
  }

  play = (index) => {
    const { items, serverURL } = this.props;
    const loading = document.querySelector("#preview-loading");
    const videoContainer = document.querySelector("#preview-video");
    const imageContainer = document.querySelector("#preview-image");
    const image = document.querySelector("#preview-image img");
    const video = document.querySelector("#preview-video video");

    video.pause();
    video.currentTime = 0;
    loading.classList.remove("hidden");
    videoContainer.classList.add("hidden");
    imageContainer.classList.add("hidden");

    if (items[index].type === "video") {
      video.src = items[index].image;
    } else {
      const img = new Image();
      img.onload = function () {
        image.src = this.src;
        loading.classList.add("hidden");
        imageContainer.classList.remove("hidden");
      };
      //img.src = items[index].url;
      img.src =
        (items[index].type !== "url" ? serverURL + "/api/image/" : "") +
        items[index].image
          .replace(/\\/g, "%5C")
          .replace(/\//g, "%5C")
          .replace("#", "%23");
    }
  };

  render() {
    const { items, onChildAction, serverURL } = this.props;
    return (
      <div id="preview">
        <div id="preview-loading" className="hidden">
          <div>CARREGANDO</div>
        </div>
        <div id="preview-video" className="hidden">
          <video src="#" controls></video>
        </div>
        <div id="preview-image" className="hidden zoom">
          <img src="#" alt="" />
        </div>
        <div className="preview-header">
          <div className="preview-window">
            <div
              className="ctrl"
              onClick={() => onChildAction({ preview: null })}
            >
              <svg width="16" height="16">
                <use xlinkHref={`${icons}#close`} />
              </svg>
            </div>
          </div>
        </div>
        {items.length > 1 && (
          <div className="preview-controls">
            <Swiper spaceBetween={0} freeMode={false} slidesPerView={"auto"}>
              {items.map((item, idx) => (
                <SwiperSlide
                  key={idx}
                  style={{ width: "auto", overflow: "hidden" }}
                  onClick={() => this.play(idx)}
                >
                  <div
                    className={`preview-item${
                      idx === this.index ? " active" : ""
                    }`}
                    style={{
                      backgroundImage: `url("${
                        item.type !== "url" ? serverURL + "/api/image/" : ""
                      }${item.thumb
                        .replace(/\\/g, "%5C")
                        .replace(/\//g, "%5C")
                        .replace("#", "%23")}")`,
                      marginLeft: idx === 0 ? "0px" : "1px",
                    }}
                  ></div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
      </div>
    );
  }
}
