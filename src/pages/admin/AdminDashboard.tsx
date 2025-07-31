import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MessageSquare, Flag, TrendingUp, Activity, Shield } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Welcome Admin</h2>
        <p className="text-muted-foreground">
          Hier is een overzicht van je forum activiteiten en statistieken.
        </p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Totaal Gebruikers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">
              +20% ten opzichte van vorige maand
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actieve Topics</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">892</div>
            <p className="text-xs text-muted-foreground">
              +15% ten opzichte van vorige maand
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reports</CardTitle>
            <Flag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              -50% ten opzichte van vorige week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Active Users</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">324</div>
            <p className="text-xs text-muted-foreground">
              +12% ten opzichte van gisteren
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recente Activiteit</CardTitle>
            <CardDescription>
              De laatste acties in je forum
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Nieuwe gebruiker geregistreerd</p>
                  <p className="text-xs text-muted-foreground">user_123 - 5 minuten geleden</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Nieuw topic aangemaakt</p>
                  <p className="text-xs text-muted-foreground">"Beste grow tips" - 12 minuten geleden</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Report ingediend</p>
                  <p className="text-xs text-muted-foreground">Spam content - 1 uur geleden</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security Overview</CardTitle>
            <CardDescription>
              Veiligheid en monitoring
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Failed Login Attempts</span>
                <span className="text-sm font-medium">2</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Active Admin Sessions</span>
                <span className="text-sm font-medium">1</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Security Score</span>
                <span className="text-sm font-medium text-green-600">98%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Last Backup</span>
                <span className="text-sm font-medium">2 uur geleden</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Snel toegang tot belangrijke beheersfuncties
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
            <button className="flex flex-col items-center p-4 rounded-lg border hover:bg-muted transition-colors">
              <Users className="h-6 w-6 mb-2" />
              <span className="text-sm">Gebruikers</span>
            </button>
            <button className="flex flex-col items-center p-4 rounded-lg border hover:bg-muted transition-colors">
              <Flag className="h-6 w-6 mb-2" />
              <span className="text-sm">Moderatie</span>
            </button>
            <button className="flex flex-col items-center p-4 rounded-lg border hover:bg-muted transition-colors">
              <MessageSquare className="h-6 w-6 mb-2" />
              <span className="text-sm">Topics</span>
            </button>
            <button className="flex flex-col items-center p-4 rounded-lg border hover:bg-muted transition-colors">
              <TrendingUp className="h-6 w-6 mb-2" />
              <span className="text-sm">Analytics</span>
            </button>
            <button className="flex flex-col items-center p-4 rounded-lg border hover:bg-muted transition-colors">
              <Shield className="h-6 w-6 mb-2" />
              <span className="text-sm">Beveiliging</span>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}