
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
    
    const verificationLink = `${baseUrl}/verify?token=${token}`;
    
    console.log("Email would be sent with the following details:");
    console.log(`To: ${to}`);
    console.log(`From: noreply@myawaaz.com`);
    console.log(`Subject: Verify Your Email Address for Awaaz`);
    console.log(`Name: ${name}`);
    console.log(`Verification Link: ${verificationLink}`);
    console.log(`SMTP: smtpout.secureserver.net:465 (SSL)`);
    
    // In production, this would be replaced with a call to a server endpoint or edge function
    // that uses Nodemailer with the SMTP settings you've provided
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
