/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  initialCurrentUser, 
  initialHeadlines, 
  initialPosts, 
  initialGroupChats, 
  initialDiscussions, 
  initialNotifications,
  initialCategories
} from './data/initialData';
import { Post, UserProfile, GroupChat, SchoolIssue, AppNotification, ComplaintStatus, PostType } from './types';
import { Header } from './components/Header';
import { SidebarProfile } from './components/SidebarProfile';
import { Feed } from './components/Feed';
import { DiscussionsAndGCs } from './components/DiscussionsAndGCs';
import { ChatModal } from './components/ChatModal';
import { CreatePostModal } from './components/CreatePostModal';
import { ComplaintTrackerModal } from './components/ComplaintTrackerModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { NotificationsPopover } from './components/NotificationsPopover';

export default function App() {
  // Load state from localStorage or fallback to defaults
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('cshs_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.name === 'Josh Munsayac') {
          parsed.name = 'Eurl Cuario';
          parsed.handle = '@eurl_cuario';
        }
        return parsed;
      } catch {
        // ignore and fallback
      }
    }
    return initialCurrentUser;
  });

  const [headlines, setHeadlines] = useState<string[]>(() => {
    const saved = localStorage.getItem('cshs_headlines');
    return saved ? JSON.parse(saved) : initialHeadlines;
  });

  const [currentHeadlineIndex, setCurrentHeadlineIndex] = useState(0);

  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem('cshs_posts');
    return saved ? JSON.parse(saved) : initialPosts;
  });

  const [groupChats, setGroupChats] = useState<GroupChat[]>(() => {
    const saved = localStorage.getItem('cshs_gcs');
    return saved ? JSON.parse(saved) : initialGroupChats;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('cshs_notifs');
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  const [discussions] = useState<SchoolIssue[]>(initialDiscussions);

  // UI state
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeFilter, setActiveFilter] = useState<'hot' | 'new' | 'top' | 'suggestions' | 'complaints' | 'polls'>('hot');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [activeGroupChat, setActiveGroupChat] = useState<GroupChat | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createModalInitialType, setCreateModalInitialType] = useState<PostType>('general');
  const [isComplaintTrackerOpen, setIsComplaintTrackerOpen] = useState(false);
  const [selectedTimelineTicket, setSelectedTimelineTicket] = useState<Post | null>(null);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('cshs_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('cshs_headlines', JSON.stringify(headlines));
  }, [headlines]);

  useEffect(() => {
    localStorage.setItem('cshs_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('cshs_gcs', JSON.stringify(groupChats));
  }, [groupChats]);

  useEffect(() => {
    localStorage.setItem('cshs_notifs', JSON.stringify(notifications));
  }, [notifications]);

  // Rotate headline every 12 seconds automatically
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeadlineIndex((prev) => (prev + 1) % headlines.length);
    }, 12000);
    return () => clearInterval(timer);
  }, [headlines.length]);

  const handleNextHeadline = () => {
    setCurrentHeadlineIndex((prev) => (prev + 1) % headlines.length);
  };

  // Toggle roles: Student <-> Admin
  const handleToggleRole = () => {
    setCurrentUser((prev) => ({
      ...prev,
      role: prev.role === 'admin' ? 'student' : 'admin',
    }));
  };

  // Toggle anonymous mode
  const handleToggleAnonymous = () => {
    setCurrentUser((prev) => ({
      ...prev,
      role: prev.role === 'anonymous' ? 'student' : 'anonymous',
    }));
  };

  // Upvote / Downvote logic
  const handleVotePost = (postId: string, direction: 'up' | 'down') => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id !== postId) return post;

        let upvotes = post.upvotes;
        let downvotes = post.downvotes;
        let newVote: 'up' | 'down' | null = direction;

        if (post.userVote === direction) {
          // Toggle off
          newVote = null;
          if (direction === 'up') upvotes -= 1;
          if (direction === 'down') downvotes -= 1;
        } else {
          // Switching or first time
          if (post.userVote === 'up') upvotes -= 1;
          if (post.userVote === 'down') downvotes -= 1;

          if (direction === 'up') upvotes += 1;
          if (direction === 'down') downvotes += 1;
        }

        return {
          ...post,
          upvotes,
          downvotes,
          userVote: newVote,
        };
      })
    );
  };

  // Add Comment
  const handleAddComment = (postId: string, content: string, isAnon: boolean) => {
    const newCommentObj = {
      id: `comm-${Date.now()}`,
      authorName: isAnon ? 'Secret Kuyog' : currentUser.name,
      authorHandle: isAnon ? '@anon_cshs' : currentUser.handle,
      authorAvatar: isAnon ? undefined : currentUser.avatar,
      isAnonymous: isAnon,
      content,
      createdAt: 'Just now',
      upvotes: 1,
    };

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        return {
          ...p,
          comments: [newCommentObj, ...p.comments],
        };
      })
    );

    // Increase reputation slightly
    setCurrentUser((u) => ({ ...u, reputation: u.reputation + 5 }));
  };

  // Vote on Poll
  const handleVotePoll = (postId: string, optionId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId || !post.pollOptions) return post;

        let total = post.pollTotalVotes || 0;
        const updatedOptions = post.pollOptions.map((opt) => {
          if (opt.id === optionId) {
            if (opt.userVoted) return opt; // already voted
            total += 1;
            return { ...opt, votes: opt.votes + 1, userVoted: true };
          }
          if (opt.userVoted) {
            // Remove previous vote
            total -= 1;
            return { ...opt, votes: Math.max(0, opt.votes - 1), userVoted: false };
          }
          return opt;
        });

        return {
          ...post,
          pollOptions: updatedOptions,
          pollTotalVotes: total,
        };
      })
    );
  };

  // Submit new post / suggestion / complaint / poll
  const handleSubmitPost = (postData: Partial<Post>) => {
    const isAnon = postData.isAnonymous ?? (currentUser.role === 'anonymous');
    const newPost: Post = {
      id: `post-${Date.now()}`,
      type: postData.type || 'general',
      title: postData.title,
      content: postData.content || '',
      authorName: isAnon ? 'Secret Kuyog' : currentUser.name,
      authorHandle: isAnon ? '@anon_cshs' : currentUser.handle,
      authorAvatar: isAnon ? undefined : currentUser.avatar,
      isAnonymous: isAnon,
      category: postData.category || 'community',
      createdAt: 'Just now',
      upvotes: 1,
      downvotes: 0,
      userVote: 'up',
      comments: [],
      ticketId: postData.ticketId,
      targetOffice: postData.targetOffice,
      complaintStatus: postData.complaintStatus,
      statusUpdates: postData.statusUpdates,
      pollOptions: postData.pollOptions,
      pollTotalVotes: postData.pollTotalVotes,
    };

    setPosts((prev) => [newPost, ...prev]);

    if (postData.type === 'complaint') {
      setCurrentUser((u) => ({ ...u, complaintsFiled: u.complaintsFiled + 1 }));
      setNotifications((n) => [
        {
          id: `n-${Date.now()}`,
          title: 'Complaint Registered',
          description: `Ticket ${newPost.ticketId} assigned for "${newPost.title || newPost.content.slice(0, 30)}". Track updates in real-time.`,
          time: 'Just now',
          read: false,
          type: 'complaint',
        },
        ...n,
      ]);
    }
  };

  // Send message in Group Chat + simulated witty replies
  const handleSendMessage = (chatId: string, text: string) => {
    const userMsg = {
      id: `msg-${Date.now()}`,
      senderName: currentUser.role === 'anonymous' ? 'Cabiao Learner' : currentUser.name,
      text,
      time: 'Just now',
      isUser: true,
    };

    setGroupChats((prev) =>
      prev.map((gc) => {
        if (gc.id !== chatId) return gc;
        return {
          ...gc,
          snippet: text,
          messages: [...gc.messages, userMsg],
        };
      })
    );

    // Update active modal chat reference if open
    setActiveGroupChat((prev) =>
      prev && prev.id === chatId
        ? {
            ...prev,
            snippet: text,
            messages: [...prev.messages, userMsg],
          }
        : prev
    );

    // Simulated quick schoolmate reply
    setTimeout(() => {
      let replySender = 'Rene';
      let replyText = 'Uy nabasa ko yan haha!';

      if (chatId === 'gc-1') {
        replySender = 'Rene';
        replyText = 'Hahahahaha grabe kayo! May bawas na sa sabon next week!';
      } else if (chatId === 'gc-2') {
        replySender = 'Mark TVL';
        replyText = 'Sige kita-kits sa library mamayang 4:00 PM!';
      } else if (chatId === 'gc-3') {
        replySender = 'Eunice STEM';
        replyText = 'Thanks sa update! Mag-ready na tayo para sa recitation!';
      } else if (chatId === 'gc-4') {
        replySender = 'Crush Watcher';
        replyText = 'May bagong crush na tayo sa STEM-B next semester haha!';
      } else if (chatId === 'gc-5') {
        replySender = 'SSG Vice President';
        replyText = 'Noted po! We will discuss this in today’s council meeting.';
      }

      const botMsg = {
        id: `msg-rep-${Date.now()}`,
        senderName: replySender,
        text: replyText,
        time: 'Just now',
        isUser: false,
      };

      setGroupChats((prev) =>
        prev.map((gc) => {
          if (gc.id !== chatId) return gc;
          return {
            ...gc,
            snippet: replyText,
            messages: [...gc.messages, botMsg],
          };
        })
      );

      setActiveGroupChat((prev) =>
        prev && prev.id === chatId
          ? {
              ...prev,
              snippet: replyText,
              messages: [...prev.messages, botMsg],
            }
          : prev
      );
    }, 1200);
  };

  // Admin: Update complaint status & official note
  const handleUpdateComplaintStatus = (postId: string, newStatus: ComplaintStatus, officialNote: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        const newUpdate = {
          date: new Date().toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
          status: newStatus,
          note: officialNote,
          updatedBy: `${currentUser.name} (SSG Admin)`,
        };

        return {
          ...p,
          complaintStatus: newStatus,
          statusUpdates: [newUpdate, ...(p.statusUpdates || [])],
        };
      })
    );

    // Notify user
    const targetPost = posts.find((p) => p.id === postId);
    if (targetPost) {
      setNotifications((n) => [
        {
          id: `n-${Date.now()}`,
          title: `Ticket Status: ${newStatus}`,
          description: `Ticket ${targetPost.ticketId || 'CSHS'} has been updated: ${officialNote}`,
          time: 'Just now',
          read: false,
          type: 'complaint',
        },
        ...n,
      ]);
    }
  };

  // Admin: Headline Management
  const handleAddHeadline = (hl: string) => {
    setHeadlines((prev) => [hl, ...prev]);
  };

  const handleRemoveHeadline = (index: number) => {
    setHeadlines((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Admin: Publish Announcement
  const handlePublishAnnouncement = (title: string, content: string) => {
    const announcementPost: Post = {
      id: `post-ann-${Date.now()}`,
      type: 'announcement',
      title,
      content,
      authorName: 'Supreme Secondary Learner Gov (SSG)',
      authorHandle: '@ssg_cshs_official',
      isAnonymous: false,
      category: 'campus_news',
      createdAt: 'Just now',
      upvotes: 120,
      downvotes: 1,
      userVote: 'up',
      pinned: true,
      comments: [],
    };

    setPosts((prev) => [announcementPost, ...prev]);
    setNotifications((n) => [
      {
        id: `n-${Date.now()}`,
        title: 'New Official Announcement',
        description: title,
        time: 'Just now',
        read: false,
        type: 'announcement',
      },
      ...n,
    ]);
  };

  // Update Hobbies
  const handleUpdateHobbies = (newHobbies: string[]) => {
    setCurrentUser((prev) => ({ ...prev, hobbies: newHobbies }));
  };

  // Filter posts
  const filteredPosts = posts
    .filter((post) => {
      // Category filter
      if (selectedCategory !== 'all') {
        if (selectedCategory === 'suggestions') {
          if (post.type !== 'suggestion') return false;
        } else if (selectedCategory === 'complaints') {
          if (post.type !== 'complaint') return false;
        } else if (selectedCategory === 'polls') {
          if (post.type !== 'poll') return false;
        } else if (post.category !== selectedCategory) {
          return false;
        }
      }

      // Quick tab filter
      if (activeFilter === 'suggestions' && post.type !== 'suggestion') return false;
      if (activeFilter === 'complaints' && post.type !== 'complaint') return false;
      if (activeFilter === 'polls' && post.type !== 'poll') return false;

      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesContent = post.content.toLowerCase().includes(query);
        const matchesTitle = post.title?.toLowerCase().includes(query);
        const matchesAuthor = post.authorName.toLowerCase().includes(query);
        const matchesTicket = post.ticketId?.toLowerCase().includes(query);
        if (!matchesContent && !matchesTitle && !matchesAuthor && !matchesTicket) {
          return false;
        }
      }

      return true;
    })
    .sort((a, b) => {
      // Pinned always on top
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;

      if (activeFilter === 'top') {
        return b.upvotes - a.upvotes;
      }
      if (activeFilter === 'new') {
        return b.id.localeCompare(a.id);
      }
      // 'hot' default: upvotes combined with comments
      const scoreA = a.upvotes + a.comments.length * 5;
      const scoreB = b.upvotes + b.comments.length * 5;
      return scoreB - scoreA;
    });

  const allComplaintsAndSuggestions = posts.filter(
    (p) => p.type === 'complaint' || p.type === 'suggestion'
  );

  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  const currentCategoryName =
    initialCategories.find((c) => c.id === selectedCategory)?.name || 'All Feeds';

  return (
    <div className="min-h-screen bg-[#EEF2F6] text-slate-800 font-sans flex flex-col">
      {/* Top Header */}
      <Header
        currentUser={currentUser}
        headlines={headlines}
        currentHeadlineIndex={currentHeadlineIndex}
        onNextHeadline={handleNextHeadline}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onToggleRole={handleToggleRole}
        onToggleAnonymous={handleToggleAnonymous}
        onOpenComplaintTracker={() => {
          setSelectedTimelineTicket(null);
          setIsComplaintTrackerOpen(true);
        }}
        onOpenAdminDashboard={() => setIsAdminDashboardOpen(true)}
        notifications={notifications}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        unreadNotificationsCount={unreadNotifsCount}
        onOpenCreatePost={() => {
          setCreateModalInitialType('general');
          setIsCreateModalOpen(true);
        }}
      />

      {/* Main 3-Column Layout Matching User's Prototype Wireframe */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Left Column: Profile & Categories (3 cols on large screen) */}
          <aside className="lg:col-span-3 order-2 lg:order-1">
            <SidebarProfile
              currentUser={currentUser}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              onToggleAnonymous={handleToggleAnonymous}
              onOpenCreateModal={(type) => {
                setCreateModalInitialType(type || 'general');
                setIsCreateModalOpen(true);
              }}
              onOpenComplaintTracker={() => {
                setSelectedTimelineTicket(null);
                setIsComplaintTrackerOpen(true);
              }}
              onUpdateHobbies={handleUpdateHobbies}
            />
          </aside>

          {/* Center Column: Main Feed (6 cols on large screen) */}
          <section className="lg:col-span-6 order-1 lg:order-2">
            <Feed
              posts={filteredPosts}
              currentUser={currentUser}
              activeFilter={activeFilter}
              onChangeFilter={setActiveFilter}
              selectedCategoryName={currentCategoryName}
              onVotePost={handleVotePost}
              onAddComment={handleAddComment}
              onVotePoll={handleVotePoll}
              onOpenCreateModal={(type) => {
                setCreateModalInitialType(type || 'general');
                setIsCreateModalOpen(true);
              }}
              onOpenTimelineModal={(post) => {
                setSelectedTimelineTicket(post);
                setIsComplaintTrackerOpen(true);
              }}
            />
          </section>

          {/* Right Column: Discussions & Group Chats (3 cols on large screen) */}
          <aside className="lg:col-span-3 order-3">
            <DiscussionsAndGCs
              issues={discussions}
              groupChats={groupChats}
              onOpenGroupChat={(chat) => setActiveGroupChat(chat)}
              onSelectIssue={(issue) => {
                setSearchQuery(issue.tag);
              }}
            />
          </aside>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="mt-auto bg-slate-200/70 border-t border-slate-300/80 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-semibold text-slate-700">
            <span>BOSES</span>
            <span>•</span>
            <span>Cabiao Senior High School Digital Portal</span>
          </div>
          <div className="text-[11px] text-slate-500">
            Digital Suggestion Box • Complaint Status Tracker • Student Freedom Wall • Group Chats
          </div>
        </div>
      </footer>

      {/* Interactive Group Chat Modal */}
      {activeGroupChat && (
        <ChatModal
          chat={activeGroupChat}
          currentUser={currentUser}
          onClose={() => setActiveGroupChat(null)}
          onSendMessage={handleSendMessage}
        />
      )}

      {/* Create Post / Suggestion / Complaint / Poll Modal */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        initialType={createModalInitialType}
        currentUser={currentUser}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmitPost={handleSubmitPost}
      />

      {/* Complaint Status Tracker Modal */}
      <ComplaintTrackerModal
        isOpen={isComplaintTrackerOpen}
        onClose={() => setIsComplaintTrackerOpen(false)}
        complaints={allComplaintsAndSuggestions}
        selectedTicketPost={selectedTimelineTicket}
        onOpenCreateComplaint={() => {
          setIsComplaintTrackerOpen(false);
          setCreateModalInitialType('complaint');
          setIsCreateModalOpen(true);
        }}
      />

      {/* Admin / SSG Officer Dashboard Modal */}
      <AdminDashboardModal
        isOpen={isAdminDashboardOpen}
        onClose={() => setIsAdminDashboardOpen(false)}
        complaints={allComplaintsAndSuggestions}
        headlines={headlines}
        currentUser={currentUser}
        onUpdateComplaintStatus={handleUpdateComplaintStatus}
        onAddHeadline={handleAddHeadline}
        onRemoveHeadline={handleRemoveHeadline}
        onPublishAnnouncement={handlePublishAnnouncement}
      />

      {/* Notifications Popover */}
      <NotificationsPopover
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={() => {
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        }}
        onSelectNotification={(n) => {
          if (n.type === 'complaint') {
            setIsComplaintTrackerOpen(true);
          }
        }}
      />
    </div>
  );
}
