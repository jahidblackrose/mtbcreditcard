/**
 * MTB Credit Card Application - Resume Dashboard
 * 
 * Dashboard-like interface for resuming applications:
 * - Resume existing application (shows list of applications)
 * - Add supplementary card only
 * - Check application status
 */

import { useState } from 'react';
import { 
  CreditCard, 
  FileText, 
  Plus, 
  Search, 
  ArrowLeft, 
  Loader2, 
  User, 
  Phone, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  ChevronRight,
  RefreshCcw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { getApplicationsByMobile, MOCK_APPLICATIONS } from '@/api/mockData';
import { ApplicationStatusTracker } from './ApplicationStatusTracker';

interface ResumeDashboardProps {
  onResumeApplication: (mobileNumber: string, applicationId?: string) => void;
  onSupplementaryOnly: () => void;
  onCheckStatus: (referenceNumber: string) => void;
  onBack: () => void;
  onCreateNew?: () => void;
  isLoading?: boolean;
}

type DashboardView = 'main' | 'resume' | 'applications-list' | 'supplementary' | 'status' | 'status-detail';

interface MockApplication {
  application_id: string;
  reference_number: string;
  status: string;
  card_product_name: string;
  applicant_name: string;
  mobile_number: string;
  created_at: string;
  last_updated_at: string;
  current_step: number;
  total_steps: number;
  is_submitted: boolean;
}

export function ResumeDashboard({
  onResumeApplication,
  onSupplementaryOnly,
  onCheckStatus,
  onBack,
  onCreateNew,
  isLoading = false,
}: ResumeDashboardProps) {
  const [view, setView] = useState<DashboardView>('main');
  const [mobileNumber, setMobileNumber] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [existingApplications, setExistingApplications] = useState<MockApplication[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [selectedReference, setSelectedReference] = useState<string | null>(null);

  const handleResumeSubmit = async () => {
    if (mobileNumber.length !== 11) {
      setSearchError('Please enter a valid 11-digit mobile number');
      return;
    }
    
    setIsSearching(true);
    setSearchError(null);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const apps = getApplicationsByMobile(mobileNumber) as MockApplication[];
    
    if (apps.length > 0) {
      setExistingApplications(apps);
      setView('applications-list');
    } else {
      // No existing applications, start new
      if (onCreateNew) {
        onCreateNew();
      } else {
        setSearchError('No applications found. Starting a new application.');
      }
    }
    
    setIsSearching(false);
  };

  const handleSelectApplication = (application: MockApplication) => {
    if (application.status === 'DRAFT') {
      onResumeApplication(application.mobile_number, application.application_id);
    } else {
      // Show status tracker for non-draft applications
      setSelectedReference(application.reference_number);
      setView('status-detail');
    }
  };

  const handleCheckStatus = () => {
    if (!referenceNumber.trim()) return;
    setSelectedReference(referenceNumber.toUpperCase());
    setView('status-detail');
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string; icon: typeof Clock }> = {
      DRAFT: { label: 'Draft', className: 'bg-muted text-muted-foreground', icon: Clock },
      SUBMITTED: { label: 'Submitted', className: 'bg-blue-500/10 text-blue-600', icon: Clock },
      UNDER_REVIEW: { label: 'Under Review', className: 'bg-primary/10 text-primary', icon: Loader2 },
      DOCUMENTS_REQUIRED: { label: 'Documents Required', className: 'bg-amber-500/10 text-amber-600', icon: AlertCircle },
      APPROVED: { label: 'Approved', className: 'bg-success/10 text-success', icon: CheckCircle },
      REJECTED: { label: 'Rejected', className: 'bg-destructive/10 text-destructive', icon: AlertCircle },
    };
    
    const config = statusConfig[status] || { label: status, className: 'bg-muted', icon: Clock };
    const Icon = config.icon;
    
    return (
      <Badge variant="secondary" className={cn('flex items-center gap-1', config.className)}>
        <Icon className={cn('h-3 w-3', status === 'UNDER_REVIEW' && 'animate-spin')} />
        {config.label}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  // Status detail view (uses ApplicationStatusTracker)
  if (view === 'status-detail' && selectedReference) {
    return (
      <ApplicationStatusTracker
        referenceNumber={selectedReference}
        onBack={() => {
          setSelectedReference(null);
          setView('main');
        }}
      />
    );
  }

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
              <RefreshCcw className="h-5 w-5" />
            </div>
            <div className="text-left flex-1">
              <span className="font-semibold block">Resume Application</span>
              <span className="text-xs opacity-80">Continue your saved credit card application</span>
            </div>
            <ChevronRight className="h-5 w-5 opacity-50" />
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
            <div className="text-left flex-1">
              <span className="font-semibold block">Add Supplementary Card</span>
              <span className="text-xs text-muted-foreground">Request a supplementary card for existing account</span>
            </div>
            <ChevronRight className="h-5 w-5 opacity-50" />
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
            <div className="text-left text-foreground flex-1">
              <span className="font-semibold block">Check Application Status</span>
              <span className="text-xs text-muted-foreground">Track your submitted application</span>
            </div>
            <ChevronRight className="h-5 w-5 opacity-50" />
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

  // Resume application view - Enter mobile
  if (view === 'resume') {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <User className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>Resume Application</CardTitle>
          <CardDescription>
            Enter your registered mobile number to find your applications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {searchError && (
            <div className="flex items-center gap-2 rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{searchError}</span>
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Mobile Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="01XXXXXXXXX"
                className="pl-10"
                maxLength={11}
                value={mobileNumber}
                onChange={(e) => {
                  setMobileNumber(e.target.value.replace(/\D/g, ''));
                  setSearchError(null);
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Enter the mobile number you used to start your application
            </p>
          </div>

          <Button
            onClick={handleResumeSubmit}
            disabled={mobileNumber.length !== 11 || isSearching}
            className="w-full mobile-cta-button hover:opacity-90"
          >
            {isSearching ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Finding your applications...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Find My Applications
              </>
            )}
          </Button>

          <Button
            variant="ghost"
            onClick={() => {
              setView('main');
              setMobileNumber('');
              setSearchError(null);
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

  // Applications list view
  if (view === 'applications-list') {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Your Applications
            </CardTitle>
            <CardDescription>
              Found {existingApplications.length} application(s) for {mobileNumber}
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="space-y-3">
          {existingApplications.map((app) => (
            <Card 
              key={app.application_id} 
              className={cn(
                "cursor-pointer transition-all hover:shadow-md",
                app.status === 'DRAFT' && 'border-primary/50'
              )}
              onClick={() => handleSelectApplication(app)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold">{app.card_product_name}</p>
                      {getStatusBadge(app.status)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Ref: {app.reference_number}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {app.applicant_name}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDate(app.last_updated_at)}
                      </span>
                    </div>
                    
                    {/* Progress for drafts */}
                    {app.status === 'DRAFT' && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span>Progress: Step {app.current_step} of {app.total_steps}</span>
                          <span className="text-primary font-medium">
                            {Math.round((app.current_step / app.total_steps) * 100)}%
                          </span>
                        </div>
                        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ width: `${(app.current_step / app.total_steps) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-1" />
                </div>
                
                {/* Action hints */}
                <div className="mt-3 pt-3 border-t border-border/50">
                  {app.status === 'DRAFT' ? (
                    <Button size="sm" className="w-full mobile-cta-button">
                      <RefreshCcw className="h-4 w-4 mr-2" />
                      Resume Application
                    </Button>
                  ) : app.status === 'APPROVED' ? (
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="w-full border-primary text-primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSupplementaryOnly();
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Supplementary Card
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" className="w-full">
                      <Search className="h-4 w-4 mr-2" />
                      View Status
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Button
          variant="ghost"
          onClick={() => {
            setView('resume');
            setExistingApplications([]);
          }}
          className="w-full"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Search Different Number
        </Button>
      </div>
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
              placeholder="e.g., MTBCC-20260128-001"
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value.toUpperCase())}
            />
            <p className="text-xs text-muted-foreground">
              You received this number when you submitted your application
            </p>
          </div>

          <Button
            onClick={handleCheckStatus}
            disabled={!referenceNumber.trim() || isSearching}
            className="w-full mobile-cta-button hover:opacity-90"
          >
            <Search className="mr-2 h-4 w-4" />
            Check Status
          </Button>

          <Button
            variant="ghost"
            onClick={() => {
              setView('main');
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
