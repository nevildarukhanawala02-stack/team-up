import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import { Suspense, lazy } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import RouteTracker from "./components/RouteTracker";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Experiences from "./pages/Experiences";
import ExperienceDetail from "./pages/ExperienceDetail";
import About from "./pages/About";
import OurStories from "./pages/OurStories";
import HowWeCelebrate from "./pages/HowWeCelebrate";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Partner from "./pages/Partner";
import Contact from "./pages/Contact";

// Admin-only pages are lazy-loaded: none of their dependencies (the TipTap
// rich text editor, Recharts for analytics) should ship in the bundle every
// public site visitor downloads on first load.
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const Admin = lazy(() => import("./pages/Admin"));
const AdminExperiences = lazy(() => import("./pages/AdminExperiences"));
const AdminExperienceForm = lazy(() => import("./pages/AdminExperienceForm"));
const AdminAnalytics = lazy(() => import("./pages/AdminAnalytics"));
const AdminBlog = lazy(() => import("./pages/AdminBlog"));
const AdminBlogForm = lazy(() => import("./pages/AdminBlogForm"));


function Router() {
  return (
    <>
      <RouteTracker />
      <Suspense fallback={null}>
        <Switch>
          <Route path={"/"} component={Home} />
          <Route path={"/experiences"} component={Experiences} />
          <Route path={"/experiences/:slug"} component={ExperienceDetail} />
          <Route path={"/about"} component={About} />
          <Route path={"/stories"} component={OurStories} />
          <Route path={"/how-we-celebrate"} component={HowWeCelebrate} />
          <Route path={"/blog"} component={Blog} />
          <Route path={"/blog/:slug"} component={BlogPost} />
          <Route path={"/partner"} component={Partner} />
          <Route path={"/contact"} component={Contact} />
          <Route path={"/admin/login"} component={AdminLogin} />
          <Route path={"/admin/experiences/new"} component={AdminExperienceForm} />
          <Route path={"/admin/experiences/:id"} component={AdminExperienceForm} />
          <Route path={"/admin/experiences"} component={AdminExperiences} />
          <Route path={"/admin/blog/new"} component={AdminBlogForm} />
          <Route path={"/admin/blog/:id"} component={AdminBlogForm} />
          <Route path={"/admin/blog"} component={AdminBlog} />
          <Route path={"/admin/analytics"} component={AdminAnalytics} />
          <Route path={"/admin"} component={Admin} />
          <Route path={"/404"} component={NotFound} />
          {/* Final fallback route */}
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
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
