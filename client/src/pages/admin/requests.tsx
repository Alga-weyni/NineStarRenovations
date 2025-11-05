import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Download, FileText, Building2, Home, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import type { Request } from "@shared/schema";

export default function AdminRequestsPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    type: 'all' as 'all' | 'landlord' | 'tenant',
    dateFrom: '',
    dateTo: '',
  });

  const { toast } = useToast();

  // Restore token from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('adminToken');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const requestsQuery = useQuery({
    queryKey: ['/api/admin/requests', filters],
    enabled: !!token,
    queryFn: async () => {
      const params = new URLSearchParams({
        type: filters.type,
        ...(filters.dateFrom && { date_from: filters.dateFrom }),
        ...(filters.dateTo && { date_to: filters.dateTo }),
      });

      const response = await fetch(`/api/admin/requests?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('adminToken');
        setToken(null);
        toast({
          title: "Session Expired",
          description: "Please log in again.",
          variant: "destructive",
        });
        throw new Error('Unauthorized');
      }

      if (!response.ok) {
        throw new Error('Failed to fetch requests');
      }
      return response.json() as Promise<Request[]>;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await fetch(`/api/admin/requests/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/requests'] });
      toast({
        title: "Status Updated",
        description: "Request status has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Update Failed",
        description: "Failed to update request status.",
        variant: "destructive",
      });
    },
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          title: "Login Failed",
          description: data.error || "Invalid credentials",
          variant: "destructive",
        });
        return;
      }

      localStorage.setItem('adminToken', data.token);
      setToken(data.token);
      toast({
        title: "Login Successful",
        description: `Welcome back, ${data.user.username}!`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log in",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setToken(null);
    setUsername("");
    setPassword("");
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
  };

  const handleExportCSV = () => {
    const params = new URLSearchParams({
      type: filters.type,
      ...(filters.dateFrom && { date_from: filters.dateFrom }),
      ...(filters.dateTo && { date_to: filters.dateTo }),
    });

    const url = `/api/admin/requests/export.csv?${params}`;
    fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(res => res.blob())
      .then(blob => {
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `requests-export-${Date.now()}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(downloadUrl);
        document.body.removeChild(a);
      })
      .catch(err => {
        toast({
          title: "Export Failed",
          description: "Failed to export CSV",
          variant: "destructive",
        });
      });
  };

  const handleDownloadPDF = (requestId: string) => {
    fetch(`/api/admin/requests/${requestId}.pdf`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(res => res.blob())
      .then(blob => {
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `request-${requestId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(downloadUrl);
        document.body.removeChild(a);
      })
      .catch(err => {
        toast({
          title: "Download Failed",
          description: "Failed to download PDF",
          variant: "destructive",
        });
      });
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'new': return 'destructive';
      case 'in-progress': return 'secondary';
      case 'closed': return 'default';
      default: return 'default';
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-4">
            <Link href="/" data-testid="link-back-home" className="self-start">
              <Button 
                variant="ghost" 
                size="sm"
                className="gap-2"
                data-testid="button-back"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
            <div>
              <CardTitle>Admin Login</CardTitle>
              <CardDescription>
                Enter your credentials to access the admin panel
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="username" className="text-sm font-medium">
                  Username
                </label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  required
                  data-testid="input-username"
                />
              </div>
              <div>
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                  data-testid="input-password"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
                data-testid="button-submit"
              >
                {isLoading ? "Please wait..." : "Login"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-2xl font-bold text-foreground">
              9 Star Renovations - Admin Panel
            </h1>
            <Button onClick={handleLogout} variant="outline" data-testid="button-logout">
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Date From</label>
                <Input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
                  data-testid="input-filter-date-from"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Date To</label>
                <Input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
                  data-testid="input-filter-date-to"
                />
              </div>

              <div className="flex items-end">
                <Button 
                  onClick={handleExportCSV}
                  variant="outline"
                  className="w-full"
                  data-testid="button-export-csv"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Requests Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="all" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              All Requests ({requestsQuery.data?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="landlord" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Landlord ({requestsQuery.data?.filter(r => r.type === 'landlord').length || 0})
            </TabsTrigger>
            <TabsTrigger value="tenant" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Tenant ({requestsQuery.data?.filter(r => r.type === 'tenant').length || 0})
            </TabsTrigger>
          </TabsList>

          {/* All Requests Tab */}
          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle>All Requests</CardTitle>
                <CardDescription>View and manage all service requests</CardDescription>
              </CardHeader>
              <CardContent>
                {requestsQuery.isLoading ? (
                  <div className="text-center py-8">Loading requests...</div>
                ) : requestsQuery.error ? (
                  <div className="text-center py-8 text-destructive">
                    Error loading requests: {(requestsQuery.error as Error).message}
                  </div>
                ) : !requestsQuery.data?.length ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No requests found
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Ticket ID</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Contact</TableHead>
                          <TableHead>Address</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {requestsQuery.data?.map((request) => (
                          <TableRow key={request.id} data-testid={`row-request-${request.id}`}>
                            <TableCell className="font-mono text-xs font-semibold">
                              {request.ticketId}
                            </TableCell>
                            <TableCell>
                              <Badge variant={request.type === 'landlord' ? 'default' : 'secondary'}>
                                {request.type === 'landlord' ? <Building2 className="w-3 h-3 mr-1 inline" /> : <Home className="w-3 h-3 mr-1 inline" />}
                                {request.type}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-medium">
                              {request.fullName}
                              {request.company && <div className="text-xs text-muted-foreground">{request.company}</div>}
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">{request.email}</div>
                              <div className="text-xs text-muted-foreground">{request.phone}</div>
                            </TableCell>
                            <TableCell className="max-w-xs">
                              <div className="text-sm">{request.address}</div>
                              {request.unit && <div className="text-xs text-muted-foreground">Unit {request.unit}</div>}
                            </TableCell>
                            <TableCell>
                              <Select 
                                value={request.status || 'new'} 
                                onValueChange={(value) => updateStatusMutation.mutate({ id: request.id, status: value })}
                              >
                                <SelectTrigger className="w-32" data-testid={`select-status-${request.id}`}>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="new">New</SelectItem>
                                  <SelectItem value="in-progress">In Progress</SelectItem>
                                  <SelectItem value="closed">Closed</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell className="text-xs">
                              {new Date(request.createdAt!).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDownloadPDF(request.id)}
                                data-testid={`button-download-pdf-${request.id}`}
                              >
                                <FileText className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Landlord Requests Tab */}
          <TabsContent value="landlord">
            <Card>
              <CardHeader className="bg-primary/5">
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Landlord Requests
                </CardTitle>
                <CardDescription>Property owner and management service requests</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {requestsQuery.isLoading ? (
                  <div className="text-center py-8">Loading requests...</div>
                ) : requestsQuery.data?.filter(r => r.type === 'landlord').length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No landlord requests found
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Ticket ID</TableHead>
                          <TableHead>Name / Company</TableHead>
                          <TableHead>Contact</TableHead>
                          <TableHead>Property</TableHead>
                          <TableHead>Request Type</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead>PDF</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {requestsQuery.data?.filter(r => r.type === 'landlord').map((request) => (
                          <TableRow key={request.id} data-testid={`row-request-${request.id}`}>
                            <TableCell className="font-mono text-xs font-semibold">
                              {request.ticketId}
                            </TableCell>
                            <TableCell>
                              <div className="font-medium">{request.fullName}</div>
                              {request.company && <div className="text-xs text-muted-foreground">{request.company}</div>}
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">{request.email}</div>
                              <div className="text-xs text-muted-foreground">{request.phone}</div>
                            </TableCell>
                            <TableCell className="max-w-xs">
                              <div className="text-sm">{request.address}</div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{request.requestType}</Badge>
                            </TableCell>
                            <TableCell>
                              <Select 
                                value={request.status || 'new'} 
                                onValueChange={(value) => updateStatusMutation.mutate({ id: request.id, status: value })}
                              >
                                <SelectTrigger className="w-32" data-testid={`select-status-${request.id}`}>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="new">New</SelectItem>
                                  <SelectItem value="in-progress">In Progress</SelectItem>
                                  <SelectItem value="closed">Closed</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell className="text-xs">
                              {new Date(request.createdAt!).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDownloadPDF(request.id)}
                                data-testid={`button-download-pdf-${request.id}`}
                              >
                                <FileText className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tenant Requests Tab */}
          <TabsContent value="tenant">
            <Card>
              <CardHeader className="bg-secondary/5">
                <CardTitle className="flex items-center gap-2">
                  <Home className="w-5 h-5" />
                  Tenant Requests
                </CardTitle>
                <CardDescription>Residential tenant maintenance and repair requests</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {requestsQuery.isLoading ? (
                  <div className="text-center py-8">Loading requests...</div>
                ) : requestsQuery.data?.filter(r => r.type === 'tenant').length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No tenant requests found
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Ticket ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Contact</TableHead>
                          <TableHead>Property</TableHead>
                          <TableHead>Issue Type</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead>PDF</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {requestsQuery.data?.filter(r => r.type === 'tenant').map((request) => (
                          <TableRow key={request.id} data-testid={`row-request-${request.id}`}>
                            <TableCell className="font-mono text-xs font-semibold">
                              {request.ticketId}
                            </TableCell>
                            <TableCell className="font-medium">
                              {request.fullName}
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">{request.email}</div>
                              <div className="text-xs text-muted-foreground">{request.phone}</div>
                            </TableCell>
                            <TableCell className="max-w-xs">
                              <div className="text-sm">{request.address}</div>
                              {request.unit && <div className="text-xs text-muted-foreground">Unit {request.unit}</div>}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{request.requestType}</Badge>
                            </TableCell>
                            <TableCell>
                              <Select 
                                value={request.status || 'new'} 
                                onValueChange={(value) => updateStatusMutation.mutate({ id: request.id, status: value })}
                              >
                                <SelectTrigger className="w-32" data-testid={`select-status-${request.id}`}>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="new">New</SelectItem>
                                  <SelectItem value="in-progress">In Progress</SelectItem>
                                  <SelectItem value="closed">Closed</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell className="text-xs">
                              {new Date(request.createdAt!).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDownloadPDF(request.id)}
                                data-testid={`button-download-pdf-${request.id}`}
                              >
                                <FileText className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
