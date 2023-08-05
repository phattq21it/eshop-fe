import React from "react";
import { Link } from "react-router-dom";
import styles from "../../../styles/style";
import image from "../../../image/8642509.jpg";

const Hero = () => {
  return (
    <div className={` w-full   ${styles.noramlFlex} `}>
      <img src={`${image}`} alt="" className="w-full" />
    </div>
  );
};

export default Hero;
