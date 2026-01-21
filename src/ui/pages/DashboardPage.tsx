/**
 * MTB Credit Card Application - Dashboard Page
 * 
 * Shows application status and tracking.
 * Different view for applicants vs staff (assisted mode).
 * 
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
import { Search, FileText, Clock, CheckCircle } from 'lucide-react';
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
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
          Application Dashboard
        </h1>

        {/* Track Application */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Track Your Application</CardTitle>
            <CardDescription>
              Enter your reference number to check application status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 flex-col sm:flex-row">
              <div className="flex-1">
                <Label htmlFor="refNumber" className="sr-only">Reference Number</Label>
                <Input
                  id="refNumber"
                  placeholder="e.g., MTB-CC-2024-00123"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                />
              </div>
              <Button onClick={handleTrack} disabled={tracking || !referenceNumber}>
                {tracking ? (
                  <LoadingSpinner size="sm" className="mr-2" />
                ) : (
                  <Search className="mr-2 h-4 w-4" />
                )}
                Track
              </Button>
            </div>

            {error && (
              <ErrorMessage message={error} className="mt-4" />
            )}

            {trackedApp && (
              <Card className="mt-4 border-primary/20">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{trackedApp.referenceNumber}</p>
                      <p className="text-sm text-muted-foreground">{trackedApp.applicantName}</p>
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
          <h2 className="text-lg font-semibold text-foreground mb-4">
            My Applications
          </h2>
          
          {applications.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No applications found</p>
                <Button variant="outline" className="mt-4">
                  Start New Application
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {applications.map((app) => (
                <Card key={app.id}>
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center gap-4">
                        <div className="bg-muted p-3 rounded-lg">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">{app.referenceNumber}</p>
                          <p className="text-sm text-muted-foreground">
                            {app.cardType.replace(/_/g, ' ')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <StatusBadge status={app.status} />
                        <Button variant="ghost" size="sm">
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
