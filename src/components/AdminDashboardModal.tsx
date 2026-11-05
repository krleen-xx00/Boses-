import React, { useState } from 'react';
import { 
  X, 
  SlidersHorizontal, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Flame, 
  Send, 
  Megaphone, 
  Plus, 
  Trash2,
  Edit3,
  TrendingUp,
  BarChart,
  UserCheck
} from 'lucide-react';
import { Post, ComplaintStatus, UserProfile } from '../types';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  complaints: Post[];
  headlines: string[];
  currentUser: UserProfile;
  onUpdateComplaintStatus: (postId: string, newStatus: ComplaintStatus, officialNote: string) => void;
  onAddHeadline: (headlineText: string) => void;
  onRemoveHeadline: (index: number) => void;
  onPublishAnnouncement: (title: string, content: string) => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  complaints,
  headlines,
  currentUser,
  onUpdateComplaintStatus,
  onAddHeadline,
  onRemoveHeadline,
  onPublishAnnouncement,
}) => {
  const [activeTab, setActiveTab] = useState<'moderation' | 'headlines' | 'announcement'>('moderation');
  
  // Status update state
  const [selectedPostId, setSelectedPostId] = useState<string>(complaints[0]?.id || '');
  const [newStatus, setNewStatus] = useState<ComplaintStatus>('In Progress');
  const [officialNote, setOfficialNote] = useState('');
  
  // New headline state
  const [newHeadline, setNewHeadline] = useState('');

  // Announcement state
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annSuccess, setAnnSuccess] = useState(false);

  if (!isOpen) return null;

  const handleStatusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPostId || !officialNote.trim()) return;
    onUpdateComplaintStatus(selectedPostId, newStatus, officialNote.trim());
    setOfficialNote('');
    alert('Complaint status and official resolution remark updated successfully!');
  };

  const handleHeadlineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHeadline.trim()) return;
    const formatted = newHeadline.trim().startsWith('headlines:')
      ? newHeadline.trim()
      : `headlines: ${newHeadline.trim()}`;
    onAddHeadline(formatted);
    setNewHeadline('');
  };

  const handleAnnouncementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annContent.trim()) return;
    onPublishAnnouncement(annTitle.trim(), annContent.trim());
    setAnnTitle('');
    setAnnContent('');
    setAnnSuccess(true);
    setTimeout(() => setAnnSuccess(false), 3000);
  };

  const selectedPost = complaints.find((c) => c.id === selectedPostId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl flex flex-col h-[650px] max-h-[92vh] overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-400 text-slate-950 font-bold">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
                <span>SSG & Administrator Control Desk</span>
                <span className="text-[10px] bg-amber-400 text-slate-900 font-extrabold px-1.5 py-0.5 rounded">
                  OFFICER ACCESS
                </span>
              </h3>
              <p className="text-[11px] text-slate-300">
                Cabiao Senior High School — BOSES Governance
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab navigation */}
        <div className="flex bg-slate-100 border-b border-slate-200 p-2 gap-2 text-xs">
          <button
            onClick={() => setActiveTab('moderation')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              activeTab === 'moderation'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>Complaint & Suggestion Desk</span>
          </button>

          <button
            onClick={() => setActiveTab('headlines')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              activeTab === 'headlines'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Flame className="w-4 h-4 text-amber-600" />
            <span>Headline Ticker Manager</span>
          </button>

          <button
            onClick={() => setActiveTab('announcement')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              activeTab === 'announcement'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Megaphone className="w-4 h-4 text-blue-600" />
            <span>Post Official Announcement</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50">
          {activeTab === 'moderation' && (
            <div className="space-y-5">
              {/* Stats overview banner */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <div className="text-[11px] text-slate-500 font-semibold">Total Complaints Filed</div>
                  <div className="text-xl font-bold text-slate-800">{complaints.length}</div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <div className="text-[11px] text-slate-500 font-semibold">Active In Progress</div>
                  <div className="text-xl font-bold text-sky-700">
                    {complaints.filter((c) => c.complaintStatus === 'In Progress').length}
                  </div>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <div className="text-[11px] text-slate-500 font-semibold">Resolved Cases</div>
                  <div className="text-xl font-bold text-emerald-700">
                    {complaints.filter((c) => c.complaintStatus === 'Resolved').length}
                  </div>
                </div>
              </div>

              {/* Action Form */}
              <form onSubmit={handleStatusSubmit} className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <Edit3 className="w-3.5 h-3.5 text-slate-600" />
                  <span>Update Ticket Status & Provide Official Action Note</span>
                </h4>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Select Target Ticket
                  </label>
                  <select
                    value={selectedPostId}
                    onChange={(e) => setSelectedPostId(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white"
                  >
                    {complaints.map((c) => (
                      <option key={c.id} value={c.id}>
                        [{c.ticketId || 'TICKET'}] {c.title || c.content.slice(0, 40)}... ({c.complaintStatus})
                      </option>
                    ))}
                  </select>
                </div>

                {selectedPost && (
                  <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                    <span className="font-bold text-slate-700">Student Issue:</span>
                    <p className="text-slate-600 mt-0.5">{selectedPost.content}</p>
                    <span className="block mt-1 text-[10px] text-slate-400">
                      Office: {selectedPost.targetOffice} • Current: {selectedPost.complaintStatus}
                    </span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      New Status
                    </label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as ComplaintStatus)}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white"
                    >
                      <option value="Under Review">Under Review</option>
                      <option value="In Progress">In Progress (Action Initiated)</option>
                      <option value="Resolved">Resolved (Completed & Verified)</option>
                      <option value="Archived">Archived</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Action Taken / Officer Remarks
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Electrician installed replacement motor..."
                      value={officialNote}
                      onChange={(e) => setOfficialNote(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={!officialNote.trim()}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors shadow-2xs disabled:opacity-40"
                  >
                    Save Status & Notify Students
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'headlines' && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Add New Marquee Headline (Campus Buzz)
                </h4>
                <form onSubmit={handleHeadlineSubmit} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. headlines: Bakit puro kayo Rene?"
                    value={newHeadline}
                    onChange={(e) => setNewHeadline(e.target.value)}
                    className="flex-1 text-xs p-2.5 rounded-lg border border-slate-300"
                  />
                  <button
                    type="submit"
                    disabled={!newHeadline.trim()}
                    className="px-4 py-2 bg-[#4B6584] hover:bg-[#3b516b] text-white text-xs font-bold rounded-lg disabled:opacity-40"
                  >
                    Add Headline
                  </button>
                </form>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 shadow-2xs">
                <div className="p-3 bg-slate-50 text-xs font-bold text-slate-700">
                  Current Headlines ({headlines.length})
                </div>
                {headlines.map((hl, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between gap-2 text-xs">
                    <span className="text-slate-800 font-medium">{hl}</span>
                    <button
                      onClick={() => onRemoveHeadline(idx)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                      title="Remove headline"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'announcement' && (
            <form onSubmit={handleAnnouncementSubmit} className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <Megaphone className="w-4 h-4 text-blue-600" />
                <span>Publish Official School Bulletin / SSG Announcement</span>
              </div>

              {annSuccess && (
                <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-medium">
                  Announcement pinned and broadcasted to Main Feed!
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Announcement Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Schedule of Periodical Examinations..."
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Announcement Content
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Official instructions and details for Cabiao SHS students..."
                  value={annContent}
                  onChange={(e) => setAnnContent(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-2xs"
                >
                  Publish & Pin to Feed
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
