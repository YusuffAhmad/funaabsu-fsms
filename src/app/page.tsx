"use client";

import React, { useState, useMemo, useEffect } from 'react';
import {
  FileText,
  Search,
  PlusCircle,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Send,
  User,
  Building,
  Mail,
  Phone,
  Calendar,
  MessageSquare,
  BarChart3,
  List,
  ShieldCheck,
  ChevronRight,
  Download,
  Printer,
  X,
  Tag,
  Briefcase,
  Check,
  ArrowUpRight,
  Inbox,
  UserCheck,
  RefreshCw
} from 'lucide-react';

const INITIAL_TICKETS = [
  {
    id: 'FUNAABSU/REQ/2026/0001',
    title: 'Sponsorship Request for G-SPARK 2.0 Tech Summit',
    requesterName: 'Adewale Tobi',
    requesterOrg: 'FUNAAB Tech Community / NACOSS',
    email: 'adewale.t@funaab.edu.ng',
    phone: '+234 803 123 4567',
    matricNo: '20211234',
    caseType: 'Sponsorship',
    source: 'Email',
    priority: 'High',
    status: 'In Progress',
    description: 'Formal request seeking N250,000 sponsorship and approval to use the Mahmoud Yakubu Lecture Theatre for the annual student tech summit.',
    nextAction: 'Present sponsorship proposal to Executive Council',
    nextActionOwner: 'Comrade Gen Sec',
    nextActionDueDate: '2026-10-06',
    waitingOnParty: 'Executive Council',
    decisionStatus: 'Pending',
    createdAt: '2026-09-28',
    actions: [
      { id: 'act-1', title: 'Verify venue availability with Student Affairs', owner: 'Sec Officer Bisi', dueDate: '2026-09-30', status: 'Completed', note: 'Mahmoud Yakubu Theatre is free on Oct 24th.' },
      { id: 'act-2', title: 'Draft Executive Briefing note', owner: 'Comrade Gen Sec', dueDate: '2026-10-06', status: 'In Progress', note: 'Gathering budget breakdown details.' }
    ],
    correspondence: [
      { id: 'cor-1', direction: 'Incoming', channel: 'Email', sender: 'Adewale Tobi', date: '2026-09-28 09:15', body: 'Dear General Secretary, please find attached our sponsorship deck for G-SPARK 2.0 scheduled for October 24.' },
      { id: 'cor-2', direction: 'Outgoing', channel: 'Email', sender: 'Secretariat Admin', date: '2026-09-28 14:20', body: 'Acknowledgement: Ticket generated as FUNAABSU/REQ/2026/0001. Under review by Gen Sec.' }
    ]
  },
  {
    id: 'FUNAABSU/REQ/2026/0002',
    title: 'Urgent Intervention on Male Hostel Water Pump Breakdown',
    requesterName: 'Comrade Olatunji Samson',
    requesterOrg: 'Hall Executive Council (HEC) - Unity Hall',
    email: 'olatunji.unity@gmail.com',
    phone: '+234 812 987 6543',
    matricNo: '20224512',
    caseType: 'Student Welfare',
    source: 'WhatsApp',
    priority: 'Urgent',
    status: 'Awaiting Decision',
    description: 'Water pump at Unity Hostel failed 3 days ago. Over 1,200 students affected. Needs immediate authorization for repair squad funding.',
    nextAction: 'Approve N45,000 disbursement for artisan repairs',
    nextActionOwner: 'Financial Secretary / President',
    nextActionDueDate: '2026-10-03',
    waitingOnParty: 'SU President',
    decisionStatus: 'Pending',
    createdAt: '2026-10-01',
    actions: [
      { id: 'act-3', title: 'Inspection visit to Unity Hall borehole', owner: 'Welfare Director', dueDate: '2026-10-01', status: 'Completed', note: 'Burnt starter switch identified.' },
      { id: 'act-4', title: 'Secure artisan quote', owner: 'Sec Officer Bisi', dueDate: '2026-10-02', status: 'Completed', note: 'Total quote evaluated at N45,000.' }
    ],
    correspondence: [
      { id: 'cor-3', direction: 'Incoming', channel: 'WhatsApp', sender: 'Comrade Olatunji', date: '2026-10-01 07:30', body: 'Sec, please we need urgent intervention in Unity Hall. No water for 3 days now.' },
      { id: 'cor-4', direction: 'Internal', channel: 'Internal Note', sender: 'Comrade Gen Sec', date: '2026-10-01 10:00', body: 'Escalated to Welfare Director for immediate physical audit.' }
    ]
  },
  {
    id: 'FUNAABSU/REQ/2026/0003',
    title: 'Permission for Annual Campus Marathon & Traffic Clearance',
    requesterName: 'Blessing Okon',
    requesterOrg: 'Sports Writers Association (Student Wing)',
    email: 'blessing.okon@funaab.edu.ng',
    phone: '+234 701 444 5555',
    matricNo: '20208899',
    caseType: 'Permission / Approval',
    source: 'Physical Letter',
    priority: 'Normal',
    status: 'In Progress',
    description: 'Application to conduct FUNAAB 5km Mini-Marathon on Nov 12. Requires SU endorsement to Campus Security Unit.',
    nextAction: 'Dispatch letter to Chief Security Officer (CSO)',
    nextActionOwner: 'Secretariat Officer A',
    nextActionDueDate: '2026-10-08',
    waitingOnParty: 'FUNAAB Security Unit',
    decisionStatus: 'Approved with Conditions',
    createdAt: '2026-09-25',
    actions: [
      { id: 'act-5', title: 'Draft recommendation letter to CSO', owner: 'Secretariat Officer A', dueDate: '2026-10-05', status: 'In Progress', note: 'Letter awaiting Gensec signature.' }
    ],
    correspondence: [
      { id: 'cor-5', direction: 'Incoming', channel: 'Physical Letter', sender: 'Blessing Okon', date: '2026-09-25 11:00', body: 'Physical copy submitted at Secretariat reception desk.' }
    ]
  },
  {
    id: 'FUNAABSU/REQ/2026/0004',
    title: 'Petition Regarding Overcrowded Campus Shuttle Buses',
    requesterName: 'Amina Yusuf',
    requesterOrg: 'Department of Agricultural Economics',
    email: 'yusuf.a@funaab.edu.ng',
    phone: '+234 809 333 2211',
    matricNo: '20230012',
    caseType: 'Complaint',
    source: 'Walk-in',
    priority: 'High',
    status: 'Received',
    description: 'Student complaint regarding long queue hours at Camp Junction bus stop and extortion by private shuttle operators during morning peak hours.',
    nextAction: 'Schedule emergency meeting with Transport Committee Chair',
    nextActionOwner: 'Comrade Gen Sec',
    nextActionDueDate: '2026-10-05',
    waitingOnParty: 'Transport Director',
    decisionStatus: 'Pending',
    createdAt: '2026-10-02',
    actions: [
      { id: 'act-6', title: 'Issue summons letter to Transport Union Chair', owner: 'Comrade Gen Sec', dueDate: '2026-10-05', status: 'Pending', note: '' }
    ],
    correspondence: [
      { id: 'cor-6', direction: 'Incoming', channel: 'Walk-in', sender: 'Amina Yusuf', date: '2026-10-02 12:45', body: 'Complainant visited secretariat in person. Complaint logged by reception officer.' }
    ]
  },
  {
    id: 'FUNAABSU/REQ/2026/0005',
    title: 'Invitation to Inter-Tertiary Parliamentary Debate Competition',
    requesterName: 'Rt. Hon. Farouq Alabi',
    requesterOrg: 'Student Representative Council (SRC)',
    email: 'src.speaker@funaabsu.org',
    phone: '+234 815 666 7788',
    matricNo: '20201122',
    caseType: 'Invitation',
    source: 'Email',
    priority: 'Low',
    status: 'Resolved',
    description: 'Invitation for SU Executives to attend the opening ceremony of the South-West Parliamentary Debate Championship at UI Ibadan.',
    nextAction: 'Send attendance confirmation & goodwill message',
    nextActionOwner: 'PRO / Gen Sec',
    nextActionDueDate: '2026-09-29',
    waitingOnParty: 'None',
    decisionStatus: 'Approved',
    createdAt: '2026-09-20',
    actions: [
      { id: 'act-7', title: 'Send official goodwill message letter', owner: 'Secretariat Officer B', dueDate: '2026-09-29', status: 'Completed', note: 'Delivered via email and courier.' }
    ],
    correspondence: [
      { id: 'cor-7', direction: 'Incoming', channel: 'Email', sender: 'Farouq Alabi', date: '2026-09-20 09:00', body: 'Formal invitation letter attached.' },
      { id: 'cor-8', direction: 'Outgoing', channel: 'Email', sender: 'Comrade Gen Sec', date: '2026-09-27 16:00', body: 'Official delegation confirmed. Vice President will represent the Union.' }
    ]
  }
];

