'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  Inbox,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Plus,
  Search,
  Filter,
  MessageSquare,
  ChevronRight,
  Send,
  X,
  TrendingUp,
  ChevronLeft,
  CheckSquare,
  Building2,
  Settings,
  Users,
  Loader2,
  RefreshCw,
  Mail
} from 'lucide-react';

// --- TYPES ---
type Priority = 'Low' | 'Normal' | 'High' | 'Urgent';
type Channel = 'Email' | 'WhatsApp' | 'Phone Call' | 'Walk-in' | 'Physical Letter';
type CaseType = 'General Request' | 'Sponsorship' | 'Student Welfare' | 'Academic Matter' | 'Venue / Facility';
type Status = 'Received' | 'In Progress' | 'Awaiting Decision' | 'Resolved';

interface ActionItem {
  id: string;
  ticket_id: string;
  title: string;
  owner: string;
  due_date: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Overdue';
}

interface Correspondence {
  id: string;
  ticket_id: string;
  direction: 'Incoming' | 'Outgoing' | 'Internal';
  channel: Channel;
  sender: string;
  recipient?: string;
  body_text: string;
  created_at: string;
}

interface Ticket {
  id: string;
  ticket_number: string;
  title: string;
  description?: string;
  requester_name: string;
  organization?: string;
  case_type: CaseType;
  source: Channel;
  priority: Priority;
  status: Status;
  created_at: string;
  next_action: string;
  next_action_owner: string;
  next_action_due_date: string;
  actions?: ActionItem[];
  correspondence?: Correspondence[];
}

