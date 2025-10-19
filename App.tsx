import React, { useState, useEffect, useCallback } from 'react';
import { Reading } from './types';
import { TAG_MATRIX } from './constants';
import Header from './components/Header';
import LoginScreen from './components/LoginScreen';
import DataEntryWizard from './components/DataEntryWizard';
import FinanceReport from './components/FinanceReport';

type ViewMode = 'entry' | 'report';

const App: React.FC = () => {
  // State for user login
  const [operatorName, setOperatorName] = useState<string | null>(() => {
    return localStorage.getItem('operatorName');
  });

  // State for app view
  const [viewMode, setViewMode] = useState<ViewMode>('entry');

  // State for readings
  const [readings, setReadings] = useState<Reading[]>(() => {
    try {
      const savedReadings = localStorage.getItem('electricalReadings');
      // Sort readings by timestamp descending to show most recent first
      const parsedReadings = savedReadings ? JSON.parse(savedReadings) : [];
      return parsedReadings.sort((a: Reading, b: Reading) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } catch (error) {
      console.error("Could not parse localStorage readings:", error);
      return [];
    }
  });

  // State for the current data entry session
  const [sessionReadings, setSessionReadings] = useState<{ [tagId: string]: string }>({});

  // State for wizard position
  const [currentTagIndex, setCurrentTagIndex] = useState<number>(0);

  useEffect(() => {
    localStorage.setItem('electricalReadings', JSON.stringify(readings));
  }, [readings]);

  const handleLogin = (name: string) => {
    const today = new Date().toISOString().split('T')[0];
    
    try {
      const savedReadingsRaw = localStorage.getItem('electricalReadings');
      if (savedReadingsRaw) {
        const savedReadings: Reading[] = JSON.parse(savedReadingsRaw);
        if (savedReadings.length > 0) {
          // Readings are sorted descending, so the first one is the most recent
          const lastReading = savedReadings[0];
          const lastReadingDate = new Date(lastReading.timestamp).toISOString().split('T')[0];
          const lastOperator = lastReading.submittedBy;
          const currentOperator = name;

          // Clear readings if it's a new day OR a different operator logs in
          if (lastReadingDate !== today || lastOperator !== currentOperator) {
            setReadings([]);
            localStorage.removeItem('electricalReadings');
          }
        }
      }
    } catch (error) {
      console.error("Error processing readings on login:", error);
      // If there's an error, it's safer to clear the potentially corrupt data
      setReadings([]);
      localStorage.removeItem('electricalReadings');
    }

    setOperatorName(name);
    localStorage.setItem('operatorName', name);
  };

  const handleLogout = () => {
    setOperatorName(null);
    localStorage.removeItem('operatorName');
    // Clear all readings on logout
    setReadings([]);
    localStorage.removeItem('electricalReadings');
    setViewMode('entry');
    setCurrentTagIndex(0);
  };

  const handleToggleView = () => {
    setViewMode(prev => (prev === 'entry' ? 'report' : 'entry'));
  };

  const handleSessionReadingChange = (tagId: string, value: string) => {
    setSessionReadings(prev => ({
      ...prev,
      [tagId]: value,
    }));
  };

  const handleNewReading = useCallback((tagId: string, kwh: number) => {
    if (!operatorName) return;

    const newReading: Reading = {
      id: `reading-${tagId}-${new Date().toISOString()}`,
      tagId,
      kwh,
      timestamp: new Date().toISOString(),
      submittedBy: operatorName,
    };
    
    setReadings(prevReadings => {
      const otherReadings = prevReadings.filter(r => r.tagId !== tagId);
      const updatedReadings = [...otherReadings, newReading];
       // Re-sort after adding a new reading
      return updatedReadings.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    });
  }, [operatorName]);
  
  const handleNextTag = () => {
    setCurrentTagIndex(prevIndex => Math.min(prevIndex + 1, TAG_MATRIX.length - 1));
  };

  const handlePreviousTag = () => {
    setCurrentTagIndex(prevIndex => Math.max(prevIndex - 1, 0));
  };
  
  if (!operatorName) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  const currentTag = TAG_MATRIX[currentTagIndex];
  const currentKwhValue = sessionReadings[currentTag.id] ?? readings.find(r => r.tagId === currentTag.id)?.kwh.toString() ?? '';

  return (
    <div className="min-h-screen bg-brand-light text-brand-dark pb-20 sm:pb-0">
      <Header 
        operatorName={operatorName}
        viewMode={viewMode}
        onToggleView={handleToggleView}
        onLogout={handleLogout}
      />
      <main className="container mx-auto p-4 flex justify-center items-start pt-10">
        {viewMode === 'entry' ? (
          <DataEntryWizard
            currentTag={currentTag}
            currentKwhValue={currentKwhValue}
            onKwhChange={handleSessionReadingChange}
            onNewReading={handleNewReading}
            onNext={handleNextTag}
            onPrevious={handlePreviousTag}
            currentIndex={currentTagIndex}
            totalTags={TAG_MATRIX.length}
          />
        ) : (
          <div className="w-full max-w-6xl">
            <FinanceReport
              readings={readings}
              tags={TAG_MATRIX}
              operatorName={operatorName ?? ''}
            />
          </div>
        )}
      </main>

      {/* Mobile-only View Switcher Button */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-brand-light p-4 border-t border-slate-200 shadow-lg">
          <button
            onClick={handleToggleView}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-brand-secondary hover:bg-brand-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary transition-colors"
          >
            {viewMode === 'entry' ? 'View Report' : 'Back to Entry'}
          </button>
      </div>
    </div>
  );
};

export default App;