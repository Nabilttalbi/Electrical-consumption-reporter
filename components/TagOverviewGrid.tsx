import React from 'react';
import { Tag, Reading } from '../types';

interface TagOverviewGridProps {
  tags: Tag[];
  readings: Reading[];
}

const TagOverviewGrid: React.FC<TagOverviewGridProps> = ({ tags, readings }) => {
  const today = new Date().toISOString().split('T')[0];
  const submittedCount = readings.filter(
    r => new Date(r.timestamp).toISOString().split('T')[0] === today
  ).length;
  const totalCount = tags.length;
  const allDone = submittedCount === totalCount;
  const progressPct = Math.round((submittedCount / totalCount) * 100);

  return (
    <div className="w-full bg-white rounded-xl shadow-md px-4 py-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-brand-dark">Daily Progress</span>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${allDone ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
          {submittedCount} / {totalCount}
        </span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full transition-all duration-500 ${allDone ? 'bg-green-500' : 'bg-brand-secondary'}`}
          style={{ width: `${progressPct}%` }}
        />
      </div>
    </div>
  );
};

export default TagOverviewGrid;
