import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Send, 
  Users, 
  Smile, 
  Sparkles, 
  Check, 
  ShieldCheck, 
  Info,
  Flame
} from 'lucide-react';
import { GroupChat, GroupChatMessage, UserProfile } from '../types';

interface ChatModalProps {
  chat: GroupChat | null;
  currentUser: UserProfile;
  onClose: () => void;
  onSendMessage: (chatId: string, text: string) => void;
}

export const ChatModal: React.FC<ChatModalProps> = ({
  chat,
  currentUser,
  onClose,
  onSendMessage,
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat?.messages]);

  if (!chat) return null;

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(chat.id, inputText.trim());
    setInputText('');
  };

  const handleQuickReaction = (emojiText: string) => {
    onSendMessage(chat.id, emojiText);
  };

  const quickReactions = ['😂 Hahaha', '😭 Grabe naman', '🔥 Laban CSHS', '👀 Legit ba?', '🧼 Sabon ni Rene!'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs">
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col h-[600px] max-h-[90vh] overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#4B6584] text-white px-4 py-3 flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center font-bold text-base border border-white/20">
              {chat.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-bold text-sm leading-snug flex items-center gap-1.5 text-white">
                <span>{chat.name}</span>
                <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-normal">
                  {chat.membersCount} students
                </span>
              </h3>
              <p className="text-[11px] text-slate-200 truncate max-w-[260px]">
                {chat.description}
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

        {/* Notice banner */}
        <div className="bg-sky-50 px-4 py-1.5 border-b border-sky-100 flex items-center justify-between text-[11px] text-sky-800">
          <span>💬 CSHS Student Circle • Safe, moderated student space</span>
          <span className="font-semibold text-emerald-600 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live
          </span>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/70">
          <div className="text-center py-2">
            <span className="text-[11px] bg-slate-200/80 text-slate-600 px-3 py-1 rounded-full font-medium">
              Start of group conversation
            </span>
          </div>

          {chat.messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.isUser ? 'items-end' : 'items-start'}`}
            >
              {!msg.isUser && (
                <span className="text-[10px] font-bold text-slate-500 ml-2 mb-0.5">
                  {msg.senderName}
                </span>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed shadow-2xs ${
                  msg.isUser
                    ? 'bg-[#4B6584] text-white rounded-tr-xs'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs'
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>
                <span
                  className={`block text-[9px] mt-1 text-right ${
                    msg.isUser ? 'text-slate-300' : 'text-slate-400'
                  }`}
                >
                  {msg.time}
                </span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Reactions bar */}
        <div className="px-3 py-1.5 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <span className="text-[10px] text-slate-400 shrink-0 font-medium">Quick:</span>
          {quickReactions.map((emoji) => (
            <button
              key={emoji}
              onClick={() => handleQuickReaction(emoji)}
              className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 shrink-0 transition-colors"
            >
              {emoji}
            </button>
          ))}
        </div>

        {/* Input Footer */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            placeholder={`Message ${chat.name}...`}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 text-xs px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-300 focus:outline-none focus:ring-1 focus:ring-sky-500 text-slate-800 placeholder:text-slate-400"
            autoFocus
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-2 rounded-xl bg-[#4B6584] hover:bg-[#3b516b] text-white disabled:opacity-40 transition-colors shadow-2xs shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
