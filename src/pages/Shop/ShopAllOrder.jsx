import React from "react";
import DashboardHeader from "../../components/shop/layout/DashboardHeader";
import DashboardSideBar from "../../components/shop/layout/DashboardSideBar";
import AllOrder from "../../components/shop/AllOrder.jsx";

const ShopAllOrder = () => {
  return (
    <div>
      <DashboardHeader />
      <div className="flex justify-between w-full">
        <div className="w-[80px] 800px:w-[330px]">
          <DashboardSideBar active={2} />
        </div>
        <div className="w-full justify-center flex">
          <AllOrder />
        </div>
      </div>
    </div>
  );
};

export default ShopAllOrder;
