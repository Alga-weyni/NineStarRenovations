import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import LandlordRequestPage from "@/pages/landlord-request";
import TenantRequestPage from "@/pages/tenant-request";
import AdminRequestsPage from "@/pages/admin/requests";

function Router() {
  return (
    <Switch>
      <Route path="/landlord-request" component={LandlordRequestPage} />
      <Route path="/tenant-request" component={TenantRequestPage} />
      <Route path="/admin/requests" component={AdminRequestsPage} />
      <Route path="/" component={LandlordRequestPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
