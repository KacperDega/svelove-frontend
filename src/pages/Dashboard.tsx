import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import ErrorPopup from "../components/ErrorPopup";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api/apiRequest";
import { DashboardDto } from "../types";
import imagePlaceholder from "../assets/image-placeholder.svg";

function pluralize(count: number, forms: [string, string, string]) {
  if (count === 1) return forms[0];
  if (count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 10 || count % 100 >= 20)) {
    return forms[1];
  }
  return forms[2];
}

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showError, setShowError] = useState(true);
  const navigate = useNavigate();

  
  async function fetchDashboard() {
    setLoading(true);
    setError(null);
    try {
      const dto = await apiRequest<DashboardDto>("/dashboard");
      setData(dto);
    } catch (err: any) {
      console.error("Error fetching dashboard:", err);
      setError("Błąd podczas ładowania danych");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDashboard();
  }, []);

  // LOADING SCREEN
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-base-100 text-base-content font-sans">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="loading loading-spinner text-primary w-10 h-10 mb-4"></div>
            <p className="text-lg font-medium text-base-content/80">Ładowanie danych...</p>
          </div>
        </main>
        <ErrorPopup error={error} showError={!!error} setShowError={setShowError} />
      </div>
    );
  }

  const {
    username = "",
    profilePictureUrl = undefined,
    newMatchesCount = 0,
    newMessagesCount = 0,
    notifications = [],
    currentMonthStats = { leftSwipes: 0, rightSwipes: 0, matches: 0 },
  } = data ?? {};

  return (
    <div className="min-h-screen bg-base-100 text-base-content font-sans">
      <Navbar />

      <div className="relative">
        <main className={`mx-auto mt-6 mb-20 max-w-3xl space-y-8 p-6 md:mb-6 ${error ? "blur-sm pointer-events-none" : ""}`}>
          {/* Powitanie */}
          <section className="rounded-lg bg-neutral p-6 shadow-md shadow-secondary/50 border border-secondary/50">
            <div className="flex items-center space-x-4">
              <img
                src={profilePictureUrl ?? imagePlaceholder}
                alt="Zdjęcie profilowe"
                className="w-16 h-16 rounded-full object-cover border border-base-300"
              />
              <div>
                <h1 className="text-3xl font-bold text-neutral-content">Cześć, <span className="text-primary">{username}</span> 👋</h1>
                <p className="text-neutral-content">
                  Masz{" "}
                  <span className="font-semibold text-secondary">
                    {newMatchesCount} {pluralize(newMatchesCount, ["nowe dopasowanie", "nowe dopasowania", "nowych dopasowań"])}
                  </span>{" "}
                  i{" "}
                  <span className="font-semibold text-secondary">
                    {newMessagesCount} {pluralize(newMessagesCount, ["nową wiadomość", "nowe wiadomości", "nowych wiadomości"])}
                  </span>.
                </p>
              </div>
            </div>
          </section>

          {/* Szybkie akcje */}
          <section className="rounded-lg bg-neutral p-6 shadow-md shadow-secondary/50 border border-secondary/50">
            <h2 className="mb-5 text-2xl font-semibold text-primary">🚀 Szybkie akcje</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <button className="btn btn-primary" onClick={() => navigate("/matches")}>
                🔥 Dopasowania
              </button>
              <button className="btn btn-info" onClick={() => navigate("/chat")}>
                💬 Wiadomości
              </button>
              <button className="btn btn-success" onClick={() => navigate("/profile")}>
                👤 Twój profil
              </button>
              <button className="btn btn-warning" onClick={() => navigate("/profile/edit/photos")}>
                📸 Edytuj zdjęcia
              </button>
            </div>
          </section>

          {/* Ostatnie powiadomienia */}
          <section className="rounded-lg bg-neutral p-6 shadow-md shadow-secondary/50 border border-secondary/50">
            <h2 className="mb-2 text-2xl font-semibold text-primary">⏰ Ostatnie aktywności</h2>
            <ul className="space-y-2 text-neutral-content">
              {notifications.map((n) => {
                let emoji = "";
                if (n.type === "NEW_MATCH") {
                  emoji = "❤️";
                } else if (n.type === "NEW_CONVERSATION") {
                  emoji = "📝";
                } else {
                  emoji = "🔔";
                }

                const words = n.message.trim().split(" ");
                const username = words.pop(); // ostatnie słowo to nazwa użytkownika
                const messageWithoutUsername = words.join(" ");

                return (
                  <li key={n.id}>
                    <span>{emoji} {messageWithoutUsername}</span> <strong className="text-secondary">{username}</strong>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* Statystyki miesięczne */}
          <section className="rounded-lg bg-neutral p-6 shadow-md shadow-secondary/50 border border-secondary/50">
            <h2 className="mb-2 text-2xl font-semibold text-primary">📊 Statystyki aktualnego miesiąca</h2>
            <div className="flex space-x-8 text-neutral-content justify-between px-6">
              <div className="flex items-center">
                <span className="text-3xl mr-2">⬅️</span>
                <div>
                  <p className="font-semibold">Swipe w lewo:</p>
                  <p className="text-center text-lg font-bold text-error">{currentMonthStats.leftSwipes}</p>
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-3xl mr-2">➡️</span>
                <div>
                  <p className="font-semibold">Swipe w prawo:</p>
                  <p className="text-center text-lg font-bold text-success">{currentMonthStats.rightSwipes}</p>
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-3xl mr-2">❤️</span>
                <div>
                  <p className="font-semibold">Matchy:</p>
                  <p className="text-center text-lg font-bold text-primary">{currentMonthStats.matches}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Co nowego? */}
          <section className="rounded-lg bg-neutral p-6 shadow-md shadow-secondary/50 border border-secondary/50">
            <h2 className="mb-2 text-2xl font-semibold text-primary">✨ Co nowego?</h2>
            <div className="space-y-2 text-neutral-content">
              <p>
                🆕 <strong className="text-info">Nowość:</strong> Zobacz swoje statystyki dopasowań w sekcji&nbsp;
                <strong onClick={() => navigate("/profile/stats")} className="cursor-pointer hover:underline text-info">
                  📊 Statystyki
                </strong>
                !
              </p>
              <p>
                💡 <strong className="text-warning">Tip:</strong> Dodaj uśmiechnięte zdjęcie - zwiększasz szansę na match! 😊
              </p>
            </div>
          </section>
        </main>

        <ErrorPopup error={error} showError={showError} setShowError={setShowError} />

        {error && (
          <div className="absolute inset-0 z-40 bg-base-100/60 backdrop-blur-md flex items-center justify-center pointer-events-auto">
            <div className="text-center bg-neutral p-6 rounded-lg shadow-lg z-50 max-w-md mx-auto">
              <div className="text-4xl mb-2">😔</div>
              <h2 className="text-xl font-semibold text-primary mb-2">
                Coś poszło nie tak
              </h2>
              <p className="text-base text-base-content/80 mb-4">
                {error ||
                  "Wystąpił problem podczas ładowania danych. Spróbuj ponownie."}
              </p>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setError(null);
                  fetchDashboard();
                }}
              >
                Spróbuj ponownie
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
