import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="navbar sticky bg-neutral shadow-lg px-4 top-0 z-50 border-b border-secondary justify-center h-[64px]">
      <div className="flex-grow-0">
        <span className="text-3xl font-teaspoon text-primary select-none">
          svelove
        </span>
      </div>
    </header>
  );
};

export default Header;
