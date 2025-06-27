import React, { useEffect, useState } from "react";
import Select from "react-select";
import { apiRequest } from "../api/index";
import { useNavigate } from "react-router-dom";
import { hobbies as hobbyOptions } from "../types/enums/Hobby";
import { UserProfileDTO, emptyProfile } from "../types/UserProfileDTO";
import Navbar from "../components/Navbar";

const sexOptions = [
  { value: "Male", label: "Mężczyzna" },
  { value: "Female", label: "Kobieta" },
  { value: "Other", label: "Inna" },
];

const preferenceOptions = [
  { value: "Men", label: "Mężczyźni" },
  { value: "Women", label: "Kobiety" },
  { value: "Both", label: "Oboje" },
  { value: "Other", label: "Inne" },
];

const hobbies = hobbyOptions.map((hobby) => ({
  value: hobby,
  label: hobby,
}));

const EditProfile: React.FC = () => {
  const [formData, setFormData] = useState<UserProfileDTO>(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const photos = [
    "https://picsum.photos/800/500",
    "https://picsum.photos/800/400",
    "https://picsum.photos/800/600",
  ];

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      setError(null);
      try {
        const data = await apiRequest<UserProfileDTO>("/profile");
        setFormData(data);
      } catch {
        setError("Błąd pobierania profilu.");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleHobbiesChange = (selected: any) => {
    setFormData({ ...formData, hobbies: selected.map((s: any) => s.value) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest("/profile/edit", {method: "POST",body: JSON.stringify(formData),});
      navigate("/profile");
    } catch {
      setError("Błąd zapisu zmian.");
    }
  };


  if (loading)
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="max-w-3xl mx-auto p-6 space-y-6">
        {/* zdjęcia */}
        <div className="carousel w-full rounded-lg overflow-hidden shadow-lg">
          {photos.map((url, index) => (
            <div
              id={`slide${index}`}
              key={index}
              className="carousel-item relative w-full"
            >
              <img
                src={url}
                className="w-full object-cover h-[300px] sm:h-[400px]"
                alt={`Zdjęcie ${index + 1}`}
              />
              <div className="absolute flex justify-between transform -translate-y-1/2 left-4 right-4 top-1/2">
                <a
                  href={`#slide${(index - 1 + photos.length) % photos.length}`}
                  className="btn btn-circle btn-sm"
                >
                  ❮
                </a>
                <a
                  href={`#slide${(index + 1) % photos.length}`}
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
                onChange={handleChange}
                placeholder="Login"
                className="input input-bordered w-full"
                required
              />
            </div>

            <div>
              <label className="label font-semibold">Płeć</label>
              <select
                name="sex"
                value={formData.sex}
                onChange={handleChange}
                className="select select-bordered w-full"
                required
              >
                <option value="">Wybierz płeć</option>
                {sexOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
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
                {preferenceOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label font-semibold">Lokalizacja</label>
              <input
                name="localization"
                value={formData.localization}
                onChange={handleChange}
                placeholder="Lokalizacja"
                className="input input-bordered w-full"
                required
              />
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
              options={hobbies}
              value={formData.hobbies.map((h) => ({ value: h, label: h }))}
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
