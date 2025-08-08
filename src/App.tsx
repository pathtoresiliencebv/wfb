import * as React from "react";
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

import Forums from "./pages/Forums";
import ForumCategory from "./pages/ForumCategory";
import TopicDetail from "./pages/TopicDetail";
import CreateTopic from "./pages/CreateTopic";
import UserProfile from "./pages/UserProfile";
import Members from "./pages/Members";
import Leaderboard from "./pages/Leaderboard";
import NotFound from "./pages/NotFound";
import Messages from "./pages/Messages";
import { AdminLayout } from "@/components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminModeration from "./pages/admin/AdminModeration";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminTopics from "./pages/admin/AdminTopics";
import AdminTags from "./pages/admin/AdminTags";
import AdminImages from "./pages/admin/AdminImages";
import AdminSecurity from "./pages/admin/AdminSecurity";
import AdminAnalyticsPage from "./pages/admin/AdminAnalytics";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminSuppliers from "./pages/admin/AdminSuppliers";
import Search from "./pages/Search";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AdminRoute } from "@/components/auth/AdminRoute";
import { OnboardingWelcome } from "@/components/auth/OnboardingWelcome";
import { LandingPage } from "@/components/landing/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PasswordReset from "./pages/PasswordReset";
import Settings from "./pages/Settings";
import Gamification from "./pages/Gamification";
import { SupplierProfile as SupplierProfilePage } from "./pages/SupplierProfile";

// Create QueryClient instance outside of component to prevent recreation
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
    <React.Fragment>
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
                  path="/forums/:slug" 
                  element={
                    <Layout>
                      <ForumCategory />
                    </Layout>
                  } 
                />
                <Route 
                  path="/forums/:slug/topic/:topicId" 
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
                  path="/forums/:slug/new-topic" 
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
                  path="/gamification" 
                  element={
                    <Layout>
                      <Gamification />
                    </Layout>
                  } 
                />
                <Route 
                  path="/admin" 
                  element={
                    <AdminRoute requireRole="moderator">
                      <AdminLayout>
                        <AdminDashboard />
                      </AdminLayout>
                    </AdminRoute>
                  } 
                />
                <Route 
                  path="/admin/moderation" 
                  element={
                    <AdminRoute requireRole="moderator">
                      <AdminLayout>
                        <AdminModeration />
                      </AdminLayout>
                    </AdminRoute>
                  } 
                />
                <Route 
                  path="/admin/users" 
                  element={
                    <AdminRoute requireRole="moderator">
                      <AdminLayout>
                        <AdminUsers />
                      </AdminLayout>
                    </AdminRoute>
                  } 
                />
                <Route 
                  path="/admin/categories" 
                  element={
                    <AdminRoute requireRole="moderator">
                      <AdminLayout>
                        <AdminCategories />
                      </AdminLayout>
                    </AdminRoute>
                  } 
                />
                <Route 
                  path="/admin/topics" 
                  element={
                    <AdminRoute requireRole="moderator">
                      <AdminLayout>
                        <AdminTopics />
                      </AdminLayout>
                    </AdminRoute>
                  } 
                />
                <Route 
                  path="/admin/tags" 
                  element={
                    <AdminRoute requireRole="moderator">
                      <AdminLayout>
                        <AdminTags />
                      </AdminLayout>
                    </AdminRoute>
                  } 
                />
                <Route 
                  path="/admin/images" 
                  element={
                    <AdminRoute requireRole="moderator">
                      <AdminLayout>
                        <AdminImages />
                      </AdminLayout>
                    </AdminRoute>
                  } 
                />
                <Route 
                  path="/admin/security" 
                  element={
                    <AdminRoute requireRole="moderator">
                      <AdminLayout>
                        <AdminSecurity />
                      </AdminLayout>
                    </AdminRoute>
                  } 
                />
                <Route 
                  path="/admin/analytics" 
                  element={
                    <AdminRoute requireRole="moderator">
                      <AdminLayout>
                        <AdminAnalyticsPage />
                      </AdminLayout>
                    </AdminRoute>
                  } 
                />
                <Route 
                  path="/admin/settings" 
                  element={
                    <AdminRoute requireRole="moderator">
                      <AdminLayout>
                        <AdminSettings />
                      </AdminLayout>
                    </AdminRoute>
                  } 
                />
                <Route 
                  path="/admin/suppliers" 
                  element={
                    <AdminRoute requireRole="moderator">
                      <AdminLayout>
                        <AdminSuppliers />
                      </AdminLayout>
                    </AdminRoute>
                  } 
                />
                
                <Route 
                  path="/leverancier/:username" 
                  element={<SupplierProfilePage />} 
                />
                
        {/* Catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </React.Fragment>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <AuthConfigManager />
          <ThemeProvider defaultTheme="light">
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <AppRoutes />
            </TooltipProvider>
          </ThemeProvider>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
