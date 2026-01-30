/**
 * MTB Credit Card Application - Application Status Tracker
 * 
 * Displays status timeline for tracking submitted applications.
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  XCircle, 
  Loader2,
  ArrowLeft,
  CreditCard,
  FileText,
  User,
  Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  getApplicationByReference, 
  getStatusTimeline,
  type MOCK_STATUS_TIMELINES 
} from '@/api/mockData';

interface ApplicationStatusTrackerProps {
  referenceNumber: string;
  onBack: () => void;
}

type TimelineEvent = {
  timestamp: string;
  event: string;
  status: 'completed' | 'pending' | 'current' | 'error';
  description: string;
  actor?: string;
};

interface ApplicationDetails {
  application_id: string;
  reference_number: string;
  status: string;
  card_product_name: string;
  applicant_name: string;
  mobile_number: string;
  submitted_at: string | null;
  last_updated_at: string;
}

export function ApplicationStatusTracker({ 
  referenceNumber, 
  onBack 
}: ApplicationStatusTrackerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [application, setApplication] = useState<ApplicationDetails | null>(null);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      setIsLoading(true);
      setError(null);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const app = getApplicationByReference(referenceNumber);
      
      if (!app) {
        setError('No application found with this reference number.');
        setIsLoading(false);
        return;
      }
      
      setApplication(app as ApplicationDetails);
      setTimeline(getStatusTimeline(referenceNumber));
      setIsLoading(false);
    };
    
    fetchStatus();
  }, [referenceNumber]);

  const getStatusIcon = (status: TimelineEvent['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-success" />;
      case 'current':
        return <Loader2 className="h-5 w-5 text-primary animate-spin" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      case 'pending':
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string }> = {
      DRAFT: { label: 'Draft', className: 'bg-muted text-muted-foreground' },
      SUBMITTED: { label: 'Submitted', className: 'bg-blue-500/10 text-blue-600' },
      UNDER_REVIEW: { label: 'Under Review', className: 'bg-primary/10 text-primary' },
      DOCUMENTS_REQUIRED: { label: 'Documents Required', className: 'bg-amber-500/10 text-amber-600' },
      APPROVED: { label: 'Approved', className: 'bg-success/10 text-success' },
      REJECTED: { label: 'Rejected', className: 'bg-destructive/10 text-destructive' },
    };
    
    const config = statusConfig[status] || { label: status, className: 'bg-muted text-muted-foreground' };
    
    return (
      <Badge variant="secondary" className={cn('px-3 py-1', config.className)}>
        {config.label}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading application status...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
            <XCircle className="h-6 w-6 text-destructive" />
          </div>
          <p className="text-center text-muted-foreground mb-6">{error}</p>
          <Button onClick={onBack} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Application Summary Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Application Status
              </CardTitle>
              <CardDescription className="mt-1">
                Reference: {referenceNumber}
              </CardDescription>
            </div>
            {application && getStatusBadge(application.status)}
          </div>
        </CardHeader>
        <CardContent>
          {application && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  Applicant
                </div>
                <p className="font-medium">{application.applicant_name}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CreditCard className="h-4 w-4" />
                  Card Type
                </div>
                <p className="font-medium">{application.card_product_name}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Submitted
                </div>
                <p className="font-medium">
                  {application.submitted_at ? formatDate(application.submitted_at) : 'Not submitted'}
                </p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  Last Updated
                </div>
                <p className="font-medium">{formatDate(application.last_updated_at)}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Timeline Card */}
      <Card>
        <CardHeader>
          <CardTitle>Application Timeline</CardTitle>
          <CardDescription>Track the progress of your application</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[11px] top-3 bottom-3 w-0.5 bg-border" />
            
            {/* Timeline events */}
            <div className="space-y-6">
              {timeline.map((event, index) => (
                <div key={index} className="relative flex gap-4">
                  {/* Icon */}
                  <div className={cn(
                    "relative z-10 flex items-center justify-center w-6 h-6 rounded-full",
                    event.status === 'completed' && 'bg-success/10',
                    event.status === 'current' && 'bg-primary/10',
                    event.status === 'error' && 'bg-destructive/10',
                    event.status === 'pending' && 'bg-muted'
                  )}>
                    {getStatusIcon(event.status)}
                  </div>
                  
                  {/* Content */}
                  <div className={cn(
                    "flex-1 min-w-0 pb-6",
                    index === timeline.length - 1 && 'pb-0'
                  )}>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className={cn(
                          "font-medium",
                          event.status === 'pending' && 'text-muted-foreground'
                        )}>
                          {event.event}
                        </p>
                        <p className={cn(
                          "text-sm mt-0.5",
                          event.status === 'error' ? 'text-destructive' : 'text-muted-foreground'
                        )}>
                          {event.description}
                        </p>
                        {event.actor && (
                          <p className="text-xs text-muted-foreground mt-1">
                            By: {event.actor}
                          </p>
                        )}
                      </div>
                      {event.timestamp && (
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatDate(event.timestamp)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button onClick={onBack} variant="outline" className="flex-1">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        {application?.status === 'DOCUMENTS_REQUIRED' && (
          <Button className="flex-1 mobile-cta-button">
            Upload Documents
          </Button>
        )}
      </div>
    </div>
  );
}
