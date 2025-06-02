import React from "react";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-base-100 text-base-content font-sans">
      {/* Pasek nawigacji */}
      <nav className="fixed bottom-0 left-0 right-0 flex justify-around p-4 text-sm shadow md:relative md:top-0 md:justify-start md:space-x-8 md:p-6 bg-neutral">
        <a href="#" className="font-bold text-primary">
          🏠 Główna
        </a>
        <a href="#" className="hover:brightness-125 text-secondary font-medium">
          🔥 Dopasowania
        </a>
        <a href="#" className="hover:brightness-125 text-secondary font-medium">
          💬 Wiadomości
        </a>
        <a href="#" className="hover:brightness-125 text-secondary font-medium">
          👤 Profil
        </a>
        <a href="#" className="hover:brightness-125 text-secondary font-medium">
          ⚙️ Ustawienia
        </a>
      </nav>

      <main className="mx-auto mt-6 mb-20 max-w-3xl space-y-8 p-6 md:mb-6">
        {/* Powitanie */}
        <section className="rounded-lg bg-neutral p-6 shadow">
          <h1 className="text-3xl font-bold text-primary">Cześć, Ania! 👋</h1>
          <p className="text-base-content/70">
            Masz <span className="font-semibold text-secondary">3 nowe dopasowania</span> i{" "}
            <span className="font-semibold text-secondary">1 nową wiadomość</span>.
          </p>
        </section>

        {/* Szybkie akcje */}
        <section className="rounded-lg bg-neutral p-6 shadow">
          <h2 className="mb-5 text-2xl font-semibold text-primary">Szybkie akcje</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <button className="btn btn-primary">🔥 Dopasowania</button>
            <button className="btn btn-info">💬 Wiadomości</button>
            <button className="btn btn-success">📝 Uzupełnij profil</button>
            <button className="btn btn-warning">📸 Dodaj zdjęcie</button>
          </div>
        </section>

        {/* Ostatnie aktywności / Ostatnie powiadomienia*/}
        <section className="rounded-lg bg-neutral p-6 shadow">
          <h2 className="mb-2 text-2xl font-semibold text-primary">Ostatnie aktywności</h2>
          <ul className="space-y-2">
            <li>
              ❤️ <strong>Kamil</strong> polubił Twój profil
            </li>
            <li>
              👀 <strong>Ola</strong> odwiedziła Twój profil
            </li>
            <li>
              📨 Masz wiadomość od <strong>Michał</strong>
            </li>
          </ul>
        </section>

        {/* Status konta ???? */}
        <section className="rounded-lg bg-neutral p-6 shadow">
          <h2 className="mb-2 text-2xl font-semibold text-primary">Status konta</h2>
          <p className="mb-2 text-base-content/70">
            Twój profil jest uzupełniony w <strong>60%</strong>
          </p>
          <progress className="progress progress-secondary w-full h-4" value={60} max={100} />
          <a href="#" className="mt-2 inline-block link link-secondary">
            Uzupełnij brakujące informacje
          </a>
        </section>

        {/* Co nowego ???? */}
        <section className="rounded-lg bg-neutral p-6 shadow">
          <h2 className="mb-2 text-2xl font-semibold text-primary">Co nowego?</h2>
          <div className="space-y-2 text-base-content/80">
            <p>
              🆕 <strong>Nowość:</strong> Zobacz ostatnie wydarzenia w sekcji{" "}
              <strong>Ostatnie Aktywności</strong>!
            </p>
            <p>
              💡 <strong>Tip:</strong> Dodaj uśmiechnięte zdjęcie – zwiększasz szansę na match!
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
