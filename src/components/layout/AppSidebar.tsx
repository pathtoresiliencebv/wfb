
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Home,
  MessageSquare,
  Users,
  Mail,
  Trophy,
  Leaf,
  Settings,
  Scale,
  Heart,
  Sprout,
  AlertTriangle,
  TrendingUp,
  Star,
  Package,
  Shield,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import wietforumLogoLight from '@/assets/wietforum-logo-light.png';
import wietforumLogoDark from '@/assets/wietforum-logo-dark.png';
import { useTheme } from '@/contexts/ThemeContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/AuthContext';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { TopSuppliers } from '@/components/supplier/TopSuppliers';

const mainNavItems = [
  { title: 'Feed', url: '/', icon: Home },
  { title: 'Forums', url: '/forums', icon: MessageSquare },
  { title: 'Leden', url: '/members', icon: Users },
  { title: 'Berichten', url: '/messages', icon: Mail },
  { title: 'Leaderboard', url: '/leaderboard', icon: Trophy },
];

// Icon mapping for database strings to Lucide icons
const iconMap = {
  'trending-up': TrendingUp,
  'star': Star,
  'message-square': MessageSquare,
  'users': Users,
  'scale': Scale,
  'heart': Heart,
  'package': Package,
  'sprout': Sprout,
  'alert-triangle': AlertTriangle,
} as const;

export function AppSidebar() {
  const { state } = useSidebar();
  const { theme } = useTheme();
  const { user } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname;
  const isMobile = useIsMobile();
  const collapsed = state === "collapsed";
  
  // Fetch categories from database
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['sidebar-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
  });
  
  // Show mini icons on mobile for specific routes (e.g., user and supplier profiles)
  const allowMiniOnMobile = currentPath.startsWith('/user') || currentPath.startsWith('/leverancier');
  
  // Use theme-appropriate logo
  const logoSrc = theme === 'dark' ? wietforumLogoDark : wietforumLogoLight;

  const isActive = (path: string) => {
    if (path === '/') {
      return currentPath === '/';
    }
    return currentPath.startsWith(path);
  };

  const getNavClass = (path: string) => {
    const baseClass = "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors";
    if (isActive(path)) {
      return `${baseClass} bg-primary text-primary-foreground`;
    }
    return `${baseClass} text-muted-foreground hover:bg-accent hover:text-accent-foreground`;
  };

  return (
    <Sidebar 
      allowMiniOnMobile={allowMiniOnMobile}
      collapsible="icon"
    >
      <SidebarContent className={isMobile ? "p-2" : "p-4"}>
        {/* Logo Section */}
        <div className="mb-6 flex items-center justify-center">
          <div className="flex h-12 w-12 items-center justify-center">
            <img 
              src="/favicon-logo.png" 
              alt="Wiet Forum België" 
              className="h-16 w-auto object-contain"
            />
          </div>
        </div>

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Navigatie</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavClass(item.url)}>
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Forum Categories */}
        <SidebarGroup>
          <SidebarGroupLabel>Forum Categorieën</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {categoriesLoading ? (
                <SidebarMenuItem>
                  <SidebarMenuButton disabled>
                    <div className="h-4 w-4 bg-muted rounded animate-pulse" />
                    {!collapsed && <span className="text-muted-foreground">Laden...</span>}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ) : (
                categories.map((category: any) => {
                  const categoryUrl = `/forums/${category.slug}`;
                  const IconComponent = iconMap[category.icon as keyof typeof iconMap] || MessageSquare;
                  
                  return (
                    <SidebarMenuItem key={category.id}>
                      <SidebarMenuButton asChild>
                        <NavLink to={categoryUrl} className={getNavClass(categoryUrl)}>
                          <IconComponent className="h-4 w-4 shrink-0" />
                          {!collapsed && <span className="truncate">{category.name}</span>}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Top Leveranciers */}
        <SidebarGroup>
          <SidebarGroupLabel>Top Leveranciers</SidebarGroupLabel>
          <SidebarGroupContent>
            <TopSuppliers />
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Settings and Admin/Supplier Navigation */}
        <div className="mt-auto pt-4">
          <SidebarMenu>
            {/* Admin Panel - Only show for admins and moderators */}
            {(user?.role === 'admin' || user?.role === 'moderator') && (
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/admin" className={getNavClass('/admin')}>
                    <Shield className="h-4 w-4 shrink-0" />
                    {!collapsed && <span>Admin Panel</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
            {/* Supplier Navigation - Show for suppliers OR admins */}
            {(user?.role === 'supplier' || user?.role === 'admin') && (
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink to="/leverancier/dashboard" className={getNavClass('/leverancier/dashboard')}>
                    <Package className="h-4 w-4 shrink-0" />
                    {!collapsed && <span>Leverancier</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <NavLink to="/settings" className={getNavClass('/settings')}>
                  <Settings className="h-4 w-4 shrink-0" />
                  {!collapsed && <span>Instellingen</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
