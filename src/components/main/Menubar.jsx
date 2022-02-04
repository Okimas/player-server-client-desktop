import React from "react";
import "./Menubar.css";

const Menubar = ({ active, categories, texts, onChildAction }) => {
  return (
    <nav id="menu">
      <ul>
        {categories.map((category) => {
          return (
            <li key={"menu-" + category.code}>
              <a
                href={"/#"}
                onClick={(e) => {
                  e.preventDefault();
                  onChildAction({ category: category.code });
                }}
                className={`${category.code === active ? "active" : ""}`}
              >
                {texts.find((text) => text.code === category.code).value}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Menubar;
