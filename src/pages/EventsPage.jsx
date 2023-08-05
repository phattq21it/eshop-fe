import React from "react";
import { useSelector } from "react-redux";
import EventCard from "../components/Events/EventCard";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";

const EventsPage = () => {
  const { allEvents, isLoading } = useSelector((state) => state.events);
  return (
    <div>
      {!isLoading && (
        <div>
          <Header activeHeading={4} />
          <div className="w-[50%] flex justify-center  bg-slate-200- py-10">
            <h1 className="text-4xl  text-[#fe1515f4] font-medium">
              Sự kiện ưu đãi đang diễn ra
            </h1>
          </div>

          {/* <EventCard active={true} data={allEvents && allEvents[0]} /> */}
          <Footer />
        </div>
      )}
    </div>
  );
};

export default EventsPage;
