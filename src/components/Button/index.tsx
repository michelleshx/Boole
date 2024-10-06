import React, { ReactNode } from "react";
import styles from "./Button.module.css";

interface IButtonProps {
  text: string;
  variant: string;
  size?: string;
  onClick?: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
  title: string;
  ariaLabel?: string;
  children?: ReactNode;
}

const Button: React.FC<IButtonProps> = ({
  text,
  variant = "primary",
  size = "large",
  onClick = () => {},
  disabled = false,
  fullWidth,
  title,
  ariaLabel,
  children,
}) => {
  return (
    <button
      className={[
        styles.button,
        styles[`button--${variant}`],
        styles[`button--${size}`],
        styles[`button--${fullWidth ? "fullWidth" : ""}`],
      ].join(" ")}
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={ariaLabel ? ariaLabel : title}
    >
      {text}
      <span className={styles.icon}>{children}</span>
    </button>
  );
};

export default Button;
