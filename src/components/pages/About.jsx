import React from "react";
import "./About.css";
import icons from "../../assets/images/icons.svg";

const About = ({ texts, onChildAction }) => {
  return (
    <div id="about">
      <div
        className="close"
        onClick={() => onChildAction({ component: { name: "main" } })}
      >
        <svg width="16" height="16">
          <use xlinkHref={`${icons}#close`} />
        </svg>
      </div>
      <header className="title">
        {texts.find((text) => text.code === "about-title").value}
      </header>
      <main className="content">
        <header>
          <div>
            <span>AppName</span>
            <span>v1.0.0</span>
          </div>
          <div>
            Kjn dnc ksnc sndckd ncn cknsdc ksnck dncknskcnskdncksnck nskc dnc
            knc ksnc dcs
          </div>
        </header>
        <main>
          <div>MAIN</div>
        </main>
      </main>
    </div>
  );
};

export default About;
