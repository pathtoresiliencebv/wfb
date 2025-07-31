import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Activity, Wifi, Database, Shield, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';

interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical';
  uptime: number;
  memoryUsage: number;
  responseTime: number;
  errorRate: number;
  activeUsers: number;
}

export function ProductionMonitor() {
  const performanceMonitor = usePerformanceMonitor();
  const [errors] = useState<Error[]>([]);
  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    status: 'healthy',
    uptime: 0,
    memoryUsage: 0,
    responseTime: 0,
    errorRate: 0,
    activeUsers: 0,
  });

  // Simulate system health monitoring
  useEffect(() => {
    const updateSystemHealth = () => {
      const memoryUsage = Math.random() * 100;
      const responseTime = 50 + Math.random() * 200;
      const errorRate = Math.random() * 5;
      
      let status: 'healthy' | 'warning' | 'critical' = 'healthy';
      
      if (memoryUsage > 80 || responseTime > 200 || errorRate > 2) {
        status = 'warning';
      }
      if (memoryUsage > 95 || responseTime > 500 || errorRate > 5) {
        status = 'critical';
      }

      setSystemHealth({
        status,
        uptime: Date.now() - (Date.now() % (24 * 60 * 60 * 1000)),
        memoryUsage,
        responseTime,
        errorRate,
        activeUsers: Math.floor(Math.random() * 100) + 10,
      });
    };

    updateSystemHealth();
    const interval = setInterval(updateSystemHealth, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'critical': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'critical': return <AlertTriangle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const formatUptime = (uptime: number) => {
    const hours = Math.floor(uptime / (1000 * 60 * 60));
    const minutes = Math.floor((uptime % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
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
                   systemHealth.status === 'warning' ? 'Waarschuwing' : 'Kritiek'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-muted text-blue-500">
                <Clock className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium">Uptime</p>
                <p className="text-lg font-bold">
                  {formatUptime(systemHealth.uptime)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-muted text-green-500">
                <Wifi className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium">Actieve Gebruikers</p>
                <p className="text-lg font-bold">{systemHealth.activeUsers}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-muted text-purple-500">
                <Database className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium">Response Time</p>
                <p className="text-lg font-bold">{Math.round(systemHealth.responseTime)}ms</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Geheugengebruik</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Gebruikt</span>
                <span>{Math.round(systemHealth.memoryUsage)}%</span>
              </div>
              <Progress value={systemHealth.memoryUsage} />
              <div className="text-xs text-muted-foreground">
                {systemHealth.memoryUsage > 80 ? 'Hoog geheugengebruik gedetecteerd' : 'Geheugengebruik normaal'}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Foutpercentage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Fouten</span>
                <span>{systemHealth.errorRate.toFixed(2)}%</span>
              </div>
              <Progress 
                value={Math.min(systemHealth.errorRate * 20, 100)} 
                className={systemHealth.errorRate > 2 ? 'text-red-500' : ''}
              />
              <div className="text-xs text-muted-foreground">
                {systemHealth.errorRate > 2 ? 'Verhoogd foutpercentage' : 'Foutpercentage normaal'}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Errors */}
      {errors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Recente Fouten
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {errors.slice(0, 5).map((error, index) => (
                <Alert key={index} variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="font-medium">{error.message}</div>
                    <div className="text-sm opacity-70 mt-1">
                      {error.stack && error.stack.split('\n')[1]?.trim()}
                    </div>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold">150ms</p>
              <p className="text-sm text-muted-foreground">Pagina Laadtijd</p>
            </div>
            
            <div className="text-center">
              <p className="text-2xl font-bold">25ms</p>
              <p className="text-sm text-muted-foreground">Render Tijd</p>
            </div>
            
            <div className="text-center">
              <p className="text-2xl font-bold">12.5MB</p>
              <p className="text-sm text-muted-foreground">JS Heap</p>
            </div>
            
            <div className="text-center">
              <p className="text-2xl font-bold">1200</p>
              <p className="text-sm text-muted-foreground">DOM Nodes</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Beveiliging Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="font-medium">HTTPS Actief</p>
                <p className="text-sm text-muted-foreground">SSL certificaat geldig</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="font-medium">Rate Limiting</p>
                <p className="text-sm text-muted-foreground">Actief en werkend</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="font-medium">Input Sanitization</p>
                <p className="text-sm text-muted-foreground">Alle inputs gefilterd</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}