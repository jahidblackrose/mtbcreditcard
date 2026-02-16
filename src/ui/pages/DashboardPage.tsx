/**
 * MTB Credit Card Application - Dashboard Page
 *
 * Shows application status and tracking.
 * Different view for applicants vs staff (assisted mode).
 * Enhanced with better UX, empty states, and improved design.
 *
 * API: Uses dashboard.api.ts ONLY
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MainLayout } from '../layouts';
import { LoadingSpinner, ErrorMessage, StatusBadge, EmptyState, ApplicationCardSkeleton } from '@/components';
import { getMyApplications, trackApplication } from '@/api/dashboard.api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, FileText, Plus, TrendingUp, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import type { ApplicationSummary, PaginatedResponse } from '@/types';

export function DashboardPage() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<ApplicationSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [referenceNumber, setReferenceNumber] = useState('');
  const [trackedApp, setTrackedApp] = useState<ApplicationSummary | null>(null);
  const [tracking, setTracking] = useState(false);
  const [trackError, setTrackError] = useState<string | null>(null);

  useEffect(() => {
    async function loadApplications() {
      const response = await getMyApplications();
      if (response.status === 200 && response.data) {
        setApplications(response.data.items);
      } else {
        setError(response.message);
      }
      setLoading(false);
    }
    loadApplications();
  }, []);

  const handleTrack = async () => {
    setTracking(true);
    setTrackError(null);
    setTrackedApp(null);

    const response = await trackApplication(referenceNumber);

    if (response.status === 200 && response.data) {
      setTrackedApp(response.data);
    } else {
      setTrackError(response.message);
    }
    setTracking(false);
  };

  const handleStartNew = () => {
    navigate('/');
  };

  const handleViewDetails = (appId: string) => {
    // Navigate to application details or status tracker
    navigate(`/application/${appId}`);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return <FileText className="h-5 w-5 text-gray-500" />;
      case 'SUBMITTED':
      case 'UNDER_REVIEW':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'APPROVED':
      case 'CARD_ISSUED':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'DOCUMENTS_REQUIRED':
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      case 'REJECTED':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Application Dashboard</h1>
          <p className="text-gray-600">Track and manage your credit card applications</p>
        </motion.div>

        {/* Track Application - Enhanced */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="shadow-md border-0 bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
                  <Search className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl text-gray-900">Track Your Application</CardTitle>
                  <CardDescription className="text-gray-600">
                    Enter your reference number to check application status
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3 flex-col sm:flex-row">
                <div className="flex-1">
                  <Label htmlFor="refNumber" className="sr-only">Reference Number</Label>
                  <Input
                    id="refNumber"
                    placeholder="e.g., MTB-CC-2024-00123"
                    className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    value={referenceNumber}
                    onChange={(e) => {
                      setReferenceNumber(e.target.value);
                      setTrackError(null);
                    }}
                    onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
                  />
                </div>
                <Button
                  onClick={handleTrack}
                  disabled={tracking || !referenceNumber}
                  className="h-11 bg-blue-600 hover:bg-blue-700 shadow-md"
                >
                  {tracking ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Tracking...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Track
                    </>
                  )}
                </Button>
              </div>

              <AnimatePresence>
                {trackError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-4"
                  >
                    <ErrorMessage message={trackError} />
                  </motion.div>
                )}
              </AnimatePresence>

              {trackedApp && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4"
                >
                  <Card className="border-2 border-green-200 bg-green-50">
                    <CardContent className="pt-5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                            {getStatusIcon(trackedApp.status)}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{trackedApp.referenceNumber}</p>
                            <p className="text-sm text-gray-600">{trackedApp.applicantName}</p>
                          </div>
                        </div>
                        <StatusBadge status={trackedApp.status} />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex gap-4">
            <Button
              onClick={handleStartNew}
              className="flex-1 h-auto py-4 bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transition-all"
            >
              <Plus className="h-5 w-5 mr-2" />
              <span className="font-medium">Start New Application</span>
            </Button>
          </div>
        </motion.div>

        {/* My Applications - Enhanced */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">My Applications</h2>
            {applications.length > 0 && (
              <div className="flex items-center text-sm text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">
                <TrendingUp className="h-4 w-4 mr-1.5" />
                {applications.length} application{applications.length > 1 ? 's' : ''}
              </div>
            )}
          </div>

          {loading ? (
            <div className="space-y-3">
              <ApplicationCardSkeleton count={3} />
            </div>
          ) : applications.length === 0 ? (
            <EmptyState
              icon={<FileText className="h-16 w-16 text-gray-400" />}
              title="No Applications Yet"
              description="You haven't started any credit card applications. Begin your application journey today!"
              action={{
                label: 'Start Your First Application',
                onClick: handleStartNew,
              }}
            />
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {applications.map((app, index) => (
                  <motion.div
                    key={app.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                  >
                    <Card className="shadow-sm hover:shadow-lg transition-all duration-300 border-2 cursor-pointer border-gray-200 hover:border-blue-300">
                      <CardContent className="p-5">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                          <div className="flex items-center gap-4">
                            <motion.div
                              className="bg-gradient-to-br from-blue-100 to-indigo-100 p-3 rounded-xl"
                              whileHover={{ rotate: 5 }}
                            >
                              {getStatusIcon(app.status)}
                            </motion.div>
                            <div>
                              <p className="font-bold text-gray-900 text-lg">{app.referenceNumber}</p>
                              <p className="text-sm text-gray-600 mt-0.5">
                                {app.cardType?.replace(/_/g, ' ') || 'Credit Card'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <StatusBadge status={app.status} />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewDetails(app.id)}
                              className="hover:bg-blue-50 hover:border-blue-300"
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.section>
      </div>
    </MainLayout>
  );
}
