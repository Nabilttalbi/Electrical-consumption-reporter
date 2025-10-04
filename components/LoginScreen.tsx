import React, { useState } from 'react';
import { OPERATORS } from '../users';

interface LoginScreenProps {
  onLogin: (name: string) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin.trim()) {
      setError('PIN code is required.');
      return;
    }
    
    const operatorName = OPERATORS[pin.trim()];
    if (operatorName) {
      setError('');
      onLogin(operatorName);
    } else {
      setError('Invalid PIN code. Please try again.');
      setPin(''); // Clear the pin on error
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-sm p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <div className="flex justify-center">
            <img src="/WILMACO.png" alt="Wilmaco Logo" className="h-12 w-auto" />
        </div>
        <h2 className="text-2xl font-bold text-center text-brand-dark">
          Operator PIN Entry
        </h2>
        <p className="text-center text-sm text-slate-600">Please enter your 4-digit PIN to begin.</p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="pin" className="block text-sm font-medium text-slate-700 sr-only">
              PIN Code
            </label>
            <input
              id="pin"
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="mt-1 block w-full px-3 py-3 text-center text-2xl tracking-widest border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary"
              placeholder="••••"
              maxLength={4}
              autoComplete="off"
              autoFocus
              pattern="\d*"
            />
          </div>
          
          {error && <p className="text-sm text-red-600 text-center">{error}</p>}
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-primary hover:bg-brand-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-secondary transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginScreen;
