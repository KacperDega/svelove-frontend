import React, { useEffect, useState } from "react";
import { apiRequest } from "../api/index";
import { useNavigate } from "react-router-dom";
import { UserProfileDTO, emptyProfile } from "../types/UserProfileDTO";
import Navbar from "../components/Navbar";
import "../index.css";
import ErrorPopup from "../components/ErrorPopup";

const Profile: React.FC = () => {
  const [user, setUser] = useState<UserProfileDTO>(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showError, setShowError] = useState(true);
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
      <div className="flex flex-col min-h-screen bg-base-100">
        <Navbar />
        
        <div className="flex justify-center items-center flex-grow">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="max-w-5xl mx-auto p-6 space-y-6 w-full">
        <div className="grid grid-cols-1 md:grid-cols-[6fr_4fr] gap-6">
          
          {/* zdjecia */}
          <div className="carousel w-full rounded-lg overflow-hidden shadow-lg">
            {user.photoUrls.map((url, index) => (
              <div
                id={`slide${index}`}
                key={index}
                className="carousel-item relative w-full"
              >
                <img src={url} className="w-full object-cover h-[500px] sm:h-[600px]" alt={`Zdjęcie ${index + 1}`} />
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

          {/* dane */}
          <div className="card bg-neutral shadow-xl border border-secondary h-full flex flex-col justify-between">
            <div className="card-body flex flex-col h-full gap-4">
              <h2 className="card-title text-3xl font-bold text-primary">{user.username}</h2>

              <div className="text-neutral-content space-y-2">
                <p><span className="font-semibold">Login:</span> {user.login}</p>
                <p><span className="font-semibold">Płeć:</span> {user.sex}</p>
                <p><span className="font-semibold">Wiek:</span> {user.age}</p>
                <p><span className="font-semibold">Preferencje:</span> {user.preference}</p>
                <p><span className="font-semibold">Zakres wieku:</span> {user.age_min} - {user.age_max}</p>
                <p><span className="font-semibold">Lokalizacja:</span> {user.city}</p>
                <p><span className="font-semibold">Opis:</span> {user.description}</p>
              </div>

              <div>
                <p className="font-semibold text-neutral-content">Zainteresowania:</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {user.hobbies.map((hobby) => (
                    <span key={hobby} className="badge badge-primary badge-outline">
                      {hobby}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-base-content/10">
                <button
                  className="btn btn-secondary btn-outline w-full"
                  onClick={() => navigate("/profile/edit")}
                >
                  Edytuj profil
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>

    <ErrorPopup error={error} showError={showError} setShowError={setShowError}/>
  </div>
);

};

export default Profile;
