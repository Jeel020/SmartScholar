import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>SmartScholar</h1>
      <input placeholder="Email" />
      <br />
      <br />
      <input placeholder="Password" type="password" />
      <br />
      <br />
      <button onClick={() => navigate("/dashboard")}>
        Login
      </button>
    </div>
  );
}

export default Login;