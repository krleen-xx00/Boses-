export type PostType = 'general' | 'suggestion' | 'complaint' | 'poll' | 'announcement';

export type ComplaintStatus = 'Submitted' | 'Under Review' | 'In Progress' | 'Resolved' | 'Archived';

export interface UserProfile {
  id: string;
  name: string;
  handle: string;
  gradeAndStrand: string; // e.g. "Grade 12 - STEM A"
  avatar: string;
  role: 'student' | 'admin' | 'anonymous';
  hobbies: string[];
  reputation: number;
  complaintsFiled: number;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
  userVoted?: boolean;
}

export interface Comment {
  id: string;
  authorName: string;
  authorHandle: string;
  authorAvatar?: string;
  isAnonymous: boolean;
  content: string;
  createdAt: string;
  upvotes: number;
  userVoted?: 'up' | 'down' | null;
}

export interface Post {
  id: string;
  type: PostType;
  title?: string;
  content: string;
  authorName: string;
  authorHandle: string;
  authorAvatar?: string;
  isAnonymous: boolean;
  category: string;
  createdAt: string;
  upvotes: number;
  downvotes: number;
  userVote?: 'up' | 'down' | null;
  comments: Comment[];
  pinned?: boolean;
  
  // Specific to Suggestion & Complaint
  ticketId?: string; // e.g. "CSHS-2026-089"
  targetOffice?: 'Supreme Secondary Learner Gov (SSG)' | 'Prefect of Discipline' | 'School Principal' | 'Guidance Office' | 'Canteen & Facilities' | 'Department Head';
  complaintStatus?: ComplaintStatus;
  statusUpdates?: {
    date: string;
    status: ComplaintStatus;
    note: string;
    updatedBy: string;
  }[];

  // Specific to Poll
  pollOptions?: PollOption[];
  pollTotalVotes?: number;
}

export interface GroupChatMessage {
  id: string;
  senderName: string;
  senderAvatar?: string;
  isUser: boolean;
  text: string;
  time: string;
}

export interface GroupChat {
  id: string;
  name: string;
  snippet: string;
  unreadCount: number;
  avatarColor: string;
  membersCount: number;
  description: string;
  messages: GroupChatMessage[];
}

export interface SchoolIssue {
  id: string;
  title: string;
  tag: string;
  time: string;
  repliesCount: number;
}

export interface AppNotification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: 'complaint' | 'vote' | 'comment' | 'announcement';
}
