import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { Button } from "@/components/ui/button";
import { Footer } from "../layout/Footer";
import { Home, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import logoLight from "@/assets/wietforum-logo-light.png";
import logoDark from "@/assets/wietforum-logo-dark.png";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { logout } = useAuth();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        {/* Admin Sidebar */}
        <AdminSidebar />
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Admin Header */}
          <header className="h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
            <div className="flex items-center justify-between h-full px-4">
              <div className="flex items-center gap-3">
                <SidebarTrigger />
                <div className="h-6 w-px bg-border" />
                <Link to="/admin" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                  <img 
                    src={logoLight} 
                    alt="WietForum" 
                    className="h-8 w-auto dark:hidden"
                  />
                  <img 
                    src={logoDark} 
                    alt="WietForum" 
                    className="h-8 w-auto hidden dark:block"
                  />
                  <span className="font-semibold text-lg hidden sm:block">Admin Dashboard</span>
                </Link>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link to="/">
                    <Home className="h-4 w-4 mr-2" />
                    Terug naar Forum
                  </Link>
                </Button>
                <Button variant="outline" size="sm" onClick={logout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Uitloggen
                </Button>
              </div>
            </div>
          </header>
          
          {/* Content */}
          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
          
          <Footer />
        </div>
      </div>
    </SidebarProvider>
  );
}