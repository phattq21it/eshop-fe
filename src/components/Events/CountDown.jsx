import axios from "axios";
import React, { useEffect, useState } from "react";
import { server } from "../../server";

const CountDown = ({ data }) => {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    if (
      typeof timeLeft.ngày === "undefined" &&
      typeof timeLeft.giờ === "undefined" &&
      typeof timeLeft.phút === "undefined" &&
      typeof timeLeft.giây === "undefined"
    ) {
      axios.delete(`${server}/event/delete-shop-event/${data._id}`);
    }
    return () => clearTimeout(timer);
  });

  function calculateTimeLeft() {
    const difference = +new Date(data.Finish_Date) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        ngày: Math.floor(difference / (1000 * 60 * 60 * 24)),
        giờ: Math.floor((difference / (1000 * 60 * 60)) % 24),
        phút: Math.floor((difference / 1000 / 60) % 60),
        giây: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  }

  const timerComponents = Object.keys(timeLeft).map((interval) => {
    if (!timeLeft[interval]) {
      return null;
    }

    return (
      <span className="text-[28px] text-[#fe1515f4] font-Roboto font-medium">
        {timeLeft[interval]} {interval}{" "}
      </span>
    );
  });

  return (
    <div>
      {timerComponents.length ? (
        timerComponents
      ) : (
        <span className="text-[red] text-[25px]">Time's Up</span>
      )}
    </div>
  );
};

export default CountDown;
