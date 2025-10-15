import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import placeholder from "../assets/image-placeholder.svg";

const UserMenu = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);
  const profilePhotoUrl = localStorage.getItem("profilePhotoUrl");

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    navigate("/");
  };

  const menuItems = [
    { label: "🪪 Mój profil", onClick: () => navigate("/profile") },
    { label: "📊 Statystyki", onClick: () => navigate("/profile/stats") },
    { label: "⚙️ Ustawienia", onClick: () => navigate("/profile/edit") },
    { label: "📸 Zarządzaj zdjęciami", onClick: () => navigate("/profile/edit/photos") },
    { label: "🚪 Wyloguj", onClick: handleLogout },
  ];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        className="btn btn-ghost btn-circle"
        onClick={() => setOpen((prev) => !prev)}
      >
        <img
          src={profilePhotoUrl || placeholder}
          alt="User avatar"
          className="h-8 w-8 rounded-full object-cover"
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 card bg-neutral shadow-lg z-50 border border-secondary">
          <div className="card-body p-2">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={item.onClick}
                className="w-full text-left px-3 py-2 rounded-lg text-neutral-content hover:bg-base-300 hover:text-base-content"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
