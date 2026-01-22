/**
 * Application Submission Success Screen
 * Dark theme styled success message with prominent Application ID
 */

import { CheckCircle2, Mail, MessageSquare, FileText, Home, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

interface SubmissionSuccessProps {
  applicationId: string;
  applicantName: string;
  applicantEmail: string;
  applicantMobile: string;
  submittedAt: string;
  onGoHome: () => void;
}

export function SubmissionSuccess({
  applicationId,
  applicantName,
  applicantEmail,
  applicantMobile,
  submittedAt,
  onGoHome,
}: SubmissionSuccessProps) {
  const handleCopyId = () => {
    navigator.clipboard.writeText(applicationId);
    toast.success('Application ID copied to clipboard');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Dark Theme Success Message Card */}
      <div 
        className="rounded-2xl p-8 text-center"
        style={{ backgroundColor: '#333333' }}
      >
        {/* Success Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 mb-6">
          <CheckCircle2 className="h-12 w-12 text-green-400" />
        </div>
        
        {/* Success Message - Bold White Text */}
        <h1 
          className="text-2xl md:text-3xl font-bold mb-4"
          style={{ color: '#ffffff' }}
        >
          Your application has been successfully submitted!
        </h1>
        
        <p className="text-gray-300 mb-6">
          Thank you, {applicantName}. Your credit card application has been received.
        </p>
        
        {/* Application ID - Prominent Display */}
        <div className="bg-black/30 rounded-xl p-6 mb-4">
          <p className="text-sm text-gray-400 mb-2">Application ID</p>
          <div className="flex items-center justify-center gap-3">
            <span 
              className="text-3xl md:text-4xl font-mono font-bold tracking-wider"
              style={{ color: '#A1ED6F' }}
            >
              {applicationId}
            </span>
            <button
              onClick={handleCopyId}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              aria-label="Copy Application ID"
            >
              <Copy className="h-5 w-5 text-white" />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Please save this reference number for future correspondence
          </p>
        </div>
      </div>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Confirmation Sent</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30">
              <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="font-medium text-sm">Email Confirmation</p>
              <p className="text-sm text-muted-foreground">
                A confirmation email has been sent to <span className="font-medium">{applicantEmail}</span>
              </p>
            </div>
          </div>
          
          <Separator />
          
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30">
              <MessageSquare className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="font-medium text-sm">SMS Notification</p>
              <p className="text-sm text-muted-foreground">
                An SMS has been sent to <span className="font-medium">{applicantMobile}</span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* What's Next */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5" />
            What Happens Next?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-4">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium flex items-center justify-center">
                1
              </span>
              <div>
                <p className="font-medium text-sm">Application Review</p>
                <p className="text-sm text-muted-foreground">
                  Our team will review your application within 2-3 business days.
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium flex items-center justify-center">
                2
              </span>
              <div>
                <p className="font-medium text-sm">Verification Call</p>
                <p className="text-sm text-muted-foreground">
                  You may receive a verification call from our team to confirm details.
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium flex items-center justify-center">
                3
              </span>
              <div>
                <p className="font-medium text-sm">Decision Notification</p>
                <p className="text-sm text-muted-foreground">
                  You'll receive the decision via SMS and email within 5-7 business days.
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-medium flex items-center justify-center">
                4
              </span>
              <div>
                <p className="font-medium text-sm">Card Delivery</p>
                <p className="text-sm text-muted-foreground">
                  If approved, your card will be delivered to your mailing address.
                </p>
              </div>
            </li>
          </ol>
        </CardContent>
      </Card>

      {/* Submission Details */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Submitted on</span>
            <span className="font-medium">{new Date(submittedAt).toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3">
        <Button size="lg" className="w-full" onClick={onGoHome}>
          <Home className="h-4 w-4 mr-2" />
          Return to Home
        </Button>
      </div>
    </div>
  );
}
