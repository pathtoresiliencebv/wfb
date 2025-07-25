import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
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
import Search from "./pages/Search";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { LandingPage } from "@/components/landing/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider defaultTheme="system">
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
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
                
                {/* Catch-all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
