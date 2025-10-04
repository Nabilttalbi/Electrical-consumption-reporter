import React from 'react';
import { Reading, Tag } from '../types';

interface ReportTableProps {
  readings: Reading[];
  tags: Tag[];
}

const ReportTable: React.FC<ReportTableProps> = ({ readings, tags }) => {
  const tagMap = new Map(tags.map(t => [t.id, t]));

  if (readings.length === 0) {
    return (
      <div className="mt-4 text-center py-10 px-4 bg-slate-50 rounded-lg">
        <h3 className="text-lg font-medium text-slate-700">No Readings Yet</h3>
        <p className="text-sm text-slate-500">Go to the data entry view to submit the first reading.</p>
      </div>
    );
  }

  return (
    <div className="mt-4">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Cabinet Tag
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                KWH Value
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Submitted By
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {readings.map((reading) => {
              const tag = tagMap.get(reading.tagId);
              const date = new Date(reading.timestamp);
              return (
                <tr key={reading.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                    {tag?.name ?? 'Unknown'}
                    <span className="block text-xs text-slate-500">{tag?.area ?? 'Unknown'}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-brand-primary">
                    {reading.kwh.toLocaleString()}
                  </td>
                   <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {date.toLocaleDateString()}
                  </td>
                   <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {reading.submittedBy}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
    </div>
  );
};

export default ReportTable;