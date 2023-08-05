import React, { useEffect } from "react";
import ShopLogin from "../components/shop/ShopLogin.jsx";

import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export const ShopLoginPage = () => {
  const navigate = useNavigate();
  const { isSeller, isLoading } = useSelector((state) => state.seller);

  useEffect(() => {
    if (isSeller === true) {
      navigate(`/dashboard`);
    }
  }, [isLoading, isSeller]);
  return <ShopLogin />;
};
export default ShopLoginPage;
