// src/app/api/email/send/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const { ticketId, recipientEmail, subject, bodyText } = await request.json();
    const supabase = await createClient();

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

    // 2. Dispatch via Postmark API
    const emailRes = await fetch('https://api.postmarkapp.com/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Postmark-Server-Token': process.env.POSTMARK_SERVER_TOKEN!,
      },
      body: JSON.stringify({
        From: 'FUNAABSU General Secretary <yusuffao.23@student.funaab.edu.ng>', // Replace with your exact verified signature handle
        To: recipientEmail, 
        ReplyTo: 'officialfunaabsu@gmail.com', // Direct replies back to the union Gmail
        Subject: formattedSubject,
        TextBody: bodyText,
        Tag: 'Secretariat-Response',
      }),
    });

    if (!emailRes.ok) {
      const postmarkError = await emailRes.json();
      console.error('Postmark API Error:', postmarkError);
      throw new Error(postmarkError.Message || 'Failed to send email via outbound provider');
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