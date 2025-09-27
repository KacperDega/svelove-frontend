import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import logo from "../assets/logo1.svg";
import NotificationsMenu from "./NotificationsMenu";
import UserMenu from "./UserMenu";

const Navbar: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;

  const navItems = [
    { to: "/dashboard", label: "🏠 Strona Główna", isActive: () => path === "/dashboard" },
    { to: "/matches", label: "🔥 Dopasowania", isActive: () => path.startsWith("/matches") },
    { to: "/chat", label: "💬 Wiadomości", isActive: () => path.startsWith("/chat") },
    { to: "/profile", label: "🪪 Profil", isActive: () => path.startsWith("/profile") && !path.startsWith("/profile/edit") },
    // { to: "/profile/stats", label: "📊 Statystyki", isActive: () => path.startsWith("/profile/stats") },  
    // { to: "/profile/edit", label: "⚙️ Ustawienia", isActive: () => path.startsWith("/profile/edit") },
  ];

  return (
    <nav className="border-b border-secondary fixed bottom-0 left-0 right-0 flex items-center justify-between h-[73px] px-4 text-sm shadow bg-neutral z-10
                    md:relative md:top-0 md:px-6">

      <div className="hidden md:block">
        <img src={logo} alt="Logo" className="h-6 object-contain" />
      </div>

      <div className="absolute left-1/2 -translate-x-1/2 flex space-x-6">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={`hover:brightness-125 ${
              item.isActive() ? "text-primary font-bold" : "text-secondary font-medium"
            }`}
          >
            {item.label}
          </NavLink>
        ))}
      </div>

      <div className="hidden md:flex items-center gap-4">
        <NotificationsMenu />
        <UserMenu />
      </div>
    </nav>
  );
};

export default Navbar;
