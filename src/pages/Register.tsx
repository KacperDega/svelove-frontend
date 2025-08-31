import React, { useState, useEffect } from "react";
import { register, login } from "../api/auth";
import { useNavigate } from "react-router-dom";
import "../index.css";
import logo from "../assets/logo1.png";
import { Preference, Sex } from "../types/enums";
import Select from "react-select";
import PhotoUploader from "../components/PhotoUploader";
import { getHobbies, getCities } from "../api";
import { CityDTO, HobbyDTO } from "../types";

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);


  const [hobbies, setHobbies] = useState<HobbyDTO[]>([]);
  const [cities, setCities] = useState<CityDTO[]>([]);

  const [selectedHobbies, setSelectedHobbies] = useState<
    { label: string; value: number }[]
  >([]);

  const [formData, setFormData] = useState({
    username: "",
    login: "",
    password: "",
    sex: "" as Sex,
    age: "",
    cityId: "",
    description: "",
    preference: "" as Preference,
    age_min: "",
    age_max: "",
  });

  const [photos, setPhotos] = useState<(File | string)[]>([]);

  const [error, setError] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [hobbiesData, citiesData] = await Promise.all([
          getHobbies(),
          getCities(),
        ]);
        setHobbies(hobbiesData);
        setCities(citiesData);
      } catch (err: any) {
        console.error("Data loading error:", err);
        setError("Nie udało się połączyć. Spróbuj ponownie później.");
      }
    };
    loadData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const previousStep = () => {
    setStep((prev) => prev - 1);
  };

  const nextStep = () => {
    if (step === 1) {
      const { username, login, password, sex, age } = formData;
      if (![username, login, password, sex, age].every((val) => val.trim())) {
        setError("Uzupełnij wszystkie pola.");
        return;
      }
      if (Number(age) < 18 || Number(age) > 100) {
        setError("Wiek musi być między 18 a 100.");
        return;
      }
    }

    if (step === 2) {
      const { cityId, description, preference, age_min, age_max } = formData;
      if (![cityId, description, preference, age_min, age_max].every((v) => v.trim())) {
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
    }

    setError(null);
    setStep((prev) => prev + 1);
  };

  const handleHobbyChange = (selected: any) => {
    setSelectedHobbies(selected || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (photos.length === 0) {
      setError("Dodaj przynajmniej jedno zdjęcie.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const payload = {
        username: formData.username,
        login: formData.login,
        password: formData.password,
        sex: formData.sex as Sex,
        preference: formData.preference as Preference,
        description: formData.description,
        age: Number(formData.age),
        ageMin: Number(formData.age_min),
        ageMax: Number(formData.age_max),
        cityId: Number(formData.cityId),
        hobbyIds: selectedHobbies.map((h) => h.value),
        photos,
      };

      console.log("Register payload:", payload);

      await register(payload);

      const response = await login(formData.login, formData.password);
      localStorage.setItem("jwt", response.token);
      
      setSubmitting(false);
      setSuccess(true);

      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (err: any) {
      setError(`Error: ${err.message || "Błąd rejestracji"}`);
      setSubmitting(false);
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
        <div
          className={`bg-neutral shadow-md rounded-xl p-6 w-full 
                      ${step === 3 ? "max-w-full sm:max-w-3xl" : "max-w-md"}
                      border border-secondary text-center flex flex-col space-y-4`}
        >
          <h3 className="text-3xl font-semibold">
            {step === 1 && "Rejestracja - krok 1"}
            {step === 2 && "Rejestracja - krok 2"}
            {step === 3 && "Rejestracja - zdjęcia"}
          </h3>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col space-y-4"
          >
            {step === 1 && (
              <>
                {/* KROK 1 */}
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
            )}

            {step === 2 && (
              <>
                {/* KROK 2 */}
                <select
                  name="cityId"
                  value={formData.cityId}
                  onChange={handleChange}
                  className="select select-bordered"
                  required
                >
                  <option value="">Wybierz miasto</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>

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
                  className="text-primary-content"
                  options={hobbies.map((h) => ({
                    value: h.id,
                    label: h.label,
                  }))}
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
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={nextStep}
                  >
                    Dalej
                  </button>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                {/* KROK 3 */}
                <PhotoUploader maxFiles={5} onChange={setPhotos} />

                <div className="flex justify-between space-x-2 mt-4">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={previousStep}
                  >
                    Powrót
                  </button>
                  
                  <button
                    type="submit"
                    className={`btn btn-primary 
                      ${submitting || success ? "opacity-65 cursor-not-allowed" : ""}
                      ${success ? "bg-success border-success hover:bg-success hover:border-success" : ""}
                    `}
                  >
                    {success ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-bounce">✅</span>
                        <span>Zarejestrowano</span>
                      </span>
                    ) : submitting ? (
                      <span className="flex items-center gap-2">
                        <span className="loading loading-spinner loading-sm"></span>
                        <span>Rejestracja...</span>
                      </span>
                    ) : (
                      "Zarejestruj się"
                    )}
                  </button>
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
            ${
              showAlert
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6 pointer-events-none"
            }`}
        >
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default Register;
