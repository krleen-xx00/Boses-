import React from 'react';
import { Bell, CheckCheck, X, ShieldAlert, Sparkles, MessageSquare } from 'lucide-react';
import { AppNotification } from '../types';

interface NotificationsPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAllAsRead: () => void;
  onSelectNotification: (notif: AppNotification) => void;
}

export const NotificationsPopover: React.FC<NotificationsPopoverProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onSelectNotification,
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/20 sm:bg-transparent"
      onClick={onClose}
    >
      <div
        className="absolute top-14 right-2 sm:right-6 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-100 z-50"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#4B6584] text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-amber-300" />
            <span className="font-bold text-xs uppercase tracking-wider">
              Notifications & Alerts
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onMarkAllAsRead}
              className="text-[11px] text-slate-200 hover:text-white flex items-center gap-1 font-semibold"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark all read</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded text-slate-300 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 p-1">
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400">
              No notifications at the moment.
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => {
                  onSelectNotification(n);
                  onClose();
                }}
                className={`p-3 text-xs cursor-pointer hover:bg-slate-50 transition-colors rounded-lg flex items-start gap-2.5 ${
                  !n.read ? 'bg-sky-50/60 font-medium' : 'text-slate-600'
                }`}
              >
                <div className="p-1.5 rounded-lg bg-slate-100 text-slate-700 shrink-0 mt-0.5">
                  {n.type === 'complaint' ? (
                    <ShieldAlert className="w-4 h-4 text-teal-600" />
                  ) : n.type === 'vote' ? (
                    <Sparkles className="w-4 h-4 text-amber-500" />
                  ) : (
                    <MessageSquare className="w-4 h-4 text-blue-600" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h5 className="font-bold text-slate-900 text-xs truncate">
                      {n.title}
                    </h5>
                    <span className="text-[10px] text-slate-400 shrink-0 font-normal">
                      {n.time}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                    {n.description}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center text-[11px] text-slate-500">
          Cabiao Senior High School BOSES
        </div>
      </div>
    </div>
  );
};
