import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { AuthConfigManager } from "@/components/auth/AuthConfigManager";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";
import { Layout } from "@/components/layout/Layout";
import { HomeRoute } from "@/components/routes/HomeRoute";
import Index from "./pages/Index";
import Forums from "./pages/Forums";
import ForumCategory from "./pages/ForumCategory";
import TopicDetail from "./pages/TopicDetail";
import CreateTopic from "./pages/CreateTopic";
import UserProfile from "./pages/UserProfile";
import Members from "./pages/Members";
import Leaderboard from "./pages/Leaderboard";
import NotFound from "./pages/NotFound";
import Messages from "./pages/Messages";
import Admin from "./pages/Admin";
import Search from "./pages/Search";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { OnboardingWelcome } from "@/components/auth/OnboardingWelcome";
import { LandingPage } from "@/components/landing/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PasswordReset from "./pages/PasswordReset";
import Settings from "./pages/Settings";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function AppRoutes() {
  const { showOnboarding, setShowOnboarding, user } = useAuth();

  return (
    <>
      {showOnboarding && user && (
        <OnboardingWelcome
          username={user.username}
          onComplete={() => setShowOnboarding(false)}
        />
      )}
      <Routes>
                {/* Public auth routes */}
                <Route 
                  path="/login" 
                  element={
                    <ProtectedRoute requireAuth={false}>
                      <Login />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/register" 
                  element={
                    <ProtectedRoute requireAuth={false}>
                      <Register />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/password-reset" 
                  element={
                    <ProtectedRoute requireAuth={false}>
                      <PasswordReset />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Home route - conditional rendering based on auth */}
                <Route path="/" element={<HomeRoute />} />
                <Route 
                  path="/forums" 
                  element={
                    <Layout>
                      <Forums />
                    </Layout>
                  } 
                />
                <Route 
                  path="/forums/:categoryId" 
                  element={
                    <Layout>
                      <ForumCategory />
                    </Layout>
                  } 
                />
                <Route 
                  path="/forums/:categoryId/topic/:topicId" 
                  element={
                    <Layout>
                      <TopicDetail />
                    </Layout>
                  } 
                 />
                <Route 
                  path="/create-topic" 
                  element={
                    <Layout>
                      <CreateTopic />
                    </Layout>
                  } 
                />
                <Route 
                  path="/forums/:categoryId/new-topic" 
                  element={
                    <Layout>
                      <CreateTopic />
                    </Layout>
                  } 
                />
                <Route 
                  path="/user/:userId" 
                  element={
                    <Layout>
                      <UserProfile />
                    </Layout>
                  } 
                />
                <Route 
                  path="/members" 
                  element={
                    <Layout>
                      <Members />
                    </Layout>
                  } 
                />
                <Route 
                  path="/leaderboard" 
                  element={
                    <Layout>
                      <Leaderboard />
                    </Layout>
                  } 
                />
                <Route 
                  path="/messages" 
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Messages />
                      </Layout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/search" 
                  element={
                    <Layout>
                      <Search />
                    </Layout>
                  } 
                />
                <Route 
                  path="/settings" 
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Settings />
                      </Layout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Admin />
                      </Layout>
                    </ProtectedRoute>
                  } 
                />
                
        {/* Catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AuthConfigManager />
          <ThemeProvider defaultTheme="system">
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <AppRoutes />
              </BrowserRouter>
            </TooltipProvider>
          </ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
