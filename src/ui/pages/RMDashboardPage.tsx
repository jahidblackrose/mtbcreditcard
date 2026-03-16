/**
 * MTB Credit Card Application - RM Dashboard Page
 *
 * Dashboard for Relationship Managers to view and manage applications.
 * Enhanced with professional design, export functionality, and better UX.
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
  Download,
  TrendingUp,
  Users,
  BarChart3,
  RefreshCw,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { MainLayout } from '../layouts';
import { LoadingSpinner, StatusBadge, TableSkeleton } from '@/components';
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
  const [isExporting, setIsExporting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

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
    if (isRefreshing) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

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
    setIsRefreshing(false);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadDashboardData();
  };

  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      // Create CSV content
      const headers = ['Reference', 'Applicant', 'Mobile', 'Card Type', 'Status', 'Created Date', 'Last Updated'];
      const rows = applications.map(app => [
        app.referenceNumber,
        app.applicantName,
        app.mobileNumber,
        app.cardProductName,
        app.status,
        format(new Date(app.createdAt), 'dd MMM yyyy'),
        format(new Date(app.updatedAt), 'dd MMM yyyy'),
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');

      // Create and download the file
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `applications_${format(new Date(), 'yyyy-MM-dd')}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
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
            <motion.h1
              className="text-3xl font-bold text-gray-900"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              RM Dashboard
            </motion.h1>
            <p className="text-gray-600 mt-1">
              Welcome, <span className="font-semibold text-gray-900">{rmUser?.fullName}</span> • {rmUser?.branch}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              variant="outline"
              onClick={handleExportCSV}
              disabled={isExporting || applications.length === 0}
              className="gap-2"
            >
              <Download className={`h-4 w-4 ${isExporting ? 'animate-bounce' : ''}`} />
              Export CSV
            </Button>
            <Button onClick={handleNewApplication} className="gap-2 bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4" />
              New Application
            </Button>
            <Button variant="outline" onClick={handleLogout} className="gap-2">
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Stats Cards - Enhanced with Icons and Better Design */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card
                className="cursor-pointer hover:shadow-lg hover:border-blue-400 transition-all duration-300 border-2 bg-gradient-to-br from-gray-50 to-white"
                onClick={() => setStatusFilter('all')}
              >
                <CardContent className="pt-5">
                  <div className="flex items-center justify-between mb-2">
                    <BarChart3 className="h-5 w-5 text-gray-600" />
                    <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-700 rounded-full">All</span>
                  </div>
                  <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                  <p className="text-xs text-gray-600 mt-1">Total Applications</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <Card
                className="cursor-pointer hover:shadow-lg hover:border-gray-400 transition-all duration-300 border-2 bg-gradient-to-br from-gray-50 to-white"
                onClick={() => setStatusFilter('DRAFT')}
              >
                <CardContent className="pt-5">
                  <div className="flex items-center justify-between mb-2">
                    <FileText className="h-5 w-5 text-gray-500" />
                    <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-700 rounded-full">Draft</span>
                  </div>
                  <p className="text-3xl font-bold text-gray-600">{stats.draft}</p>
                  <p className="text-xs text-gray-600 mt-1">Draft Applications</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card
                className="cursor-pointer hover:shadow-lg hover:border-blue-400 transition-all duration-300 border-2 bg-gradient-to-br from-blue-50 to-white"
                onClick={() => setStatusFilter('SUBMITTED')}
              >
                <CardContent className="pt-5">
                  <div className="flex items-center justify-between mb-2">
                    <Clock className="h-5 w-5 text-blue-500" />
                    <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-700 rounded-full">New</span>
                  </div>
                  <p className="text-3xl font-bold text-blue-600">{stats.submitted}</p>
                  <p className="text-xs text-gray-600 mt-1">Submitted</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <Card
                className="cursor-pointer hover:shadow-lg hover:border-purple-400 transition-all duration-300 border-2 bg-gradient-to-br from-purple-50 to-white"
                onClick={() => setStatusFilter('UNDER_REVIEW')}
              >
                <CardContent className="pt-5">
                  <div className="flex items-center justify-between mb-2">
                    <Users className="h-5 w-5 text-purple-500" />
                    <span className="text-xs font-medium px-2 py-1 bg-purple-100 text-purple-700 rounded-full">Review</span>
                  </div>
                  <p className="text-3xl font-bold text-purple-600">{stats.underReview}</p>
                  <p className="text-xs text-gray-600 mt-1">Under Review</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card
                className="cursor-pointer hover:shadow-lg hover:border-amber-400 transition-all duration-300 border-2 bg-gradient-to-br from-amber-50 to-white"
                onClick={() => setStatusFilter('DOCUMENTS_REQUIRED')}
              >
                <CardContent className="pt-5">
                  <div className="flex items-center justify-between mb-2">
                    <AlertCircle className="h-5 w-5 text-amber-500" />
                    <span className="text-xs font-medium px-2 py-1 bg-amber-100 text-amber-700 rounded-full">Action</span>
                  </div>
                  <p className="text-3xl font-bold text-amber-600">{stats.documentsRequired}</p>
                  <p className="text-xs text-gray-600 mt-1">Docs Required</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <Card
                className="cursor-pointer hover:shadow-lg hover:border-green-400 transition-all duration-300 border-2 bg-gradient-to-br from-green-50 to-white"
                onClick={() => setStatusFilter('APPROVED')}
              >
                <CardContent className="pt-5">
                  <div className="flex items-center justify-between mb-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-700 rounded-full">Success</span>
                  </div>
                  <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
                  <p className="text-xs text-gray-600 mt-1">Approved</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card
                className="cursor-pointer hover:shadow-lg hover:border-red-400 transition-all duration-300 border-2 bg-gradient-to-br from-red-50 to-white"
                onClick={() => setStatusFilter('REJECTED')}
              >
                <CardContent className="pt-5">
                  <div className="flex items-center justify-between mb-2">
                    <XCircle className="h-5 w-5 text-red-500" />
                    <span className="text-xs font-medium px-2 py-1 bg-red-100 text-red-700 rounded-full">Declined</span>
                  </div>
                  <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
                  <p className="text-xs text-gray-600 mt-1">Rejected</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}

        {/* Filters - Enhanced with better styling */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="mb-6 shadow-sm border-0">
            <CardContent className="pt-5">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by name or reference number..."
                    className="pl-10 h-11 border-gray-300 focus:border-blue-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-[200px] h-11 border-gray-300">
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
        </motion.div>

        {/* Applications Table - Enhanced with better design */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="shadow-sm border-0">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-white rounded-t-lg">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Applications</CardTitle>
                  <CardDescription className="text-gray-600">
                    {applications.length} application{applications.length !== 1 ? 's' : ''} found
                  </CardDescription>
                </div>
                {applications.length > 0 && (
                  <div className="flex items-center text-sm text-gray-500">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    Showing all results
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {isRefreshing ? (
                <div className="p-8">
                  <TableSkeleton rowCount={5} columnCount={6} />
                </div>
              ) : applications.length === 0 ? (
                <div className="text-center py-16 text-gray-500">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                  >
                    <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  </motion.div>
                  <p className="text-lg font-medium text-gray-900 mb-1">No applications found</p>
                  <p className="text-sm text-gray-500 mb-4">Try adjusting your filters or create a new application</p>
                  <Button onClick={handleNewApplication} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Application
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50 hover:bg-gray-50">
                        <TableHead className="font-semibold text-gray-700">Reference</TableHead>
                        <TableHead className="font-semibold text-gray-700">Applicant</TableHead>
                        <TableHead className="font-semibold text-gray-700">Card Type</TableHead>
                        <TableHead className="font-semibold text-gray-700">Status</TableHead>
                        <TableHead className="font-semibold text-gray-700">Last Updated</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {applications.map((app, index) => (
                        <motion.tr
                          key={app.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="cursor-pointer hover:bg-blue-50/50 transition-colors"
                          onClick={() => handleViewApplication(app)}
                        >
                          <TableCell className="font-mono text-sm">
                            {app.referenceNumber}
                          </TableCell>
                          <TableCell className="font-medium text-gray-900">{app.applicantName}</TableCell>
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
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
        </motion.div>
      </div>
    </MainLayout>
    );
  }
