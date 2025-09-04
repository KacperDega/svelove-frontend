import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import logo from "../assets/logo1.svg";

const Navbar: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;

  const navItems = [
    { to: "/dashboard", label: "🏠 Główna", isActive: () => path === "/dashboard" },
    { to: "/matches", label: "🔥 Dopasowania", isActive: () => path.startsWith("/matches") },
    { to: "/chat", label: "💬 Wiadomości", isActive: () => path.startsWith("/chat") },
    { to: "/profile", label: "👤 Profil", isActive: () => path.startsWith("/profile") && !path.startsWith("/profile/edit") },
    { to: "/profile/edit", label: "⚙️ Ustawienia", isActive: () => path.startsWith("/profile/edit") },
  ];

  return (
    <nav className="border-b border-secondary fixed bottom-0 left-0 right-0 flex justify-around p-4 text-sm shadow md:relative md:top-0 md:justify-start md:space-x-8 md:p-6 bg-neutral z-10">
      <div className="hidden md:block mr-4">
        <img src={logo} alt="Logo" className="h-6 max-h-6 object-contain" />
      </div>

      {navItems.map((item) => {
        const isActive = location.pathname.startsWith(item.to);
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={`hover:brightness-125 ${
              item.isActive() ? "text-primary font-bold" : "text-secondary font-medium"
            }`}
          >
            {item.label}
          </NavLink>
        );
      })}
    </nav>
  );
};

export default Navbar;
