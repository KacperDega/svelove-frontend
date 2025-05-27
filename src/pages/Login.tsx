import React, { useState } from "react";
import { login } from "../api/auth";
import { useNavigate } from "react-router-dom";
import '../index.css';

const Login = () => {
  const navigate = useNavigate();
  const [loginValue, setLoginValue] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await login(loginValue, password);
      console.log("Zalogowano, otrzymany token:", response.token);

      localStorage.setItem("jwt", response.token);

      setError(null);

      navigate("/dashboard");
      
    } catch (err: any) {
      setError(err.message || "Błąd logowania");
    }
  };

  return (
    <div>
      <h3>Logowanie</h3>
      <form onSubmit={handleSubmit}>
        <label htmlFor="login">Login</label>
        <input
          type="text"
          id="login"
          value={loginValue}
          onChange={(e) => setLoginValue(e.target.value)}
        />

        <label htmlFor="password">Hasło</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input type="submit" className="btn btn-primary" value="Zaloguj się" />
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button className="btn btn-neutral">Neutral</button>
    </div>
  );
};

export default Login;
