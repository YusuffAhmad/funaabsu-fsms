// src/app/api/email/send/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const { ticketId, recipientEmail, subject, bodyText } = await request.json();
    const supabase = createClient();

    // 1. Fetch ticket reference
    const { data: ticket, error: ticketErr } = await supabase
      .from('tickets')
      .select('ticket_number')
      .eq('id', ticketId)
      .single();

    if (ticketErr || !ticket) {
      return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
    }

    const formattedSubject = `Re: [${ticket.ticket_number}] ${subject}`;

    // 2. Dispatch via Email Service API (e.g. Postmark/Resend)
    const emailRes = await fetch('https://api.postmarkapp.com/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Postmark-Server-Token': process.env.POSTMARK_SERVER_TOKEN!,
      },
      body: JSON.stringify({
        From: 'officialfunaabsu@gmail.com',
        To: recipientEmail,
        Subject: formattedSubject,
        TextBody: bodyText,
        Tag: 'Secretariat-Response',
      }),
    });

    if (!emailRes.ok) {
      throw new Error('Failed to send email via outbound provider');
    }

    // 3. Record outgoing email in correspondence table
    await supabase.from('correspondence').insert({
      ticket_id: ticketId,
      direction: 'Outgoing',
      channel: 'Email',
      sender: 'Comrade Ahmad Yusuff',
      recipient: recipientEmail,
      subject: formattedSubject,
      body_text: bodyText,
      is_internal_note: false,
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}