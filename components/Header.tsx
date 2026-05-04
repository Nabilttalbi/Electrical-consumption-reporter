import React from 'react';

interface HeaderProps {
  operatorName: string;
  viewMode: 'entry' | 'report';
  onToggleView: () => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ operatorName, viewMode, onToggleView, onLogout }) => {
  return (
    <header className="bg-brand-primary shadow-lg">
      <div className="container mx-auto px-4 lg:px-8 py-3">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center">

          {/* Left: Logo */}
          <div className="flex items-center">
            <img src="/WILMACO.png" alt="Wilmaco Logo" className="h-5 w-auto" />
          </div>

          {/* Center: Title + operator */}
          <div className="text-center">
            <h1 className="text-sm font-bold text-white tracking-wide leading-tight whitespace-nowrap">
              Electrical Reporting
            </h1>
            <p className="text-xs text-brand-secondary font-semibold whitespace-nowrap">{operatorName}</p>
          </div>

          {/* Right: Controls */}
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={onToggleView}
              className="hidden sm:block px-3 py-1.5 text-xs font-semibold rounded-lg text-brand-primary bg-brand-light hover:brightness-95 transition"
            >
              {viewMode === 'entry' ? 'View Report' : 'Back to Entry'}
            </button>
            <button
              onClick={onLogout}
              className="flex items-center justify-center px-10 py-1.5 rounded-lg text-white bg-red-500 hover:bg-red-600 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
              </svg>
              <span className="hidden sm:inline ml-1.5 text-xs font-semibold">Logout</span>
            </button>
          </div>

        </div>
      </div>
      {/* Gold accent line */}
      <div className="h-0.5 bg-brand-secondary" />
    </header>
  );
};

export default Header;