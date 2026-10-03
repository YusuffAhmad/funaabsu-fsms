// src/hooks/useTickets.ts
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface ActionItem {
  id: string;
  title: string;
  owner: string;
  due_date: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Overdue';
}

export interface Correspondence {
  id: string;
  direction: 'Incoming' | 'Outgoing' | 'Internal';
  channel: 'Email' | 'WhatsApp' | 'Phone Call' | 'Walk-in' | 'Physical Letter';
  sender: string;
  body_text: string;
  created_at: string;
}

export interface Ticket {
  id: string;
  ticket_number: string;
  title: string;
  description: string;
  source: string;
  priority: 'Low' | 'Normal' | 'High' | 'Urgent';
  status: 'Received' | 'In Progress' | 'Awaiting Decision' | 'Resolved';
  created_at: string;
  next_action: string;
  next_action_due_date: string;
  actions?: ActionItem[];
  correspondence?: Correspondence[];
}

export function useTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const supabase = createClient();

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

    // Subscribe to real-time changes on tickets and correspondence
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tickets' },
        () => fetchTickets()
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'correspondence' },
        () => fetchTickets()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { tickets, loading, refetch: fetchTickets };
}