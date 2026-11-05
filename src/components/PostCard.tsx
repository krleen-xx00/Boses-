import React, { useState } from 'react';
import { 
  ThumbsUp, 
  ThumbsDown, 
  MessageSquare, 
  Share2, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  EyeOff, 
  Send, 
  Check, 
  BarChart2, 
  Sparkles,
  Bookmark,
  Pin
} from 'lucide-react';
import { Post, UserProfile, ComplaintStatus } from '../types';

interface PostCardProps {
  post: Post;
  currentUser: UserProfile;
  onVotePost: (postId: string, direction: 'up' | 'down') => void;
  onAddComment: (postId: string, content: string, isAnon: boolean) => void;
  onVotePoll: (postId: string, optionId: string) => void;
  onOpenTimelineModal: (post: Post) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  currentUser,
  onVotePost,
  onAddComment,
  onVotePoll,
  onOpenTimelineModal,
}) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [commentAsAnon, setCommentAsAnon] = useState(currentUser.role === 'anonymous');
  const [copiedLink, setCopiedLink] = useState(false);

  const formatCount = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace('.0', '') + 'K';
    }
    return num.toString();
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    onAddComment(post.id, newComment.trim(), commentAsAnon);
    setNewComment('');
  };

  const getStatusBadge = (status?: ComplaintStatus) => {
    switch (status) {
      case 'Submitted':
        return {
          bg: 'bg-slate-100 text-slate-700 border-slate-300',
          icon: Clock,
          label: 'Submitted',
        };
      case 'Under Review':
        return {
          bg: 'bg-amber-100 text-amber-800 border-amber-300',
          icon: Clock,
          label: 'Under Review',
        };
      case 'In Progress':
        return {
          bg: 'bg-sky-100 text-sky-800 border-sky-300',
          icon: Sparkles,
          label: 'In Progress by SSG / Facilities',
        };
      case 'Resolved':
        return {
          bg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          icon: CheckCircle2,
          label: 'Resolved & Action Taken',
        };
      default:
        return null;
    }
  };

  const statusBadge = getStatusBadge(post.complaintStatus);

  return (
    <article className="bg-white rounded-xl shadow-xs border border-slate-200/90 overflow-hidden hover:border-slate-300 transition-all">
      {/* Pinned announcement header if applicable */}
      {post.pinned && (
        <div className="bg-amber-50 px-4 py-1.5 border-b border-amber-200/70 flex items-center gap-1.5 text-xs font-semibold text-amber-900">
          <Pin className="w-3.5 h-3.5 rotate-45 text-amber-700" />
          <span>Pinned School Bulletin</span>
        </div>
      )}

      {/* Ticket / Complaint banner if this is a suggestion or complaint */}
      {(post.type === 'complaint' || post.type === 'suggestion') && post.ticketId && (
        <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-300">
              Ticket: {post.ticketId}
            </span>
            <span className="text-slate-500 hidden sm:inline">
              Office: <strong className="text-slate-700">{post.targetOffice || 'SSG'}</strong>
            </span>
          </div>

          {statusBadge && (
            <div className="flex items-center gap-1.5">
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${statusBadge.bg}`}>
                <statusBadge.icon className="w-3 h-3" />
                {statusBadge.label}
              </span>
              <button
                onClick={() => onOpenTimelineModal(post)}
                className="text-[11px] text-sky-700 hover:text-sky-900 underline font-semibold ml-1"
              >
                Timeline
              </button>
            </div>
          )}
        </div>
      )}

      <div className="p-4 sm:p-5">
        {/* Author Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            {post.isAnonymous ? (
              <div className="w-10 h-10 rounded-full bg-slate-800 text-white flex items-center justify-center shrink-0">
                <EyeOff className="w-5 h-5 text-purple-300" />
              </div>
            ) : post.authorName === 'Among us' ? (
              <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm shrink-0 border border-slate-400">
                ඞ
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 font-bold shrink-0">
                {post.authorName.charAt(0)}
              </div>
            )}

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-slate-900 text-sm">
                  {post.authorName}
                </span>
                {post.isAnonymous && (
                  <span className="text-[10px] bg-purple-100 text-purple-800 font-semibold px-1.5 py-0.2 rounded border border-purple-200">
                    Secret Kuyog
                  </span>
                )}
                {post.authorHandle.includes('ssg') && (
                  <span className="text-[10px] bg-sky-100 text-sky-800 font-bold px-1.5 py-0.2 rounded border border-sky-200">
                    SSG Council
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                <span>{post.authorHandle}</span>
                <span>•</span>
                <span>{post.createdAt}</span>
              </div>
            </div>
          </div>

          {/* Post category pill */}
          <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200/80">
            {post.type === 'complaint'
              ? '🛡️ Complaint'
              : post.type === 'suggestion'
              ? '💡 Suggestion'
              : post.type === 'poll'
              ? '📊 Student Poll'
              : '💬 Freedom Wall'}
          </span>
        </div>

        {/* Post Title if available */}
        {post.title && (
          <h3 className="font-bold text-slate-900 text-base mb-1.5 leading-snug">
            {post.title}
          </h3>
        )}

        {/* Content body */}
        <p className="text-slate-800 text-sm leading-relaxed whitespace-pre-line mb-4 font-normal">
          {post.content}
        </p>

        {/* Poll Options (If type === 'poll') */}
        {post.type === 'poll' && post.pollOptions && (
          <div className="my-3 space-y-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>CSHS Student Poll ({formatCount(post.pollTotalVotes || 0)} votes)</span>
              <span className="text-[11px] text-slate-500 font-normal">Tap to vote</span>
            </div>

            {post.pollOptions.map((opt) => {
              const total = post.pollTotalVotes || 1;
              const percentage = Math.round((opt.votes / total) * 100) || 0;

              return (
                <button
                  key={opt.id}
                  onClick={() => onVotePoll(post.id, opt.id)}
                  className={`w-full relative overflow-hidden rounded-lg p-2.5 text-left border text-xs font-medium transition-all ${
                    opt.userVoted
                      ? 'border-sky-500 bg-sky-50/70 text-sky-950 font-bold'
                      : 'border-slate-200 bg-white hover:bg-slate-100/70 text-slate-800'
                  }`}
                >
                  {/* Progress fill */}
                  <div
                    className={`absolute inset-y-0 left-0 transition-all duration-500 ${
                      opt.userVoted ? 'bg-sky-200/60' : 'bg-slate-200/50'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />

                  <div className="relative flex items-center justify-between z-10">
                    <span className="flex items-center gap-1.5">
                      {opt.userVoted && <Check className="w-3.5 h-3.5 text-sky-700" />}
                      <span>{opt.text}</span>
                    </span>
                    <span className="font-mono text-slate-600 font-semibold ml-2">
                      {percentage}% ({formatCount(opt.votes)})
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Footer actions: Upvote, Downvote, Comments, Share */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
          {/* Vote buttons matching wireframe: [ThumbsUp count] [ThumbsDown count] */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onVotePost(post.id, 'up')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-semibold transition-all ${
                post.userVote === 'up'
                  ? 'bg-amber-100 border-amber-400 text-amber-900 shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
              }`}
            >
              <ThumbsUp className={`w-3.5 h-3.5 ${post.userVote === 'up' ? 'text-amber-600 fill-amber-500' : 'text-slate-600'}`} />
              <span>{formatCount(post.upvotes)}</span>
            </button>

            <button
              onClick={() => onVotePost(post.id, 'down')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-semibold transition-all ${
                post.userVote === 'down'
                  ? 'bg-rose-100 border-rose-400 text-rose-900 shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
              }`}
            >
              <ThumbsDown className={`w-3.5 h-3.5 ${post.userVote === 'down' ? 'text-rose-600 fill-rose-500' : 'text-slate-600'}`} />
              <span>{formatCount(post.downvotes)}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Comment Toggle */}
            <button
              onClick={() => setShowComments(!showComments)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-medium transition-all ${
                showComments
                  ? 'bg-sky-50 border-sky-300 text-sky-800'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-slate-600" />
              <span>{formatCount(post.comments.length)} comments</span>
            </button>

            {/* Share */}
            <button
              onClick={handleShare}
              title="Copy share link"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-800 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{copiedLink ? 'Copied!' : 'Share'}</span>
            </button>
          </div>
        </div>

        {/* Inline Comments Section */}
        {showComments && (
          <div className="mt-4 pt-3 border-t border-slate-100 space-y-3">
            {/* Add Comment Input Form */}
            <form onSubmit={handleSubmitComment} className="space-y-2">
              <div className="relative">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Join the discussion... (Bawal foul language, keep it respectful!)"
                  rows={2}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 text-slate-800 placeholder:text-slate-400"
                />
              </div>

              <div className="flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => setCommentAsAnon(!commentAsAnon)}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded text-[11px] font-medium border transition-colors ${
                    commentAsAnon
                      ? 'bg-purple-100 text-purple-900 border-purple-300'
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  <EyeOff className="w-3 h-3 text-purple-600" />
                  <span>{commentAsAnon ? 'Posting as Anonymous' : `Post as ${currentUser.name}`}</span>
                </button>

                <button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="flex items-center gap-1 px-3 py-1.5 bg-[#4B6584] hover:bg-[#3b516b] text-white rounded-lg text-xs font-semibold disabled:opacity-50 transition-colors shadow-2xs"
                >
                  <Send className="w-3 h-3" />
                  <span>Reply</span>
                </button>
              </div>
            </form>

            {/* Existing Comments List */}
            <div className="space-y-2.5 pt-1">
              {post.comments.length === 0 ? (
                <p className="text-xs text-slate-400 italic text-center py-2">
                  No comments yet. Be the first to chime in!
                </p>
              ) : (
                post.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/80 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-bold text-slate-800">
                        {comment.isAnonymous ? (
                          <span className="flex items-center gap-1 text-purple-700">
                            <EyeOff className="w-3 h-3" />
                            {comment.authorName}
                          </span>
                        ) : (
                          <span>{comment.authorName}</span>
                        )}
                        <span className="text-[10px] font-normal text-slate-400">
                          • {comment.createdAt}
                        </span>
                      </div>
                      <span className="text-[10px] font-semibold text-slate-500">
                        👍 {comment.upvotes}
                      </span>
                    </div>
                    <p className="text-slate-700 text-xs leading-relaxed">
                      {comment.content}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </article>
  );
};
