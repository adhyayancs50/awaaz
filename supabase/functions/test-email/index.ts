
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
    const { to } = await req.json();

    // Validate email address
    if (!to || !to.includes('@')) {
      return new Response(
        JSON.stringify({ error: 'Valid email address is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Create SMTP client
    const client = new SMTPClient({
      connection: {
        hostname: "smtpout.secureserver.net",
        port: 465,
        tls: true,
        auth: {
          username: "noreply@myawaaz.com",
          password: Deno.env.get("EMAIL_PASSWORD") || "",
        },
        debug: true, // Enable debugging for detailed logs
      }
    });

    // Send test email
    try {
      console.log("Starting SMTP connection with credentials:", {
        hostname: "smtpout.secureserver.net",
        port: 465,
        username: "noreply@myawaaz.com",
        // password is hidden for security
        tls: true
      });
      
      const sendResult = await client.send({
        from: "Awaaz <noreply@myawaaz.com>",
        to: to,
        subject: "Awaaz Email System Test",
        content: "This is a test email to verify that the Awaaz email system is working correctly.",
        html: `
          <html>
            <body style="font-family: Arial, sans-serif; padding: 20px;">
              <h1 style="color: #27ae60;">Awaaz Email Test</h1>
              <p>This is a test email to verify that the Awaaz email system is working correctly.</p>
              <p>If you received this email, your email configuration is working!</p>
              <p>Details:</p>
              <ul>
                <li>Time sent: ${new Date().toISOString()}</li>
                <li>Sent to: ${to}</li>
                <li>SMTP: smtpout.secureserver.net:465 (SSL/TLS)</li>
              </ul>
            </body>
          </html>
        `,
      });
      
      console.log("SMTP test email result:", sendResult);
      
      // Close connection
      await client.close();
      
      return new Response(
        JSON.stringify({ success: true, message: "Test email sent successfully!" }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    } catch (smtpError) {
      console.error("SMTP Error:", smtpError);
      
      // Close connection even on error
      try {
        await client.close();
      } catch (closeError) {
        console.error("Error closing SMTP connection:", closeError);
      }
      
      return new Response(
        JSON.stringify({ 
          error: "SMTP Error", 
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
