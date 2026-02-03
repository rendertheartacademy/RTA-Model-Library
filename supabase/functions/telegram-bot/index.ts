
// Follow this setup guide to deploy: https://supabase.com/docs/guides/functions
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.0.0";

declare const Deno: any;

const BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

serve(async (req: any) => {
  try {
    const update = await req.json();

    // Handle Join Request
    if (update.chat_join_request) {
      const request = update.chat_join_request;
      const chatId = request.chat.id;
      const userId = request.from.id;
      const username = request.from.username; // Note: User must have a username

      if (!username) {
         await declineJoinRequest(chatId, userId);
         return new Response("No username", { status: 200 });
      }

      // Check Database
      // STRICT LOGIC: Prepend '@' and use .eq for exact match
      const formattedUsername = `@${username}`;

      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("telegram_username", formattedUsername) // Exact match required
        .eq("status", "approved")
        .gt("end_date", new Date().toISOString())
        .maybeSingle();

      if (data && !error) {
        await approveJoinRequest(chatId, userId);
        // Optional: Send a welcome message via bot
      } else {
        // Option A: Decline immediately
        // await declineJoinRequest(chatId, userId);
        
        // Option B: Do nothing (let it sit in pending)
      }
    }

    return new Response("OK", { status: 200 });
  } catch (error: any) {
    return new Response(error.message, { status: 500 });
  }
});

async function approveJoinRequest(chatId: number, userId: number) {
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/approveChatJoinRequest`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, user_id: userId }),
  });
}

async function declineJoinRequest(chatId: number, userId: number) {
  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/declineChatJoinRequest`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, user_id: userId }),
  });
}
// Deploy again
