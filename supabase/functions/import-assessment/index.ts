import "jsr:@supabase/functions-js/edge-runtime.d.ts";

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
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const assessment = await req.json();

    // Use direct Postgres connection to bypass schema cache
    const dbUrl = Deno.env.get("SUPABASE_DB_URL");
    if (!dbUrl) {
      throw new Error("Database URL not configured");
    }

    // Extract user ID from JWT
    const token = authHeader.replace("Bearer ", "");
    const [, payloadBase64] = token.split(".");
    const payload = JSON.parse(atob(payloadBase64));
    const userId = payload.sub;

    if (!userId) {
      return new Response(
        JSON.stringify({ error: "Invalid token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Connect directly to Postgres
    const { Client } = await import("https://deno.land/x/postgres@v0.17.0/mod.ts");
    const client = new Client(dbUrl);
    await client.connect();

    try {
      await client.queryArray(
        `INSERT INTO assessments (
          age, app_version, grip_l_pct, grip_r_pct, location,
          mip_pct, mobility_age, mtp_pct, name_full, sex,
          sitreach_in, sway_l_pct, sway_r_pct, tester,
          timestamp_local, tug_s, user_id, user_id_csv, vo2_mlkgmin
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
          $11, $12, $13, $14, $15, $16, $17, $18, $19
        )`,
        [
          assessment.age,
          assessment.app_version || '',
          assessment.grip_l_pct,
          assessment.grip_r_pct,
          assessment.location || '',
          assessment.mip_pct,
          assessment.mobility_age,
          assessment.mtp_pct,
          assessment.name_full,
          assessment.sex,
          assessment.sitreach_in,
          assessment.sway_l_pct,
          assessment.sway_r_pct,
          assessment.tester || '',
          assessment.timestamp_local,
          assessment.tug_s,
          userId,
          assessment.user_id_csv || '',
          assessment.vo2_mlkgmin
        ]
      );
    } finally {
      await client.end();
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
