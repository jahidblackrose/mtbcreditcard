/**
 * MTB Credit Card Application - RM Dashboard Page
 * 
 * Data-oriented dashboard with navy theme for Relationship Managers.
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
  Filter,
  LayoutDashboard
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
      navigate(`/application/${app.id}`);
    }
  };

  const getStatusIcon = (status: ApplicationStatus) => {
    switch (status) {
      case 'DRAFT':
        return <FileText className="h-3.5 w-3.5 text-muted-foreground" />;
      case 'SUBMITTED':
      case 'UNDER_REVIEW':
        return <Clock className="h-3.5 w-3.5 text-info" />;
      case 'APPROVED':
      case 'CARD_ISSUED':
        return <CheckCircle className="h-3.5 w-3.5 text-success" />;
      case 'REJECTED':
        return <XCircle className="h-3.5 w-3.5 text-destructive" />;
      case 'DOCUMENTS_REQUIRED':
        return <AlertCircle className="h-3.5 w-3.5 text-warning" />;
      default:
        return <FileText className="h-3.5 w-3.5" />;
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

  const statCards = stats ? [
    { label: 'Total', value: stats.total, color: 'text-foreground', filter: 'all', borderColor: 'border-t-primary' },
    { label: 'Draft', value: stats.draft, color: 'text-muted-foreground', filter: 'DRAFT', borderColor: 'border-t-muted-foreground' },
    { label: 'Submitted', value: stats.submitted, color: 'text-info', filter: 'SUBMITTED', borderColor: 'border-t-info' },
    { label: 'Under Review', value: stats.underReview, color: 'text-warning', filter: 'UNDER_REVIEW', borderColor: 'border-t-warning' },
    { label: 'Docs Required', value: stats.documentsRequired, color: 'text-warning', filter: 'DOCUMENTS_REQUIRED', borderColor: 'border-t-warning' },
    { label: 'Approved', value: stats.approved, color: 'text-success', filter: 'APPROVED', borderColor: 'border-t-success' },
    { label: 'Rejected', value: stats.rejected, color: 'text-destructive', filter: 'REJECTED', borderColor: 'border-t-destructive' },
  ] : [];

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <LayoutDashboard className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">RM Dashboard</h1>
              <p className="text-[13px] text-muted-foreground">
                Welcome, {rmUser?.fullName} • {rmUser?.branch}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <Button onClick={handleNewApplication} size="default" className="gap-2">
              <Plus className="h-4 w-4" />
              New Application
            </Button>
            <Button variant="outline" onClick={handleLogout} size="default" className="gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Stats Cards - Equal height with top accent border */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
            {statCards.map((stat) => (
              <Card 
                key={stat.filter}
                className={`cursor-pointer hover:shadow-md transition-all border-t-2 ${stat.borderColor} ${statusFilter === stat.filter ? 'ring-1 ring-primary/30' : ''}`}
                onClick={() => setStatusFilter(stat.filter)}
              >
                <CardContent className="pt-4 pb-3 px-4">
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="text-[11px] text-muted-foreground font-medium mt-0.5">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Filters */}
        <Card className="mb-4 shadow-none">
          <CardContent className="py-3 px-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or reference number..."
                  className="pl-10 h-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px] h-9">
                  <Filter className="h-3.5 w-3.5 mr-2" />
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
        <Card className="shadow-none">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Applications</CardTitle>
            <CardDescription className="text-[13px]">
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
                <FileText className="h-10 w-10 mx-auto mb-3 opacity-40" />
                <p className="text-sm">No applications found</p>
                <Button variant="link" onClick={handleNewApplication} className="mt-1 text-[13px]">
                  Create your first application
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto -mx-6">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                      <TableHead className="text-[11px] font-semibold uppercase tracking-wider">Reference</TableHead>
                      <TableHead className="text-[11px] font-semibold uppercase tracking-wider">Applicant</TableHead>
                      <TableHead className="text-[11px] font-semibold uppercase tracking-wider">Card Type</TableHead>
                      <TableHead className="text-[11px] font-semibold uppercase tracking-wider">Status</TableHead>
                      <TableHead className="text-[11px] font-semibold uppercase tracking-wider">Last Updated</TableHead>
                      <TableHead className="w-[40px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {applications.map((app) => (
                      <TableRow
                        key={app.id}
                        className="cursor-pointer hover:bg-muted/30 transition-colors"
                        onClick={() => handleViewApplication(app)}
                      >
                        <TableCell className="font-mono text-[13px] text-primary">
                          {app.referenceNumber}
                        </TableCell>
                        <TableCell className="font-medium text-[13px]">{app.applicantName}</TableCell>
                        <TableCell className="text-[13px] text-muted-foreground">
                          {app.cardType.replace('_', ' ')}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            {getStatusIcon(app.status)}
                            <StatusBadge status={app.status} />
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-[13px]">
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
