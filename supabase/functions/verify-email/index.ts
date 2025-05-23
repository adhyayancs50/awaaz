
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// CORS headers for browser requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get token from request
    const { token, password } = await req.json();

    if (!token || !password) {
      return new Response(
        JSON.stringify({ error: "Token and password are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Find verification entry
    const { data: verifications, error: fetchError } = await supabase
      .from("email_verifications")
      .select("*")
      .eq("token", token)
      .is("verified_at", null)
      .order("created_at", { ascending: false })
      .limit(1);

    if (fetchError) {
      console.error("Error fetching verification:", fetchError);
      return new Response(
        JSON.stringify({ error: "Failed to verify token" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!verifications || verifications.length === 0) {
      return new Response(
        JSON.stringify({ error: "Invalid or expired verification token" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const verification = verifications[0];
    const now = new Date();
    const expiresAt = new Date(verification.expires_at);

    // Check if token is expired
    if (now > expiresAt) {
      return new Response(
        JSON.stringify({ error: "Verification token has expired" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Mark as verified
    const { error: updateError } = await supabase
      .from("email_verifications")
      .update({ verified_at: now.toISOString() })
      .eq("id", verification.id);

    if (updateError) {
      console.error("Error updating verification:", updateError);
      return new Response(
        JSON.stringify({ error: "Failed to complete verification" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create user account
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: verification.email,
      password: password,
      options: {
        data: {
          display_name: verification.display_name,
        },
      },
    });

    if (signUpError) {
      console.error("Error creating user account:", signUpError);
      return new Response(
        JSON.stringify({ error: "Failed to create account" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Email verified and account created successfully",
        user: signUpData.user
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error verifying email:", error);
    
    return new Response(
      JSON.stringify({ error: "Failed to verify email" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
