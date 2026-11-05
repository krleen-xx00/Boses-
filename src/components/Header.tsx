import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  ShieldCheck, 
  UserCheck, 
  EyeOff, 
  SlidersHorizontal,
  Flame,
  CheckCircle,
  HelpCircle,
  Sparkles,
  Volume2
} from 'lucide-react';
import { UserProfile, AppNotification } from '../types';

interface HeaderProps {
  currentUser: UserProfile;
  headlines: string[];
  currentHeadlineIndex: number;
  onNextHeadline: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onToggleRole: () => void;
  onToggleAnonymous: () => void;
  onOpenComplaintTracker: () => void;
  onOpenAdminDashboard: () => void;
  notifications: AppNotification[];
  onOpenNotifications: () => void;
  unreadNotificationsCount: number;
  onOpenCreatePost: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  headlines,
  currentHeadlineIndex,
  onNextHeadline,
  searchQuery,
  onSearchChange,
  onToggleRole,
  onToggleAnonymous,
  onOpenComplaintTracker,
  onOpenAdminDashboard,
  notifications,
  onOpenNotifications,
  unreadNotificationsCount,
  onOpenCreatePost,
}) => {
  const currentHeadline = headlines[currentHeadlineIndex] || headlines[0];

  return (
    <header className="sticky top-0 z-40 bg-[#4B6584] text-white shadow-md border-b border-[#3b516b]">
      {/* Top Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5">
        <div className="flex items-center justify-between gap-3">
          {/* Logo & School Title (Matching Wireframe: "BOSES First design of") */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center font-black text-xl tracking-wider text-amber-300 shadow-inner">
                B
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-xl tracking-tight text-white drop-shadow-sm">
                    BOSES
                  </span>
                  <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-white/15 text-sky-100 border border-white/20">
                    CSHS Official
                  </span>
                </div>
                <div className="text-[11px] text-slate-200 font-medium tracking-wide truncate max-w-[200px] sm:max-w-none">
                  Cabiao Senior High School — Digital Suggestion Box & Freedom Wall
                </div>
              </div>
            </div>
          </div>

          {/* Search bar */}
          <div className="hidden sm:flex flex-1 max-w-md mx-2">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
              <input
                type="text"
                placeholder="Search suggestions, complaints, topics or GCs..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 bg-black/20 hover:bg-black/25 focus:bg-white text-white focus:text-slate-900 placeholder:text-slate-300 focus:placeholder:text-slate-400 rounded-lg text-sm border border-white/20 focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-300 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Action buttons & User profile pill */}
          <div className="flex items-center gap-2">
            {/* Quick Create Suggestion / Post Button */}
            <button
              onClick={onOpenCreatePost}
              className="hidden lg:flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold px-3 py-1.5 rounded-lg text-xs shadow-sm transition-transform active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-900" />
              <span>Boses Mo! (Post)</span>
            </button>

            {/* Complaint Tracker shortcut */}
            <button
              onClick={onOpenComplaintTracker}
              title="Open Complaint Status Tracker"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium border border-white/15 transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span className="hidden sm:inline">Track Tickets</span>
            </button>

            {/* Admin Switcher */}
            <button
              onClick={onOpenAdminDashboard}
              title="Admin & SSG Officer Dashboard"
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                currentUser.role === 'admin'
                  ? 'bg-amber-400 text-slate-900 border-amber-300 font-bold'
                  : 'bg-white/10 hover:bg-white/20 text-slate-100 border-white/15'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {currentUser.role === 'admin' ? 'SSG Admin View' : 'Admin Mode'}
              </span>
            </button>

            {/* Notification Bell */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 rounded-lg bg-white/10 hover:bg-white/20 text-slate-100 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* User Badge / Anonymous Toggle Pill */}
            <div className="flex items-center bg-black/25 rounded-lg p-1 border border-white/15">
              <button
                onClick={onToggleAnonymous}
                title={currentUser.role === 'anonymous' ? 'Switch to Real Student Profile' : 'Switch to Anonymous (Secret Kuyog)'}
                className={`flex items-center gap-1.5 px-2 py-1 rounded text-xs font-semibold transition-all ${
                  currentUser.role === 'anonymous'
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-200 hover:text-white'
                }`}
              >
                {currentUser.role === 'anonymous' ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5 text-purple-200" />
                    <span>Secret Kuyog</span>
                  </>
                ) : (
                  <>
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-4 h-4 rounded-full object-cover"
                    />
                    <span className="max-w-[85px] truncate hidden sm:inline">
                      {currentUser.name}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Headline Marquee Bar (Exact Match with Wireframe: "headlines: Bakit puro kayo Rene?") */}
      <div className="bg-[#3b516b] border-t border-[#314358] px-3 sm:px-6 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-hidden flex-1 cursor-pointer" onClick={onNextHeadline}>
            <div className="text-slate-100 font-medium truncate hover:text-sky-200 transition-colors font-mono sm:text-xs text-[11px]">
              {currentHeadline}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[10px] text-slate-300 hidden sm:inline">
              Tap to next headline
            </span>
            <button
              onClick={onNextHeadline}
              className="text-[11px] px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-slate-200 transition-colors font-mono"
            >
              Next »
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
