/**
 * MTB Credit Card Application - Resume Dashboard
 * 
 * Dashboard-like interface for resuming applications:
 * - Resume existing application
 * - Add supplementary card only
 * - Check application status
 */

import { useState } from 'react';
import { CreditCard, FileText, Plus, Search, ArrowLeft, Loader2, User, Phone, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ResumeDashboardProps {
  onResumeApplication: (mobileNumber: string) => void;
  onSupplementaryOnly: () => void;
  onCheckStatus: (referenceNumber: string) => void;
  onBack: () => void;
  isLoading?: boolean;
}

type DashboardView = 'main' | 'resume' | 'supplementary' | 'status';

interface ApplicationStatusResult {
  referenceNumber: string;
  status: 'pending' | 'processing' | 'approved' | 'rejected';
  applicantName: string;
  submittedDate: string;
  cardType?: string;
}

export function ResumeDashboard({
  onResumeApplication,
  onSupplementaryOnly,
  onCheckStatus,
  onBack,
  isLoading = false,
}: ResumeDashboardProps) {
  const [view, setView] = useState<DashboardView>('main');
  const [mobileNumber, setMobileNumber] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [statusResult, setStatusResult] = useState<ApplicationStatusResult | null>(null);
  const [statusError, setStatusError] = useState<string | null>(null);

  const handleResumeSubmit = () => {
    if (mobileNumber.length === 11) {
      onResumeApplication(mobileNumber);
    }
  };

  const handleStatusCheck = async () => {
    if (!referenceNumber.trim()) return;
    
    setIsSearching(true);
    setStatusError(null);
    setStatusResult(null);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock response
    if (referenceNumber.toUpperCase().startsWith('MTB-CC-')) {
      setStatusResult({
        referenceNumber: referenceNumber.toUpperCase(),
        status: 'processing',
        applicantName: 'John Doe',
        submittedDate: '2024-01-15',
        cardType: 'Visa Platinum',
      });
    } else {
      setStatusError('No application found with this reference number.');
    }
    
    setIsSearching(false);
  };

  const getStatusBadge = (status: ApplicationStatusResult['status']) => {
    const statusConfig = {
      pending: { label: 'Pending Review', variant: 'secondary' as const, icon: Clock },
      processing: { label: 'Processing', variant: 'default' as const, icon: Loader2 },
      approved: { label: 'Approved', variant: 'default' as const, icon: CheckCircle },
      rejected: { label: 'Rejected', variant: 'destructive' as const, icon: AlertCircle },
    };
    
    const config = statusConfig[status];
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className={cn(
        'flex items-center gap-1',
        status === 'approved' && 'bg-success text-success-foreground',
        status === 'processing' && 'bg-primary text-primary-foreground'
      )}>
        <Icon className={cn('h-3 w-3', status === 'processing' && 'animate-spin')} />
        {config.label}
      </Badge>
    );
  };

  // Main dashboard view
  if (view === 'main') {
    return (
      <Card className="max-w-lg mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <FileText className="h-7 w-7 text-primary" />
          </div>
          <CardTitle className="text-2xl">Application Dashboard</CardTitle>
          <CardDescription>
            Manage your credit card applications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Resume Existing Application */}
          <Button
            onClick={() => setView('resume')}
            className="w-full h-auto py-4 flex items-start gap-4 mobile-cta-button hover:opacity-90"
            size="lg"
          >
            <div className="w-10 h-10 rounded-full bg-black/10 flex items-center justify-center flex-shrink-0">
              <CreditCard className="h-5 w-5" />
            </div>
            <div className="text-left">
              <span className="font-semibold block">Resume Application</span>
              <span className="text-xs opacity-80">Continue your saved credit card application</span>
            </div>
          </Button>

          {/* Supplementary Card Only - Existing Customer */}
          <Button
            onClick={onSupplementaryOnly}
            variant="outline"
            className="w-full h-auto py-4 flex items-start gap-4 border-primary text-primary hover:bg-primary/5"
            size="lg"
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Plus className="h-5 w-5" />
            </div>
            <div className="text-left">
              <span className="font-semibold block">Add Supplementary Card</span>
              <span className="text-xs text-muted-foreground">Request a supplementary card for existing account</span>
            </div>
          </Button>

          {/* Check Application Status */}
          <Button
            onClick={() => setView('status')}
            variant="outline"
            className="w-full h-auto py-4 flex items-start gap-4 border-border hover:bg-muted"
            size="lg"
          >
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
              <Search className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="text-left text-foreground">
              <span className="font-semibold block">Check Application Status</span>
              <span className="text-xs text-muted-foreground">Track your submitted application</span>
            </div>
          </Button>

          <div className="pt-4">
            <Button
              variant="ghost"
              onClick={onBack}
              className="w-full text-muted-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Selection
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Resume application view
  if (view === 'resume') {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <User className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>Resume Application</CardTitle>
          <CardDescription>
            Enter your registered mobile number to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Mobile Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="01XXXXXXXXX"
                className="pl-10"
                maxLength={11}
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Enter the mobile number you used to start your application
            </p>
          </div>

          <Button
            onClick={handleResumeSubmit}
            disabled={mobileNumber.length !== 11 || isLoading}
            className="w-full mobile-cta-button hover:opacity-90"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Finding your application...
              </>
            ) : (
              'Continue Application'
            )}
          </Button>

          <Button
            variant="ghost"
            onClick={() => setView('main')}
            className="w-full"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Check status view
  if (view === 'status') {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Search className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>Check Application Status</CardTitle>
          <CardDescription>
            Enter your application reference number
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Reference Number</label>
            <Input
              placeholder="e.g., MTB-CC-2024-00123"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              You received this number when you submitted your application
            </p>
          </div>

          <Button
            onClick={handleStatusCheck}
            disabled={!referenceNumber.trim() || isSearching}
            className="w-full mobile-cta-button hover:opacity-90"
          >
            {isSearching ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Searching...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Check Status
              </>
            )}
          </Button>

          {/* Status Result */}
          {statusResult && (
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{statusResult.referenceNumber}</span>
                    {getStatusBadge(statusResult.status)}
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p><strong>Applicant:</strong> {statusResult.applicantName}</p>
                    <p><strong>Card Type:</strong> {statusResult.cardType}</p>
                    <p><strong>Submitted:</strong> {statusResult.submittedDate}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Error Message */}
          {statusError && (
            <div className="flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{statusError}</span>
            </div>
          )}

          <Button
            variant="ghost"
            onClick={() => {
              setView('main');
              setStatusResult(null);
              setStatusError(null);
              setReferenceNumber('');
            }}
            className="w-full"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </CardContent>
      </Card>
    );
  }

  return null;
}
