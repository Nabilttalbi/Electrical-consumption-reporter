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
            <div className="block">
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
              className="px-4 py-2 rounded bg-brand-secondary text-white font-semibold hover:bg-brand-primary transition-colors"
            >
              {viewMode === 'entry' ? 'View Report' : 'Back to Entry'}
            </button>
            <button
              onClick={onLogout}
              className="px-4 py-2 rounded bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors"
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