import styles from "./Loading.module.css";

const Loading = () => {
  return (
    <div
      className={styles.loading}
      role="img"
      title="Loading..."
      aria-label="Loading..."
    />
  );
};

export default Loading;
