import React from 'react';
import { Reading, Tag } from '../types';
import ReportTable from './ReportTable';
import { generateFromTemplate } from '../services/excelService';

interface FinanceReportProps {
  readings: Reading[];
  tags: Tag[];
  operatorName?: string;
}

const cellMap: Record<string, string> = {
  DATE: 'G4',
  OPERATOR: 'H4',
  'MCC REF': 'F6',
  'EHT-1': 'F7',
  'EHT-2': 'F8',
  'EHT-4': 'F9',
  'EHT-5': 'F10',
  'PDB 2': 'F11',
  'MCC HYD': 'F14',
  'EHT-HYD': 'F15',
  'MAR-MCC 05 PANEL': 'F17',
  'MCC-TF': 'F19',
  'EHT-3': 'F20',
  'MCC-ETP': 'F24',
  'PDB 4': 'F26',
  'Chaudière': 'F28',
  'PDB 3': 'F29',
  'PDB 5': 'F31',
  'EHT PDB': 'F35',
  'MLDB': 'F36',
  'PDB 1': 'F37',
  'Fire Water Pumps': 'F40',
  'AGBT 1': 'F42',
  'AGBT 2': 'F43',
  'LYDEC Global': 'F44',
};

const FinanceReport: React.FC<FinanceReportProps> = ({
  readings,
  tags,
  operatorName = '',
}) => {
  const handleDownloadSheet = async () => {
    const buildReplacements = () => {
      const replacements: Record<string, string | number> = {};
      const dateStr = new Date().toISOString().split('T')[0];
      replacements[cellMap.DATE] = dateStr;
      replacements[cellMap.OPERATOR] = operatorName;

      const todaysReadings = readings.filter(
        r => new Date(r.timestamp).toISOString().split('T')[0] === dateStr
      );

      const tagIdToName = new Map(tags.map(t => [t.id, t.name]));
      const mapByTagName = new Map(
        todaysReadings.map(r => [tagIdToName.get(r.tagId) ?? r.tagId, r.kwh ?? 0])
      );

      Object.entries(cellMap).forEach(([key, cell]) => {
        if (key === 'DATE' || key === 'OPERATOR') return;
        const val = mapByTagName.get(key);
        replacements[cell] = val !== undefined ? val : '';
      });

      return replacements;
    };

    try {
      const replacements = buildReplacements();
      await generateFromTemplate(
        '/Electrical Consumption.xlsx',
        replacements,
        `electrical_report_${new Date().toISOString().slice(0, 10)}.xlsx`
      );
    } catch (err) {
      console.error('Failed to generate excel from template', err);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex flex-wrap justify-between items-center mb-4 border-b pb-2">
        <h2 className="text-xl font-bold text-brand-dark">Daily Readings Log</h2>
        <div className="flex items-center space-x-2 mt-2 sm:mt-0">
          <button
            onClick={handleDownloadSheet}
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