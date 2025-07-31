import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Activity, 
  Zap, 
  Server, 
  Clock, 
  AlertTriangle, 
  CheckCircle,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

interface PerformanceMetrics {
  page_load_time: number;
  first_contentful_paint: number;
  largest_contentful_paint: number;
  cumulative_layout_shift: number;
  first_input_delay: number;
  time_to_interactive: number;
  core_web_vitals_score: number;
}

interface SystemHealth {
  server_response_time: number;
  database_query_time: number;
  memory_usage: number;
  cpu_usage: number;
  error_rate: number;
  uptime: number;
}

interface PerformanceAlert {
  type: 'warning' | 'error' | 'info';
  metric: string;
  message: string;
  timestamp: Date;
}

export const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [alerts, setAlerts] = useState<PerformanceAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPerformanceData();
    const interval = setInterval(loadPerformanceData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadPerformanceData = async () => {
    try {
      // In production, these would come from real monitoring services
      const mockMetrics: PerformanceMetrics = {
        page_load_time: 1.2 + Math.random() * 0.5,
        first_contentful_paint: 0.8 + Math.random() * 0.3,
        largest_contentful_paint: 1.5 + Math.random() * 0.4,
        cumulative_layout_shift: 0.05 + Math.random() * 0.05,
        first_input_delay: 45 + Math.random() * 20,
        time_to_interactive: 2.1 + Math.random() * 0.6,
        core_web_vitals_score: 85 + Math.random() * 10
      };

      const mockSystemHealth: SystemHealth = {
        server_response_time: 120 + Math.random() * 80,
        database_query_time: 25 + Math.random() * 15,
        memory_usage: 0.65 + Math.random() * 0.15,
        cpu_usage: 0.45 + Math.random() * 0.2,
        error_rate: 0.001 + Math.random() * 0.002,
        uptime: 0.998 + Math.random() * 0.002
      };

      // Generate alerts based on thresholds
      const newAlerts: PerformanceAlert[] = [];
      
      if (mockMetrics.page_load_time > 2.0) {
        newAlerts.push({
          type: 'warning',
          metric: 'Page Load Time',
          message: 'Langzame laadtijden gedetecteerd',
          timestamp: new Date()
        });
      }

      if (mockSystemHealth.error_rate > 0.005) {
        newAlerts.push({
          type: 'error',
          metric: 'Error Rate',
          message: 'Verhoogde error rate gedetecteerd',
          timestamp: new Date()
        });
      }

      if (mockSystemHealth.memory_usage > 0.8) {
        newAlerts.push({
          type: 'warning',
          metric: 'Memory Usage',
          message: 'Hoog geheugengebruik',
          timestamp: new Date()
        });
      }

      setMetrics(mockMetrics);
      setSystemHealth(mockSystemHealth);
      setAlerts(newAlerts);
    } catch (error) {
      console.error('Error loading performance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMetricStatus = (value: number, good: number, poor: number, invert = false) => {
    const isGood = invert ? value < good : value > good;
    const isPoor = invert ? value > poor : value < poor;
    
    if (isGood) return 'good';
    if (isPoor) return 'poor';
    return 'needs-improvement';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'text-green-600';
      case 'needs-improvement':
        return 'text-yellow-600';
      case 'poor':
        return 'text-red-600';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'needs-improvement':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'poor':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Performance Monitor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-4 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!metrics || !systemHealth) return null;

  return (
    <div className="space-y-6">
      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((alert, index) => (
            <Alert key={index} variant={alert.type === 'error' ? 'destructive' : 'default'}>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>{alert.metric}:</strong> {alert.message}
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Core Web Vitals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Core Web Vitals
          </CardTitle>
          <CardDescription>
            Google's belangrijkste gebruikerservaring metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* LCP */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Largest Contentful Paint</span>
                {getStatusIcon(getMetricStatus(metrics.largest_contentful_paint, 2.5, 4.0, true))}
              </div>
              <div className="text-2xl font-bold">
                {metrics.largest_contentful_paint.toFixed(1)}s
              </div>
              <Progress 
                value={Math.min((metrics.largest_contentful_paint / 4.0) * 100, 100)} 
                className="h-2"
              />
              <p className="text-xs text-muted-foreground">
                Tijd tot belangrijkste content geladen is
              </p>
            </div>

            {/* FID */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">First Input Delay</span>
                {getStatusIcon(getMetricStatus(metrics.first_input_delay, 100, 300, true))}
              </div>
              <div className="text-2xl font-bold">
                {Math.round(metrics.first_input_delay)}ms
              </div>
              <Progress 
                value={Math.min((metrics.first_input_delay / 300) * 100, 100)} 
                className="h-2"
              />
              <p className="text-xs text-muted-foreground">
                Reactietijd op eerste interactie
              </p>
            </div>

            {/* CLS */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Cumulative Layout Shift</span>
                {getStatusIcon(getMetricStatus(metrics.cumulative_layout_shift, 0.1, 0.25, true))}
              </div>
              <div className="text-2xl font-bold">
                {metrics.cumulative_layout_shift.toFixed(3)}
              </div>
              <Progress 
                value={Math.min((metrics.cumulative_layout_shift / 0.25) * 100, 100)} 
                className="h-2"
              />
              <p className="text-xs text-muted-foreground">
                Visuele stabiliteit tijdens laden
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="font-medium">Overall Core Web Vitals Score</span>
              <Badge 
                variant={metrics.core_web_vitals_score >= 90 ? "default" : 
                        metrics.core_web_vitals_score >= 75 ? "secondary" : "destructive"}
              >
                {Math.round(metrics.core_web_vitals_score)}/100
              </Badge>
            </div>
            <Progress value={metrics.core_web_vitals_score} className="mt-2" />
          </div>
        </CardContent>
      </Card>

      {/* System Health */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            Systeemgezondheid
          </CardTitle>
          <CardDescription>
            Server en database prestatie metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Server Response Time</span>
                <span className="text-sm text-muted-foreground">
                  {Math.round(systemHealth.server_response_time)}ms
                </span>
              </div>
              <Progress 
                value={Math.min((systemHealth.server_response_time / 500) * 100, 100)} 
                className="h-2"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Database Query Time</span>
                <span className="text-sm text-muted-foreground">
                  {Math.round(systemHealth.database_query_time)}ms
                </span>
              </div>
              <Progress 
                value={Math.min((systemHealth.database_query_time / 100) * 100, 100)} 
                className="h-2"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Memory Usage</span>
                <span className="text-sm text-muted-foreground">
                  {Math.round(systemHealth.memory_usage * 100)}%
                </span>
              </div>
              <Progress 
                value={systemHealth.memory_usage * 100} 
                className="h-2"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">CPU Usage</span>
                <span className="text-sm text-muted-foreground">
                  {Math.round(systemHealth.cpu_usage * 100)}%
                </span>
              </div>
              <Progress 
                value={systemHealth.cpu_usage * 100} 
                className="h-2"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Error Rate</span>
                <span className="text-sm text-muted-foreground">
                  {(systemHealth.error_rate * 100).toFixed(3)}%
                </span>
              </div>
              <Progress 
                value={Math.min(systemHealth.error_rate * 1000, 100)} 
                className="h-2"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Uptime</span>
                <span className="text-sm text-muted-foreground">
                  {(systemHealth.uptime * 100).toFixed(2)}%
                </span>
              </div>
              <Progress 
                value={systemHealth.uptime * 100} 
                className="h-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Laadtijd Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Page Load Time</span>
              <span className="font-mono">{metrics.page_load_time.toFixed(2)}s</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">First Contentful Paint</span>
              <span className="font-mono">{metrics.first_contentful_paint.toFixed(2)}s</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Time to Interactive</span>
              <span className="font-mono">{metrics.time_to_interactive.toFixed(2)}s</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Performance Trends
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">vs Vorige Week</span>
              <Badge variant="default" className="bg-green-500">
                <TrendingUp className="h-3 w-3 mr-1" />
                +5.2%
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">vs Vorige Maand</span>
              <Badge variant="secondary">
                <TrendingDown className="h-3 w-3 mr-1" />
                -1.8%
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Beste Score</span>
              <span className="font-mono text-green-600">98/100</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};