import React, { useEffect, useState } from "react";
import { apiRequest } from "../api/index";
import { useNavigate } from "react-router-dom";
import { UserProfileDTO, emptyProfile } from "../types/UserProfileDTO";
import Navbar from "../components/Navbar";
import "../index.css";

const Profile: React.FC = () => {
  const [user, setUser] = useState<UserProfileDTO>(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      setError(null);
      try {
        const data = await apiRequest<UserProfileDTO>("/profile");
        setUser(data);
      } catch (e: any) {
        setError("Błąd pobierania profilu.");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

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
          {user.photoUrls.map((url, index) => (
            <div
              id={`slide${index}`}
              key={index}
              className="carousel-item relative w-full"
            >
              <img src={url} className="w-full object-cover h-[300px] sm:h-[400px]" alt={`Zdjęcie ${index + 1}`} />
              <div className="absolute flex justify-between transform -translate-y-1/2 left-4 right-4 top-1/2">
                <a
                  href={`#slide${(index - 1 + user.photoUrls.length) % user.photoUrls.length}`}
                  className="btn btn-circle btn-sm"
                >
                  ❮
                </a>
                <a
                  href={`#slide${(index + 1) % user.photoUrls.length}`}
                  className="btn btn-circle btn-sm"
                >
                  ❯
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* {dane} */}
        <div className="card bg-neutral shadow-xl border border-secondary">
          <div className="card-body">
            <h2 className="card-title text-3xl mb-2 font-bold">{user.username}</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-base-content">
              <div>
                  <p><span className="font-semibold">Login:</span> {user.login}</p>
                  <p><span className="font-semibold">Płeć:</span> {user.sex}</p>
                  <p><span className="font-semibold">Wiek:</span> {user.age}</p>
              </div>
              <div>
                  <p><span className="font-semibold">Preferencje:</span> {user.preference}</p>
                  <p><span className="font-semibold">Preferowany zakres wieku:</span> {user.age_min} - {user.age_max}</p>
                  <p><span className="font-semibold">Lokalizacja:</span> {user.city}</p>
              </div>
            </div>

            <div className="mt-4">
              <p><span className="font-semibold">Opis:</span> {user.description}</p>
            </div>

            <div className="mt-4">
              <p className="font-semibold">Zainteresowania:</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {user.hobbies.map((hobby) => (
                  <span key={hobby} className="badge badge-primary badge-outline">
                    {hobby}
                  </span>
                ))}
              </div>
              
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            className="btn btn-secondary btn-outline w-full"
            onClick={() => navigate("/profile/edit")}
          >
            Edytuj profil
          </button>
        </div>

        {error && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 alert alert-error max-w-md mx-auto mt-8 z-50">
            <span>{error}</span>
          </div>
        )}

      </div>
    </div>
  );
};

export default Profile;
