import React from 'react';
import { Reading, Tag } from '../types';
import ReportTable from './ReportTable';
// Assure-toi que le service excelService utilise bien exceljs
import { generateFromTemplate } from '../services/excelService';

interface FinanceReportProps {
  readings: Reading[];
  tags: Tag[];
  // Ajout de operatorName pour le passer au template
  operatorName?: string; 
}

// Le mapping des tags vers les cellules de ton template Excel
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
  'PDB 3': 'F28',
  'PDB 5': 'F30',
  'EHT PDB': 'F34',
  'MLDB': 'F35',
  'PDB 1': 'F36',
  'Fire Water Pumps': 'F39',
  'AGBT 1': 'F41',
  'AGBT 2': 'F42',
};

const FinanceReport: React.FC<FinanceReportProps> = ({ 
  readings,
  tags,
  operatorName = '' // Valeur par défaut
}) => {

  // Nouvelle fonction pour télécharger le template Excel rempli
  const handleDownloadSheet = async () => {
    // Helper pour construire l'objet de remplacements
    const buildReplacements = () => {
      const replacements: Record<string, string | number> = {};
      const dateStr = new Date().toISOString().split('T')[0];
      replacements[cellMap.DATE] = dateStr;
      replacements[cellMap.OPERATOR] = operatorName || '';

      // Debug: vérifier la structure des readings et les clés
      console.log('readings:', readings);
      console.log('cellMap keys:', Object.keys(cellMap));

      // créer map par tagId (assure-toi que tagId correspond bien aux clefs de cellMap)
      const mapByTag = new Map(readings.map(r => [r.tagId, r.kwh ?? 0]));
      console.log('mapByTag keys:', Array.from(mapByTag.keys()));

      Object.entries(cellMap).forEach(([key, cell]) => {
        if (key === 'DATE' || key === 'OPERATOR') return;
        // tolérance: supporte aussi correspondance par name si nécessaire
        let val = mapByTag.get(key);
        if (val === undefined) {
          // essai par tag name (si readings utilisent un id différent)
          const found = readings.find(r => {
            // compare insensible à la casse et sans tirets/espaces
            const normalize = (s: string) => s?.toString().toLowerCase().replace(/[\s-]/g, '');
            return normalize(r.tagId) === normalize(key) || normalize((r as any).tagName || '') === normalize(key);
          });
          val = found ? (found.kwh ?? 0) : '';
        }
        const num = typeof val === 'number' ? val : parseFloat(String(val));
        replacements[cell] = Number.isFinite(num) ? num : (val ?? '');
      });

      // Debug: voir ce qu'on va écrire dans le template
      console.log('replacements:', replacements);
      return replacements;
    };

    try {
      const replacements = buildReplacements();
      await generateFromTemplate(
        '/Electrical Consumption.xlsx', // Chemin vers ton template dans le dossier public
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
            // L'onClick appelle maintenant la nouvelle fonction
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