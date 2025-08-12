import { useAuth } from "@/contexts/AuthContext";
import { Layout } from "@/components/layout/Layout";
import { HomePage } from "@/components/home/HomePage";

export const HomeRoute = () => {
  const { user } = useAuth();
  
  // Always use Layout to ensure consistent header/navigation
  return (
    <Layout>
      <HomePage />
    </Layout>
  );
};