export default function SecretariatManagementSystem() {
  const supabase = createClient();

  // Database State
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Layout State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'actions' | 'correspondence' | 'reports' | 'directory' | 'settings'>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');

  // Modals & Drawers
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isQuickIntakeOpen, setIsQuickIntakeOpen] = useState(false);

  // Intake Form State
  const [newTitle, setNewTitle] = useState('');
  const [newRequester, setNewRequester] = useState('');
  const [newOrg, setNewOrg] = useState('');
  const [newCaseType, setNewCaseType] = useState<CaseType>('General Request');
  const [newChannel, setNewChannel] = useState<Channel>('Email');
  const [newPriority, setNewPriority] = useState<Priority>('Normal');
  const [newSummary, setNewSummary] = useState('');

  // Email / Note Reply State
  const [replyBody, setReplyBody] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);

  // --- SUPABASE REALTIME FETCHING ---
  const fetchTickets = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('tickets')
      .select(`
        *,
        actions(*),
        correspondence(*)
      `)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setTickets(data as Ticket[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTickets();

    // Subscribe to database changes (Emails ingested or cases updated)
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tickets' }, () => fetchTickets())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'correspondence' }, () => fetchTickets())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'actions' }, () => fetchTickets())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Compute live stats
  const stats = useMemo(() => {
    const active = tickets.filter(t => t.status !== 'Resolved').length;
    const pendingDecision = tickets.filter(t => t.status === 'Awaiting Decision').length;
    const resolved = tickets.filter(t => t.status === 'Resolved').length;
    return { active, pendingDecision, resolved };
  }, [tickets]);

  // Filtered Tickets
  const filteredTickets = useMemo(() => {
    return tickets.filter(t => {
      const matchesSearch =
        t.ticket_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.requester_name?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
      const matchesPriority = priorityFilter === 'All' || t.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tickets, searchQuery, statusFilter, priorityFilter]);

  // Handle Manual Case Logging
  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newRequester) return;

    // Call database sequence generator function
    const { data: ticketNumber, error: seqError } = await supabase.rpc('generate_ticket_number');
    const finalTicketNum = ticketNumber || `FUNAABSU/REQ/${new Date().getFullYear()}/0001`;

    const { data: insertedTicket, error } = await supabase
      .from('tickets')
      .insert({
        ticket_number: finalTicketNum,
        title: newTitle,
        requester_name: newRequester,
        organization: newOrg || null,
        case_type: newCaseType,
        source: newChannel,
        priority: newPriority,
        status: 'Received',
        next_action: 'Initial review and triage by Secretariat',
        next_action_owner: 'Comrade Gen Sec',
        next_action_due_date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]
      })
      .select()
      .single();

    if (!error && insertedTicket) {
      if (newSummary) {
        await supabase.from('correspondence').insert({
          ticket_id: insertedTicket.id,
          direction: 'Incoming',
          channel: newChannel,
          sender: newRequester,
          body_text: newSummary,
          is_internal_note: false
        });
      }
      fetchTickets();
      setIsQuickIntakeOpen(false);
      setNewTitle('');
      setNewRequester('');
      setNewOrg('');
      setNewSummary('');
    }
  };

  // Dispatch Outbound Email or Internal Note
  const handleSendResponse = async (ticketId: string, recipientEmail: string, isInternalNote: boolean) => {
    if (!replyBody.trim()) return;
    setSendingEmail(true);

    if (isInternalNote) {
      await supabase.from('correspondence').insert({
        ticket_id: ticketId,
        direction: 'Internal',
        channel: 'Email',
        sender: 'Comrade Gen Sec',
        body_text: replyBody,
        is_internal_note: true
      });
      fetchTickets();
      setReplyBody('');
    } else {
      // Outbound Email via API Route
      const response = await fetch('/api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketId,
          recipientEmail,
          subject: selectedTicket?.title,
          bodyText: replyBody
        })
      });

      if (response.ok) {
        setReplyBody('');
        fetchTickets();
      } else {
        alert('Failed to send outbound email response.');
      }
    }
    setSendingEmail(false);
  };

  return (
    <div className="flex h-screen bg-slate-100 text-slate-900 overflow-hidden font-sans">

      {/* --- SIDEBAR NAVIGATION --- */}
      <aside className={`bg-emerald-950 text-white flex flex-col justify-between transition-all duration-300 z-20 ${
        isSidebarCollapsed ? 'w-20' : 'w-64'
      }`}>
        
        {/* Brand Header */}
        <div>
          <div className="h-16 flex items-center justify-between px-4 border-b border-emerald-900">
            {!isSidebarCollapsed && (
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-white text-base shadow">
                  FS
                </div>
                <div>
                  <h1 className="font-bold text-sm leading-tight text-white">FUNAABSU</h1>
                  <p className="text-[10px] text-emerald-400 font-mono">Secretariat Portal</p>
                </div>
              </div>
            )}

            {isSidebarCollapsed && (
              <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-white text-base shadow mx-auto">
                FS
              </div>
            )}

            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-1.5 rounded-lg text-emerald-300 hover:bg-emerald-900/60 transition-colors hidden sm:block"
            >
              {isSidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>
          </div>

          {/* Quick Intake CTA */}
          <div className="p-3">
            <button
              onClick={() => setIsQuickIntakeOpen(true)}
              className={`w-full flex items-center justify-center space-x-2 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold py-2.5 px-3 rounded-lg text-xs transition-colors shadow-sm ${
                isSidebarCollapsed ? 'px-0' : ''
              }`}
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              {!isSidebarCollapsed && <span>Log New Case</span>}
            </button>
          </div>

          {/* Sidebar Nav Items */}
          <nav className="px-2 space-y-1 mt-2">
            {[
              { id: 'dashboard', label: 'Cases & Dashboard', icon: Inbox },
              { id: 'actions', label: 'Action Items & SLA', icon: CheckSquare },
              { id: 'correspondence', label: 'Correspondence Logs', icon: MessageSquare },
              { id: 'reports', label: 'Executive Briefing', icon: TrendingUp },
              { id: 'directory', label: 'Stakeholder Directory', icon: Users },
              { id: 'settings', label: 'Secretariat Settings', icon: Settings },
            ].map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-emerald-800/80 text-white font-semibold'
                      : 'text-emerald-300/70 hover:bg-emerald-900/40 hover:text-white'
                  }`}
                  title={isSidebarCollapsed ? item.label : undefined}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-emerald-400' : 'text-emerald-400/60'}`} />
                  {!isSidebarCollapsed && <span className="truncate">{item.label}</span>}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Footer */}
        <div className="p-3 border-t border-emerald-900/60">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-emerald-800 border border-emerald-700 flex items-center justify-center font-bold text-emerald-100 text-xs shrink-0">
              GS
            </div>
            {!isSidebarCollapsed && (
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-white truncate">Comrade Gen Sec</p>
                <p className="text-[10px] text-emerald-400 truncate">Office of the Secretariat</p>
              </div>
            )}
          </div>
        </div>

      </aside>

      {/* --- MAIN CONTENT CONTAINER --- */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <h2 className="text-base font-bold text-slate-800 capitalize">
              {activeTab === 'dashboard' && 'Cases Register & Real-Time Email Intake'}
              {activeTab === 'actions' && 'Action Items & SLA Monitoring'}
              {activeTab === 'correspondence' && 'Audit Trail & Multi-Channel Logs'}
              {activeTab === 'reports' && 'Executive Summary & Analytics'}
              {activeTab === 'directory' && 'Union & Institutional Directory'}
              {activeTab === 'settings' && 'Secretariat Workflow Settings'}
            </h2>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <button
              onClick={fetchTickets}
              className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-slate-100 rounded-lg transition-colors"
              title="Refresh Live Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <span className="bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-200 font-medium">
              Active Session: 2025/2026
            </span>
          </div>
        </header>

        {/* Main Body */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Cases</p>
                <h3 className="text-2xl font-extrabold text-slate-900">{stats.active}</h3>
              </div>
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Inbox className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pending Decision</p>
                <h3 className="text-2xl font-extrabold text-amber-600">{stats.pendingDecision}</h3>
              </div>
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Resolved</p>
                <h3 className="text-2xl font-extrabold text-slate-700">{stats.resolved}</h3>
              </div>
              <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* --- TAB 1: CASES DASHBOARD --- */}
          {activeTab === 'dashboard' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search ticket #, requester, title..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="flex items-center space-x-2 text-xs">
                  <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Received">Received</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Awaiting Decision">Awaiting Decision</option>
                    <option value="Resolved">Resolved</option>
                  </select>

                  <select
                    value={priorityFilter}
                    onChange={e => setPriorityFilter(e.target.value)}
                    className="bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium"
                  >
                    <option value="All">All Priorities</option>
                    <option value="Low">Low</option>
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              {loading ? (
                <div className="py-16 text-center text-slate-500 flex flex-col items-center">
                  <Loader2 className="w-6 h-6 animate-spin text-emerald-600 mb-2" />
                  <p className="text-xs">Connecting to Secretariat database...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100/80 text-slate-600 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4">Ticket Ref</th>
                        <th className="py-3 px-4">Subject & Requester</th>
                        <th className="py-3 px-4">Type / Source</th>
                        <th className="py-3 px-4">Priority</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Next Action</th>
                        <th className="py-3 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {filteredTickets.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-12 text-center text-slate-400">
                            No cases currently logged.
                          </td>
                        </tr>
                      ) : (
                        filteredTickets.map(t => (
                          <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                            <td className="py-3.5 px-4 font-mono font-bold text-emerald-700">{t.ticket_number}</td>
                            <td className="py-3.5 px-4 max-w-xs">
                              <p className="font-semibold text-slate-900 truncate">{t.title}</p>
                              <p className="text-[11px] text-slate-500">{t.requester_name} {t.organization && `• ${t.organization}`}</p>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="font-medium text-slate-700 block">{t.case_type}</span>
                              <span className="text-[10px] text-slate-400">via {t.source}</span>
                            </td>
                            <td className="py-3.5 px-4 font-semibold">{t.priority}</td>
                            <td className="py-3.5 px-4 font-semibold text-emerald-800">{t.status}</td>
                            <td className="py-3.5 px-4 max-w-xs truncate">{t.next_action}</td>
                            <td className="py-3.5 px-4 text-right">
                              <button
                                onClick={() => setSelectedTicket(t)}
                                className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-semibold rounded border border-emerald-200 hover:bg-emerald-100"
                              >
                                Manage
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* --- TAB 2: ACTION ITEMS & SLA --- */}
          {activeTab === 'actions' && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-slate-900">Pending Action Items Across Cases</h3>
              <div className="space-y-3">
                {tickets.flatMap(t => (t.actions || []).map(a => ({ ...a, ticketNum: t.ticket_number }))).length === 0 ? (
                  <p className="text-xs text-slate-400 py-6 text-center">No open action items requiring attention.</p>
                ) : (
                  tickets.flatMap(t => (t.actions || []).map(a => ({ ...a, ticketNum: t.ticket_number }))).map(a => (
                    <div key={a.id} className="p-3 border border-slate-200 rounded-lg flex items-center justify-between text-xs">
                      <div>
                        <span className="font-mono text-emerald-700 font-bold mr-2">{a.ticketNum}</span>
                        <span className="font-semibold text-slate-800">{a.title}</span>
                        <p className="text-slate-400 text-[11px] mt-0.5">Assigned to: {a.owner} | Due: {a.due_date}</p>
                      </div>
                      <span className="px-2 py-0.5 rounded font-bold bg-amber-100 text-amber-800 text-[10px]">{a.status}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* --- TAB 3: CORRESPONDENCE LOGS --- */}
          {activeTab === 'correspondence' && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-slate-900">Multi-Channel Inbound/Outbound Audit Trail</h3>
              <div className="space-y-3">
                {tickets.flatMap(t => (t.correspondence || []).map(c => ({ ...c, ticketNum: t.ticket_number }))).length === 0 ? (
                  <p className="text-xs text-slate-400 py-6 text-center">No correspondence records in log.</p>
                ) : (
                  tickets.flatMap(t => (t.correspondence || []).map(c => ({ ...c, ticketNum: t.ticket_number }))).map(c => (
                    <div key={c.id} className="p-3.5 border border-slate-200 rounded-lg space-y-1 text-xs bg-slate-50/50">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="font-mono font-bold text-emerald-700">{c.ticketNum} • {c.direction} ({c.channel})</span>
                        <span className="text-slate-400">{new Date(c.created_at).toLocaleString()}</span>
                      </div>
                      <p className="font-semibold text-slate-800">{c.sender}</p>
                      <p className="text-slate-600 bg-white p-2.5 rounded border border-slate-200">{c.body_text}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* --- TAB 4: EXECUTIVE REPORT --- */}
          {activeTab === 'reports' && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4 text-xs">
              <h3 className="font-bold text-slate-900 text-sm">Executive Secretariat Summary Report</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="font-bold text-slate-700">Total Cases Processed</p>
                  <p className="text-2xl font-extrabold text-slate-900 mt-1">{tickets.length}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="font-bold text-slate-700">Resolution Rate</p>
                  <p className="text-2xl font-extrabold text-emerald-700 mt-1">
                    {tickets.length ? Math.round((stats.resolved / tickets.length) * 100) : 0}%
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* --- TAB 5: DIRECTORY --- */}
          {activeTab === 'directory' && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm text-xs">
              <h3 className="font-bold text-slate-900 text-sm mb-3">Stakeholder Directory</h3>
              <ul className="divide-y divide-slate-200">
                <li className="py-2.5 flex justify-between"><span>General Secretary</span><span className="font-mono">gensec@funaabsu.org</span></li>
                <li className="py-2.5 flex justify-between"><span>President</span><span className="font-mono">president@funaabsu.org</span></li>
                <li className="py-2.5 flex justify-between"><span>Dean of Student Affairs</span><span className="font-mono">dsa@funaab.edu.ng</span></li>
              </ul>
            </div>
          )}

          {/* --- TAB 6: SETTINGS --- */}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm text-xs space-y-3">
              <h3 className="font-bold text-slate-900 text-sm">Secretariat System Settings</h3>
              <p className="text-slate-500">Postmark Email Integration: <strong className="text-emerald-700">Active</strong></p>
              <p className="text-slate-500">Ticket Prefix: <strong className="font-mono">FUNAABSU/REQ/YYYY/XXXX</strong></p>
            </div>
          )}

        </main>
      </div>

      {/* --- MANAGE CASE SIDE DRAWER --- */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-white h-full shadow-2xl overflow-y-auto flex flex-col justify-between">
            
            <div className="p-6 bg-slate-900 text-white flex justify-between items-start">
              <div>
                <span className="font-mono text-xs font-bold text-emerald-400">{selectedTicket.ticket_number}</span>
                <h3 className="font-bold text-base text-white mt-1">{selectedTicket.title}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{selectedTicket.requester_name} ({selectedTicket.source})</p>
              </div>
              <button onClick={() => setSelectedTicket(null)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <div className="p-6 space-y-5 text-xs flex-1">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <p className="font-bold text-slate-700">Next Action Required</p>
                <p className="text-slate-800 mt-0.5">{selectedTicket.next_action}</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-2">Correspondence History</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {(selectedTicket.correspondence || []).map(c => (
                    <div key={c.id} className="p-3 bg-slate-50 border rounded text-xs">
                      <div className="flex justify-between font-bold text-[11px] mb-1">
                        <span>{c.sender} ({c.direction})</span>
                        <span className="text-slate-400">{new Date(c.created_at).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-slate-600">{c.body_text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block font-semibold text-slate-700">Send Outbound Response / Add Internal Note</label>
                <textarea
                  rows={3}
                  placeholder="Type official response to requester..."
                  value={replyBody}
                  onChange={e => setReplyBody(e.target.value)}
                  className="w-full p-2.5 border rounded-lg text-xs focus:ring-2 focus:ring-emerald-500"
                />
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => handleSendResponse(selectedTicket.id, selectedTicket.requester_name, true)}
                    className="px-3 py-1.5 bg-slate-200 text-slate-700 font-semibold rounded hover:bg-slate-300"
                  >
                    Add Internal Note
                  </button>
                  <button
                    onClick={() => handleSendResponse(selectedTicket.id, selectedTicket.requester_name, false)}
                    disabled={sendingEmail}
                    className="px-3 py-1.5 bg-emerald-700 text-white font-semibold rounded hover:bg-emerald-800 flex items-center space-x-1"
                  >
                    {sendingEmail ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    <span>Send Email Response</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t text-right">
              <button onClick={() => setSelectedTicket(null)} className="px-4 py-2 bg-slate-200 rounded font-semibold text-xs">Close</button>
            </div>

          </div>
        </div>
      )}

      {/* --- QUICK INTAKE MODAL --- */}
      {isQuickIntakeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full border overflow-hidden">
            <div className="p-4 bg-emerald-950 text-white flex justify-between items-center">
              <h3 className="font-bold text-sm">Log New Secretariat Case</h3>
              <button onClick={() => setIsQuickIntakeOpen(false)}><X className="w-5 h-5 text-emerald-300" /></button>
            </div>

            <form onSubmit={handleCreateTicket} className="p-5 space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Subject / Title *</label>
                <input required type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)} className="w-full p-2 border rounded" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Requester Name *</label>
                  <input required type="text" value={newRequester} onChange={e => setNewRequester(e.target.value)} className="w-full p-2 border rounded" />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Organization</label>
                  <input type="text" value={newOrg} onChange={e => setNewOrg(e.target.value)} className="w-full p-2 border rounded" />
                </div>
              </div>
              <div className="pt-2 flex justify-end space-x-2">
                <button type="button" onClick={() => setIsQuickIntakeOpen(false)} className="px-3 py-1.5 border rounded font-semibold">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-emerald-700 text-white font-semibold rounded">Generate Case</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}