'use client';

import React from 'react';

export default function DataTable({ headers = [], rows = [], title, actionLabel, onAction }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
      {(title || actionLabel) && (
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          {title && <h3 className="font-semibold text-white text-base">{title}</h3>}
          {actionLabel && (
            <button
              onClick={onAction}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition-all"
            >
              {actionLabel}
            </button>
          )}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
            <tr>
              {headers.map((h, idx) => (
                <th key={idx} className="px-6 py-3.5">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={headers.length} className="px-6 py-8 text-center text-slate-500 italic">
                  No records found.
                </td>
              </tr>
            ) : (
              rows.map((row, rIdx) => (
                <tr key={rIdx} className="hover:bg-slate-800/40 transition-all">
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="px-6 py-3.5 font-medium whitespace-nowrap">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
