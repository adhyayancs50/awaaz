
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Email configuration
const smtpConfig = {
  hostname: "smtp.gmail.com",
  port: 587,
  username: "noreply.awaazapp@gmail.com",
  password: Deno.env.get("EMAIL_PASSWORD") || "",
  tls: true,
};

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
    // Get request data
    const { email, display_name, redirect_url } = await req.json();

    if (!email || !display_name) {
      return new Response(
        JSON.stringify({ error: "Email and display name are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if verification already exists that isn't expired
    const { data: existingTokens, error: fetchError } = await supabase
      .from("email_verifications")
      .select("*")
      .eq("email", email)
      .gt("expires_at", new Date().toISOString())
      .is("verified_at", null);

    if (fetchError) {
      console.error("Error checking existing tokens:", fetchError);
      return new Response(
        JSON.stringify({ error: "Failed to check for existing verification" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let token;
    
    // Use existing token if it exists and is not expired
    if (existingTokens && existingTokens.length > 0) {
      token = existingTokens[0].token;
    } else {
      // Generate a new verification token (random string)
      const tokenBytes = new Uint8Array(32);
      crypto.getRandomValues(tokenBytes);
      token = Array.from(tokenBytes)
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");

      // Calculate expiration time (30 minutes)
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 30);

      // Store verification details
      const { error: insertError } = await supabase
        .from("email_verifications")
        .insert([
          {
            email,
            token,
            expires_at: expiresAt.toISOString(),
            display_name,
          },
        ]);

      if (insertError) {
        console.error("Error creating verification:", insertError);
        return new Response(
          JSON.stringify({ error: "Failed to create verification" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Create verification link
    const baseUrl = redirect_url || `${req.headers.get("origin") || supabaseUrl.replace(".supabase.co", ".vercel.app")}/verify`;
    const verificationLink = `${baseUrl}?token=${token}`;

    // Create email content
    const emailSubject = "Verify your Awaaz Account";
    const emailBody = `
      Welcome to Awaaz!
      
      Please click the link below to verify your email address and complete your registration:
      
      ${verificationLink}
      
      If you did not request this, you can ignore this email.
      
      Thanks,
      Team Awaaz
    `;

    // Send verification email
    const client = new SmtpClient();
    await client.connectTLS(smtpConfig);
    
    const result = await client.send({
      from: `"noreply" <noreply.awaazapp@gmail.com>`,
      to: email,
      subject: emailSubject,
      content: emailBody,
    });
    
    await client.close();

    console.log("Email sent successfully:", result);
    
    return new Response(
      JSON.stringify({ success: true, message: "Verification email sent" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error sending verification email:", error);
    
    return new Response(
      JSON.stringify({ error: "Failed to send verification email" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
