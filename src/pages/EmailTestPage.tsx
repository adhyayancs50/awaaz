
import React from 'react';
import EmailTester from '@/components/EmailTester';

const EmailTestPage: React.FC = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Email System Testing</h1>
      <div className="max-w-md mx-auto">
        <EmailTester />
      </div>
      <div className="mt-8 bg-gray-50 p-4 rounded-md max-w-md mx-auto">
        <h2 className="text-lg font-semibold mb-2">Email Diagnostics</h2>
        <ul className="list-disc pl-5 space-y-2 text-sm">
          <li>SMTP Server: smtpout.secureserver.net</li>
          <li>Port: 465</li>
          <li>Encryption: SSL/TLS</li>
          <li>From Address: noreply@myawaaz.com</li>
        </ul>
      </div>
    </div>
  );
};

export default EmailTestPage;
