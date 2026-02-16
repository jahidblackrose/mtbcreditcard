/**
 * MTB Credit Card Application - Application Status Tracker
 *
 * Displays status timeline for tracking submitted applications.
 * Enhanced with better UX, animations, and professional design.
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  Calendar,
  Download,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { TimelineCard, type TimelineEvent } from '@/components';
import {
  getApplicationByReference,
  getStatusTimeline,
  type MOCK_STATUS_TIMELINES
} from '@/api/mockData';

interface ApplicationStatusTrackerProps {
  referenceNumber: string;
  onBack: () => void;
}

type StatusTimelineEvent = {
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
  const [timeline, setTimeline] = useState<StatusTimelineEvent[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

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
      DRAFT: { label: 'Draft', className: 'bg-gray-100 text-gray-700 border-gray-300' },
      SUBMITTED: { label: 'Submitted', className: 'bg-blue-100 text-blue-700 border-blue-300' },
      UNDER_REVIEW: { label: 'Under Review', className: 'bg-purple-100 text-purple-700 border-purple-300' },
      DOCUMENTS_REQUIRED: { label: 'Documents Required', className: 'bg-amber-100 text-amber-700 border-amber-300' },
      APPROVED: { label: 'Approved', className: 'bg-green-100 text-green-700 border-green-300' },
      REJECTED: { label: 'Rejected', className: 'bg-red-100 text-red-700 border-red-300' },
    };

    const config = statusConfig[status] || { label: status, className: 'bg-gray-100 text-gray-700 border-gray-300' };

    return (
      <Badge variant="secondary" className={cn('px-3 py-1.5 border font-medium', config.className)}>
        {config.label}
      </Badge>
    );
  };

  const handleDownloadStatus = () => {
    setIsDownloading(true);
    // Simulate download
    setTimeout(() => {
      setIsDownloading(false);
      // In real app, this would generate a PDF
    }, 1500);
  };

  // Convert timeline to our TimelineCard format
  const convertToTimelineEvents = (): TimelineEvent[] => {
    return timeline.map((event, index) => ({
      id: `event-${index}`,
      status: event.status === 'current' ? 'In Progress' : event.status === 'completed' ? 'Completed' : event.status === 'error' ? 'Attention Required' : 'Pending',
      title: event.event,
      description: event.description,
      timestamp: new Date(event.timestamp),
      actor: event.actor === 'Applicant' ? 'Applicant' : event.actor === 'System' ? 'System' : event.actor === 'RM' ? 'RM' : event.actor === 'Bank' ? 'Bank' : 'System',
      isCurrent: event.status === 'current',
      isCompleted: event.status === 'completed',
    }));
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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-2xl mx-auto"
      >
        <Card className="shadow-lg">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <Loader2 className="h-12 w-12 text-blue-600 mb-4" />
            </motion.div>
            <p className="text-gray-600 font-medium">Loading application status...</p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto"
      >
        <Card className="shadow-lg border-0">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <p className="text-center text-gray-900 font-semibold mb-2">Application Not Found</p>
            <p className="text-center text-gray-600 mb-6">{error}</p>
            <Button onClick={onBack} variant="outline" className="hover:bg-gray-100">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-3xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={onBack}
          className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button
          variant="outline"
          onClick={handleDownloadStatus}
          disabled={isDownloading}
          className="hover:bg-gray-100"
        >
          <Download className={`h-4 w-4 mr-2 ${isDownloading ? 'animate-bounce' : ''}`} />
          {isDownloading ? 'Downloading...' : 'Download Status'}
        </Button>
      </div>

      {/* Application Summary Card - Enhanced */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="shadow-md border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl text-gray-900">Application Status</CardTitle>
                <CardDescription className="text-gray-600 mt-1">
                  Reference: <span className="font-mono font-semibold">{referenceNumber}</span>
                </CardDescription>
              </div>
              {application && getStatusBadge(application.status)}
            </div>
          </CardHeader>
          <CardContent>
            {application && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 p-4 bg-white/60 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                    <User className="h-4 w-4 text-blue-600" />
                    Applicant Name
                  </div>
                  <p className="font-semibold text-gray-900">{application.applicant_name}</p>
                </div>
                <div className="space-y-2 p-4 bg-white/60 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                    <CreditCard className="h-4 w-4 text-blue-600" />
                    Card Product
                  </div>
                  <p className="font-semibold text-gray-900">{application.card_product_name}</p>
                </div>
                <div className="space-y-2 p-4 bg-white/60 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    Submitted Date
                  </div>
                  <p className="font-semibold text-gray-900">
                    {application.submitted_at ? formatDate(application.submitted_at) : 'Not submitted'}
                  </p>
                </div>
                <div className="space-y-2 p-4 bg-white/60 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                    <Clock className="h-4 w-4 text-blue-600" />
                    Last Updated
                  </div>
                  <p className="font-semibold text-gray-900">{formatDate(application.last_updated_at)}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Timeline Card - Using our new component */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <TimelineCard events={convertToTimelineEvents()} />
      </motion.div>

      {/* Contact Support */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="shadow-sm border-0 bg-gray-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Phone className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-1">Need Help?</h3>
                <p className="text-sm text-gray-600 mb-3">
                  If you have questions about your application, our support team is here to help.
                </p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-700">cardsupport@mtbbank.com</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-700">16216</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
