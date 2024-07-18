import React from "react";
import styles from "../app/ToggleSwitch.module.css";

const ToggleSwitch = () => {
  return (
    <div className={styles.toggleContainer}>
      <input type="checkbox" id="switch" className={styles.toggle} />
      <label htmlFor="switch" className={styles.switch}></label>
    </div>
  );
};

export default ToggleSwitch;
