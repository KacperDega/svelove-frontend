import React, { useEffect, useState } from "react";
import Select, { MultiValue } from "react-select";
import { apiRequest } from "../api/apiRequest";
import { useNavigate } from "react-router-dom";
import { UserProfileDTO, emptyProfile, mapToUpdateDto } from "../types/UserProfileDTO";
import Navbar from "../components/Navbar";
import { CityDTO, HobbyDTO } from "../types";
import { getCities, getHobbies } from "../api";

const EditProfile: React.FC = () => {
  const [formData, setFormData] = useState<UserProfileDTO>(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const [hobbies, setHobbies] = useState<HobbyDTO[]>([]);
  const [cities, setCities] = useState<CityDTO[]>([]);
  

useEffect(() => {
  const loadAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [hobbiesData, citiesData, profileData] = await Promise.all([
        getHobbies(),
        getCities(),
        apiRequest<UserProfileDTO>("/profile"),
      ]);

      setHobbies(hobbiesData);
      setCities(citiesData);
      setFormData(profileData);
    } catch (err) {
      console.error("Data loading error:", err);
      setError("Wystąpił błąd podczas ładowania danych. Spróbuj ponownie później.");
    } finally {
      setLoading(false);
    }
  };

  loadAllData();
}, []);


  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleHobbiesChange = (selected: MultiValue<{ value: number; label: string }>) => {
    const selectedHobbyLabels = selected.map(s => s.label);
    setFormData({ ...formData, hobbies: selectedHobbyLabels });
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCityId = Number(e.target.value);
    const selectedCity = cities.find(city => city.id === selectedCityId);

    setFormData({
      ...formData,
      city: selectedCity ? selectedCity.name : "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updateDto = mapToUpdateDto(formData, hobbies, cities);
      await apiRequest("/profile/edit", {
        method: "POST",
        body: JSON.stringify(updateDto),
      });
      navigate("/profile");
    } catch (err) {
      console.error("City not found"); 
      setError("Błąd zapisu zmian.");
    }
  };


  if (loading)
    return (
      <div className="flex flex-col h-dvh">
        <Navbar />
        
        <div className="flex justify-center items-center min-h-screen">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="max-w-3xl mx-auto p-6 space-y-6">
        {/* zdjecia */}
        <div className="carousel w-full rounded-lg overflow-hidden shadow-lg ">
          {formData.photoUrls.map((url, index) => (
            <div
              id={`slide${index}`}
              key={index}
              className="carousel-item relative w-full"
            >
              <img src={url} className="w-full object-cover h-[300px] sm:h-[400px]" alt={`Zdjęcie ${index + 1}`} />
              <div className="absolute flex justify-between transform -translate-y-1/2 left-4 right-4 top-1/2">
                <a
                  href={`#slide${(index - 1 + formData.photoUrls.length) % formData.photoUrls.length}`}
                  className="btn btn-circle btn-sm"
                >
                  ❮
                </a>
                <a
                  href={`#slide${(index + 1) % formData.photoUrls.length}`}
                  className="btn btn-circle btn-sm"
                >
                  ❯
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* edycja */}
        <form
          onSubmit={handleSubmit}
          className="card bg-neutral shadow-xl border border-secondary p-6 space-y-4"
        >
          <h2 className="text-3xl font-bold mb-4">Edytuj profil</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label font-semibold">Nazwa użytkownika</label>
              <input
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Nazwa użytkownika"
                className="input input-bordered w-full"
                required
              />
            </div>

            <div>
              <label className="label font-semibold">Login</label>
              <input
                name="login"
                value={formData.login}
                // onChange={handleChange}
                placeholder="Login"
                className="input input-bordered w-full"
                disabled
              />
            </div>

            <div>
              <label className="label font-semibold">Płeć</label>
              <select
                name="sex"
                value={formData.sex}
                // onChange={handleChange}
                className="select select-bordered w-full"
                disabled
              >
                <option value="">Płeć</option>
                <option value="Male">Mężczyzna</option>
                <option value="Female">Kobieta</option>
                <option value="Other">Inna</option>
              </select>
            </div>

            <div>
              <label className="label font-semibold">Wiek</label>
              <input
                name="age"
                type="number"
                min={18}
                max={100}
                value={formData.age}
                onChange={handleChange}
                placeholder="Wiek"
                className="input input-bordered w-full"
                required
              />
            </div>

            <div>
              <label className="label font-semibold">Preferencje</label>
              <select
                name="preference"
                value={formData.preference}
                onChange={handleChange}
                className="select select-bordered w-full"
                required
              >
                <option value="">Preferencje</option>
                <option value="Men">Mężczyźni</option>
                <option value="Women">Kobiety</option>
                <option value="Both">Oboje</option>
                <option value="Other">Inne</option>
              </select>
            </div>

            <div>
              <label className="label font-semibold">Lokalizacja</label>
                <select
                  name="cityId"
                  value={cities.find(city => city.name === formData.city)?.id ?? ""}
                  onChange={handleCityChange}
                  className="select select-bordered w-full"
                  required
                >
                  <option value="">Wybierz miasto</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
            </div>

            <div>
              <label className="label font-semibold">
                Minimalny wiek partnera
              </label>
              <input
                name="age_min"
                type="number"
                min={18}
                max={100}
                value={formData.age_min}
                onChange={handleChange}
                placeholder="Minimalny wiek partnera"
                className="input input-bordered w-full"
                required
              />
            </div>

            <div>
              <label className="label font-semibold">
                Maksymalny wiek partnera
              </label>
              <input
                name="age_max"
                type="number"
                min={18}
                max={100}
                value={formData.age_max}
                onChange={handleChange}
                placeholder="Maksymalny wiek partnera"
                className="input input-bordered w-full"
                required
              />
            </div>
          </div>

          <div>
            <label className="font-semibold mb-1 block">Opis:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="textarea textarea-bordered w-full" 
              rows={4}
              required
            />
          </div>

          <div>
            <label className="font-semibold mb-1 block">Zainteresowania:</label>
            <Select
              isMulti
              options={hobbies.map((h) => ({ value: h.id, label: h.label }))}
              value={hobbies
                .filter((h) => formData.hobbies.includes(h.label))
                .map((h) => ({ value: h.id, label: h.label }))}
              onChange={handleHobbiesChange}
              className="react-select-container text-black"
              classNamePrefix="react-select"
            />
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="btn btn-outline btn-secondary"
            >
              Anuluj
            </button>
            <button type="submit" className="btn btn-primary">
              Zapisz zmiany
            </button>
          </div>
        </form>

        {error && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 alert alert-error max-w-md mx-auto mt-8 z-50">
            <span>{error}</span>
          </div>
        )}
        
      </div>
    </div>
  );
};

export default EditProfile;
