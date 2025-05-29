import React, { useState, useEffect } from "react";
import { login } from "../api/auth";
import { useNavigate } from "react-router-dom";
import "../index.css";
import logo from "../assets/logo1.png";

const Login = () => {
  const navigate = useNavigate();
  const [loginValue, setLoginValue] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);

    if (!loginValue.trim() || !password.trim()) {
      setError("Login i hasło nie mogą być puste.");
      return;
    }

    try {
      const response = await login(loginValue, password);
      // console.log("Zalogowano, otrzymany token:", response.token);
      console.log("Zalogowano.");
      localStorage.setItem("jwt", response.token);

      setError(null);

      navigate("/dashboard");
    } catch (err: any) {
      const message =
        err.message === "Unauthorized"
          ? "Niepoprawny login lub hasło"
          : `Error: ${err.message || "Błąd logowania"}`;
      setError(message);
    }
  };

  useEffect(() => {
    setShowAlert(false);

    if (!error) return;

    const appearTimeout = setTimeout(() => setShowAlert(true), 10);
    const disappearTimeout = setTimeout(() => setShowAlert(false), 4000);

    return () => {
      clearTimeout(appearTimeout);
      clearTimeout(disappearTimeout);
    };
  }, [error]);

  return (
    <div className="grid grid-rows-[1fr,auto,1fr] h-screen">
      <div className="flex items-end justify-center">
        <img src={logo} alt="Logo" className="object-contain" />
      </div>

      <div className="flex justify-center">
        <div className="text-center flex flex-col space-y-4">
          <h3 className="text-2xl font-semibold">Logowanie</h3>
          <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
            <div>
              <label htmlFor="login" className="mr-6">
                Login
              </label>
              <input
                type="text"
                id="login"
                value={loginValue}
                onChange={(e) => setLoginValue(e.target.value)}
                className="input input-bordered"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="mr-6">
                Hasło
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input input-bordered"
                required
              />
            </div>
            <input
              type="submit"
              className="btn btn-primary"
              value="Zaloguj się"
            />
          </form>
        </div>
      </div>

      <div />

      {error && (
        <div
          role="alert"
          className={`
            alert alert-error alert-soft fixed bottom-4 right-4 shadow-lg max-w-sm z-50
            transition-all duration-500 ease-in-out
            ${
              showAlert
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6 pointer-events-none"
            }
          `}
        >
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default Login;
