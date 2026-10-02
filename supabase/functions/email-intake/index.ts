import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

serve(async (req) => {
  try {
    const payload = await req.json()
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    )

    const senderEmail = payload.From
    const subject = payload.Subject || "No Subject"
    const textBody = payload.TextBody || ""
    const messageId = payload.MessageID
    const threadId = payload.MailboxHash || messageId

    // 1. Check if Subject contains an existing ticket number
    const ticketMatch = subject.match(/FUNAABSU\/REQ\/\d{4}\/\d{4}/)
    let ticketId: string | null = null

    if (ticketMatch) {
      const { data: existing } = await supabase
        .from("tickets")
        .select("id")
        .eq("ticket_number", ticketMatch[0])
        .maybeSingle()
      if (existing) ticketId = existing.id
    }

    // 2. Fallback: Search existing thread ID
    if (!ticketId && threadId) {
      const { data: thread } = await supabase
        .from("correspondence")
        .select("ticket_id")
        .eq("email_message_id", threadId)
        .limit(1)
        .maybeSingle()
      if (thread) ticketId = thread.ticket_id
    }

    // 3. Create a new case if no existing thread is found
    if (!ticketId) {
      const { data: ticketNum } = await supabase.rpc("generate_ticket_number")

      const { data: newTicket, error: ticketErr } = await supabase
        .from("tickets")
        .insert({
          ticket_number: ticketNum,
          title: subject,
          description: textBody,
          source: "Email",
          status: "Received",
          next_action: "Triage incoming email and assign owner",
          next_action_due_date: new Date(Date.now() + 86400000).toISOString().split("T")[0]
        })
        .select("id")
        .single()

      if (ticketErr) throw ticketErr
      ticketId = newTicket.id
    }

    // 4. Record correspondence
    await supabase.from("correspondence").insert({
      ticket_id: ticketId,
      direction: "Incoming",
      channel: "Email",
      sender: senderEmail,
      subject: subject,
      body_text: textBody,
      email_message_id: threadId,
      is_internal_note: false
    })

    return new Response(JSON.stringify({ status: "success", ticketId }), { status: 200 })
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
})