import React, { useState, useEffect } from "react";
import { register, login } from "../api/auth";
import { useNavigate } from "react-router-dom";
import "../index.css";
import logo from "../assets/logo1.png";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    login: "",
    password: "",
    sex: "",
    preference: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const { username, login: loginValue, password, sex, preference } = formData;
    if (
      ![username, loginValue, password, sex, preference].every((val) =>
        val.trim()
      )
    ) {
      setError("Wszystkie pola są wymagane.");
      return;
    }

    try {
      await register(formData);

      // TODO: automatyczny log-in
      const response = await login(loginValue, password);
      localStorage.setItem("jwt", response.token);

      navigate("/dashboard");
    } catch (err: any) {
      setError(`Error: ${err.message || "Błąd rejestracji"}`);
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
          <h3 className="text-2xl font-semibold">Rejestracja</h3>
          <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
            <input
              type="text"
              name="username"
              placeholder="Nazwa użytkownika"
              value={formData.username}
              onChange={handleChange}
              className="input input-bordered"
              required
            />
            <input
              type="text"
              name="login"
              placeholder="Login"
              value={formData.login}
              onChange={handleChange}
              className="input input-bordered"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Hasło"
              value={formData.password}
              onChange={handleChange}
              className="input input-bordered"
              required
            />
            <select
              name="sex"
              value={formData.sex}
              onChange={handleChange}
              className="select select-bordered"
              required
            >
              <option value="">Płeć</option>
              <option value="Male">Mężczyzna</option>
              <option value="Female">Kobieta</option>
              <option value="Other">Inna</option>
            </select>
            <select
              name="preference"
              value={formData.preference}
              onChange={handleChange}
              className="select select-bordered"
              required
            >
              <option value="">Preferencje</option>
              <option value="Men">Mężczyźni</option>
              <option value="Women">Kobiety</option>
              <option value="Both">Oboje</option>
              <option value="Other">Inne</option>
            </select>
            <input
              type="submit"
              className="btn btn-primary"
              value="Zarejestruj się"
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

export default Register;
