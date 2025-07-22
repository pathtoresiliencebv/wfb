
import { FeedPage } from "@/components/feed/FeedPage";
import { LandingPage } from "@/components/landing/LandingPage";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user } = useAuth();
  
  // Show landing page for non-authenticated users
  if (!user) {
    return <LandingPage />;
  }
  
  // Show feed for authenticated users
  return <FeedPage />;
};

export default Index;
