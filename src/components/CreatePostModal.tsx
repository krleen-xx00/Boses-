import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Inbox, 
  ShieldAlert, 
  BarChart3, 
  MessageSquare, 
  EyeOff, 
  Plus, 
  Trash2,
  Check,
  Building2
} from 'lucide-react';
import { PostType, UserProfile, Post } from '../types';

interface CreatePostModalProps {
  currentUser: UserProfile;
  initialType?: PostType;
  isOpen: boolean;
  onClose: () => void;
  onSubmitPost: (postData: Partial<Post>) => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  currentUser,
  initialType = 'general',
  isOpen,
  onClose,
  onSubmitPost,
}) => {
  const [postType, setPostType] = useState<PostType>(initialType);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(currentUser.role === 'anonymous');
  const [targetOffice, setTargetOffice] = useState<any>('Supreme Secondary Learner Gov (SSG)');
  const [pollOptions, setPollOptions] = useState<string[]>(['Option 1', 'Option 2']);

  if (!isOpen) return null;

  const handleAddPollOption = () => {
    if (pollOptions.length < 5) {
      setPollOptions([...pollOptions, `Option ${pollOptions.length + 1}`]);
    }
  };

  const handleRemovePollOption = (index: number) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, idx) => idx !== index));
    }
  };

  const handlePollOptionChange = (index: number, val: string) => {
    const updated = [...pollOptions];
    updated[index] = val;
    setPollOptions(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !title.trim()) return;

    let ticketId: string | undefined = undefined;
    if (postType === 'complaint' || postType === 'suggestion') {
      const randomNum = Math.floor(100 + Math.random() * 900);
      ticketId = `CSHS-2026-${randomNum}`;
    }

    const newPostData: Partial<Post> = {
      type: postType,
      title: title.trim() || undefined,
      content: content.trim(),
      isAnonymous,
      category: 
        postType === 'suggestion' ? 'suggestions' :
        postType === 'complaint' ? 'complaints' :
        postType === 'poll' ? 'polls' : 'community',
      targetOffice: (postType === 'complaint' || postType === 'suggestion') ? targetOffice : undefined,
      ticketId,
      complaintStatus: (postType === 'complaint' || postType === 'suggestion') ? 'Submitted' : undefined,
      statusUpdates: (postType === 'complaint' || postType === 'suggestion') ? [
        {
          date: 'Just now',
          status: 'Submitted',
          note: `Received and assigned official reference ticket ${ticketId}. Queued for SSG & School Administration review.`,
          updatedBy: 'BOSES Dispatch',
        }
      ] : undefined,
      pollOptions: postType === 'poll' ? pollOptions.map((opt, idx) => ({
        id: `opt-${Date.now()}-${idx}`,
        text: opt.trim() || `Option ${idx + 1}`,
        votes: 0,
        userVoted: false,
      })) : undefined,
      pollTotalVotes: postType === 'poll' ? 0 : undefined,
    };

    onSubmitPost(newPostData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs">
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh] overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#4B6584] text-white px-5 py-3.5 flex items-center justify-between shrink-0">
          <div>
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>BOSES — Ipahayag ang Tinig</span>
            </h3>
            <p className="text-[11px] text-slate-200">
              Cabiao Senior High School Student Portal
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="grid grid-cols-4 p-2 bg-slate-100 border-b border-slate-200 gap-1 text-xs">
          <button
            type="button"
            onClick={() => setPostType('general')}
            className={`py-1.5 px-2 rounded-lg font-semibold flex flex-col items-center gap-1 transition-all ${
              postType === 'general'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-300'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
            <span>Freedom Wall</span>
          </button>

          <button
            type="button"
            onClick={() => setPostType('suggestion')}
            className={`py-1.5 px-2 rounded-lg font-semibold flex flex-col items-center gap-1 transition-all ${
              postType === 'suggestion'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-300'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Inbox className="w-3.5 h-3.5 text-purple-600" />
            <span>Suggestion</span>
          </button>

          <button
            type="button"
            onClick={() => setPostType('complaint')}
            className={`py-1.5 px-2 rounded-lg font-semibold flex flex-col items-center gap-1 transition-all ${
              postType === 'complaint'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-300'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-teal-600" />
            <span>Complaint</span>
          </button>

          <button
            type="button"
            onClick={() => setPostType('poll')}
            className={`py-1.5 px-2 rounded-lg font-semibold flex flex-col items-center gap-1 transition-all ${
              postType === 'poll'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-300'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-orange-600" />
            <span>Poll / Survey</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 overflow-y-auto space-y-4">
          {/* Post Type Specific Guidance */}
          {postType === 'complaint' && (
            <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-teal-700" />
                <span>CSHS Complaint Status Tracker System</span>
              </div>
              <p className="text-[11px] text-teal-800">
                Your report will automatically generate a tracking ticket (e.g. CSHS-2026-XXX). 
                The Supreme Secondary Learner Government (SSG) and facilities staff will be notified to review and update status.
              </p>
            </div>
          )}

          {postType === 'suggestion' && (
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-xs text-purple-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <Inbox className="w-4 h-4 text-purple-700" />
                <span>Digital Suggestion Box</span>
              </div>
              <p className="text-[11px] text-purple-800">
                Propose ideas for school events, classroom facilities, or library resources. Top voted suggestions are tabled in the monthly SSG meeting!
              </p>
            </div>
          )}

          {/* Target Office (For Complaint or Suggestion) */}
          {(postType === 'complaint' || postType === 'suggestion') && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Target Office / Department
              </label>
              <select
                value={targetOffice}
                onChange={(e) => setTargetOffice(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500"
              >
                <option value="Supreme Secondary Learner Gov (SSG)">Supreme Secondary Learner Gov (SSG)</option>
                <option value="Prefect of Discipline">Prefect of Discipline</option>
                <option value="Canteen & Facilities">Canteen & Physical Facilities</option>
                <option value="Guidance Office">Guidance & Counseling Office</option>
                <option value="School Principal">Office of the School Principal</option>
                <option value="Department Head">Academic Department Head</option>
              </select>
            </div>
          )}

          {/* Title Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {postType === 'complaint'
                ? 'Issue Headline / Summary'
                : postType === 'poll'
                ? 'Poll Question'
                : 'Title / Subject (Optional)'}
            </label>
            <input
              type="text"
              placeholder={
                postType === 'complaint'
                  ? 'e.g. Sira ang wall fan sa Room 304'
                  : postType === 'poll'
                  ? 'e.g. Payag ba kayo sa wash day every Friday?'
                  : 'Headline...'
              }
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-sky-500 text-slate-800"
            />
          </div>

          {/* Content Body */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {postType === 'poll' ? 'Context / Details for the Poll' : 'Description / Message'}
            </label>
            <textarea
              required
              rows={4}
              placeholder={
                postType === 'complaint'
                  ? 'Provide specific room number, building, and details of the problem...'
                  : postType === 'suggestion'
                  ? 'Describe your idea and how it benefits Cabiao SHS students...'
                  : 'Anong balita sa quad o sa classroom? Type it here...'
              }
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-sky-500 text-slate-800"
            />
          </div>

          {/* Poll Options (If Poll) */}
          {postType === 'poll' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">
                  Poll Options (Min 2, Max 5)
                </label>
                {pollOptions.length < 5 && (
                  <button
                    type="button"
                    onClick={handleAddPollOption}
                    className="text-[11px] text-sky-700 font-semibold flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Option</span>
                  </button>
                )}
              </div>

              {pollOptions.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => handlePollOptionChange(idx, e.target.value)}
                    placeholder={`Option ${idx + 1}`}
                    className="flex-1 text-xs p-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                  {pollOptions.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleRemovePollOption(idx)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Anonymous Option */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-semibold text-slate-800">
                <EyeOff className="w-4 h-4 text-purple-700" />
                <span>Anonymous Feedback (Secret Kuyog)</span>
              </div>
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 cursor-pointer"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Your name and strand won't be shown to students or administrators. Safe space for honest concerns.
            </p>
          </div>

          {/* Submit Actions */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!content.trim()}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-[#4B6584] hover:bg-[#3b516b] text-white disabled:opacity-40 transition-colors shadow-2xs"
            >
              Post to BOSES
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
