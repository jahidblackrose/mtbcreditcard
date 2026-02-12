/**
 * MTB Credit Card Application - Dashboard Page
 * 
 * Customer dashboard for tracking applications.
 * API: Uses dashboard.api.ts ONLY
 */

import { useEffect, useState } from 'react';
import { MainLayout } from '../layouts';
import { LoadingSpinner, ErrorMessage, StatusBadge } from '../components';
import { getMyApplications, trackApplication } from '@/api/dashboard.api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, FileText, CreditCard } from 'lucide-react';
import type { ApplicationSummary, PaginatedResponse } from '@/types';

export function DashboardPage() {
  const [applications, setApplications] = useState<ApplicationSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [referenceNumber, setReferenceNumber] = useState('');
  const [trackedApp, setTrackedApp] = useState<ApplicationSummary | null>(null);
  const [tracking, setTracking] = useState(false);

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
    setError(null);
    setTrackedApp(null);
    
    const response = await trackApplication(referenceNumber);
    
    if (response.status === 200 && response.data) {
      setTrackedApp(response.data);
    } else {
      setError(response.message);
    }
    setTracking(false);
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
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-2xl font-bold text-foreground mb-6">
          Application Dashboard
        </h1>

        {/* Track Application */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Track Your Application</CardTitle>
            <CardDescription className="text-[13px]">
              Enter your reference number to check application status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3 flex-col sm:flex-row">
              <div className="flex-1">
                <Label htmlFor="refNumber" className="sr-only">Reference Number</Label>
                <Input
                  id="refNumber"
                  placeholder="e.g., MTB-CC-2024-00123"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                />
              </div>
              <Button onClick={handleTrack} disabled={tracking || !referenceNumber} className="gap-2">
                {tracking ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <Search className="h-4 w-4" />
                )}
                Track
              </Button>
            </div>

            {error && (
              <ErrorMessage message={error} className="mt-4" />
            )}

            {trackedApp && (
              <Card className="mt-4 border-primary/20 shadow-none">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{trackedApp.referenceNumber}</p>
                      <p className="text-[13px] text-muted-foreground">{trackedApp.applicantName}</p>
                    </div>
                    <StatusBadge status={trackedApp.status} />
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        {/* My Applications */}
        <section>
          <h2 className="text-base font-semibold text-foreground mb-4">
            My Applications
          </h2>
          
          {applications.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mx-auto mb-3">
                  <FileText className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">No applications found</p>
                <Button variant="outline" className="mt-4 text-[13px]">
                  Start New Application
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {applications.map((app) => (
                <Card key={app.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center flex-shrink-0">
                          <CreditCard className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{app.referenceNumber}</p>
                          <p className="text-[13px] text-muted-foreground">
                            {app.cardType.replace(/_/g, ' ')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <StatusBadge status={app.status} />
                        <Button variant="ghost" size="sm" className="text-[13px]">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </MainLayout>
  );
}
