import { useAuth } from "@/contexts/AuthContext";
import { Layout } from "@/components/layout/Layout";
import { HomePage } from "@/components/home/HomePage";

export const HomeRoute = () => {
  const { user } = useAuth();
  
  // Show HomePage component which handles both authenticated and non-authenticated states
  return user ? (
    <Layout>
      <HomePage />
    </Layout>
  ) : (
    <HomePage />
  );
};