import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Users,
  Shield,
  Flag,
  BarChart3,
  ImageIcon,
  Folder,
  MessageSquare,
  Tag,
  Settings,
  Home,
  ChevronDown,
  Store,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const adminItems = [
  { title: "Dashboard", url: "/admin", icon: Home, exact: true },
  { title: "Content Moderatie", url: "/admin/moderation", icon: Flag },
  { title: "Gebruikersbeheer", url: "/admin/users", icon: Users },
  { title: "Categorieën", url: "/admin/categories", icon: Folder },
  { title: "Topics", url: "/admin/topics", icon: MessageSquare },
  { title: "Tags", url: "/admin/tags", icon: Tag },
  { title: "Leveranciers", url: "/admin/suppliers", icon: Store },
  { title: "Afbeeldingen", url: "/admin/images", icon: ImageIcon },
  { title: "Beveiliging", url: "/admin/security", icon: Shield },
  { title: "Analytics", url: "/admin/analytics", icon: BarChart3 },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string, exact?: boolean) => {
    if (exact) {
      return currentPath === path;
    }
    return currentPath.startsWith(path);
  };

  const getNavClasses = (active: boolean) =>
    active 
      ? "bg-primary/10 text-primary font-medium border-r-2 border-primary" 
      : "hover:bg-muted/50 text-muted-foreground hover:text-foreground";

  return (
    <Sidebar className={collapsed ? "w-14" : "w-64"} collapsible="icon">
      <SidebarContent>
        {/* Admin Header */}
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            {collapsed ? (
              <img 
                src="/lovable-uploads/8721330a-f235-4c3b-9c21-85436a192135.png" 
                alt="WietForum België" 
                className="h-6 w-6"
              />
            ) : (
              <>
                <img 
                  src="/lovable-uploads/8721330a-f235-4c3b-9c21-85436a192135.png" 
                  alt="WietForum België" 
                  className="h-6 w-6"
                />
                <div>
                  <h2 className="font-bold text-lg">Admin Panel</h2>
                  <p className="text-xs text-muted-foreground">Forum Beheer</p>
                </div>
              </>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Beheer</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.exact}
                      className={({ isActive: navIsActive }) =>
                        getNavClasses(navIsActive || isActive(item.url, item.exact))
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Quick Stats */}
        {!collapsed && (
          <SidebarGroup>
            <SidebarGroupLabel>Quick Stats</SidebarGroupLabel>
            <SidebarGroupContent>
              <div className="px-3 py-2 space-y-2">
                <div className="text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Online Users</span>
                    <span className="font-medium">24</span>
                  </div>
                </div>
                <div className="text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pending Reports</span>
                    <span className="font-medium text-destructive">3</span>
                  </div>
                </div>
                <div className="text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Today's Posts</span>
                    <span className="font-medium">47</span>
                  </div>
                </div>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  );
}