import React, { useState } from 'react';
import { 
  User, 
  Megaphone, 
  BookOpen, 
  MessageSquare, 
  Trophy, 
  Inbox, 
  ShieldAlert, 
  BarChart3, 
  Globe, 
  Plus, 
  Check, 
  EyeOff, 
  UserCheck, 
  Sparkles,
  ChevronRight,
  HelpCircle,
  FileText
} from 'lucide-react';
import { UserProfile } from '../types';

interface SidebarProfileProps {
  currentUser: UserProfile;
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  onToggleAnonymous: () => void;
  onOpenCreateModal: (defaultType?: 'suggestion' | 'complaint' | 'poll' | 'general') => void;
  onOpenComplaintTracker: () => void;
  onUpdateHobbies: (hobbies: string[]) => void;
}

export const SidebarProfile: React.FC<SidebarProfileProps> = ({
  currentUser,
  selectedCategory,
  onSelectCategory,
  onToggleAnonymous,
  onOpenCreateModal,
  onOpenComplaintTracker,
  onUpdateHobbies,
}) => {
  const [isAddingHobby, setIsAddingHobby] = useState(false);
  const [newHobbyText, setNewHobbyText] = useState('');

  const handleAddHobby = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHobbyText.trim()) return;
    onUpdateHobbies([...currentUser.hobbies, newHobbyText.trim()]);
    setNewHobbyText('');
    setIsAddingHobby(false);
  };

  const handleRemoveHobby = (indexToRemove: number) => {
    onUpdateHobbies(currentUser.hobbies.filter((_, idx) => idx !== indexToRemove));
  };

  const categoryList = [
    {
      id: 'all',
      name: 'All School Posts',
      sub: 'Browse campus feeds and discussions',
      icon: Globe,
      color: 'text-indigo-600 bg-indigo-50',
    },
    {
      id: 'campus_news',
      name: 'Campus News',
      sub: 'Official bulletins & SSG announcements',
      icon: Megaphone,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      id: 'academic',
      name: 'Academic Resources',
      sub: 'Reviewers, syllabus & module tips',
      icon: BookOpen,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      id: 'community',
      name: 'Community Forums',
      sub: 'Freedom wall & school banter',
      icon: MessageSquare,
      color: 'text-amber-600 bg-amber-50',
    },
    {
      id: 'clubs',
      name: 'Club Updates',
      sub: 'Intramurals, sports & student orgs',
      icon: Trophy,
      color: 'text-rose-600 bg-rose-50',
    },
    {
      id: 'suggestions',
      name: 'Digital Suggestion Box',
      sub: 'Ideas to improve CSHS campus life',
      icon: Inbox,
      color: 'text-purple-600 bg-purple-50',
    },
    {
      id: 'complaints',
      name: 'Complaint Status Tracker',
      sub: 'Track official feedback & resolution',
      icon: ShieldAlert,
      color: 'text-teal-600 bg-teal-50',
    },
    {
      id: 'polls',
      name: 'Online Polls & Surveys',
      sub: 'Student voting & pulse checks',
      icon: BarChart3,
      color: 'text-orange-600 bg-orange-50',
    },
  ];

  return (
    <div className="space-y-4">
      {/* Profile of User Card (Matches wireframe: "Profile of user" + "List of hobbies/Intrests") */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200/90 overflow-hidden">
        {/* Profile Card Header */}
        <div className="bg-gradient-to-r from-slate-100 to-slate-200/60 px-4 py-3 border-b border-slate-200/80 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Profile of user
          </span>
          <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-slate-300/60 text-slate-700">
            CSHS Verified
          </span>
        </div>

        <div className="p-4 space-y-4">
          {/* Avatar & Identifiers */}
          <div className="flex items-start gap-3.5">
            <div className="relative">
              {currentUser.role === 'anonymous' ? (
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-700 to-slate-900 flex items-center justify-center text-white shadow-sm border-2 border-purple-300">
                  <EyeOff className="w-8 h-8 text-purple-200" />
                </div>
              ) : (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-16 h-16 rounded-2xl object-cover shadow-sm border-2 border-slate-200"
                />
              )}
              <div 
                className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-[10px] ${
                  currentUser.role === 'anonymous' ? 'bg-purple-600 text-white' : 'bg-emerald-500 text-white'
                }`}
                title={currentUser.role === 'anonymous' ? 'Anonymous Mode Active' : 'Online'}
              >
                ✓
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-slate-900 text-base leading-snug truncate">
                {currentUser.role === 'anonymous' ? 'Secret Kuyog (Anon)' : currentUser.name}
              </h3>
              <p className="text-xs text-slate-500 font-mono truncate">
                {currentUser.role === 'anonymous' ? '@anon_cshs_learner' : currentUser.handle}
              </p>
              <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                <span>{currentUser.gradeAndStrand}</span>
              </div>
            </div>
          </div>

          {/* Anonymous Switch Toggle */}
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                <EyeOff className="w-3.5 h-3.5 text-purple-600" />
                <span>Anonymous Mode</span>
              </div>
              <button
                onClick={onToggleAnonymous}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  currentUser.role === 'anonymous' ? 'bg-purple-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    currentUser.role === 'anonymous' ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {currentUser.role === 'anonymous'
                ? 'Your name and section will be hidden when submitting complaints or posts.'
                : 'Posting using your official CSHS learner credentials.'}
            </p>
          </div>

          {/* List of hobbies / Interests (Exact match from wireframe) */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-800">
                List of hobbies/Intrests
              </span>
              <button
                onClick={() => setIsAddingHobby(!isAddingHobby)}
                className="text-[11px] text-sky-700 hover:text-sky-900 font-semibold flex items-center gap-0.5"
              >
                <Plus className="w-3 h-3" />
                <span>Add</span>
              </button>
            </div>

            {isAddingHobby && (
              <form onSubmit={handleAddHobby} className="mb-2 flex gap-1">
                <input
                  type="text"
                  placeholder="e.g. Volleyball, Chess"
                  value={newHobbyText}
                  onChange={(e) => setNewHobbyText(e.target.value)}
                  className="flex-1 text-xs px-2 py-1 rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-2 py-1 bg-sky-600 text-white rounded text-xs font-medium"
                >
                  Save
                </button>
              </form>
            )}

            <ul className="space-y-1.5 text-xs text-slate-600">
              {currentUser.hobbies.map((hobby, index) => (
                <li key={index} className="flex items-center justify-between group">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 group-hover:bg-sky-600 transition-colors" />
                    <span className="font-medium">{hobby}</span>
                  </div>
                  <button
                    onClick={() => handleRemoveHobby(index)}
                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 text-[10px] px-1"
                    title="Remove interest"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-center">
            <div className="p-2 bg-slate-50 rounded-lg">
              <div className="text-xs text-slate-500 font-medium">BOSES Rep</div>
              <div className="font-bold text-slate-800 text-sm">{currentUser.reputation}</div>
            </div>
            <div className="p-2 bg-slate-50 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors" onClick={onOpenComplaintTracker}>
              <div className="text-xs text-slate-500 font-medium">Complaints Filed</div>
              <div className="font-bold text-teal-700 text-sm flex items-center justify-center gap-1">
                <span>{currentUser.complaintsFiled}</span>
                <span className="text-[10px] text-teal-600">(Active)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Suggestion & Complaint Buttons */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => onOpenCreateModal('suggestion')}
          className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 text-xs font-bold transition-all shadow-2xs active:scale-98"
        >
          <Inbox className="w-4 h-4 text-purple-700" />
          <span>Suggest Idea</span>
        </button>

        <button
          onClick={() => onOpenCreateModal('complaint')}
          className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200 text-xs font-bold transition-all shadow-2xs active:scale-98"
        >
          <ShieldAlert className="w-4 h-4 text-teal-700" />
          <span>File Complaint</span>
        </button>
      </div>

      {/* Categories Card (Matches wireframe layout with icons and subtitles) */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200/90 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-100 to-slate-200/60 px-4 py-3 border-b border-slate-200/80">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Categories
          </span>
        </div>

        <div className="p-2 space-y-1">
          {categoryList.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => {
                  if (cat.id === 'complaints') {
                    onOpenComplaintTracker();
                  } else {
                    onSelectCategory(cat.id);
                  }
                }}
                className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-left transition-all group ${
                  isSelected
                    ? 'bg-slate-100 border border-slate-300/80 text-slate-900 font-bold shadow-2xs'
                    : 'hover:bg-slate-50 text-slate-700 border border-transparent'
                }`}
              >
                <div className={`p-2 rounded-lg shrink-0 ${cat.color} group-hover:scale-105 transition-transform`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-slate-900 truncate">
                    {cat.name}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate">
                    {cat.sub}
                  </div>
                </div>
                {isSelected && (
                  <span className="w-1.5 h-6 rounded-full bg-slate-800" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
