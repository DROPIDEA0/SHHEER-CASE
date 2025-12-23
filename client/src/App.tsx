import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute from "./components/AdminProtectedRoute";

// Admin Pages
import Dashboard from "./pages/admin/Dashboard";
import HeaderAdmin from "./pages/admin/HeaderAdmin";
import HeroAdmin from "./pages/admin/HeroAdmin";
import TimelineAdmin from "./pages/admin/TimelineAdmin";
import TimelineCategoriesAdmin from "./pages/admin/TimelineCategoriesAdmin";
import EvidenceAdmin from "./pages/admin/EvidenceAdmin";
import EvidenceCategoriesAdmin from "./pages/admin/EvidenceCategoriesAdmin";
import VideosAdmin from "./pages/admin/VideosAdmin";
import PartiesAdmin from "./pages/admin/PartiesAdmin";
import FooterAdmin from "./pages/admin/FooterAdmin";
import SettingsAdmin from "./pages/admin/SettingsAdmin";
import AdminUsersAdmin from "./pages/admin/AdminUsersAdmin";
import SiteProtectionAdmin from "./pages/admin/SiteProtectionAdmin";
import AdminLogin from "./pages/admin/AdminLogin";
import OfficialDocumentsAdmin from "./pages/admin/OfficialDocumentsAdmin";
import WhatsAppSettingsAdmin from "./pages/admin/WhatsAppSettingsAdmin";
import SocialMediaAdmin from "./pages/admin/SocialMediaAdmin";

function Router() {
  return (
    <Switch>
      {/* Public Routes - Protected by Site Protection */}
      <Route path={"/"}>
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      </Route>
      
      {/* Admin Login */}
      <Route path={"/admin/login"} component={AdminLogin} />
      
      {/* Admin Routes - Protected by Admin Authentication */}
      <Route path={"/admin"}>
        <AdminProtectedRoute>
          <Dashboard />
        </AdminProtectedRoute>
      </Route>
      <Route path={"/admin/dashboard"}>
        <AdminProtectedRoute>
          <Dashboard />
        </AdminProtectedRoute>
      </Route>
      <Route path={"/admin/header"}>
        <AdminProtectedRoute>
          <HeaderAdmin />
        </AdminProtectedRoute>
      </Route>
      <Route path={"/admin/hero"}>
        <AdminProtectedRoute>
          <HeroAdmin />
        </AdminProtectedRoute>
      </Route>
      <Route path={"/admin/timeline"}>
        <AdminProtectedRoute>
          <TimelineAdmin />
        </AdminProtectedRoute>
      </Route>
      <Route path={"/admin/timeline-categories"}>
        <AdminProtectedRoute>
          <TimelineCategoriesAdmin />
        </AdminProtectedRoute>
      </Route>
      <Route path={"/admin/evidence"}>
        <AdminProtectedRoute>
          <EvidenceAdmin />
        </AdminProtectedRoute>
      </Route>
      <Route path={"/admin/evidence-categories"}>
        <AdminProtectedRoute>
          <EvidenceCategoriesAdmin />
        </AdminProtectedRoute>
      </Route>
      <Route path={"/admin/videos"}>
        <AdminProtectedRoute>
          <VideosAdmin />
        </AdminProtectedRoute>
      </Route>
      <Route path={"/admin/parties"}>
        <AdminProtectedRoute>
          <PartiesAdmin />
        </AdminProtectedRoute>
      </Route>
      <Route path={"/admin/footer"}>
        <AdminProtectedRoute>
          <FooterAdmin />
        </AdminProtectedRoute>
      </Route>
      <Route path={"/admin/settings"}>
        <AdminProtectedRoute>
          <SettingsAdmin />
        </AdminProtectedRoute>
      </Route>
      <Route path={"/admin/users"}>
        <AdminProtectedRoute>
          <AdminUsersAdmin />
        </AdminProtectedRoute>
      </Route>
      <Route path={"/admin/site-protection"}>
        <AdminProtectedRoute>
          <SiteProtectionAdmin />
        </AdminProtectedRoute>
      </Route>
      <Route path={"/admin/official-documents"}>
        <AdminProtectedRoute>
          <OfficialDocumentsAdmin />
        </AdminProtectedRoute>
      </Route>
      <Route path={"/admin/whatsapp"}>
        <AdminProtectedRoute>
          <WhatsAppSettingsAdmin />
        </AdminProtectedRoute>
      </Route>
      <Route path={"/admin/social-media"}>
        <AdminProtectedRoute>
          <SocialMediaAdmin />
        </AdminProtectedRoute>
      </Route>
      
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
