import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Sex, Preference } from "../types/enums";
import { apiRequest } from "../api/apiRequest";
import ErrorPopup from "../components/ErrorPopup";

interface MatchProfile {
  id: number;
  username: string;
  sex: Sex;
  age: number;
  localization: string;
  preference: Preference;
  hobbies: string[];
  description: string;
  photoUrls: string[];
}

const translateSex = (sex: Sex) => {
  switch (sex) {
    case Sex.Male:
      return "Mężczyzna";
    case Sex.Female:
      return "Kobieta";
    default:
      return "Inna / Nieokreślona";
  }
};

const translatePreference = (preference: Preference) => {
  switch (preference) {
    case Preference.Men:
      return "Mężczyzn";
    case Preference.Women:
      return "Kobiet";
    case Preference.Both:
      return "Mężczyzn i Kobiet";
    default:
      return "Inne / Brak preferencji";
  }
};

const Matches = () => {
  const [matches, setMatches] = useState<MatchProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [likeLoading, setLikeLoading] = useState(false);
  const [showError, setShowError] = useState(true);

  useEffect(() => {
    if (error) {
      setShowError(true);

      const startFadeTimer = setTimeout(() => setShowError(false), 4500);
      const clearTimer = setTimeout(() => setError(null), 5000);

      return () => {
        clearTimeout(startFadeTimer);
        clearTimeout(clearTimer);
      };
    }
  }, [error]);

  const fetchMatches = async () => {
    try {
      const data = await apiRequest<MatchProfile[]>("/matches/potential");
      setMatches((prev) => [...prev, ...data]);
    } catch (e) {
      setError("Błąd ładowania dopasowań.");
    }
  };

  useEffect(() => {
    fetchMatches().finally(() => setLoading(false));
  }, []);

  const preloadImage = (url: string) =>
  new Promise<void>((resolve, reject) => {
    const img = new Image();
    img.src = url;
    img.onload = () => resolve();
    img.onerror = () => reject();
  });

  const handleSkip = () => {
    const nextMatch = matches[1];

    setMatches((prev) => prev.slice(1));

    if (matches.length < 6) fetchMatches();

    if (nextMatch) {
      preloadImage(nextMatch.photoUrls[0]);
    }
  };

  const handleLike = async () => {
    const likedUser = matches[0];
    setLikeLoading(true);
    try {
      await apiRequest<string>(`/matches/like/${likedUser.id}`, { method: "POST" });
      handleSkip();
    } catch (e) {
      console.error(e);
      setError("BŁĄD: Nie udało się polubić.");
    } finally {
    setLikeLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        
        <div className="flex justify-center items-center flex-grow">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </div>
    );

  const current = matches[0];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1 items-center justify-center bg-base-100 px-4 py-8">
        {current ? (
          <div className="card w-full max-w-2xl bg-neutral shadow-2xl border border-secondary">
            <figure className="h-[550px] overflow-hidden">
              <img
                src={current.photoUrls[0]}
                alt={current.username}
                className="object-cover w-full h-full"
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title text-3xl text-primary flex items-end gap-2">
                {current.username}, {current.age}
                <span className="text-primary text-lg">
                  ({translateSex(current.sex)} → {translatePreference(current.preference)})
                </span>
              </h2>

              <p className="text-lg">
                <strong className="text-primary">Miasto:</strong> {current.localization}
              </p>
              <p className="text-lg">
                <strong className="text-primary">Zainteresowania:</strong>{" "}
                {current.hobbies.join(", ")}
              </p>
              <p className="text-lg font-medium italic mt-2 text-secondary">
                {current.description}
              </p>

              <div className="card-actions justify-between mt-6 mx-4">
                <button
                  onClick={handleSkip}
                  disabled={likeLoading}
                  className={`btn btn-outline btn-secondary btn-wide text-lg ${likeLoading ? "opacity-50 pointer-events-none" : ""}`}
                >
                  Pomiń ▷▷
                </button>
                <button
                  onClick={handleLike}
                  disabled={likeLoading}
                  className={`btn btn-primary btn-wide text-lg ${likeLoading ? "opacity-50 pointer-events-none" : ""}`}
                >
                  Polub ✓
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center px-4">
            <div className="text-6xl mb-4">😔</div>
            <h2 className="text-2xl font-semibold text-primary mb-2">Brak nowych dopasowań</h2>
            <p className="text-lg text-base-content">
              Wygląda na to, że nie ma więcej osób do wyświetlenia.<br />
              Spróbuj ponownie za jakiś czas lub zaktualizuj swoje preferencje!
            </p>
          </div>
        )}
      </div>

      <ErrorPopup error={error} showError={showError} setShowError={setShowError}/>
    </div>
  );
};

export default Matches;
