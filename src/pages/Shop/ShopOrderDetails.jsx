import React from "react";
import DashboardHeader from "../../components/shop/layout/DashboardHeader";
import Footer from "../../components/Layout/Footer";
import OrderDetails from "../../components/shop/OrderDetails.jsx";

const ShopOrderDetails = () => {
  return (
    <div>
      <DashboardHeader />
      <OrderDetails />
      <Footer />
    </div>
  );
};

export default ShopOrderDetails;
