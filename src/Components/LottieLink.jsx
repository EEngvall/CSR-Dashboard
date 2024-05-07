import React from "react";
import Lottie from "react-lottie";
import { Link } from "react-router-dom";

const LottieLink = ({ animationData, linkTo }) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData, // Dynamic based on prop
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <Link to={linkTo}>
      <Lottie options={defaultOptions} height={200} width={200} />
    </Link>
  );
};

export default LottieLink;
