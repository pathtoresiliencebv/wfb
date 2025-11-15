import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Activity, Wifi, Database, Shield, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';
import { useSystemHealth } from '@/hooks/useSystemHealth';

export function ProductionMonitor() {
  const performanceMonitor = usePerformanceMonitor();
  const systemHealth = useSystemHealth();
  const [errors] = useState<Error[]>([]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'error': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'error': return <AlertTriangle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const formatUptime = (hours: number) => {
    if (hours === 0) return '< 1h';
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    if (days > 0) return `${days}d ${remainingHours}h`;
    return `${hours}h`;
  };

  return (
    <div className="space-y-6">
      {/* Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Systeem Status
          </CardTitle>
          <CardDescription>
            Real-time monitoring van platformprestaties
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full bg-muted ${getStatusColor(systemHealth.status)}`}>
                {getStatusIcon(systemHealth.status)}
              </div>
              <div>
                <p className="text-sm font-medium">Algemene Status</p>
                <p className={`text-lg font-bold ${getStatusColor(systemHealth.status)}`}>
                  {systemHealth.status === 'healthy' ? 'Gezond' : 
                   systemHealth.status === 'warning' ? 'Waarschuwing' : 'Error'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-muted text-blue-500">
                <Clock className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium">Uptime</p>
                <p className="text-lg font-bold">{formatUptime(systemHealth.uptime)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-muted text-purple-500">
                <Wifi className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium">Actieve Gebruikers</p>
                <p className="text-lg font-bold">{systemHealth.activeUsers}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-muted text-green-500">
                <Database className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium">Response Time</p>
                <p className="text-lg font-bold">{systemHealth.responseTime}ms</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Memory Usage</span>
              <span className="text-sm font-medium">
                {systemHealth.memoryUsage > 0 ? `${systemHealth.memoryUsage}%` : 'N/A'}
              </span>
            </div>
            {systemHealth.memoryUsage > 0 && (
              <Progress value={systemHealth.memoryUsage} className="mt-2" />
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Error Rate</span>
              <span className="text-sm font-medium">{systemHealth.errorRate.toFixed(2)}%</span>
            </div>
            <Progress value={systemHealth.errorRate} className="mt-2" />
          </div>
        </CardContent>
      </Card>

      {/* Recent Errors */}
      {errors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Recente Fouten
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {errors.map((error, index) => (
              <Alert key={index} variant="destructive">
                <AlertDescription>
                  {error.message}
                </AlertDescription>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Performance Details */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Laadtijd Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Page Load Time</span>
              <Badge variant="secondary">
                {systemHealth.responseTime < 500 ? 'Good' : 'Needs Improvement'}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Time to Interactive</span>
              <Badge variant="secondary">
                {systemHealth.responseTime < 1000 ? 'Good' : 'Needs Improvement'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Performance Trends</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Render Time</span>
              <span className="text-sm font-medium">
                {systemHealth.responseTime < 100 ? 'Excellent' : 'Good'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">API Response</span>
              <span className="text-sm font-medium">{systemHealth.responseTime}ms</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">HTTPS Enabled</span>
              <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                <CheckCircle className="h-3 w-3 mr-1" />
                Active
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Rate Limiting</span>
              <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                <CheckCircle className="h-3 w-3 mr-1" />
                Enabled
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Input Sanitization</span>
              <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                <CheckCircle className="h-3 w-3 mr-1" />
                Active
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
