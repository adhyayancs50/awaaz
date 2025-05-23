
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { testEmailSending } from '@/utils/emailUtils';

const EmailTester: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success?: boolean; message?: string } | null>(null);

  const handleTestEmail = async () => {
    if (!email) return;
    
    setLoading(true);
    setResult(null);
    
    try {
      const testResult = await testEmailSending(email);
      setResult(testResult);
    } catch (error) {
      setResult({ 
        success: false, 
        message: error instanceof Error ? error.message : 'An unknown error occurred' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Email System Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="test-email" className="block text-sm font-medium">
            Enter email address to test
          </label>
          <Input
            id="test-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full"
          />
        </div>
        
        {result && (
          <Alert variant={result.success ? "default" : "destructive"}>
            <AlertTitle>{result.success ? 'Success!' : 'Error'}</AlertTitle>
            <AlertDescription>{result.message}</AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleTestEmail} 
          disabled={loading || !email}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Testing...
            </>
          ) : (
            'Send Test Email'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EmailTester;
