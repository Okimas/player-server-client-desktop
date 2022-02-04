import React from "react";
import icons from "../../assets/images/icons.svg";

const None = ({ category }) => {
  return (
    <div id="none">
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          paddingTop: "72px",
          opacity: 0.07,
          transform: "translate(-50%,-40%)",
        }}
      >
        <svg width="154" height="154">
          <use xlinkHref={`${icons}#${category}`} />
        </svg>
      </div>
    </div>
  );
};

export default None;
