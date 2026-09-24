import React, { useState, useEffect } from 'react';
import { FolderGit2, Plus, Layers, Eye, EyeOff, Lock, Key } from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import api from '../services/api';

export const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [environments, setEnvironments] = useState<any[]>([]);
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});

  // Modal State
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isVarModalOpen, setIsVarModalOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectDesc, setProjectDesc] = useState('');

  const [selectedEnvId, setSelectedEnvId] = useState('');
  const [varKey, setVarKey] = useState('');
  const [varValue, setVarValue] = useState('');
  const [isSecret, setIsSecret] = useState(false);

  const fetchProjectsData = async () => {
    try {
      const [pRes, eRes]: any[] = await Promise.all([
        api.get('/projects'),
        api.get('/environments'),
      ]);
      if (pRes.success) setProjects(pRes.data);
      if (eRes.success) setEnvironments(eRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProjectsData();
  }, []);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/projects', { name: projectName, description: projectDesc });
      setProjectName('');
      setProjectDesc('');
      setIsProjectModalOpen(false);
      fetchProjectsData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddVariable = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/environments/variables', {
        environmentId: selectedEnvId,
        key: varKey,
        value: varValue,
        isSecret,
      });
      setVarKey('');
      setVarValue('');
      setIsVarModalOpen(false);
      fetchProjectsData();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleSecret = (id: string) => {
    setShowSecrets((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const maskValue = (val: string) => {
    if (val.length <= 8) return '••••••••';
    return `${val.substring(0, 4)}••••••••${val.substring(val.length - 4)}`;
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Projects & Environments</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage logical project boundaries and environment variables (e.g., {'{{BASE_URL}}'}, {'{{API_KEY}}'}).
          </p>
        </div>
        <button
          onClick={() => setIsProjectModalOpen(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2 w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Projects List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((proj) => (
          <div key={proj.id} className="bg-[#101F33] border border-[#182E4B] rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                  <FolderGit2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-100">{proj.name}</h3>
                  <p className="text-xs text-slate-400">{proj.description || 'No description'}</p>
                </div>
              </div>
              <span className="text-xs font-mono text-slate-400 bg-[#0B1728] px-2.5 py-1 rounded-lg border border-[#182E4B]">
                {proj._count?.apis || 0} APIs
              </span>
            </div>

            {/* Environments & Variables */}
            <div className="space-y-3 pt-3 border-t border-[#182E4B]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Environments</span>
                </span>
              </div>

              {proj.environments?.map((envItem: any) => (
                <div key={envItem.id} className="p-3 bg-[#0B1728] border border-[#182E4B] rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">{envItem.name}</span>
                    <button
                      onClick={() => {
                        setSelectedEnvId(envItem.id);
                        setIsVarModalOpen(true);
                      }}
                      className="text-[11px] text-blue-400 hover:text-blue-300 font-semibold"
                    >
                      + Add Variable
                    </button>
                  </div>

                  {envItem.variables?.length > 0 ? (
                    <div className="space-y-1">
                      {envItem.variables.map((v: any) => (
                        <div key={v.id} className="flex items-center justify-between text-xs font-mono bg-[#07111F] px-2.5 py-1.5 rounded border border-[#182E4B]">
                          <span className="text-blue-400 font-bold">{`{{${v.key}}}`}</span>
                          <div className="flex items-center gap-2 text-slate-300">
                            <span>
                              {v.isSecret && !showSecrets[v.id] ? maskValue(v.value) : v.value}
                            </span>
                            {v.isSecret && (
                              <button
                                onClick={() => toggleSecret(v.id)}
                                className="text-slate-500 hover:text-slate-300"
                              >
                                {showSecrets[v.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-500 italic">No variables configured.</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* New Project Modal */}
      <Modal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        title="Create New Project"
        subtitle="Organize APIs under logic project namespaces."
      >
        <form onSubmit={handleCreateProject} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Project Name</label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="e.g. Payment Gateway Services"
              className="w-full px-3 py-2 bg-[#0B1728] border border-[#182E4B] rounded-lg text-sm text-slate-100"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Description</label>
            <input
              type="text"
              value={projectDesc}
              onChange={(e) => setProjectDesc(e.target.value)}
              placeholder="Optional notes regarding team ownership..."
              className="w-full px-3 py-2 bg-[#0B1728] border border-[#182E4B] rounded-lg text-sm text-slate-100"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-[#182E4B]">
            <button
              type="button"
              onClick={() => setIsProjectModalOpen(false)}
              className="px-4 py-2 bg-[#0B1728] text-slate-300 rounded-lg text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold"
            >
              Create Project
            </button>
          </div>
        </form>
      </Modal>

      {/* Add Variable Modal */}
      <Modal
        isOpen={isVarModalOpen}
        onClose={() => setIsVarModalOpen(false)}
        title="Add Environment Variable"
        subtitle="Variables can be referenced in API URLs like {{BASE_URL}}"
      >
        <form onSubmit={handleAddVariable} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Variable Key</label>
            <input
              type="text"
              value={varKey}
              onChange={(e) => setVarKey(e.target.value.toUpperCase())}
              placeholder="BASE_URL or API_KEY"
              className="w-full px-3 py-2 bg-[#0B1728] border border-[#182E4B] rounded-lg text-sm text-slate-100 font-mono"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Variable Value</label>
            <input
              type="text"
              value={varValue}
              onChange={(e) => setVarValue(e.target.value)}
              placeholder="https://httpbin.org or sk_live_..."
              className="w-full px-3 py-2 bg-[#0B1728] border border-[#182E4B] rounded-lg text-sm text-slate-100 font-mono"
              required
            />
          </div>
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isSecret"
              checked={isSecret}
              onChange={(e) => setIsSecret(e.target.checked)}
              className="rounded bg-[#0B1728] border-[#182E4B]"
            />
            <label htmlFor="isSecret" className="text-xs text-slate-300 flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Mask secret value in UI & logs</span>
            </label>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-[#182E4B]">
            <button
              type="button"
              onClick={() => setIsVarModalOpen(false)}
              className="px-4 py-2 bg-[#0B1728] text-slate-300 rounded-lg text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold"
            >
              Save Variable
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
