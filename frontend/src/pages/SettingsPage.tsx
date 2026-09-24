import React, { useState } from 'react';
import { Settings, Lock, Bell, User, Monitor } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Tabs } from '../components/ui/Tabs';

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('account');

  // Form states
  const [name, setName] = useState(user?.name || 'Alex Rivera');
  const [email, setEmail] = useState(user?.email || 'admin@sentinel.io');
  const [defaultTimeout, setDefaultTimeout] = useState(5000);
  const [defaultInterval, setDefaultInterval] = useState(60);
  const [savedMessage, setSavedMessage] = useState('');

  const tabs = [
    { id: 'account', label: 'Account Profile' },
    { id: 'security', label: 'Security & Auth' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'defaults', label: 'API Monitoring Defaults' },
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedMessage('Settings saved successfully!');
    setTimeout(() => setSavedMessage(''), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div>
        <h1 className="text-2xl font-bold text-slate-100 tracking-tight">System & Account Settings</h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage user profiles, default probe configurations, security, and notification preferences.
        </p>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {savedMessage && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 text-xs font-semibold">
          {savedMessage}
        </div>
      )}

      {activeTab === 'account' && (
        <div className="bg-[#101F33] border border-[#182E4B] rounded-2xl p-6 shadow-xl max-w-2xl space-y-4">
          <h3 className="font-bold text-slate-100 text-sm">Profile Details</h3>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-[#0B1728] border border-[#182E4B] rounded-lg text-sm text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 bg-[#0B1728] border border-[#182E4B] rounded-lg text-sm text-slate-100"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-lg shadow-blue-500/20"
            >
              Update Profile
            </button>
          </form>
        </div>
      )}

      {activeTab === 'defaults' && (
        <div className="bg-[#101F33] border border-[#182E4B] rounded-2xl p-6 shadow-xl max-w-2xl space-y-4">
          <h3 className="font-bold text-slate-100 text-sm">Monitoring Engine Defaults</h3>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Default Probe Interval (Seconds)</label>
              <input
                type="number"
                value={defaultInterval}
                onChange={(e) => setDefaultInterval(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#0B1728] border border-[#182E4B] rounded-lg text-sm text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Default Request Timeout (ms)</label>
              <input
                type="number"
                value={defaultTimeout}
                onChange={(e) => setDefaultTimeout(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#0B1728] border border-[#182E4B] rounded-lg text-sm text-slate-100"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold shadow-lg shadow-blue-500/20"
            >
              Save Defaults
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
