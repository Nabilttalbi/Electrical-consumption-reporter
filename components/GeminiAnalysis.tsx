import React from 'react';

interface GeminiAnalysisProps {
  analysis: string;
  isLoading: boolean;
  error: string | null;
}

const GeminiAnalysis: React.FC<GeminiAnalysisProps> = ({ analysis, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="my-4 p-4 border border-brand-secondary bg-brand-light rounded-lg animate-pulse">
        <p className="text-sm text-brand-primary">Communicating with Gemini AI... Please wait for the analysis.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-4 p-4 border border-red-200 bg-red-50 rounded-lg">
        <h4 className="font-bold text-red-800">Analysis Error</h4>
        <p className="text-sm text-red-700">{error}</p>
      </div>
    );
  }

  if (!analysis) {
    return null; // Don't render anything if there's no analysis, error, or loading state
  }
  
  // Basic markdown-like formatting for newlines
  const formattedAnalysis = analysis.split('\n').map((line, index) => (
    <React.Fragment key={index}>
      {line}
      <br />
    </React.Fragment>
  ));

  return (
    <div className="my-4 p-4 border border-brand-secondary bg-brand-light rounded-lg">
      <h4 className="font-bold text-brand-primary mb-2">✨ AI-Powered Consumption Analysis</h4>
      <div className="text-sm text-brand-dark whitespace-pre-wrap">{formattedAnalysis}</div>
    </div>
  );
};

export default GeminiAnalysis;