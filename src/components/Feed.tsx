import React, { useState } from 'react';
import { 
  Flame, 
  Sparkles, 
  Clock, 
  TrendingUp, 
  PlusCircle, 
  Inbox, 
  ShieldAlert, 
  BarChart3, 
  Filter,
  Search,
  MessageSquare,
  HelpCircle
} from 'lucide-react';
import { Post, UserProfile } from '../types';
import { PostCard } from './PostCard';

interface FeedProps {
  posts: Post[];
  currentUser: UserProfile;
  activeFilter: 'hot' | 'new' | 'top' | 'suggestions' | 'complaints' | 'polls';
  onChangeFilter: (filter: 'hot' | 'new' | 'top' | 'suggestions' | 'complaints' | 'polls') => void;
  selectedCategoryName: string;
  onVotePost: (postId: string, direction: 'up' | 'down') => void;
  onAddComment: (postId: string, content: string, isAnon: boolean) => void;
  onVotePoll: (postId: string, optionId: string) => void;
  onOpenCreateModal: (defaultType?: 'general' | 'suggestion' | 'complaint' | 'poll') => void;
  onOpenTimelineModal: (post: Post) => void;
}

export const Feed: React.FC<FeedProps> = ({
  posts,
  currentUser,
  activeFilter,
  onChangeFilter,
  selectedCategoryName,
  onVotePost,
  onAddComment,
  onVotePoll,
  onOpenCreateModal,
  onOpenTimelineModal,
}) => {
  return (
    <div className="space-y-4">
      {/* Main Feed Header with Tabs (Exact match with wireframe: "Main Feed") */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200/90 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-100 to-slate-200/60 px-4 py-3 border-b border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-800">
              Main Feed
            </h2>
            <span className="text-xs text-slate-500 font-medium hidden sm:inline">
              • {selectedCategoryName}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-[11px] font-semibold text-slate-600">
              Cabiao SHS Campus Live
            </span>
          </div>
        </div>

        {/* Quick Post Prompt Bar */}
        <div className="p-3 sm:p-4 bg-white border-b border-slate-100">
          <div className="flex items-center gap-3">
            {currentUser.role === 'anonymous' ? (
              <div className="w-9 h-9 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs shrink-0">
                Anon
              </div>
            ) : (
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-9 h-9 rounded-full object-cover shrink-0 border border-slate-200"
              />
            )}

            <button
              onClick={() => onOpenCreateModal('general')}
              className="flex-1 text-left px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-xs text-slate-500 hover:text-slate-700 transition-colors cursor-pointer border border-slate-200"
            >
              Ipahayag ang boses mo... Suggest, complain, or post to Freedom Wall
            </button>

            <button
              onClick={() => onOpenCreateModal('suggestion')}
              className="p-2 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 transition-colors"
              title="New Suggestion"
            >
              <Inbox className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Category Buttons for posting */}
          <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-100 text-xs">
            <span className="text-slate-400 text-[11px] font-medium hidden sm:inline">
              Create:
            </span>
            <button
              onClick={() => onOpenCreateModal('general')}
              className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold transition-colors"
            >
              💬 Post
            </button>
            <button
              onClick={() => onOpenCreateModal('suggestion')}
              className="px-2.5 py-1 rounded-md bg-purple-100 hover:bg-purple-200 text-purple-800 text-[11px] font-semibold transition-colors"
            >
              💡 Suggestion
            </button>
            <button
              onClick={() => onOpenCreateModal('complaint')}
              className="px-2.5 py-1 rounded-md bg-teal-100 hover:bg-teal-200 text-teal-800 text-[11px] font-semibold transition-colors"
            >
              🛡️ Complaint
            </button>
            <button
              onClick={() => onOpenCreateModal('poll')}
              className="px-2.5 py-1 rounded-md bg-amber-100 hover:bg-amber-200 text-amber-800 text-[11px] font-semibold transition-colors"
            >
              📊 School Poll
            </button>
          </div>
        </div>

        {/* Reddit-style Feed Filter Tabs */}
        <div className="px-3 py-2 bg-slate-50 border-t border-slate-200/60 flex items-center gap-1 overflow-x-auto no-scrollbar">
          <button
            onClick={() => onChangeFilter('hot')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all ${
              activeFilter === 'hot'
                ? 'bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs'
                : 'text-slate-600 hover:bg-white hover:text-slate-900'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-600" />
            <span>Trending Hot</span>
          </button>

          <button
            onClick={() => onChangeFilter('new')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all ${
              activeFilter === 'new'
                ? 'bg-slate-200 text-slate-900 border border-slate-300 shadow-2xs'
                : 'text-slate-600 hover:bg-white hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-slate-600" />
            <span>Latest / New</span>
          </button>

          <button
            onClick={() => onChangeFilter('top')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all ${
              activeFilter === 'top'
                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-2xs'
                : 'text-slate-600 hover:bg-white hover:text-slate-900'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>Top Voted</span>
          </button>

          <div className="h-4 w-px bg-slate-300 mx-1 shrink-0" />

          <button
            onClick={() => onChangeFilter('suggestions')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all ${
              activeFilter === 'suggestions'
                ? 'bg-purple-100 text-purple-900 border border-purple-300 shadow-2xs'
                : 'text-slate-600 hover:bg-white hover:text-slate-900'
            }`}
          >
            <Inbox className="w-3.5 h-3.5 text-purple-600" />
            <span>Suggestions</span>
          </button>

          <button
            onClick={() => onChangeFilter('complaints')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all ${
              activeFilter === 'complaints'
                ? 'bg-teal-100 text-teal-900 border border-teal-300 shadow-2xs'
                : 'text-slate-600 hover:bg-white hover:text-slate-900'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-teal-600" />
            <span>Complaints</span>
          </button>

          <button
            onClick={() => onChangeFilter('polls')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all ${
              activeFilter === 'polls'
                ? 'bg-orange-100 text-orange-900 border border-orange-300 shadow-2xs'
                : 'text-slate-600 hover:bg-white hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-orange-600" />
            <span>Polls</span>
          </button>
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-3.5">
        {posts.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center border border-slate-200">
            <MessageSquare className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="font-bold text-slate-700 text-sm">Walang nahanap na post</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Subukang mag-post ng bagong topic o magpalit ng filter sa itaas.
            </p>
            <button
              onClick={() => onOpenCreateModal('general')}
              className="mt-3 px-4 py-2 bg-[#4B6584] hover:bg-[#3b516b] text-white rounded-lg text-xs font-bold transition-colors"
            >
              Gumawa ng unang post
            </button>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              currentUser={currentUser}
              onVotePost={onVotePost}
              onAddComment={onAddComment}
              onVotePoll={onVotePoll}
              onOpenTimelineModal={onOpenTimelineModal}
            />
          ))
        )}
      </div>
    </div>
  );
};
