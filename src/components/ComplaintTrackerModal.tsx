import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  Building2, 
  ChevronRight, 
  Calendar, 
  User, 
  EyeOff, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Post, ComplaintStatus } from '../types';

interface ComplaintTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  complaints: Post[];
  selectedTicketPost?: Post | null;
  onOpenCreateComplaint: () => void;
}

export const ComplaintTrackerModal: React.FC<ComplaintTrackerModalProps> = ({
  isOpen,
  onClose,
  complaints,
  selectedTicketPost,
  onOpenCreateComplaint,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Under Review' | 'In Progress' | 'Resolved'>('all');
  const [activeTicket, setActiveTicket] = useState<Post | null>(selectedTicketPost || complaints[0] || null);

  if (!isOpen) return null;

  const filteredComplaints = complaints.filter((c) => {
    const matchesSearch = 
      (c.ticketId?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (c.title?.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (c.content.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || c.complaintStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const currentSelected = activeTicket || filteredComplaints[0];

  const getStepIndex = (status?: ComplaintStatus) => {
    switch (status) {
      case 'Submitted': return 1;
      case 'Under Review': return 2;
      case 'In Progress': return 3;
      case 'Resolved': return 4;
      default: return 1;
    }
  };

  const steps = [
    { title: 'Submitted', desc: 'Received & Logged' },
    { title: 'Under Review', desc: 'SSG Assessment' },
    { title: 'In Progress', desc: 'Action in Effect' },
    { title: 'Resolved', desc: 'Completed & Checked' },
  ];

  const currentStep = getStepIndex(currentSelected?.complaintStatus);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col h-[650px] max-h-[92vh] overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-[#4B6584] text-white px-5 py-3.5 flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/10 border border-white/20">
              <ShieldCheck className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-white">
                Cabiao SHS Complaint & Suggestion Status Tracker
              </h3>
              <p className="text-[11px] text-slate-200">
                Official transparency and accountability portal for student welfare
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenCreateComplaint}
              className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-xs transition-colors shadow-2xs hidden sm:flex items-center gap-1"
            >
              <span>+ New Complaint</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by ticket ID (e.g. CSHS-2026-089) or issue keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg bg-white border border-slate-300 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 text-xs">
            {(['all', 'Under Review', 'In Progress', 'Resolved'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                  statusFilter === st
                    ? 'bg-[#4B6584] text-white'
                    : 'bg-white hover:bg-slate-200 text-slate-600 border border-slate-200'
                }`}
              >
                {st === 'all' ? 'All Status' : st}
              </button>
            ))}
          </div>
        </div>

        {/* Content Body: Split View (List on left, detail on right) */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Tickets List Column */}
          <div className="w-full md:w-5/12 border-r border-slate-200 overflow-y-auto divide-y divide-slate-100 bg-white">
            {filteredComplaints.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No complaint tickets found.
              </div>
            ) : (
              filteredComplaints.map((ticket) => {
                const isSelected = currentSelected?.id === ticket.id;
                return (
                  <div
                    key={ticket.id}
                    onClick={() => setActiveTicket(ticket)}
                    className={`p-3.5 cursor-pointer transition-colors text-left ${
                      isSelected
                        ? 'bg-slate-100/90 border-l-4 border-l-[#4B6584]'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="font-mono text-[11px] font-bold text-slate-700 bg-slate-200/70 px-1.5 py-0.5 rounded">
                        {ticket.ticketId || 'CSHS-TICKET'}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          ticket.complaintStatus === 'Resolved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : ticket.complaintStatus === 'In Progress'
                            ? 'bg-sky-100 text-sky-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {ticket.complaintStatus}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                      {ticket.title || ticket.content}
                    </h4>

                    <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                      {ticket.content}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2">
                      <span>Office: {ticket.targetOffice || 'SSG'}</span>
                      <span>{ticket.createdAt}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Ticket Detail & Timeline Column */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50">
            {currentSelected ? (
              <div className="space-y-6">
                {/* Header Info */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-mono font-bold text-sm text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-300">
                      Ticket Reference: {currentSelected.ticketId}
                    </span>
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${
                        currentSelected.complaintStatus === 'Resolved'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : currentSelected.complaintStatus === 'In Progress'
                          ? 'bg-sky-100 text-sky-800 border border-sky-300'
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}
                    >
                      Status: {currentSelected.complaintStatus}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-base leading-snug">
                      {currentSelected.title || 'Reported Campus Concern'}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 whitespace-pre-line leading-relaxed">
                      {currentSelected.content}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Filer:</span>
                      <span className="font-semibold text-slate-700">
                        {currentSelected.isAnonymous ? 'Secret Kuyog (Anonymous)' : currentSelected.authorName}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Target Office:</span>
                      <span className="font-semibold text-slate-700">
                        {currentSelected.targetOffice || 'Supreme Secondary Learner Gov (SSG)'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Date Filed:</span>
                      <span className="font-semibold text-slate-700">
                        {currentSelected.createdAt}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 4-Step Progress Indicator */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-4">
                    Resolution Progress
                  </h4>

                  <div className="grid grid-cols-4 gap-2 relative">
                    {steps.map((step, idx) => {
                      const stepNum = idx + 1;
                      const isDone = stepNum <= currentStep;
                      const isCurrent = stepNum === currentStep;

                      return (
                        <div key={step.title} className="flex flex-col items-center text-center">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mb-1.5 transition-colors ${
                              isDone
                                ? 'bg-[#4B6584] text-white shadow-xs'
                                : 'bg-slate-200 text-slate-500'
                            }`}
                          >
                            {isDone ? '✓' : stepNum}
                          </div>
                          <span className={`text-xs font-bold leading-tight ${isCurrent ? 'text-sky-900' : 'text-slate-700'}`}>
                            {step.title}
                          </span>
                          <span className="text-[10px] text-slate-400 hidden sm:inline">
                            {step.desc}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Audit Trail / Timeline Log */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>Official Action Log & Remarks</span>
                  </h4>

                  <div className="space-y-3 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-slate-200">
                    {(currentSelected.statusUpdates && currentSelected.statusUpdates.length > 0) ? (
                      currentSelected.statusUpdates.map((update, index) => (
                        <div key={index} className="relative pl-7 text-xs">
                          <span className="absolute left-1.5 top-1 w-3 h-3 rounded-full bg-[#4B6584] border-2 border-white ring-2 ring-slate-200" />
                          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                            <div className="flex items-center justify-between text-[11px] mb-1">
                              <span className="font-bold text-slate-800">
                                {update.status}
                              </span>
                              <span className="text-slate-400 font-mono text-[10px]">
                                {update.date}
                              </span>
                            </div>
                            <p className="text-slate-700 text-xs">
                              {update.note}
                            </p>
                            <span className="block mt-1 text-[10px] text-slate-500 font-medium">
                              Logged by: {update.updatedBy}
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="pl-7 text-xs text-slate-500">
                        Received ticket. Awaiting first inspection by designated school officer.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                Select a ticket from the left to view timeline & status details.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
