import React, { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { AuthConfigManager } from "@/components/auth/AuthConfigManager";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Layout } from "@/components/layout/Layout";
import { HomePage } from "@/components/home/HomePage";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AdminRoute } from "@/components/auth/AdminRoute";
import { OnboardingWelcome } from "@/components/auth/OnboardingWelcome";
import { PageLoadingSpinner } from "@/components/loading/PageLoadingSpinner";
import { PerformanceOptimizations } from "@/components/performance/PerformanceOptimizations";

// Lazy load pages for code splitting
const Forums = lazy(() => import("./pages/Forums"));
const ForumCategory = lazy(() => import("./pages/ForumCategory"));
const TopicDetail = lazy(() => import("./pages/TopicDetail"));
const CreateTopic = lazy(() => import("./pages/CreateTopic"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const Members = lazy(() => import("./pages/Members"));
const Leaderboard = lazy(() => import("./pages/Leaderboard"));
const Messages = lazy(() => import("./pages/Messages"));
const Search = lazy(() => import("./pages/Search"));
const Settings = lazy(() => import("./pages/Settings"));
const Gamification = lazy(() => import("./pages/Gamification"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Auth pages
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const PasswordReset = lazy(() => import("./pages/PasswordReset"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const SupplierLogin = lazy(() => import("./pages/SupplierLogin"));

// Admin pages (heavy - lazy load)
const AdminLayout = lazy(() => import("@/components/admin/AdminLayout").then(m => ({ default: m.AdminLayout })));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminModeration = lazy(() => import("./pages/admin/AdminModeration"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminCategories = lazy(() => import("./pages/admin/AdminCategories"));
const AdminTopics = lazy(() => import("./pages/admin/AdminTopics"));
const AdminTags = lazy(() => import("./pages/admin/AdminTags"));
const AdminImages = lazy(() => import("./pages/admin/AdminImages"));
const AdminSecurity = lazy(() => import("./pages/admin/AdminSecurity"));
const AdminAnalyticsPage = lazy(() => import("./pages/admin/AdminAnalytics"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings"));
const AdminSuppliers = lazy(() => import("./pages/admin/AdminSuppliers"));

// Supplier pages
const SupplierProfilePage = lazy(() => import("./pages/SupplierProfile").then(m => ({ default: m.SupplierProfile })));
const SupplierDashboard = lazy(() => import("./pages/SupplierDashboard"));

// Legal pages
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));

// Optimized QueryClient with aggressive caching
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes - data stays fresh longer
      gcTime: 30 * 60 * 1000, // 30 minutes - keep in cache longer
      refetchOnWindowFocus: false,
      refetchOnMount: false,
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
                      <Suspense fallback={<PageLoadingSpinner />}>
                        <Login />
                      </Suspense>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/register" 
                  element={
                    <ProtectedRoute requireAuth={false}>
                      <Suspense fallback={<PageLoadingSpinner />}>
                        <Register />
                      </Suspense>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/password-reset" 
                  element={
                    <ProtectedRoute requireAuth={false}>
                      <Suspense fallback={<PageLoadingSpinner />}>
                        <PasswordReset />
                      </Suspense>
                    </ProtectedRoute>
                  } 
                />
                
                {/* Admin auth routes */}
                <Route 
                  path="/admin/login" 
                  element={
                    <ProtectedRoute requireAuth={false}>
                      <Suspense fallback={<PageLoadingSpinner />}>
                        <AdminLogin />
                      </Suspense>
                    </ProtectedRoute>
                  } 
                />
                
                {/* Supplier login route */}
                <Route 
                  path="/supplier-login" 
                  element={
                    <ProtectedRoute requireAuth={false}>
                      <Suspense fallback={<PageLoadingSpinner />}>
                        <SupplierLogin />
                      </Suspense>
                    </ProtectedRoute>
                  } 
                />
                
                {/* Home route */}
                <Route 
                  path="/" 
                  element={
                    <Layout>
                      <HomePage />
                    </Layout>
                  } 
                />
                <Route 
                  path="/forums" 
                  element={
                    <Layout>
                      <Suspense fallback={<PageLoadingSpinner />}>
                        <Forums />
                      </Suspense>
                    </Layout>
                  } 
                />
                <Route 
                  path="/forums/:slug" 
                  element={
                    <Layout>
                      <Suspense fallback={<PageLoadingSpinner />}>
                        <ForumCategory />
                      </Suspense>
                    </Layout>
                  } 
                />
                <Route 
                  path="/forums/:slug/topic/:topicId" 
                  element={
                    <Layout>
                      <Suspense fallback={<PageLoadingSpinner />}>
                        <TopicDetail />
                      </Suspense>
                    </Layout>
                  } 
                 />
                <Route 
                  path="/create-topic" 
                  element={
                    <Layout>
                      <Suspense fallback={<PageLoadingSpinner />}>
                        <CreateTopic />
                      </Suspense>
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
                      <Suspense fallback={<PageLoadingSpinner />}>
                        <UserProfile />
                      </Suspense>
                    </Layout>
                  } 
                />
                <Route 
                  path="/members" 
                  element={
                    <Layout>
                      <Suspense fallback={<PageLoadingSpinner />}>
                        <Members />
                      </Suspense>
                    </Layout>
                  } 
                />
                <Route 
                  path="/leaderboard" 
                  element={
                    <Layout>
                      <Suspense fallback={<PageLoadingSpinner />}>
                        <Leaderboard />
                      </Suspense>
                    </Layout>
                  } 
                />
                <Route 
                  path="/messages" 
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Suspense fallback={<PageLoadingSpinner />}>
                          <Messages />
                        </Suspense>
                      </Layout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/search" 
                  element={
                    <Layout>
                      <Suspense fallback={<PageLoadingSpinner />}>
                        <Search />
                      </Suspense>
                    </Layout>
                  } 
                />
                <Route 
                  path="/settings" 
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Suspense fallback={<PageLoadingSpinner />}>
                          <Settings />
                        </Suspense>
                      </Layout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/gamification" 
                  element={
                    <Layout>
                      <Suspense fallback={<PageLoadingSpinner />}>
                        <Gamification />
                      </Suspense>
                    </Layout>
                  } 
                />
                <Route 
                  path="/admin" 
                  element={
                    <AdminRoute requireRole="moderator">
                      <Suspense fallback={<PageLoadingSpinner />}>
                        <AdminLayout>
                          <AdminDashboard />
                        </AdminLayout>
                      </Suspense>
                    </AdminRoute>
                  } 
                />
                <Route 
                  path="/admin/moderation" 
                  element={
                    <AdminRoute requireRole="moderator">
                      <Suspense fallback={<PageLoadingSpinner />}>
                        <AdminLayout>
                          <AdminModeration />
                        </AdminLayout>
                      </Suspense>
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
                   path="/aanbod/:username" 
                   element={
                     <ProtectedRoute>
                       <Suspense fallback={<PageLoadingSpinner />}>
                         <SupplierProfilePage />
                       </Suspense>
                     </ProtectedRoute>
                   } 
                 />
                
                <Route 
                  path="/leverancier/dashboard" 
                  element={
                    <Suspense fallback={<PageLoadingSpinner />}>
                      <SupplierDashboard />
                    </Suspense>
                  } 
                />
                
                {/* Legal pages */}
                <Route 
                  path="/terms" 
                  element={
                    <Suspense fallback={<PageLoadingSpinner />}>
                      <Terms />
                    </Suspense>
                  } 
                />
                <Route 
                  path="/privacy" 
                  element={
                    <Suspense fallback={<PageLoadingSpinner />}>
                      <Privacy />
                    </Suspense>
                  } 
                />
                
        {/* Catch-all route */}
        <Route path="*" element={
          <Suspense fallback={<PageLoadingSpinner />}>
            <NotFound />
          </Suspense>
        } />
      </Routes>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <AuthConfigManager />
          <ThemeProvider defaultTheme="light">
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <PerformanceOptimizations />
              <AppRoutes />
            </TooltipProvider>
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
