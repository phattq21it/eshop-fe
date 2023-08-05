import React, { useEffect } from "react";
import Login from "../components/Login/Login.jsx";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export const LoginPages = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    if (isAuthenticated === true) {
      navigate("/");
    }
  }, []);
  return (
    <div className="w-full h-screen  bg-gray-800">
      <Login />
    </div>
  );
};
export default LoginPages;
