import React, { useState, useEffect } from 'react';
import { Radio, Plus, ExternalLink, Globe } from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import api from '../services/api';

export const StatusPagesPage: React.FC = () => {
  const [pages, setPages] = useState<any[]>([]);
  const [apis, setApis] = useState<any[]>([]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [selectedApiIds, setSelectedApiIds] = useState<string[]>([]);

  const fetchStatusPages = async () => {
    try {
      const [pRes, apisRes]: any[] = await Promise.all([
        api.get('/status-pages'),
        api.get('/apis'),
      ]);
      if (pRes.success) setPages(pRes.data);
      if (apisRes.success) setApis(apisRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStatusPages();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/status-pages', {
        name,
        slug,
        description,
        apiIds: selectedApiIds,
      });
      setIsModalOpen(false);
      fetchStatusPages();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Public Status Pages</h1>
          <p className="text-xs text-slate-400 mt-1">
            Publish hosted operational status dashboards for customers and external stakeholders.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2 w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>New Status Page</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pages.map((sp) => (
          <div key={sp.id} className="bg-[#101F33] border border-[#182E4B] rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <Radio className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-100">{sp.name}</h3>
                  <p className="text-xs text-slate-400">{sp.description || 'Public status page'}</p>
                </div>
              </div>

              <a
                href={`/status/${sp.slug}`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <span>View Page</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="p-3 bg-[#0B1728] border border-[#182E4B] rounded-xl text-xs font-mono text-slate-300">
              <span className="text-slate-500 block text-[10px] uppercase font-sans font-semibold mb-1">
                Hosted Public URL:
              </span>
              <a href={`/status/${sp.slug}`} target="_blank" rel="noreferrer" className="text-blue-400 underline truncate block">
                {`${window.location.origin}/status/${sp.slug}`}
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* New Status Page Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Public Status Page"
        subtitle="Publish service availability page for customers."
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Status Page Title</label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setSlug(e.target.value.toLowerCase().replace(/[^a-z0-0]/g, '-'));
              }}
              placeholder="e.g. API Sentinel Platform Status"
              className="w-full px-3 py-2 bg-[#0B1728] border border-[#182E4B] rounded-lg text-sm text-slate-100"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">URL Slug</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="sentinel-status"
              className="w-full px-3 py-2 bg-[#0B1728] border border-[#182E4B] rounded-lg text-xs font-mono text-slate-100"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Select Displayed APIs</label>
            <div className="space-y-1.5 max-h-40 overflow-y-auto custom-scrollbar p-2 bg-[#0B1728] border border-[#182E4B] rounded-lg">
              {apis.map((a) => (
                <label key={a.id} className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedApiIds.includes(a.id)}
                    onChange={(e) => {
                      if (e.target.checked) setSelectedApiIds([...selectedApiIds, a.id]);
                      else setSelectedApiIds(selectedApiIds.filter((id) => id !== a.id));
                    }}
                    className="rounded bg-[#07111F] border-[#182E4B]"
                  />
                  <span>{a.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#182E4B]">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-[#0B1728] text-slate-300 rounded-lg text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold"
            >
              Publish Status Page
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
