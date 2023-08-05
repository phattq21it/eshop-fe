import React, { useEffect } from "react";
import ShopCreate from "../components/shop/ShopCreate.jsx";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
export const ShopCreatePage = () => {
  const navigate = useNavigate();
  const { isSeller, seller } = useSelector((state) => state.seller);

  useEffect(() => {
    if (isSeller === true) {
      navigate(`/shop/${seller._id}`);
    }
  }, []);
  return <ShopCreate />;
};
export default ShopCreatePage;
