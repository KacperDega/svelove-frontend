import React from "react";
import { NavLink } from "react-router-dom";
import logo from "../assets/logo1.svg";

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
      <div className="hidden md:block mr-4">
        <img src={logo} alt="Logo" className="h-6 max-h-6 object-contain" />
      </div>
      
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end
          className={({ isActive }) =>
            `hover:brightness-125 ${
              isActive ? "text-primary font-bold" : "text-secondary font-medium"
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
