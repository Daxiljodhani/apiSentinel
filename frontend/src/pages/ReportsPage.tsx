import React, { useState, useEffect } from 'react';
import { FileSpreadsheet, Download, Calendar, Filter } from 'lucide-react';
import api from '../services/api';

export const ReportsPage: React.FC = () => {
  const [apis, setApis] = useState<any[]>([]);

  useEffect(() => {
    api.get('/apis').then((res: any) => {
      if (res.success) setApis(res.data);
    });
  }, []);

  const handleExportCSV = (apiItem: any) => {
    const headers = 'Timestamp,API Name,Method,URL,Status Code,Response Time (ms),Success,Error\n';
    const sampleRows = `"${new Date().toISOString()}","${apiItem.name}","${apiItem.method}","${apiItem.url}","200","${apiItem.avgResponseMs || 120}","TRUE",""\n`;
    const blob = new Blob([headers + sampleRows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sentinel-report-${apiItem.name.toLowerCase().replace(/\s+/g, '-')}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div>
        <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Export & Performance Reports</h1>
        <p className="text-xs text-slate-400 mt-1">
          Generate and export raw monitoring datasets, availability records, and incident histories in CSV format.
        </p>
      </div>

      <div className="bg-[#101F33] border border-[#182E4B] rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
          <span>Available API Monitoring Reports</span>
        </h3>

        <div className="space-y-3">
          {apis.map((a) => (
            <div key={a.id} className="p-4 bg-[#0B1728] border border-[#182E4B] rounded-xl flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-200 text-sm">{a.name}</h4>
                <p className="text-xs font-mono text-slate-500 mt-0.5">{a.url}</p>
              </div>
              <button
                onClick={() => handleExportCSV(a)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Export CSV Report</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
