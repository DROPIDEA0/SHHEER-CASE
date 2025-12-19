import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";

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

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path={"/"} component={Home} />
      
      {/* Admin Routes */}
      <Route path={"/admin"} component={Dashboard} />
      <Route path={"/admin/dashboard"} component={Dashboard} />
      <Route path={"/admin/header"} component={HeaderAdmin} />
      <Route path={"/admin/hero"} component={HeroAdmin} />
      <Route path={"/admin/timeline"} component={TimelineAdmin} />
      <Route path={"/admin/timeline-categories"} component={TimelineCategoriesAdmin} />
      <Route path={"/admin/evidence"} component={EvidenceAdmin} />
      <Route path={"/admin/evidence-categories"} component={EvidenceCategoriesAdmin} />
      <Route path={"/admin/videos"} component={VideosAdmin} />
      <Route path={"/admin/parties"} component={PartiesAdmin} />
      <Route path={"/admin/footer"} component={FooterAdmin} />
      <Route path={"/admin/settings"} component={SettingsAdmin} />
      
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
