import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SignupForm from "../components/auth/SignupForm";

const SignupPage = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);

  const handleSignupSuccess = (userInfo) => {
    setUserInfo(userInfo);
    navigate("/dashboard");
  };

  return (
    <div className="page-container">
      <div className="signup-wrapper">
        <SignupForm onSignupSuccess={handleSignupSuccess} />
      </div>
    </div>
  );
};

export default SignupPage;
