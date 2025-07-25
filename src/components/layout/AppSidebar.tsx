
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
} from 'lucide-react';
import wietforumLogoDark from '@/assets/wietforum-logo-dark.png';
import wietforumLogoGreen from '@/assets/wietforum-logo-green.png';
import { useTheme } from '@/contexts/ThemeContext';
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

const mainNavItems = [
  { title: 'Feed', url: '/', icon: Home },
  { title: 'Forums', url: '/forums', icon: MessageSquare },
  { title: 'Leden', url: '/members', icon: Users },
  { title: 'Berichten', url: '/messages', icon: Mail },
  { title: 'Leaderboard', url: '/leaderboard', icon: Trophy },
];

const forumCategories = [
  { title: 'Wetgeving & Nieuws', url: '/forums/wetgeving', icon: Scale },
  { title: 'Medicinaal Gebruik', url: '/forums/medicinaal', icon: Heart },
  { title: 'Teelt & Horticultuur', url: '/forums/teelt', icon: Sprout },
  { title: 'Harm Reduction', url: '/forums/harm-reduction', icon: AlertTriangle },
  { title: 'Community', url: '/forums/community', icon: Users },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const { theme } = useTheme();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";
  
  // Select logo based on theme
  const logoSrc = theme === 'dark' ? wietforumLogoGreen : wietforumLogoDark;

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
    <Sidebar className={collapsed ? "w-16" : "w-64"} collapsible="icon">
      <SidebarContent className="p-4">
        {/* Logo Section */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center">
            <img 
              src={logoSrc} 
              alt="Wietforum België" 
              className="h-10 w-10 object-contain"
            />
          </div>
          {!collapsed && (
            <div className="ml-2">
              <h1 className="font-heading text-lg font-bold text-foreground">
                Wietforum
              </h1>
              <p className="text-xs text-muted-foreground">België</p>
            </div>
          )}
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
              {forumCategories.map((category) => (
                <SidebarMenuItem key={category.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={category.url} className={getNavClass(category.url)}>
                      <category.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span className="truncate">{category.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Settings */}
        <div className="mt-auto pt-4">
          <SidebarMenu>
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
