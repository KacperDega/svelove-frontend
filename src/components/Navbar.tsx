import React from "react";
import { NavLink } from "react-router-dom";

const Navbar: React.FC = () => {
  const navItems = [
    { to: "/dashboard", label: "🏠 Główna" },
    { to: "/matches", label: "🔥 Dopasowania" },
    { to: "/chat", label: "💬 Wiadomości" },
    { to: "/profile", label: "👤 Profil" },
    { to: "/profile/edit", label: "⚙️ Ustawienia" },
  ];

  return (
    <nav className="border-b border-secondary fixed bottom-0 left-0 right-0 flex justify-around p-4 text-sm shadow md:relative md:top-0 md:justify-start md:space-x-8 md:p-6 bg-neutral z-10">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end
          className={({ isActive }) =>
            `font-medium hover:brightness-125 ${
              isActive ? "text-primary font-bold" : "text-secondary"
            }`
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
};

export default Navbar;
