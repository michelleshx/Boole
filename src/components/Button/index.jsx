import React from "react";
import styles from "./Button.module.css";

const Button = ({
  text,
  variant = "primary",
  size = "large",
  onClick = () => {},
  disabled = false,
  children,
}) => {
  return (
    <button
      className={[
        styles.button,
        styles[`button--${variant}`],
        styles[`button--${size}`],
      ].join(" ")}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
      <span className={styles.icon}>{children}</span>
    </button>
  );
};

export default Button;
