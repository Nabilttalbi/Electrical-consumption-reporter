import React, { useState, useEffect } from 'react';
import { Tag } from '../types';

interface DataEntryWizardProps {
  currentTag: Tag;
  currentKwhValue: string;
  onKwhChange: (tagId: string, value: string) => void;
  onNewReading: (tagId: string, kwh: number) => void;
  onNext: () => void;
  onPrevious: () => void;
  currentIndex: number;
  totalTags: number;
}

const DataEntryWizard: React.FC<DataEntryWizardProps> = ({
  currentTag,
  currentKwhValue,
  onKwhChange,
  onNewReading,
  onNext,
  onPrevious,
  currentIndex,
  totalTags,
}) => {
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Reset messages when tag changes, but not the value
  useEffect(() => {
    setError('');
    setSuccessMessage('');
  }, [currentTag]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const kwhValue = parseFloat(currentKwhValue);
    if (isNaN(kwhValue) || kwhValue < 0) {
      setError('Please enter a valid, non-negative KWH value.');
      return;
    }
    setError('');
    onNewReading(currentTag.id, kwhValue);
    setSuccessMessage(`Reading for ${currentTag.name} submitted successfully!`);

    // Automatically move to the next tag after submission for a smoother workflow
    setTimeout(() => {
      setSuccessMessage('');
      if (currentIndex < totalTags - 1) {
        onNext();
      }
    }, 1500);
  };

  return (
    <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-2xl transform transition-all">
      <div className="text-sm text-slate-500 mb-2">
        Step {currentIndex + 1} of {totalTags}
      </div>
      <div className="text-center mb-6">
        <p className="text-lg font-semibold text-slate-600">{currentTag.area}</p>
        <h2 className="text-4xl font-bold text-brand-primary">{currentTag.name}</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="kwh" className="block text-lg font-medium text-slate-700 text-center mb-2">
            Enter KWH Index Reading
          </label>
          <input
            type="number"
            id="kwh"
            value={currentKwhValue}
            onChange={(e) => onKwhChange(currentTag.id, e.target.value)}
            placeholder="Enter Value"
            className="text-center text-2xl mt-1 block w-full px-3 py-4 bg-slate-800 text-white border border-brand-secondary rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary"
            autoFocus
          />
        </div>
        
        {error && <p className="text-sm text-red-600 text-center">{error}</p>}
        {successMessage && <p className="text-sm text-green-600 text-center">{successMessage}</p>}

        <div className="pt-4 flex gap-2">
          <button
            type="button"
            onClick={onPrevious}
            disabled={currentIndex === 0}
            className="flex-1 py-3 rounded-md shadow-sm text-base font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          
          <button
            type="submit"
            disabled={!!successMessage || !currentKwhValue}
            className="flex-1 py-3 rounded-md shadow-sm text-base font-medium text-white bg-brand-secondary hover:bg-brand-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-secondary transition-colors disabled:bg-green-500 disabled:cursor-not-allowed"
          >
            {successMessage ? 'Submitted!' : 'Submit'}
          </button>

          <button
            type="button"
            onClick={onNext}
            disabled={currentIndex === totalTags - 1}
            className="flex-1 py-3 rounded-md shadow-sm text-base font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default DataEntryWizard;