import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Plus, Trash2, Send } from 'lucide-react';
import api from '../../services/api';

interface ApiFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: any;
  projects: any[];
}

export const ApiFormModal: React.FC<ApiFormModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialData,
  projects,
}) => {
  const [activeTab, setActiveTab] = useState<'basic' | 'headers' | 'auth' | 'rules'>('basic');

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [method, setMethod] = useState('GET');
  const [projectId, setProjectId] = useState('');
  const [intervalSeconds, setIntervalSeconds] = useState(60);
  const [timeoutMs, setTimeoutMs] = useState(5000);
  const [expectedStatusCode, setExpectedStatusCode] = useState(200);
  const [expectedResponseMs, setExpectedResponseMs] = useState(1000);
  const [authType, setAuthType] = useState('NONE');

  // Custom Headers
  const [headers, setHeaders] = useState<{ key: string; value: string }[]>([
    { key: 'Content-Type', value: 'application/json' },
  ]);

  // Auth Details
  const [authToken, setAuthToken] = useState('');
  const [apiKeyName, setApiKeyName] = useState('X-API-Key');
  const [apiKeyValue, setApiKeyValue] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setDescription(initialData.description || '');
      setUrl(initialData.url || '');
      setMethod(initialData.method || 'GET');
      setProjectId(initialData.projectId || (projects[0]?.id || ''));
      setIntervalSeconds(initialData.intervalSeconds || 60);
      setTimeoutMs(initialData.timeoutMs || 5000);
      setExpectedStatusCode(initialData.expectedStatusCode || 200);
      setExpectedResponseMs(initialData.expectedResponseMs || 1000);
      setAuthType(initialData.authType || 'NONE');
    } else {
      setName('');
      setDescription('');
      setUrl('');
      setMethod('GET');
      setProjectId(projects[0]?.id || '');
      setIntervalSeconds(60);
      setTimeoutMs(5000);
      setExpectedStatusCode(200);
      setExpectedResponseMs(1000);
      setAuthType('NONE');
    }
  }, [initialData, projects, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !url || !projectId) {
      setError('Please fill in all required fields (Name, URL, Project).');
      return;
    }

    setIsLoading(true);
    setError('');

    const formattedHeaders: Record<string, string> = {};
    headers.forEach((h) => {
      if (h.key) formattedHeaders[h.key] = h.value;
    });

    const payload = {
      name,
      description,
      url,
      method,
      projectId,
      intervalSeconds: Number(intervalSeconds),
      timeoutMs: Number(timeoutMs),
      expectedStatusCode: Number(expectedStatusCode),
      expectedResponseMs: Number(expectedResponseMs),
      headers: formattedHeaders,
      authType,
      authConfig:
        authType === 'BEARER'
          ? { token: authToken }
          : authType === 'API_KEY'
          ? { key: apiKeyName, value: apiKeyValue }
          : null,
    };

    try {
      if (initialData?.id) {
        await api.put(`/apis/${initialData.id}`, payload);
      } else {
        await api.post('/apis', payload);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save API monitor');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit API Monitor' : 'Add New API Monitor'}
      subtitle="Configure endpoint details, HTTP method, probe interval, and validation rules."
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-400 text-xs">
            {error}
          </div>
        )}

        {/* Tab Selection */}
        <div className="flex border-b border-[#182E4B] gap-4">
          <button
            type="button"
            onClick={() => setActiveTab('basic')}
            className={`pb-2 text-xs font-semibold border-b-2 ${
              activeTab === 'basic'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Basic Config
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('headers')}
            className={`pb-2 text-xs font-semibold border-b-2 ${
              activeTab === 'headers'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Request Headers
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('auth')}
            className={`pb-2 text-xs font-semibold border-b-2 ${
              activeTab === 'auth'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Authentication
          </button>
        </div>

        {activeTab === 'basic' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">API Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. User Profile Service"
                  className="w-full px-3 py-2 bg-[#0B1728] border border-[#182E4B] rounded-lg text-sm text-slate-100 focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Project *</label>
                <select
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0B1728] border border-[#182E4B] rounded-lg text-sm text-slate-100 focus:border-blue-500 focus:outline-none"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Method</label>
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0B1728] border border-[#182E4B] rounded-lg text-sm text-slate-100 font-mono focus:border-blue-500 focus:outline-none"
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="PATCH">PATCH</option>
                  <option value="DELETE">DELETE</option>
                  <option value="HEAD">HEAD</option>
                  <option value="OPTIONS">OPTIONS</option>
                </select>
              </div>
              <div className="sm:col-span-3">
                <label className="block text-xs font-medium text-slate-300 mb-1">URL Endpoint *</label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://api.domain.com/v1/users or {{BASE_URL}}/users"
                  className="w-full px-3 py-2 bg-[#0B1728] border border-[#182E4B] rounded-lg text-sm text-slate-100 font-mono focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional notes regarding this endpoint..."
                className="w-full px-3 py-2 bg-[#0B1728] border border-[#182E4B] rounded-lg text-sm text-slate-100 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Interval</label>
                <select
                  value={intervalSeconds}
                  onChange={(e) => setIntervalSeconds(Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-[#0B1728] border border-[#182E4B] rounded-lg text-xs text-slate-200"
                >
                  <option value={30}>30 sec</option>
                  <option value={60}>1 min</option>
                  <option value={300}>5 min</option>
                  <option value={600}>10 min</option>
                  <option value={900}>15 min</option>
                  <option value={1800}>30 min</option>
                  <option value={3600}>1 hour</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Timeout (ms)</label>
                <input
                  type="number"
                  value={timeoutMs}
                  onChange={(e) => setTimeoutMs(Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-[#0B1728] border border-[#182E4B] rounded-lg text-xs text-slate-200"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Expected Status</label>
                <input
                  type="number"
                  value={expectedStatusCode}
                  onChange={(e) => setExpectedStatusCode(Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-[#0B1728] border border-[#182E4B] rounded-lg text-xs text-slate-200"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Max Latency (ms)</label>
                <input
                  type="number"
                  value={expectedResponseMs}
                  onChange={(e) => setExpectedResponseMs(Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-[#0B1728] border border-[#182E4B] rounded-lg text-xs text-slate-200"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'headers' && (
          <div className="space-y-3">
            <p className="text-xs text-slate-400">Add custom HTTP request headers to include during checks.</p>
            {headers.map((h, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input
                  type="text"
                  placeholder="Header key (e.g. Content-Type)"
                  value={h.key}
                  onChange={(e) => {
                    const newH = [...headers];
                    newH[i].key = e.target.value;
                    setHeaders(newH);
                  }}
                  className="flex-1 px-3 py-1.5 bg-[#0B1728] border border-[#182E4B] rounded-lg text-xs text-slate-200 font-mono"
                />
                <input
                  type="text"
                  placeholder="Header value"
                  value={h.value}
                  onChange={(e) => {
                    const newH = [...headers];
                    newH[i].value = e.target.value;
                    setHeaders(newH);
                  }}
                  className="flex-1 px-3 py-1.5 bg-[#0B1728] border border-[#182E4B] rounded-lg text-xs text-slate-200 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setHeaders(headers.filter((_, idx) => idx !== i))}
                  className="p-1.5 text-slate-500 hover:text-rose-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setHeaders([...headers, { key: '', value: '' }])}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold inline-flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Header
            </button>
          </div>
        )}

        {activeTab === 'auth' && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Authentication Type</label>
              <select
                value={authType}
                onChange={(e) => setAuthType(e.target.value)}
                className="w-full px-3 py-2 bg-[#0B1728] border border-[#182E4B] rounded-lg text-sm text-slate-200"
              >
                <option value="NONE">None</option>
                <option value="BEARER">Bearer Token</option>
                <option value="API_KEY">API Key</option>
              </select>
            </div>

            {authType === 'BEARER' && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Bearer Token</label>
                <input
                  type="text"
                  value={authToken}
                  onChange={(e) => setAuthToken(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1Ni..."
                  className="w-full px-3 py-2 bg-[#0B1728] border border-[#182E4B] rounded-lg text-xs font-mono text-slate-200"
                />
              </div>
            )}

            {authType === 'API_KEY' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Header / Param Key</label>
                  <input
                    type="text"
                    value={apiKeyName}
                    onChange={(e) => setApiKeyName(e.target.value)}
                    placeholder="X-API-Key"
                    className="w-full px-3 py-2 bg-[#0B1728] border border-[#182E4B] rounded-lg text-xs font-mono text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Key Value</label>
                  <input
                    type="text"
                    value={apiKeyValue}
                    onChange={(e) => setApiKeyValue(e.target.value)}
                    placeholder="sk_live_..."
                    className="w-full px-3 py-2 bg-[#0B1728] border border-[#182E4B] rounded-lg text-xs font-mono text-slate-200"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-[#182E4B]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-[#0B1728] hover:bg-[#182E4B] text-slate-300 rounded-lg text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2"
          >
            {isLoading ? 'Saving...' : initialData ? 'Save Changes' : 'Create API Monitor'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
