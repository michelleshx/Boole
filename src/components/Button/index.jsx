import React from "react";
import styles from "./Button.module.css";

const Button = ({ text, variant = "primary", size = "large" }) => {
  return (
    <button
      className={[
        styles.button,
        styles[`button--${variant}`],
        styles[`button--${size}`],
      ].join(" ")}
    >
      {text}
    </button>
  );
};

export default Button;
