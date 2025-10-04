import React from 'react';

interface HeaderProps {
  operatorName: string;
  viewMode: 'entry' | 'report';
  onToggleView: () => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ operatorName, viewMode, onToggleView, onLogout }) => {
  return (
    <header className="bg-brand-primary shadow-md">
      <div className="container mx-auto px-4 lg:px-8 py-2">
        <div className="flex items-center justify-between">
          {/* Left: Logo & Operator */}
          <div className="flex items-center space-x-4">
            <img src="/WILMACO.png" alt="Wilmaco Logo" className="h-5 w-auto" />
            <div className="hidden sm:block">
              <p className="text-sm text-brand-light">Operator</p>
              <p className="font-semibold text-white">{operatorName}</p>
            </div>
          </div>

          {/* Center: Title */}
          <div className="hidden lg:block text-center absolute left-1/2 -translate-x-1/2">
              <h1 className="text-xl font-bold text-white tracking-tight">
                Electrical Consumption Reporting
              </h1>
              <p className="text-brand-light text-xs">Automated Daily Log</p>
          </div>

          {/* Right: Controls */}
          <div className="flex items-center space-x-2">
             <button
              onClick={onToggleView}
              className="px-3 py-2 border border-transparent text-sm font-medium rounded-md text-brand-primary bg-brand-light hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-secondary transition"
            >
              {viewMode === 'entry' ? 'View Report' : 'Back to Entry'}
            </button>
            <button
              onClick={onLogout}
              className="px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;