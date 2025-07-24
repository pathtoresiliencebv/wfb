import { useAuth } from "@/contexts/AuthContext";
import { Layout } from "@/components/layout/Layout";
import { LandingPage } from "@/components/landing/LandingPage";
import Index from "@/pages/Index";

export const HomeRoute = () => {
  const { user } = useAuth();
  
  // Show landing page for non-authenticated users (no sidebar)
  if (!user) {
    return <LandingPage />;
  }
  
  // Show feed for authenticated users (with sidebar)
  return (
    <Layout>
      <Index />
    </Layout>
  );
};