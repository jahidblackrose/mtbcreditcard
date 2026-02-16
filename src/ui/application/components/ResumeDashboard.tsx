/**
 * MTB Credit Card Application - Resume Dashboard
 *
 * Dashboard-like interface for resuming applications:
 * - Resume existing application (shows list of applications)
 * - Add supplementary card only
 * - Check application status
 *
 * Enhanced with improved UX, loading states, and visual feedback.
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
  RefreshCcw,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { getApplicationsByMobile, MOCK_APPLICATIONS } from '@/api/mockData';
import { ApplicationStatusTracker } from './ApplicationStatusTracker';
import { ApplicationCardSkeleton, EmptyState } from '@/components';

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
      DRAFT: { label: 'Draft', className: 'bg-gray-100 text-gray-700 border-gray-300', icon: Clock },
      SUBMITTED: { label: 'Submitted', className: 'bg-blue-100 text-blue-700 border-blue-300', icon: Clock },
      UNDER_REVIEW: { label: 'Under Review', className: 'bg-purple-100 text-purple-700 border-purple-300', icon: Loader2 },
      DOCUMENTS_REQUIRED: { label: 'Documents Required', className: 'bg-amber-100 text-amber-700 border-amber-300', icon: AlertCircle },
      APPROVED: { label: 'Approved', className: 'bg-green-100 text-green-700 border-green-300', icon: CheckCircle },
      REJECTED: { label: 'Rejected', className: 'bg-red-100 text-red-700 border-red-300', icon: AlertCircle },
    };

    const config = statusConfig[status] || { label: status, className: 'bg-gray-100 text-gray-700 border-gray-300', icon: Clock };
    const Icon = config.icon;

    return (
      <Badge variant="secondary" className={cn('flex items-center gap-1.5 px-3 py-1 border', config.className)}>
        <Icon className={cn('h-3.5 w-3.5', status === 'UNDER_REVIEW' && 'animate-spin')} />
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

  // Main dashboard view - Enhanced with better animations and design
  if (view === 'main') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="max-w-lg mx-auto shadow-lg border-0">
          <CardHeader className="text-center pb-6">
            <motion.div
              className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg"
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              <FileText className="h-8 w-8 text-white" />
            </motion.div>
            <CardTitle className="text-2xl font-bold text-gray-900">Application Dashboard</CardTitle>
            <CardDescription className="text-base">
              Manage your credit card applications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Resume Existing Application */}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={() => setView('resume')}
                className="w-full h-auto py-4 px-5 flex items-start gap-4 bg-blue-600 hover:bg-blue-700 text-white border-0 shadow-md hover:shadow-lg transition-all"
                size="lg"
              >
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                  <RefreshCcw className="h-6 w-6" />
                </div>
                <div className="text-left flex-1">
                  <span className="font-semibold block text-base">Resume Application</span>
                  <span className="text-xs opacity-90">Continue your saved credit card application</span>
                </div>
                <ChevronRight className="h-5 w-5 opacity-70" />
              </Button>
            </motion.div>

            {/* Supplementary Card Only - Existing Customer */}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={onSupplementaryOnly}
                variant="outline"
                className="w-full h-auto py-4 px-5 flex items-start gap-4 border-2 border-blue-200 text-blue-700 hover:bg-blue-50 shadow-sm"
                size="lg"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Plus className="h-6 w-6" />
                </div>
                <div className="text-left flex-1">
                  <span className="font-semibold block text-base">Add Supplementary Card</span>
                  <span className="text-xs text-blue-600/70">Request a supplementary card for existing account</span>
                </div>
                <ChevronRight className="h-5 w-5 opacity-50" />
              </Button>
            </motion.div>

            {/* Check Application Status */}
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={() => setView('status')}
                variant="outline"
                className="w-full h-auto py-4 px-5 flex items-start gap-4 border-2 border-gray-200 hover:bg-gray-50 shadow-sm"
                size="lg"
              >
                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <Search className="h-6 w-6 text-gray-600" />
                </div>
                <div className="text-left text-gray-900 flex-1">
                  <span className="font-semibold block text-base">Check Application Status</span>
                  <span className="text-xs text-gray-500">Track your submitted application</span>
                </div>
                <ChevronRight className="h-5 w-5 opacity-50" />
              </Button>
            </motion.div>

            <div className="pt-6 border-t border-gray-100">
              <Button
                variant="ghost"
                onClick={onBack}
                className="w-full text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  // Resume application view - Enhanced with better UX
  if (view === 'resume') {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="max-w-md mx-auto shadow-lg">
          <CardHeader className="text-center">
            <motion.div
              className="mx-auto w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.1 }}
            >
              <User className="h-7 w-7 text-blue-600" />
            </motion.div>
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
    </motion.div>
    );
  }

  // Applications list view - Enhanced with better UX
  if (view === 'applications-list') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-2xl mx-auto space-y-4"
      >
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="shadow-md border-0">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <CreditCard className="h-5 w-5 text-blue-600" />
                Your Applications
              </CardTitle>
              <CardDescription className="text-gray-700">
                Found {existingApplications.length} application{existingApplications.length > 1 ? 's' : ''} for {mobileNumber}
              </CardDescription>
            </CardHeader>
          </Card>
        </motion.div>

        {isSearching ? (
          <div className="space-y-3">
            <ApplicationCardSkeleton count={2} />
          </div>
        ) : existingApplications.length === 0 ? (
          <EmptyState
            icon={<CreditCard className="h-12 w-12 text-gray-400" />}
            title="No Applications Found"
            description="We couldn't find any applications associated with this mobile number."
            action={{
              label: 'Start New Application',
              onClick: () => {
                setView('main');
                setMobileNumber('');
              },
            }}
          />
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {existingApplications.map((app, index) => (
                <motion.div
                  key={app.application_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="cursor-pointer"
                  onClick={() => handleSelectApplication(app)}
                >
                  <Card
                    className={cn(
                      'shadow-sm hover:shadow-lg transition-all duration-300 border-2',
                      app.status === 'DRAFT' ? 'border-blue-300 hover:border-blue-400' : 'border-gray-200 hover:border-gray-300'
                    )}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <p className="font-bold text-lg">{app.card_product_name}</p>
                            {getStatusBadge(app.status)}
                          </div>
                          <p className="text-sm text-gray-600 mb-3 font-mono">
                            Ref: {app.reference_number}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded">
                              <User className="h-3.5 w-3.5" />
                              {app.applicant_name}
                            </span>
                            <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded">
                              <Clock className="h-3.5 w-3.5" />
                              {formatDate(app.last_updated_at)}
                            </span>
                          </div>

                          {/* Progress for drafts */}
                          {app.status === 'DRAFT' && (
                            <div className="mt-4 bg-blue-50 rounded-lg p-3">
                              <div className="flex items-center justify-between text-xs mb-2">
                                <span className="font-medium text-blue-900">Progress: Step {app.current_step} of {app.total_steps}</span>
                                <span className="text-blue-700 font-bold">
                                  {Math.round((app.current_step / app.total_steps) * 100)}%
                                </span>
                              </div>
                              <div className="h-2 rounded-full bg-blue-200 overflow-hidden">
                                <motion.div
                                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${(app.current_step / app.total_steps) * 100}%` }}
                                  transition={{ duration: 0.8, delay: index * 0.1 }}
                                />
                              </div>
                            </div>
                          )}
                        </div>

                        <ChevronRight className="h-6 w-6 text-gray-400 flex-shrink-0 mt-2" />
                      </div>

                      {/* Action hints */}
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        {app.status === 'DRAFT' ? (
                          <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                            <RefreshCcw className="h-4 w-4 mr-2" />
                            Resume Application
                          </Button>
                        ) : app.status === 'APPROVED' ? (
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full border-green-500 text-green-700 hover:bg-green-50"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            View Status
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full hover:bg-gray-50"
                          >
                            <Search className="h-4 w-4 mr-2" />
                            View Status
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        <Button
          variant="ghost"
          onClick={() => {
            setView('main');
            setMobileNumber('');
            setSearchError(null);
            setExistingApplications([]);
          }}
          className="w-full text-gray-600 hover:text-gray-900 hover:bg-gray-100 mt-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </motion.div>
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
