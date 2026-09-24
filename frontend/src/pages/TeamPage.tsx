import React, { useState, useEffect } from 'react';
import { Users, Plus, Shield, UserPlus } from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import api from '../services/api';

export const TeamPage: React.FC = () => {
  const [teams, setTeams] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('DEVELOPER');

  const fetchTeams = async () => {
    try {
      const res: any = await api.get('/teams');
      if (res.success) setTeams(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teams[0]?.id) return;
    try {
      await api.post('/teams/invite', {
        teamId: teams[0].id,
        email: inviteEmail,
        role: inviteRole,
      });
      setInviteEmail('');
      setIsModalOpen(false);
      fetchTeams();
    } catch (err) {
      console.error(err);
    }
  };

  const members = teams[0]?.members || [];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Team Members & Access Control</h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage organization members, assign projects, and configure Role-Based Access Control (RBAC).
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2 w-fit"
        >
          <UserPlus className="w-4 h-4" />
          <span>Invite Member</span>
        </button>
      </div>

      <div className="bg-[#101F33] border border-[#182E4B] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0B1728] border-b border-[#182E4B] text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-3.5 px-6">Member Name</th>
                <th className="py-3.5 px-6">Email</th>
                <th className="py-3.5 px-6">Role</th>
                <th className="py-3.5 px-6">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#182E4B] text-sm">
              {members.map((m: any) => (
                <tr key={m.id} className="hover:bg-[#0B1728]/50">
                  <td className="py-4 px-6 font-semibold text-slate-100 flex items-center gap-3">
                    <img
                      src={m.user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                      alt="Avatar"
                      className="w-8 h-8 rounded-full border border-blue-500/30 object-cover"
                    />
                    <span>{m.user?.name}</span>
                  </td>
                  <td className="py-4 px-6 font-mono text-xs text-slate-400">{m.user?.email}</td>
                  <td className="py-4 px-6">
                    <span className="px-2.5 py-1 text-xs font-mono font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-md">
                      {m.role || m.user?.role}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-xs text-slate-400 font-mono">
                    {new Date(m.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Invite Team Member"
        subtitle="Grant role-based access permissions to your workspace."
      >
        <form onSubmit={handleInvite} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">User Email</label>
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="colleague@sentinel.io"
              className="w-full px-3 py-2 bg-[#0B1728] border border-[#182E4B] rounded-lg text-sm text-slate-100"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Role Permission</label>
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              className="w-full px-3 py-2 bg-[#0B1728] border border-[#182E4B] rounded-lg text-xs text-slate-100"
            >
              <option value="ADMIN">Admin (Full Management)</option>
              <option value="DEVELOPER">Developer (Manage APIs & Logs)</option>
              <option value="VIEWER">Viewer (Read Only)</option>
            </select>
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
              Send Invite
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
