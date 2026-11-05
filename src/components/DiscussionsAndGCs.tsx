import React from 'react';
import { 
  MessageCircle, 
  Users, 
  Clock, 
  Sparkles, 
  Flame, 
  Send, 
  Calendar, 
  AlertCircle,
  HelpCircle,
  ChevronRight
} from 'lucide-react';
import { GroupChat, SchoolIssue } from '../types';

interface DiscussionsAndGCsProps {
  issues: SchoolIssue[];
  groupChats: GroupChat[];
  onOpenGroupChat: (chat: GroupChat) => void;
  onSelectIssue: (issue: SchoolIssue) => void;
}

export const DiscussionsAndGCs: React.FC<DiscussionsAndGCsProps> = ({
  issues,
  groupChats,
  onOpenGroupChat,
  onSelectIssue,
}) => {
  return (
    <div className="space-y-4">
      {/* Latest School Issues / Quick Discussions (Exact Match from wireframe: "Message's / Discussions latest school Issue's") */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200/90 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-100 to-slate-200/60 px-4 py-3 border-b border-slate-200/80 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
              Message's / Discussions
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              Latest school issues & updates
            </span>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>

        <div className="p-3 divide-y divide-slate-100">
          {issues.map((issue) => (
            <div
              key={issue.id}
              onClick={() => onSelectIssue(issue)}
              className="py-2.5 first:pt-1 last:pb-1 cursor-pointer group transition-colors"
            >
              <div className="flex items-start gap-2">
                <span className="text-slate-400 group-hover:text-sky-600 transition-colors font-bold text-sm">
                  •
                </span>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-semibold text-slate-800 group-hover:text-sky-800 transition-colors leading-snug">
                    {issue.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                    <span className="font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded text-[10px]">
                      {issue.tag}
                    </span>
                    <span>{issue.time}</span>
                    <span>• {issue.repliesCount} comments</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Group Chats (GC's) Section (Exact Match from wireframe circles) */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200/90 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-100 to-slate-200/60 px-4 py-3 border-b border-slate-200/80 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
              Campus GC's & Circles
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              Join active student chatrooms
            </span>
          </div>
          <span className="text-[10px] font-semibold text-sky-700 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded-full">
            Live Chat
          </span>
        </div>

        <div className="p-2 space-y-1">
          {groupChats.map((gc) => (
            <button
              key={gc.id}
              onClick={() => onOpenGroupChat(gc)}
              className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 text-left transition-all border border-transparent hover:border-slate-200 group"
            >
              {/* Circular Avatar matching wireframe big circles */}
              <div className="relative shrink-0">
                <div className="w-11 h-11 rounded-full bg-slate-300 flex items-center justify-center font-bold text-slate-700 text-sm shadow-inner group-hover:bg-slate-400/80 transition-colors">
                  {gc.name.charAt(0)}
                </div>
                {gc.unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center border-2 border-white">
                    {gc.unreadCount}
                  </span>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-sky-800">
                    {gc.name}
                  </h4>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {gc.membersCount} mbrs
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">
                  {gc.snippet}
                </p>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors shrink-0" />
            </button>
          ))}
        </div>

        <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-500">
            💬 Connect with batchmates, section buddies, and school orgs.
          </p>
        </div>
      </div>
    </div>
  );
};
