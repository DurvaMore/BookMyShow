import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Mark movies with 0 available seats as 'housefull'
    const { data: housefullUpdated, error: e1 } = await supabase
      .from("movies")
      .update({ availability: "housefull" })
      .eq("available_seats", 0)
      .neq("availability", "housefull")
      .neq("availability", "ended")
      .select("id, title");

    // Mark movies whose release_date has passed and are 'coming_soon' → 'now_showing'
    const today = new Date().toISOString().split("T")[0];
    const { data: nowShowingUpdated, error: e2 } = await supabase
      .from("movies")
      .update({ availability: "now_showing" })
      .eq("availability", "coming_soon")
      .lte("release_date", today)
      .select("id, title");

    if (e1) throw e1;
    if (e2) throw e2;

    const result = {
      timestamp: new Date().toISOString(),
      housefull: housefullUpdated?.map((m) => m.title) ?? [],
      now_showing: nowShowingUpdated?.map((m) => m.title) ?? [],
    };

    console.log("Availability update:", JSON.stringify(result));

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
