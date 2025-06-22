import React, { useState, useEffect } from "react";
import { register, login } from "../api/auth";
import { useNavigate } from "react-router-dom";
import "../index.css";
import logo from "../assets/logo1.png";
import { Preference, Sex } from "../types/enums";
import Select from 'react-select';
import {hobbies as hobbyOptions } from "../types/enums";

const toPascalCase = (text: string): string => {
  return text
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const [selectedHobbies, setSelectedHobbies] = useState<{ label: string; value: string }[]>([]);
  const options = hobbyOptions.map((hobby) => ({
    value: hobby,
    label: hobby,
  }));

  const [formData, setFormData] = useState({
    username: "",
    login: "",
    password: "",
    sex: "" as Sex,
    age: "",
    localization: "",
    description: "",
    preference: "" as Preference,
    age_min: "",
    age_max: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const previousStep = () => {
    setStep(1);
  };

  const nextStep = () => {
    const { username, login, password, sex, age } = formData;
    if (![username, login, password, sex, age].every((val) => val.trim())) {
      setError("Uzupełnij wszystkie pola.");
      return;
    }
    if (Number(age) < 18 || Number(age) > 100) {
      setError("Wiek musi być między 18 a 100.");
      return;
    }
    setError(null);
    setStep(2);
  };

  const handleHobbyChange = (selected: any) => {
    setSelectedHobbies(selected || []);
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const {
      username,
      login: loginValue,
      password,
      sex,
      age,
      localization,
      description,
      preference,
      age_min,
      age_max,
    } = formData;

    if (
      ![
        localization,
        description,
        preference,
        age_min,
        age_max,
      ].every((val) => val.trim())
    ) {
      setError("Uzupełnij wszystkie pola.");
      return;
    }

    if (
      Number(age_min) < 18 ||
      Number(age_max) > 100 ||
      Number(age_min) > Number(age_max)
    ) {
      setError("Zakres wieku musi być poprawny (18-100).");
      return;
    }

    if (selectedHobbies.length === 0) {
      setError("Wybierz przynajmniej jedno hobby.");
      return;
    }


    try {
      const payload = {
        username,
        login: loginValue,
        password,
        sex: sex as Sex,
        preference: preference as Preference,
        description,
        localization: toPascalCase(localization),
        age: Number(age),
        age_min: Number(age_min),
        age_max: Number(age_max),
        hobbies: selectedHobbies.map((h) => h.value),
      };

      console.log("Rejestracja payload:", JSON.stringify(payload, null, 2));

      await register(payload);

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

    const appear = setTimeout(() => setShowAlert(true), 10);
    const disappear = setTimeout(() => setShowAlert(false), 4000);
    return () => {
      clearTimeout(appear);
      clearTimeout(disappear);
    };
  }, [error]);

  return (
    <div className="grid grid-rows-[1fr,auto,1fr] h-screen">
      <div className="flex items-end justify-center">
        <img src={logo} alt="Logo" className="object-contain h-24" />
      </div>

      <div className="flex justify-center">
        <div className="bg-neutral shadow-md rounded-xl p-6 w-full max-w-md border border-secondary text-center flex flex-col space-y-4">
          <h3 className="text-3xl font-semibold">
            {step === 1 ? "Rejestracja - krok 1" : "Rejestracja - krok 2"}
          </h3>
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            {step === 1 ? (
              <>
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
                <input
                  type="number"
                  name="age"
                  placeholder="Wiek"
                  value={formData.age}
                  onChange={handleChange}
                  className="input input-bordered"
                  required
                />
                <div className="flex justify-between space-x-2">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => navigate("/")}
                  >
                    Powrót
                  </button>
                <button
                  type="button"
                  className="btn btn-primary px-14"
                  onClick={nextStep}
                >
                  Dalej
                </button>
                </div>
              </>
            ) : (
              <>
                <input
                  type="text"
                  name="localization"
                  placeholder="Lokalizacja"
                  value={formData.localization}
                  onChange={handleChange}
                  className="input input-bordered"
                  required
                />
                <textarea
                  name="description"
                  placeholder="Opis"
                  value={formData.description}
                  onChange={handleChange}
                  className="textarea textarea-bordered"
                  maxLength={225}
                  required
                />
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
                  type="number"
                  name="age_min"
                  placeholder="Minimalny wiek partnera"
                  value={formData.age_min}
                  onChange={handleChange}
                  className="input input-bordered"
                  required
                />
                <input
                  type="number"
                  name="age_max"
                  placeholder="Maksymalny wiek partnera"
                  value={formData.age_max}
                  onChange={handleChange}
                  className="input input-bordered"
                  required
                />
                <Select
                  className=" text-primary-content"
                  options={options}
                  value={selectedHobbies}
                  onChange={handleHobbyChange}
                  isMulti={true}
                  placeholder="Wybierz hobby"
                />
                <div className="flex justify-between space-x-2">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={previousStep}
                  >
                    Powrót
                  </button>
                  <input
                    type="submit"
                    className="btn btn-primary"
                    value="Zarejestruj się"
                  />
                </div>
              </>
            )}
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
            ${showAlert ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6 pointer-events-none"}
          `}
        >
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default Register;
