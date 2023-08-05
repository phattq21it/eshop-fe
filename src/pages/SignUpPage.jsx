import React, { useEffect } from "react";
import SignUp from "../components/Signup/Signup.jsx";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export const SignUpPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    if (isAuthenticated === true) {
      navigate("/");
    }
  }, []);
  return (
    <div>
      <SignUp></SignUp>
    </div>
  );
};
export default SignUpPage;
