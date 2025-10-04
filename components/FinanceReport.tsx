import React from 'react';
import { Reading, Tag } from '../types';
import ReportTable from './ReportTable';

interface FinanceReportProps {
  readings: Reading[];
  tags: Tag[];
}

const FinanceReport: React.FC<FinanceReportProps> = ({ 
  readings,
  tags,
}) => {
  const tagMap = new Map(tags.map(t => [t.id, t]));

  const generateCSVString = () => {
    const headers = ['Cabinet Tag', 'Area', 'KWH Value', 'Date', 'Submitted By'];
    const csvRows = [
      headers.join(','),
      ...readings.map(reading => {
        const tag = tagMap.get(reading.tagId);
        const date = new Date(reading.timestamp);
        return [
          `"${tag?.name ?? 'Unknown Tag'}"`,
          `"${tag?.area ?? 'Unknown Area'}"`,
          reading.kwh,
          date.toLocaleDateString(),
          `"${reading.submittedBy}"`
        ].join(',')
      })
    ];
    return csvRows.join('\n');
  };

  const handleDownloadCSV = () => {
    const csvString = generateCSVString();
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `electrical_log_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex flex-wrap justify-between items-center mb-4 border-b pb-2">
        <h2 className="text-xl font-bold text-brand-dark">Daily Readings Log</h2>
        <div className="flex items-center space-x-2 mt-2 sm:mt-0">
           <button
            onClick={handleDownloadCSV}
            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-brand-primary hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-secondary transition-colors"
          >
            Download Sheet
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <ReportTable readings={readings} tags={tags} />
      </div>
    </div>
  );
};

export default FinanceReport;