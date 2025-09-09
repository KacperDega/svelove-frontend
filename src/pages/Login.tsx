import React, { useState, useEffect } from "react";
import { login } from "../api/auth";
import { useNavigate } from "react-router-dom";
import "../index.css";
import logo from "../assets/logo1.svg";

const Login = () => {
  const navigate = useNavigate();
  const [loginValue, setLoginValue] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);

    if (!loginValue.trim() || !password.trim()) {
      setError("Login i hasło nie mogą być puste.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const response = await login(loginValue, password);
      console.log("Zalogowano, otrzymany token:", response.token);
      // console.log("Zalogowano.");
      localStorage.setItem("jwt", response.token);

      setSubmitting(false);
      setSuccess(true);

      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (err: any) {
      const message =
        err.message === "Unauthorized"
          ? "Niepoprawny login lub hasło"
          : `Error: ${err.message || "Błąd logowania"}`;
      setError(message);
      setSubmitting(false);
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
          <div className="bg-neutral shadow-md rounded-xl p-6 w-full max-w-md border border-secondary text-center flex flex-col space-y-4">
          <h3 className="text-3xl font-semibold">Logowanie</h3>
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
            <div className="flex justify-between space-x-2">
              <button
                type="button"
                className={`btn btn-secondary ${submitting ? "opacity-65 cursor-not-allowed pointer-events-none" : ""}`}
                onClick={() => navigate("/")}
              >
                Powrót
              </button>
              
              <button
                type="submit"
                className={`btn btn-primary 
                  ${submitting || success ? "opacity-65 cursor-not-allowed pointer-events-none" : ""}
                  ${success ? "bg-success border-success hover:bg-success hover:border-success" : ""}
                `}
              >
                {success ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-bounce">✅</span>
                    <span>Zalogowano</span>
                  </span>
                ) : submitting ? (
                  <span className="flex items-center gap-2">
                    <span className="loading loading-spinner loading-sm"></span>
                    <span>Logowanie...</span>
                  </span>
                ) : (
                  "Zaloguj się"
                )}
              </button>
          </div>
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
