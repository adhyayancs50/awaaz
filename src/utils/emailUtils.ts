
import { Tables } from '@/integrations/supabase/types';

export interface VerificationEmailOptions {
  to: string;
  name: string;
  token: string;
  baseUrl: string;
}

export const sendVerificationEmail = async ({ to, name, token, baseUrl }: VerificationEmailOptions): Promise<boolean> => {
  try {
    // In a browser environment, we need to use an API endpoint to send emails
    // For now, we'll simulate a successful email send for testing purposes
    
    console.log("Email would be sent with the following details:");
    console.log(`To: ${to}`);
    console.log(`Name: ${name}`);
    console.log(`Verification Link: ${baseUrl}/verify?token=${token}`);
    
    // In production, you would call your API endpoint here:
    // const response = await fetch('/api/send-verification-email', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ to, name, token, baseUrl }),
    // });
    // return response.ok;
    
    // For testing purposes, always return true to simulate successful email sending
    return true;
  } catch (error) {
    console.error("Email sending error:", error);
    return false;
  }
};

export const generateVerificationToken = (): string => {
  // Generate a random string of 32 characters
  return [...Array(32)].map(() => Math.floor(Math.random() * 36).toString(36)).join('');
};

export const getVerificationExpiry = (): Date => {
  // Set expiration to 24 hours from now
  const expiryDate = new Date();
  expiryDate.setHours(expiryDate.getHours() + 24);
  return expiryDate;
};

export type EmailVerification = Tables<'email_verifications'>;
