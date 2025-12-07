import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const assessment = await req.json();

    const { error: insertError } = await supabaseClient.rpc('insert_assessment', {
      p_timestamp_local: assessment.timestamp_local,
      p_app_version: assessment.app_version,
      p_name_full: assessment.name_full,
      p_tester: assessment.tester,
      p_location: assessment.location,
      p_sex: assessment.sex,
      p_age: assessment.age,
      p_tug_s: assessment.tug_s,
      p_vo2_mlkgmin: assessment.vo2_mlkgmin,
      p_sitreach_in: assessment.sitreach_in,
      p_mtp_pct: assessment.mtp_pct,
      p_mip_pct: assessment.mip_pct,
      p_grip_r_pct: assessment.grip_r_pct,
      p_grip_l_pct: assessment.grip_l_pct,
      p_sway_r_pct: assessment.sway_r_pct,
      p_sway_l_pct: assessment.sway_l_pct,
      p_mobility_age: assessment.mobility_age,
      p_user_id_csv: assessment.user_id_csv,
      p_user_id: user.id,
    });

    if (insertError) {
      return new Response(
        JSON.stringify({ error: insertError.message }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});