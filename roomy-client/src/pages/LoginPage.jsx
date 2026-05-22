import LoginForm from "../components/auth/LoginForm";

const LoginPage = () => {
  const handleLoginSuccess = (userInfo) => {
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
    window.location.href = "/dashboard";
  };

  return (
    <div className="page-container">
      <div className="login-wrapper">
        <LoginForm onLoginSuccess={handleLoginSuccess} />
      </div>
    </div>
  );
};

export default LoginPage;
