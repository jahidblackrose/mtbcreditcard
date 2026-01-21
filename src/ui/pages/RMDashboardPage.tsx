/**
 * MTB Credit Card Application - RM Dashboard Page
 * 
 * Dashboard for Relationship Managers to view and manage applications.
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { 
  Plus, 
  Search, 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  LogOut,
  ChevronRight,
  Filter
} from 'lucide-react';
import { MainLayout } from '../layouts';
import { LoadingSpinner, StatusBadge } from '../components';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getRMSession, rmLogout } from '@/api/auth.api';
import { getRMApplications, getRMDashboardStats } from '@/api/rm-dashboard.api';
import type { ApplicationSummary, ApplicationStatus, StaffUser } from '@/types';

export function RMDashboardPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [rmUser, setRmUser] = useState<StaffUser | null>(null);
  const [applications, setApplications] = useState<ApplicationSummary[]>([]);
  const [stats, setStats] = useState<{
    total: number;
    draft: number;
    submitted: number;
    underReview: number;
    approved: number;
    rejected: number;
    documentsRequired: number;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    const sessionResponse = await getRMSession();
    
    if (!sessionResponse.data) {
      navigate('/rm/login');
      return;
    }

    setRmUser(sessionResponse.data.user);
    await loadDashboardData();
  };

  const loadDashboardData = async () => {
    setIsLoading(true);
    
    const [appsResponse, statsResponse] = await Promise.all([
      getRMApplications({
        status: statusFilter !== 'all' ? (statusFilter as ApplicationStatus) : undefined,
        search: searchQuery || undefined,
      }),
      getRMDashboardStats(),
    ]);

    if (appsResponse.data) {
      setApplications(appsResponse.data);
    }
    if (statsResponse.data) {
      setStats(statsResponse.data);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (rmUser) {
      loadDashboardData();
    }
  }, [searchQuery, statusFilter]);

  const handleLogout = async () => {
    await rmLogout();
    navigate('/rm/login');
  };

  const handleNewApplication = () => {
    navigate('/apply', { state: { mode: 'ASSISTED' } });
  };

  const handleViewApplication = (app: ApplicationSummary) => {
    if (app.status === 'DRAFT') {
      navigate('/apply', { state: { mode: 'ASSISTED', applicationId: app.id } });
    } else {
      // View-only mode for submitted applications
      navigate(`/application/${app.id}`);
    }
  };

  const getStatusIcon = (status: ApplicationStatus) => {
    switch (status) {
      case 'DRAFT':
        return <FileText className="h-4 w-4 text-muted-foreground" />;
      case 'SUBMITTED':
      case 'UNDER_REVIEW':
        return <Clock className="h-4 w-4 text-info" />;
      case 'APPROVED':
      case 'CARD_ISSUED':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'REJECTED':
        return <XCircle className="h-4 w-4 text-destructive" />;
      case 'DOCUMENTS_REQUIRED':
        return <AlertCircle className="h-4 w-4 text-warning" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  if (isLoading && !rmUser) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner size="lg" />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">RM Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome, {rmUser?.fullName} • {rmUser?.branch}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={handleNewApplication} className="gap-2">
              <Plus className="h-4 w-4" />
              New Application
            </Button>
            <Button variant="outline" onClick={handleLogout} className="gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
            <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => setStatusFilter('all')}>
              <CardContent className="pt-4">
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </CardContent>
            </Card>
            <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => setStatusFilter('DRAFT')}>
              <CardContent className="pt-4">
                <p className="text-2xl font-bold text-muted-foreground">{stats.draft}</p>
                <p className="text-xs text-muted-foreground">Draft</p>
              </CardContent>
            </Card>
            <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => setStatusFilter('SUBMITTED')}>
              <CardContent className="pt-4">
                <p className="text-2xl font-bold text-info">{stats.submitted}</p>
                <p className="text-xs text-muted-foreground">Submitted</p>
              </CardContent>
            </Card>
            <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => setStatusFilter('UNDER_REVIEW')}>
              <CardContent className="pt-4">
                <p className="text-2xl font-bold text-info">{stats.underReview}</p>
                <p className="text-xs text-muted-foreground">Under Review</p>
              </CardContent>
            </Card>
            <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => setStatusFilter('DOCUMENTS_REQUIRED')}>
              <CardContent className="pt-4">
                <p className="text-2xl font-bold text-warning">{stats.documentsRequired}</p>
                <p className="text-xs text-muted-foreground">Docs Required</p>
              </CardContent>
            </Card>
            <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => setStatusFilter('APPROVED')}>
              <CardContent className="pt-4">
                <p className="text-2xl font-bold text-success">{stats.approved}</p>
                <p className="text-xs text-muted-foreground">Approved</p>
              </CardContent>
            </Card>
            <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => setStatusFilter('REJECTED')}>
              <CardContent className="pt-4">
                <p className="text-2xl font-bold text-destructive">{stats.rejected}</p>
                <p className="text-xs text-muted-foreground">Rejected</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or reference number..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="SUBMITTED">Submitted</SelectItem>
                  <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                  <SelectItem value="DOCUMENTS_REQUIRED">Documents Required</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Applications Table */}
        <Card>
          <CardHeader>
            <CardTitle>Applications</CardTitle>
            <CardDescription>
              {applications.length} application{applications.length !== 1 ? 's' : ''} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner />
              </div>
            ) : applications.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No applications found</p>
                <Button variant="link" onClick={handleNewApplication} className="mt-2">
                  Create your first application
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Reference</TableHead>
                      <TableHead>Applicant</TableHead>
                      <TableHead>Card Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Updated</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {applications.map((app) => (
                      <TableRow
                        key={app.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleViewApplication(app)}
                      >
                        <TableCell className="font-mono text-sm">
                          {app.referenceNumber}
                        </TableCell>
                        <TableCell className="font-medium">{app.applicantName}</TableCell>
                        <TableCell>
                          <span className="text-sm">
                            {app.cardType.replace('_', ' ')}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(app.status)}
                            <StatusBadge status={app.status} />
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {format(new Date(app.lastUpdatedAt), 'dd MMM yyyy, HH:mm')}
                        </TableCell>
                        <TableCell>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
