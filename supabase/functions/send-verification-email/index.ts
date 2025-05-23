
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { SMTPClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body
    const { to, name, verificationLink, subject } = await req.json();

    // Validate required fields
    if (!to || !verificationLink) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Create email client
    const client = new SMTPClient({
      connection: {
        hostname: "smtpout.secureserver.net",
        port: 465,
        tls: true,
        auth: {
          username: "noreply@myawaaz.com",
          password: Deno.env.get("EMAIL_PASSWORD") || "",
        }
      }
    });

    // Create email template
    const emailBody = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #27ae60; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; }
            .button { background-color: #27ae60; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; }
            .footer { font-size: 12px; color: #666; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Awaaz Email Verification</h1>
            </div>
            <div class="content">
              <p>Hello ${name},</p>
              <p>Thank you for registering with Awaaz. To complete your registration, please verify your email address by clicking the button below:</p>
              <p style="text-align: center; margin: 30px 0;">
                <a class="button" href="${verificationLink}">Verify My Email</a>
              </p>
              <p>Or copy and paste the following URL into your browser:</p>
              <p style="word-break: break-all;">${verificationLink}</p>
              <p>This link will expire in 30 minutes for security reasons.</p>
              <p>If you did not create an account with Awaaz, please ignore this email.</p>
            </div>
            <div class="footer">
              <p>This is an automated message from Awaaz. Please do not reply to this email.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send email
    try {
      const sendResult = await client.send({
        from: "Awaaz <noreply@myawaaz.com>",
        to: to,
        subject: subject || "Verify Your Email Address for Awaaz",
        html: emailBody,
      });
      
      console.log("Email sent successfully:", sendResult);
      
      // Always close connection
      await client.close();
      
      return new Response(
        JSON.stringify({ success: true, message: "Email sent successfully" }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    } catch (smtpError) {
      console.error("SMTP Error:", smtpError);
      
      // Make sure to close connection even on error
      try {
        await client.close();
      } catch (closeError) {
        console.error("Error closing SMTP connection:", closeError);
      }
      
      return new Response(
        JSON.stringify({ 
          error: "Failed to send email", 
          details: smtpError.message || String(smtpError) 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
  } catch (error) {
    console.error("General error:", error);
    
    return new Response(
      JSON.stringify({ error: "Server error", details: error.message || String(error) }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
