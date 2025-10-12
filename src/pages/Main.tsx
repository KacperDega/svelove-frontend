import React, { useRef } from 'react';
import { useNavigate } from "react-router-dom";
import Header from '../components/Header';

const features = [
  {
    icon: "❤️",
    title: "Inteligentne Dopasowania",
    description: "Nasz algorytm łączy Cię z osobami o podobnych zainteresowaniach i wartościach.",
  },
  {
    icon: "🔒",
    title: "Bezpieczeństwo i Prywatność",
    description: "Twoje dane są u nas bezpieczne. Rozmawiaj swobodnie w naszym szyfrowanym czacie.",
  },
  {
    icon: "✨",
    title: "Nowoczesny Design",
    description: "Ciesz się intuicyjnym i przyjemnym dla oka interfejsem, który ułatwia nawigację.",
  },
];

const Main = () => {
  const navigate = useNavigate();
  const featuresRef = useRef<HTMLElement>(null);

  const scrollToFeatures = () =>
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });

  const scrollToTop = () =>
    window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div className="min-h-screen font-sans">
      <Header />

      <main className="hero min-h-[calc(100vh-64px)] bg-base-100 border-b border-secondary">
        <div className="hero-content text-center">
          <div className="max-w-2xl flex flex-col items-center">
            <p className="text-9xl pb-4 font-teaspoon text-primary select-none mb-4">svelove</p>
            <h1 className="text-4xl md:text-5xl pb-3 font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Odkryj nowe znajomości.
            </h1>
            <p className="py-6 text-lg text-base-content/80">
              Dołącz do svelove, nowoczesnej platformy randkowej, która pomoże Ci znaleźć idealnego partnera. Prosto, szybko i przyjemnie.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button className="btn btn-primary btn-lg shadow-lg" onClick={() => navigate("/register")}>
                Zacznij swoją przygodę
              </button>
              <button className="btn btn-secondary btn-lg shadow-lg" onClick={() => navigate("/login")}>
                Zaloguj się
              </button>
            </div>

            <button className="btn btn-circle btn-ghost animate-bounce" onClick={scrollToFeatures}>
              <span className="text-3xl text-accent">⯆</span>
            </button>
          </div>
        </div>
      </main>

      <section className="py-20 bg-base-100" ref={featuresRef}>
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-12 text-primary">
            Dlaczego <span className="font-teaspoon">svelove</span>?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map(({ icon, title, description }) => (
              <div key={title} className="p-6 bg-base-200 rounded-lg shadow-md">
                <div className="text-5xl mb-4">{icon}</div>
                <h3 className="text-2xl font-semibold mb-2">{title}</h3>
                <p>{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-base-100 flex justify-center">
        <button className="btn btn-circle btn-ghost animate-bounce" onClick={scrollToTop}>
          <span className="text-3xl text-accent">⯅</span>
        </button>
      </section>

      <footer className="footer footer-center p-4 bg-base-200 text-base-content">
        <div>
          <p>
            Copyright © {new Date().getFullYear()} - Wszelkie prawa zastrzeżone przez svelove
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Main;