export default function App() {
  const [tickets, setTickets] = useState(INITIAL_TICKETS);
  const [activeTab, setActiveTab] = useState('cases'); // cases, intake, actions, correspondence, analytics
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [channelFilter, setChannelFilter] = useState('All');
  
  // Selected Ticket for Modal Detail View
  const [selectedTicket, setSelectedTicket] = useState(null);
  
  // Quick Intake Modal Form State
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [newCase, setNewCase] = useState({
    title: '',
    requesterName: '',
    requesterOrg: '',
    email: '',
    phone: '',
    matricNo: '',
    caseType: 'General Request',
    source: 'Email',
    priority: 'Normal',
    description: '',
    nextAction: '',
    nextActionOwner: 'Comrade Gen Sec',
    nextActionDueDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0]
  });

  // Action Add Modal State
  const [isAddActionModalOpen, setIsAddActionModalOpen] = useState(false);
  const [newActionData, setNewActionData] = useState({
    ticketId: '',
    title: '',
    owner: 'Secretariat Officer',
    dueDate: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0]
  });

  // Toast alert
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const filteredTickets = useMemo(() => {
    return tickets.filter(t => {
      const matchesSearch = 
        t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.requesterName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.requesterOrg.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
      const matchesPriority = priorityFilter === 'All' || t.priority === priorityFilter;
      const matchesType = typeFilter === 'All' || t.caseType === typeFilter;
      const matchesChannel = channelFilter === 'All' || t.source === channelFilter;

      return matchesSearch && matchesStatus && matchesPriority && matchesType && matchesChannel;
    });
  }, [tickets, searchQuery, statusFilter, priorityFilter, typeFilter, channelFilter]);

  const metrics = useMemo(() => {
    const total = tickets.length;
    const active = tickets.filter(t => t.status !== 'Resolved' && t.status !== 'Closed').length;
    
    // Find overdue actions across all tickets
    const todayStr = new Date().toISOString().split('T')[0];
    let overdueActionsCount = 0;
    tickets.forEach(t => {
      t.actions.forEach(a => {
        if (a.status !== 'Completed' && a.dueDate < todayStr) {
          overdueActionsCount++;
        }
      });
    });

    const pendingDecisions = tickets.filter(t => t.decisionStatus === 'Pending').length;
    const resolvedThisMonth = tickets.filter(t => t.status === 'Resolved').length;

    return { total, active, overdueActionsCount, pendingDecisions, resolvedThisMonth };
  }, [tickets]);

  const handleCreateCase = (e) => {
    e.preventDefault();
    if (!newCase.title || !newCase.requesterName) {
      alert('Please fill in the essential required fields (Title, Requester Name).');
      return;
    }

    const nextSeq = String(tickets.length + 1).padStart(4, '0');
    const ticketId = `FUNAABSU/REQ/2026/${nextSeq}`;

    const createdTicket = {
      id: ticketId,
      ...newCase,
      status: 'Received',
      waitingOnParty: 'FUNAABSU Secretariat',
      decisionStatus: 'Pending',
      createdAt: new Date().toISOString().split('T')[0],
      actions: newCase.nextAction ? [
        {
          id: `act-${Date.now()}`,
          title: newCase.nextAction,
          owner: newCase.nextActionOwner,
          dueDate: newCase.nextActionDueDate,
          status: 'Pending',
          note: 'Initial triage action item.'
        }
      ] : [],
      correspondence: [
        {
          id: `cor-${Date.now()}`,
          direction: 'Incoming',
          channel: newCase.source,
          sender: newCase.requesterName,
          date: new Date().toLocaleString([], { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
          body: newCase.description || 'Initial request submitted to secretariat.'
        }
      ]
    };

    setTickets([createdTicket, ...tickets]);
    setIsLogModalOpen(false);
    showToast(`Case Successfully Created! Assigned ID: ${ticketId}`);
    
    // Reset form
    setNewCase({
      title: '',
      requesterName: '',
      requesterOrg: '',
      email: '',
      phone: '',
      matricNo: '',
      caseType: 'General Request',
      source: 'Email',
      priority: 'Normal',
      description: '',
      nextAction: '',
      nextActionOwner: 'Comrade Gen Sec',
      nextActionDueDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0]
    });
  };

  const handleUpdateTicketStatus = (ticketId, newStatus) => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        const updated = { ...t, status: newStatus };
        if (newStatus === 'Resolved' || newStatus === 'Closed') {
          updated.decisionStatus = 'Approved';
        }
        if (selectedTicket && selectedTicket.id === ticketId) {
          setSelectedTicket(updated);
        }
        return updated;
      }
      return t;
    }));
    showToast(`Case status updated to "${newStatus}"`);
  };

  const handleUpdateDecisionStatus = (ticketId, newDecision) => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        const updated = { ...t, decisionStatus: newDecision };
        if (selectedTicket && selectedTicket.id === ticketId) {
          setSelectedTicket(updated);
        }
        return updated;
      }
      return t;
    }));
    showToast(`Decision updated to "${newDecision}"`);
  };

  const handleAddActionItem = (e) => {
    e.preventDefault();
    if (!newActionData.ticketId || !newActionData.title) return;

    setTickets(prev => prev.map(t => {
      if (t.id === newActionData.ticketId) {
        const newAct = {
          id: `act-${Date.now()}`,
          title: newActionData.title,
          owner: newActionData.owner,
          dueDate: newActionData.dueDate,
          status: 'Pending',
          note: 'New action assigned.'
        };
        const updated = {
          ...t,
          actions: [...t.actions, newAct],
          nextAction: newActionData.title,
          nextActionOwner: newActionData.owner,
          nextActionDueDate: newActionData.dueDate
        };
        if (selectedTicket && selectedTicket.id === t.id) {
          setSelectedTicket(updated);
        }
        return updated;
      }
      return t;
    }));

    setIsAddActionModalOpen(false);
    setNewActionData({ ticketId: '', title: '', owner: 'Secretariat Officer', dueDate: new Date().toISOString().split('T')[0] });
    showToast('Action item assigned successfully!');
  };

  const toggleActionStatus = (ticketId, actionId) => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        const updatedActions = t.actions.map(a => {
          if (a.id === actionId) {
            const nextStatus = a.status === 'Completed' ? 'Pending' : 'Completed';
            return { ...a, status: nextStatus };
          }
          return a;
        });
        const updated = { ...t, actions: updatedActions };
        if (selectedTicket && selectedTicket.id === t.id) {
          setSelectedTicket(updated);
        }
        return updated;
      }
      return t;
    }));
  };

  const [newCorData, setNewCorData] = useState({ direction: 'Outgoing', channel: 'Email', body: '' });

  const handleAddCorrespondence = (ticketId) => {
    if (!newCorData.body.trim()) return;

    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        const newEntry = {
          id: `cor-${Date.now()}`,
          direction: newCorData.direction,
          channel: newCorData.channel,
          sender: newCorData.direction === 'Outgoing' ? 'Secretariat Admin' : t.requesterName,
          date: new Date().toLocaleString([], { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
          body: newCorData.body
        };
        const updated = { ...t, correspondence: [...t.correspondence, newEntry] };
        if (selectedTicket && selectedTicket.id === t.id) {
          setSelectedTicket(updated);
        }
        return updated;
      }
      return t;
    }));

    setNewCorData({ direction: 'Outgoing', channel: 'Email', body: '' });
    showToast('Correspondence logged to case timeline!');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-emerald-900 text-white px-5 py-3 rounded-lg shadow-xl flex items-center gap-3 border border-emerald-700 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="font-medium text-sm">{toastMessage}</span>
        </div>
      )}

      {}
      <header className="bg-emerald-900 text-white shadow-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Branding */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-800 border-2 border-amber-400 flex items-center justify-center font-bold text-amber-400 text-lg shadow">
                FS
              </div>
              <div>
                <h1 className="font-extrabold text-lg tracking-tight leading-none text-white">
                  FUNAABSU <span className="text-amber-400 font-semibold">FSMS</span>
                </h1>
                <p className="text-xs text-emerald-200">Secretariat Case & Correspondence System</p>
              </div>
            </div>

            {/* Global Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-8 relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search ticket #, requester, subject, keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-emerald-950 text-white placeholder-emerald-300/70 text-sm pl-9 pr-4 py-2 rounded-md border border-emerald-700/60 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-2.5 text-emerald-300 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Officer Profile & Quick Log CTA */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsLogModalOpen(true)}
                className="bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold px-3 py-1.5 rounded-md text-xs sm:text-sm flex items-center gap-1.5 shadow transition"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Quick Intake</span>
              </button>

              <div className="hidden sm:flex items-center gap-2 border-l border-emerald-800 pl-3">
                <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center text-xs font-bold border border-amber-400/50">
                  GS
                </div>
                <div className="text-left text-xs">
                  <p className="font-semibold text-white leading-tight">Comrade Gen Sec</p>
                  <p className="text-[10px] text-emerald-300">FUNAABSU 2025/2026</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Mobile Search Input */}
        <div className="p-2 bg-emerald-950 md:hidden border-t border-emerald-800">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search cases, tickets, names..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-emerald-900 text-white text-xs pl-8 pr-3 py-1.5 rounded border border-emerald-700 focus:outline-none"
            />
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-emerald-950/80 border-t border-emerald-800/80 px-4">
          <div className="max-w-7xl mx-auto flex space-x-1 sm:space-x-4 overflow-x-auto text-xs sm:text-sm font-medium">
            <button
              onClick={() => setActiveTab('cases')}
              className={`py-2.5 px-3 border-b-2 flex items-center gap-2 transition whitespace-nowrap ${
                activeTab === 'cases' ? 'border-amber-400 text-amber-400 font-bold' : 'border-transparent text-emerald-200 hover:text-white'
              }`}
            >
              <Inbox className="w-4 h-4" /> Cases & Dashboard
            </button>

            <button
              onClick={() => setActiveTab('actions')}
              className={`py-2.5 px-3 border-b-2 flex items-center gap-2 transition whitespace-nowrap ${
                activeTab === 'actions' ? 'border-amber-400 text-amber-400 font-bold' : 'border-transparent text-emerald-200 hover:text-white'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" /> Action Items & SLA
              {metrics.overdueActionsCount > 0 && (
                <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                  {metrics.overdueActionsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('correspondence')}
              className={`py-2.5 px-3 border-b-2 flex items-center gap-2 transition whitespace-nowrap ${
                activeTab === 'correspondence' ? 'border-amber-400 text-amber-400 font-bold' : 'border-transparent text-emerald-200 hover:text-white'
              }`}
            >
              <MessageSquare className="w-4 h-4" /> Correspondence Logs
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-2.5 px-3 border-b-2 flex items-center gap-2 transition whitespace-nowrap ${
                activeTab === 'analytics' ? 'border-amber-400 text-amber-400 font-bold' : 'border-transparent text-emerald-200 hover:text-white'
              }`}
            >
              <BarChart3 className="w-4 h-4" /> Executive Report
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">

        {}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Cases</p>
              <p className="text-2xl font-black text-slate-800 mt-1">{metrics.active}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Total registered: {metrics.total}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <Briefcase className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Overdue Actions</p>
              <p className="text-2xl font-black text-rose-600 mt-1">{metrics.overdueActionsCount}</p>
              <p className="text-[11px] text-rose-500 font-medium mt-0.5">Requires urgent triage</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Decision</p>
              <p className="text-2xl font-black text-amber-600 mt-1">{metrics.pendingDecisions}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Awaiting council review</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Resolved Cases</p>
              <p className="text-2xl font-black text-teal-700 mt-1">{metrics.resolvedThisMonth}</p>
              <p className="text-[11px] text-emerald-600 font-medium mt-0.5">Archived & closed</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>

        </section>

        {/* TAB 1: CASES MANAGEMENT & FILTERABLE TABLE */}
        {activeTab === 'cases' && (
          <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            
            {/* Filter Bar */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-500" />
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Filters:</span>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-xs">
                
                {/* Status Dropdown */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-white border border-slate-300 rounded px-2 py-1.5 text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-600"
                >
                  <option value="All">Status: All</option>
                  <option value="Received">Received</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Awaiting Decision">Awaiting Decision</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Closed">Closed</option>
                </select>

                {/* Priority Dropdown */}
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="bg-white border border-slate-300 rounded px-2 py-1.5 text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-600"
                >
                  <option value="All">Priority: All</option>
                  <option value="Urgent">Urgent</option>
                  <option value="High">High</option>
                  <option value="Normal">Normal</option>
                  <option value="Low">Low</option>
                </select>

                {/* Case Type Dropdown */}
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="bg-white border border-slate-300 rounded px-2 py-1.5 text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-600"
                >
                  <option value="All">Type: All</option>
                  <option value="Sponsorship">Sponsorship</option>
                  <option value="Student Welfare">Student Welfare</option>
                  <option value="Permission / Approval">Permission / Approval</option>
                  <option value="Complaint">Complaint</option>
                  <option value="Invitation">Invitation</option>
                  <option value="General Request">General Request</option>
                </select>

                {/* Source Channel Dropdown */}
                <select
                  value={channelFilter}
                  onChange={(e) => setChannelFilter(e.target.value)}
                  className="bg-white border border-slate-300 rounded px-2 py-1.5 text-slate-700 font-medium focus:outline-none focus:ring-1 focus:ring-emerald-600"
                >
                  <option value="All">Channel: All</option>
                  <option value="Email">Email</option>
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Physical Letter">Physical Letter</option>
                  <option value="Walk-in">Walk-in</option>
                </select>

                {(statusFilter !== 'All' || priorityFilter !== 'All' || typeFilter !== 'All' || channelFilter !== 'All') && (
                  <button
                    onClick={() => {
                      setStatusFilter('All');
                      setPriorityFilter('All');
                      setTypeFilter('All');
                      setChannelFilter('All');
                    }}
                    className="text-xs text-rose-600 hover:underline font-semibold ml-2"
                  >
                    Reset Filters
                  </button>
                )}

              </div>
            </div>

            {/* Cases Data Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm text-slate-600">
                <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="py-3.5 px-4">Ticket Reference</th>
                    <th className="py-3.5 px-4">Subject & Requester</th>
                    <th className="py-3.5 px-4">Type & Source</th>
                    <th className="py-3.5 px-4">Priority</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Next Action / Due Date</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredTickets.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-slate-400">
                        <Inbox className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                        No cases found matching your filters.
                      </td>
                    </tr>
                  ) : (
                    filteredTickets.map((t) => (
                      <tr key={t.id} className="hover:bg-emerald-50/50 transition">
                        
                        {/* Ticket ID */}
                        <td className="py-3 px-4 font-mono font-bold text-emerald-900 whitespace-nowrap">
                          {t.id}
                        </td>

                        {/* Title & Requester */}
                        <td className="py-3 px-4 max-w-xs">
                          <p className="font-bold text-slate-900 truncate" title={t.title}>{t.title}</p>
                          <p className="text-xs text-slate-500 flex items-center gap-1">
                            <User className="w-3 h-3 text-slate-400" />
                            {t.requesterName} ({t.requesterOrg})
                          </p>
                        </td>

                        {/* Case Type & Channel */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className="inline-block bg-slate-100 border border-slate-200 text-slate-700 px-2 py-0.5 rounded text-[11px] font-medium">
                            {t.caseType}
                          </span>
                          <span className="block text-[10px] text-slate-400 mt-0.5">
                            via {t.source}
                          </span>
                        </td>

                        {/* Priority Badge */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                            t.priority === 'Urgent' ? 'bg-rose-100 text-rose-700 border border-rose-200' :
                            t.priority === 'High' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                            t.priority === 'Normal' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {t.priority}
                          </span>
                        </td>

                        {/* Status Badge */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                            t.status === 'Resolved' ? 'bg-teal-100 text-teal-800' :
                            t.status === 'In Progress' ? 'bg-emerald-100 text-emerald-800' :
                            t.status === 'Awaiting Decision' ? 'bg-amber-100 text-amber-800' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {t.status}
                          </span>
                        </td>

                        {/* Next Action */}
                        <td className="py-3 px-4 max-w-xs text-xs">
                          <p className="font-medium text-slate-800 truncate" title={t.nextAction}>
                            {t.nextAction || 'None assigned'}
                          </p>
                          <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <Clock className="w-2.5 h-2.5" />
                            Due: {t.nextActionDueDate || 'N/A'} ({t.nextActionOwner})
                          </p>
                        </td>

                        {/* View Modal CTA */}
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <button
                            onClick={() => setSelectedTicket(t)}
                            className="text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 font-semibold px-2.5 py-1 rounded text-xs border border-emerald-200 transition"
                          >
                            Manage Case
                          </button>
                        </td>

                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* TAB 2: ACTION ITEMS & SLA TRACKER */}
        {activeTab === 'actions' && (
          <section className="space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div>
                <h2 className="text-base font-bold text-slate-900">Secretariat Task & SLA Accountability Tracker</h2>
                <p className="text-xs text-slate-500">Monitor officer tasks, review pending deadlines, and uphold Secretariat Service Level Agreements.</p>
              </div>
              <button
                onClick={() => setIsAddActionModalOpen(true)}
                className="bg-emerald-800 hover:bg-emerald-700 text-white font-bold px-3 py-2 rounded-md text-xs flex items-center justify-center gap-2 shadow"
              >
                <PlusCircle className="w-4 h-4" /> Add Action Item
              </button>
            </div>

            {/* Kanban columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Column 1: Pending Actions */}
              <div className="bg-slate-100 rounded-xl p-3 border border-slate-200">
                <div className="flex items-center justify-between mb-3 px-1">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span> Pending Tasks
                  </h3>
                  <span className="bg-slate-200 text-slate-700 font-bold text-xs px-2 py-0.5 rounded-full">
                    {tickets.flatMap(t => t.actions).filter(a => a.status === 'Pending').length}
                  </span>
                </div>

                <div className="space-y-3">
                  {tickets.map(t =>
                    t.actions
                      .filter(a => a.status === 'Pending')
                      .map(a => (
                        <div key={a.id} className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded border border-emerald-100">
                              {t.id}
                            </span>
                            <span className="text-[10px] font-semibold text-slate-500">Due: {a.dueDate}</span>
                          </div>
                          <p className="text-xs font-bold text-slate-800 leading-snug">{a.title}</p>
                          <p className="text-[11px] text-slate-500">Assigned: <span className="font-medium text-slate-700">{a.owner}</span></p>
                          
                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                            <button
                              onClick={() => toggleActionStatus(t.id, a.id)}
                              className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" /> Mark Completed
                            </button>
                            <button
                              onClick={() => setSelectedTicket(t)}
                              className="text-[11px] text-slate-400 hover:text-slate-700 underline"
                            >
                              View Ticket
                            </button>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>

              {/* Column 2: In Progress */}
              <div className="bg-slate-100 rounded-xl p-3 border border-slate-200">
                <div className="flex items-center justify-between mb-3 px-1">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span> In Progress
                  </h3>
                  <span className="bg-slate-200 text-slate-700 font-bold text-xs px-2 py-0.5 rounded-full">
                    {tickets.flatMap(t => t.actions).filter(a => a.status === 'In Progress').length}
                  </span>
                </div>

                <div className="space-y-3">
                  {tickets.map(t =>
                    t.actions
                      .filter(a => a.status === 'In Progress')
                      .map(a => (
                        <div key={a.id} className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded border border-emerald-100">
                              {t.id}
                            </span>
                            <span className="text-[10px] font-semibold text-slate-500">Due: {a.dueDate}</span>
                          </div>
                          <p className="text-xs font-bold text-slate-800 leading-snug">{a.title}</p>
                          <p className="text-[11px] text-slate-500">Assigned: <span className="font-medium text-slate-700">{a.owner}</span></p>

                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                            <button
                              onClick={() => toggleActionStatus(t.id, a.id)}
                              className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" /> Complete Task
                            </button>
                            <button
                              onClick={() => setSelectedTicket(t)}
                              className="text-[11px] text-slate-400 hover:text-slate-700 underline"
                            >
                              View Ticket
                            </button>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </div>

              {/* Column 3: Completed Actions */}
              <div className="bg-slate-100 rounded-xl p-3 border border-slate-200">
                <div className="flex items-center justify-between mb-3 px-1">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Completed
                  </h3>
                  <span className="bg-slate-200 text-slate-700 font-bold text-xs px-2 py-0.5 rounded-full">
                    {tickets.flatMap(t => t.actions).filter(a => a.status === 'Completed').length}
                  </span>
                </div>

                <div className="space-y-3">
                  {tickets.map(t =>
                    t.actions
                      .filter(a => a.status === 'Completed')
                      .map(a => (
                        <div key={a.id} className="bg-emerald-50/60 p-3 rounded-lg border border-emerald-200/60 shadow-sm space-y-1">
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-900 px-1.5 py-0.5 rounded">
                              {t.id}
                            </span>
                            <span className="text-[10px] font-bold text-emerald-700">DONE</span>
                          </div>
                          <p className="text-xs font-semibold text-slate-700 line-through">{a.title}</p>
                          <p className="text-[10px] text-slate-500">By {a.owner}</p>
                        </div>
                      ))
                  )}
                </div>
              </div>

            </div>

          </section>
        )}

        {/* TAB 3: CORRESPONDENCE LOGS */}
        {activeTab === 'correspondence' && (
          <section className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900">Official Correspondence Audit Log</h2>
              <p className="text-xs text-slate-500">Timeline of inbound emails, formal letters, WhatsApp communications, and internal secretariat minute notes.</p>
            </div>

            <div className="space-y-6">
              {tickets.map(t => (
                <div key={t.id} className="border border-slate-200 rounded-lg p-4 bg-slate-50/50 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-200">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs bg-emerald-900 text-amber-400 px-2 py-0.5 rounded">
                        {t.id}
                      </span>
                      <h3 className="font-bold text-sm text-slate-800">{t.title}</h3>
                    </div>
                    <span className="text-xs text-slate-500">Requester: <b>{t.requesterName}</b> ({t.source})</span>
                  </div>

                  <div className="space-y-2 pl-2 sm:pl-4 border-l-2 border-emerald-600">
                    {t.correspondence.map(c => (
                      <div key={c.id} className="bg-white p-3 rounded border border-slate-200 shadow-sm text-xs space-y-1">
                        <div className="flex items-center justify-between text-slate-500">
                          <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${c.direction === 'Incoming' ? 'bg-blue-500' : c.direction === 'Outgoing' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                            {c.direction} ({c.channel}) - <span className="text-emerald-900">{c.sender}</span>
                          </span>
                          <span className="text-[10px]">{c.date}</span>
                        </div>
                        <p className="text-slate-700 bg-slate-50 p-2 rounded text-xs leading-relaxed">{c.body}</p>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => setSelectedTicket(t)}
                      className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
                    >
                      Log Response or Internal Note <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* TAB 4: EXECUTIVE REPORT & ANALYTICS */}
        {activeTab === 'analytics' && (
          <section className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Executive Secretariat Performance Report</h2>
                <p className="text-xs text-slate-500">Comprehensive summary prepared for Executive Council, Senate Representatives & Student Affairs Division.</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-3 py-2 rounded text-xs flex items-center gap-1.5 shadow"
                >
                  <Printer className="w-4 h-4" /> Print Briefing
                </button>
              </div>
            </div>

            {/* Distribution Charts Visual Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Breakdown by Case Type */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-2">Case Type Breakdown</h3>
                <div className="space-y-3">
                  {['Sponsorship', 'Student Welfare', 'Permission / Approval', 'Complaint', 'Invitation'].map(type => {
                    const count = tickets.filter(t => t.caseType === type).length;
                    const pct = Math.round((count / (tickets.length || 1)) * 100);
                    return (
                      <div key={type} className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold text-slate-700">
                          <span>{type}</span>
                          <span>{count} ({pct}%)</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                          <div className="bg-emerald-800 h-full rounded-full transition-all" style={{ width: `${pct}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Breakdown by Priority */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                <h3 className="font-bold text-sm text-slate-800 border-b border-slate-100 pb-2">Priority Distribution</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Urgent', color: 'bg-rose-500' },
                    { label: 'High', color: 'bg-amber-500' },
                    { label: 'Normal', color: 'bg-blue-500' },
                    { label: 'Low', color: 'bg-slate-400' }
                  ].map(p => {
                    const count = tickets.filter(t => t.priority === p.label).length;
                    const pct = Math.round((count / (tickets.length || 1)) * 100);
                    return (
                      <div key={p.label} className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold text-slate-700">
                          <span>{p.label} Priority</span>
                          <span>{count} cases</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                          <div className={`${p.color} h-full rounded-full`} style={{ width: `${pct}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Auto-Generated Report Memo Box */}
            <div className="bg-emerald-950 text-emerald-100 p-6 rounded-xl border border-emerald-800 shadow-lg font-mono text-xs leading-relaxed space-y-4">
              <div className="border-b border-emerald-800 pb-3 flex justify-between items-center text-amber-400 font-bold text-sm">
                <span>MEMORANDUM: SECRETARIAT MONTHLY STATUS BRIEFING</span>
                <span>OCTOBER 2026</span>
              </div>
              <p>FROM: Office of the General Secretary, FUNAAB Student Union (FUNAABSU)</p>
              <p>TO: Central Executive Council (CEC) & General Assembly</p>
              <p className="text-slate-300">
                1. EXECUTIVE SUMMARY: Between September and October 2026, the Secretariat logged a total of <b>{metrics.total}</b> formal cases. Currently, <b>{metrics.active}</b> remain active and under operational processing.
              </p>
              <p className="text-slate-300">
                2. SLA & DECISION BOTTLENECKS: There are <b>{metrics.pendingDecisions}</b> cases awaiting official Executive Council decisions, and <b>{metrics.overdueActionsCount}</b> pending tasks requiring prompt officer clearance.
              </p>
              <p className="text-slate-300">
                3. WELFARE & SPONSORSHIPS: Student welfare petitions remain high priority, particularly related to hostel amenities and campus transport logistics.
              </p>
              <div className="pt-3 border-t border-emerald-800/80 text-[11px] text-emerald-400">
                System Generated via FUNAABSU FSMS Engine • Timestamp: {new Date().toLocaleString()}
              </div>
            </div>

          </section>
        )}

      </main>

      {}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
            
            {/* Modal Header */}
            <div className="bg-emerald-900 text-white p-4 sm:p-5 flex items-start justify-between border-b border-emerald-800">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-amber-400 text-emerald-950 font-mono font-black text-xs px-2 py-0.5 rounded">
                    {selectedTicket.id}
                  </span>
                  <span className="text-xs text-emerald-200">Registered: {selectedTicket.createdAt}</span>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-white">{selectedTicket.title}</h2>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="text-emerald-300 hover:text-white p-1 rounded-lg"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-xs sm:text-sm">
              
              {/* Quick Status Control Bar */}
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Current Status</label>
                  <select
                    value={selectedTicket.status}
                    onChange={(e) => handleUpdateTicketStatus(selectedTicket.id, e.target.value)}
                    className="bg-white border border-slate-300 rounded px-3 py-1.5 font-bold text-slate-800 text-xs focus:ring-2 focus:ring-emerald-600"
                  >
                    <option value="Received">Received</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Awaiting Decision">Awaiting Decision</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Executive Decision Status</label>
                  <select
                    value={selectedTicket.decisionStatus}
                    onChange={(e) => handleUpdateDecisionStatus(selectedTicket.id, e.target.value)}
                    className="bg-white border border-slate-300 rounded px-3 py-1.5 font-bold text-slate-800 text-xs focus:ring-2 focus:ring-emerald-600"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Approved with Conditions">Approved with Conditions</option>
                    <option value="Declined">Declined</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">Source Channel</label>
                  <span className="font-semibold text-slate-700 bg-white px-3 py-1.5 rounded border border-slate-200 inline-block text-xs">
                    {selectedTicket.source}
                  </span>
                </div>
              </div>

              {/* Requester Profile & Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-2">
                  <h3 className="font-bold text-xs uppercase text-emerald-900 border-b border-slate-100 pb-1 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-emerald-700" /> Requester Info
                  </h3>
                  <p><span className="text-slate-500">Name:</span> <b>{selectedTicket.requesterName}</b></p>
                  <p><span className="text-slate-500">Org/Dept:</span> <b>{selectedTicket.requesterOrg}</b></p>
                  <p><span className="text-slate-500">Matric No:</span> {selectedTicket.matricNo || 'N/A'}</p>
                  <p><span className="text-slate-500">Contact:</span> {selectedTicket.email} • {selectedTicket.phone}</p>
                </div>

                <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-2">
                  <h3 className="font-bold text-xs uppercase text-emerald-900 border-b border-slate-100 pb-1 flex items-center gap-1.5">
                    <Tag className="w-4 h-4 text-emerald-700" /> Case Classification
                  </h3>
                  <p><span className="text-slate-500">Case Type:</span> <b>{selectedTicket.caseType}</b></p>
                  <p><span className="text-slate-500">Priority Level:</span> <b className="text-rose-700">{selectedTicket.priority}</b></p>
                  <p><span className="text-slate-500">Waiting On:</span> <b>{selectedTicket.waitingOnParty || 'FUNAABSU'}</b></p>
                </div>
              </div>

              {/* Description */}
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-1">
                <h4 className="font-bold text-xs text-slate-700 uppercase">Case Summary / Description</h4>
                <p className="text-slate-700 text-xs leading-relaxed">{selectedTicket.description}</p>
              </div>

              {/* Action Items List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider">Action Items & Tasks</h4>
                  <button
                    onClick={() => {
                      setNewActionData({ ...newActionData, ticketId: selectedTicket.id });
                      setIsAddActionModalOpen(true);
                    }}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
                  >
                    <PlusCircle className="w-3.5 h-3.5" /> Assign Task
                  </button>
                </div>

                <div className="space-y-2">
                  {selectedTicket.actions.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No action items assigned to this case yet.</p>
                  ) : (
                    selectedTicket.actions.map(act => (
                      <div key={act.id} className="bg-white p-3 rounded border border-slate-200 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={act.status === 'Completed'}
                            onChange={() => toggleActionStatus(selectedTicket.id, act.id)}
                            className="rounded text-emerald-800 focus:ring-emerald-700 w-4 h-4"
                          />
                          <div>
                            <p className={`font-semibold text-xs ${act.status === 'Completed' ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                              {act.title}
                            </p>
                            <p className="text-[10px] text-slate-500">Assigned to: {act.owner} • Due: {act.dueDate}</p>
                          </div>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${act.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                          {act.status}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Correspondence Timeline & Response Form */}
              <div className="space-y-3 pt-3 border-t border-slate-200">
                <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider">Correspondence History</h4>
                
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {selectedTicket.correspondence.map(cor => (
                    <div key={cor.id} className="bg-slate-50 p-3 rounded border border-slate-200 space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
                        <span>{cor.direction} ({cor.channel}) - {cor.sender}</span>
                        <span className="text-[10px] text-slate-400">{cor.date}</span>
                      </div>
                      <p className="text-xs text-slate-700">{cor.body}</p>
                    </div>
                  ))}
                </div>

                {/* Response Log Input */}
                <div className="bg-slate-100 p-3 rounded-lg border border-slate-200 space-y-2">
                  <span className="font-bold text-xs text-slate-700 block">Log New Response / Minute Note</span>
                  <div className="flex gap-2">
                    <select
                      value={newCorData.direction}
                      onChange={(e) => setNewCorData({ ...newCorData, direction: e.target.value })}
                      className="bg-white border text-xs rounded px-2 py-1 font-semibold"
                    >
                      <option value="Outgoing">Outgoing</option>
                      <option value="Incoming">Incoming</option>
                      <option value="Internal">Internal Note</option>
                    </select>

                    <select
                      value={newCorData.channel}
                      onChange={(e) => setNewCorData({ ...newCorData, channel: e.target.value })}
                      className="bg-white border text-xs rounded px-2 py-1 font-semibold"
                    >
                      <option value="Email">Email</option>
                      <option value="WhatsApp">WhatsApp</option>
                      <option value="Physical Letter">Physical Letter</option>
                      <option value="Internal Note">Minute Note</option>
                    </select>
                  </div>

                  <textarea
                    rows={2}
                    placeholder="Enter details of response or internal minutes..."
                    value={newCorData.body}
                    onChange={(e) => setNewCorData({ ...newCorData, body: e.target.value })}
                    className="w-full text-xs p-2 rounded border border-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  />

                  <div className="flex justify-end">
                    <button
                      onClick={() => handleAddCorrespondence(selectedTicket.id)}
                      className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-3 py-1.5 rounded text-xs flex items-center gap-1"
                    >
                      <Send className="w-3.5 h-3.5" /> Submit Log
                    </button>
                  </div>
                </div>

              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-100 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedTicket(null)}
                className="bg-slate-800 hover:bg-slate-900 text-white font-bold px-4 py-2 rounded text-xs"
              >
                Close Window
              </button>
            </div>

          </div>
        </div>
      )}

      {}
      {isLogModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in">
            
            <div className="bg-emerald-900 text-white p-4 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-base">Quick Intake Registration</h2>
                <p className="text-xs text-emerald-200">Register new incoming correspondence or case into FSMS</p>
              </div>
              <button onClick={() => setIsLogModalOpen(false)} className="text-emerald-200 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCase} className="p-5 space-y-4 text-xs sm:text-sm">
              
              <div className="space-y-1">
                <label className="font-bold text-slate-700 text-xs">Subject / Case Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Request for Venue Permit - Mahmoud Yakubu Theatre"
                  value={newCase.title}
                  onChange={(e) => setNewCase({ ...newCase, title: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 text-xs">Requester Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Comrade Adewale Tobi"
                    value={newCase.requesterName}
                    onChange={(e) => setNewCase({ ...newCase, requesterName: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 text-xs">Organization / Faculty / Dept</label>
                  <input
                    type="text"
                    placeholder="e.g. NACOSS / Colphys"
                    value={newCase.requesterOrg}
                    onChange={(e) => setNewCase({ ...newCase, requesterOrg: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 text-xs">Email Address</label>
                  <input
                    type="email"
                    placeholder="student@funaab.edu.ng"
                    value={newCase.email}
                    onChange={(e) => setNewCase({ ...newCase, email: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 text-xs">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+234..."
                    value={newCase.phone}
                    onChange={(e) => setNewCase({ ...newCase, phone: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 text-xs">Matric Number</label>
                  <input
                    type="text"
                    placeholder="2021XXXX"
                    value={newCase.matricNo}
                    onChange={(e) => setNewCase({ ...newCase, matricNo: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 text-xs">Case Type</label>
                  <select
                    value={newCase.caseType}
                    onChange={(e) => setNewCase({ ...newCase, caseType: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded bg-white text-xs font-medium"
                  >
                    <option value="General Request">General Request</option>
                    <option value="Sponsorship">Sponsorship</option>
                    <option value="Student Welfare">Student Welfare</option>
                    <option value="Permission / Approval">Permission / Approval</option>
                    <option value="Complaint">Complaint</option>
                    <option value="Invitation">Invitation</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 text-xs">Source Channel</label>
                  <select
                    value={newCase.source}
                    onChange={(e) => setNewCase({ ...newCase, source: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded bg-white text-xs font-medium"
                  >
                    <option value="Email">Email</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Physical Letter">Physical Letter</option>
                    <option value="Walk-in">Walk-in</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 text-xs">Priority</label>
                  <select
                    value={newCase.priority}
                    onChange={(e) => setNewCase({ ...newCase, priority: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded bg-white text-xs font-medium"
                  >
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 text-xs">Summary / Letter Excerpt</label>
                <textarea
                  rows={3}
                  placeholder="Provide concise details regarding the request..."
                  value={newCase.description}
                  onChange={(e) => setNewCase({ ...newCase, description: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 text-xs">Initial Action Item</label>
                  <input
                    type="text"
                    placeholder="e.g. Verify request details with Dean"
                    value={newCase.nextAction}
                    onChange={(e) => setNewCase({ ...newCase, nextAction: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 text-xs">Assigned Officer</label>
                  <select
                    value={newCase.nextActionOwner}
                    onChange={(e) => setNewCase({ ...newCase, nextActionOwner: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded bg-white text-xs"
                  >
                    <option value="Comrade Gen Sec">Comrade Gen Sec</option>
                    <option value="Secretariat Officer A">Secretariat Officer A</option>
                    <option value="Secretariat Officer B">Secretariat Officer B</option>
                    <option value="Welfare Director">Welfare Director</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(false)}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold px-4 py-2 rounded text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-5 py-2 rounded text-xs shadow flex items-center gap-1.5"
                >
                  <PlusCircle className="w-4 h-4" /> Register & Generate Ticket
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {}
      {isAddActionModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 w-full max-w-md p-5 space-y-4 animate-in fade-in">
            <div className="flex justify-between items-center border-b border-slate-100 pb-2">
              <h3 className="font-bold text-sm text-slate-800">Assign Action Task</h3>
              <button onClick={() => setIsAddActionModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddActionItem} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Select Case Ticket *</label>
                <select
                  required
                  value={newActionData.ticketId}
                  onChange={(e) => setNewActionData({ ...newActionData, ticketId: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded font-mono text-xs bg-white"
                >
                  <option value="">-- Choose Ticket --</option>
                  {tickets.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.id} - {t.title.substring(0, 30)}...
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Task Title *</label>
                <input
                  type="text"
                  required
                  placeholder="Task description..."
                  value={newActionData.title}
                  onChange={(e) => setNewActionData({ ...newActionData, title: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Assigned Officer</label>
                  <input
                    type="text"
                    value={newActionData.owner}
                    onChange={(e) => setNewActionData({ ...newActionData, owner: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Due Date</label>
                  <input
                    type="date"
                    value={newActionData.dueDate}
                    onChange={(e) => setNewActionData({ ...newActionData, dueDate: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddActionModalOpen(false)}
                  className="bg-slate-200 text-slate-700 px-3 py-1.5 rounded font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-800 text-white px-4 py-1.5 rounded font-bold"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {}
      <footer className="bg-slate-900 text-slate-400 text-xs py-4 px-6 border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <p>© 2026 FUNAABSU Secretariat Management System (FSMS). Office of the General Secretary.</p>
          <p className="text-[11px] text-slate-500">Federal University of Agriculture, Abeokuta (FUNAAB)</p>
        </div>
      </footer>

    </div>
  );
}