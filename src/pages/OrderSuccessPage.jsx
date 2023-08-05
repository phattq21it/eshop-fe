import React, { useEffect } from "react";
import Footer from "../components/Layout/Footer";
import Header from "../components/Layout/Header";
import Lottie from "react-lottie";
import CheckoutSteps from "../components/Checkout/CheckoutSteps";
import animationData from "../Assests/animations/animation_lkay71gb.json";

const OrderSuccessPage = () => {
  return (
    <div>
      <Header />
      <br />
      <br />
      <CheckoutSteps active={2} />
      <br />

      <Success />
      <br />
      <br />
      <Footer />
    </div>
  );
};

const Success = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <div>
      <Lottie options={defaultOptions} width={300} height={300} />
      <h5 className="text-center mb-14 text-[25px] text-[#000000a1]">
        Your order is successful 😍
      </h5>
      <br />
      <br />
    </div>
  );
};

export default OrderSuccessPage;
