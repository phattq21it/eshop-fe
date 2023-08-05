import React from "react";
import DashboardHeader from "../../components/shop/layout/DashboardHeader";
import CreateEvent from "../../components/shop/CreateEvent.jsx";
import DashboardSideBar from "../../components/shop/layout/DashboardSideBar";

const ShopCreateEvent = () => {
  return (
    <div>
      <DashboardHeader />
      <div className="flex items-center justify-between w-full">
        <div className="w-[80px] 800px:w-[330px]">
          <DashboardSideBar active={6} />
        </div>
        <div className="w-full justify-center flex">
          <CreateEvent />
        </div>
      </div>
    </div>
  );
};

export default ShopCreateEvent;
