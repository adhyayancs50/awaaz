
import nodemailer from 'nodemailer';
import { Tables } from '@/integrations/supabase/types';

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: "smtp.secureserver.net",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: "noreply@myawaaz.com",
    pass: "Gaurav456#",
  },
});

export interface VerificationEmailOptions {
  to: string;
  name: string;
  token: string;
  baseUrl: string;
}

export const sendVerificationEmail = async ({ to, name, token, baseUrl }: VerificationEmailOptions): Promise<boolean> => {
  try {
    // Generate verification link with token
    const verificationLink = `${baseUrl}/verify?token=${token}`;
    
    // Send verification email
    await transporter.sendMail({
      from: '"noreply" <noreply@myawaaz.com>',
      to,
      subject: "Verify your Awaaz Account",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #27ae60;">Awaaz</h1>
          </div>
          
          <h2>Hello, ${name}!</h2>
          
          <p>Click the button below to verify your Awaaz account and start preserving languages!</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationLink}" style="background-color: #27ae60; color: white; padding: 12px 25px; text-decoration: none; border-radius: 4px; font-weight: bold;">Verify Email Address</a>
          </div>
          
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; color: #666;">${verificationLink}</p>
          
          <p>This verification link will expire in 24 hours.</p>
          
          <div style="margin-top: 40px; border-top: 1px solid #e0e0e0; padding-top: 20px; font-size: 12px; color: #999;">
            <p>If you didn't sign up for Awaaz, please ignore this email.</p>
          </div>
        </div>
      `,
    });
    
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
