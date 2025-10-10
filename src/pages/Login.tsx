import React, { useState, useEffect } from "react";
import { login } from "../api/auth";
import { useNavigate } from "react-router-dom";
import "../index.css";
import logo from "../assets/logo1.svg";
import ErrorPopup from "../components/ErrorPopup";
import Header from "../components/Header";

const Login = () => {
  const navigate = useNavigate();
  const [loginValue, setLoginValue] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showError, setShowError] = useState(true);
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
      localStorage.setItem("userId", response.id.toString());
      localStorage.setItem("username", response.username);
      localStorage.setItem("profilePhotoUrl", response.profilePhotoUrl);

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

  return (
    <div className="min-h-screen flex flex-col">

      <Header />
      
      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <div className="flex items-end justify-center mb-4">
          <h1 className="text-8xl font-teaspoon text-primary select-none">
            svelove
          </h1>
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
      </main>

      <ErrorPopup error={error} showError={showError} setShowError={setShowError}/>
    </div>
  );
};

export default Login;
