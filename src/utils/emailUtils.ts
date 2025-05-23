
import { Tables } from '@/integrations/supabase/types';

export interface VerificationEmailOptions {
  to: string;
  name: string;
  token: string;
  baseUrl: string;
}

export const sendVerificationEmail = async ({ to, name, token, baseUrl }: VerificationEmailOptions): Promise<boolean> => {
  try {
    // Create the verification link
    const verificationLink = `${baseUrl}/verify?token=${token}`;
    
    // In a browser environment, we need to use an API endpoint to send emails
    // since we can't use direct SMTP connections
    const response = await fetch('/api/send-verification-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        to, 
        name, 
        token, 
        verificationLink,
        subject: 'Verify Your Email Address for Awaaz',
      }),
    });
    
    // For debugging purposes, log the response
    console.log("Email API Response:", await response.text());
    
    if (!response.ok) {
      throw new Error(`Failed to send email: ${response.statusText}`);
    }
    
    return true;
  } catch (error) {
    console.error("Email sending error:", error);
    return false;
  }
};

export const testEmailSending = async (to: string): Promise<{success: boolean, message: string}> => {
  try {
    const response = await fetch('/api/test-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return { 
        success: false, 
        message: errorData.error || "Failed to send test email" 
      };
    }
    
    return { 
      success: true, 
      message: "Test email sent successfully! Please check your inbox." 
    };
  } catch (error) {
    console.error("Test email error:", error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : "Unknown error occurred" 
    };
  }
};

export const generateVerificationToken = (): string => {
  // Generate a random string of 32 characters (more secure than using UUIDs)
  return [...Array(32)].map(() => Math.floor(Math.random() * 36).toString(36)).join('');
};

export const getVerificationExpiry = (): Date => {
  // Set expiration to 30 minutes from now (as per requirements)
  const expiryDate = new Date();
  expiryDate.setMinutes(expiryDate.getMinutes() + 30);
  return expiryDate;
};

export type EmailVerification = Tables<'email_verifications'>;
