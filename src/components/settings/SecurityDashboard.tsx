import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Shield, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Monitor,
  Smartphone,
  RefreshCw
} from 'lucide-react';
import { useSecurityDashboard } from '@/hooks/useSecurityDashboard';
import { formatDistanceToNow } from 'date-fns';
import { nl } from 'date-fns/locale';

const SecurityDashboard: React.FC = () => {
  const {
    dashboard,
    isLoading,
    updateSecurityScore,
    getSecurityLevel,
    getSecurityRecommendations,
  } = useSecurityDashboard();

  const securityLevel = dashboard.currentScore 
    ? getSecurityLevel(dashboard.currentScore.score)
    : { level: 'Unknown', color: 'text-gray-600', bgColor: 'bg-gray-100' };

  const recommendations = getSecurityRecommendations();

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'login':
      case 'login_success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'login_failed':
      case 'suspicious_login':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'password_change':
        return <Shield className="h-4 w-4 text-blue-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-8 bg-muted rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Security Score Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Security Score</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-2xl font-bold">
                    {dashboard.currentScore?.score || 0}
                  </span>
                  <Badge variant="outline" className={securityLevel.bgColor}>
                    <span className={securityLevel.color}>{securityLevel.level}</span>
                  </Badge>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <Shield className="h-8 w-8 text-primary mb-2" />
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={updateSecurityScore}
                  disabled={isLoading}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Progress 
              value={dashboard.currentScore?.score || 0} 
              className="mt-3"
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Sessions</p>
                <p className="text-2xl font-bold mt-1">{dashboard.sessionCount}</p>
              </div>
              <Smartphone className="h-8 w-8 text-blue-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Sessions signed in to your account
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Known Devices</p>
                <p className="text-2xl font-bold mt-1">{dashboard.deviceCount}</p>
              </div>
              <Monitor className="h-8 w-8 text-purple-600" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Devices you've signed in from
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Security Recommendations */}
      {recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Security Recommendations
            </CardTitle>
            <CardDescription>
              Improve your account security by following these recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recommendations.map((rec, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${
                      rec.priority === 'high' ? 'bg-red-100' :
                      rec.priority === 'medium' ? 'bg-yellow-100' : 'bg-blue-100'
                    }`}>
                      <AlertTriangle className={`h-4 w-4 ${
                        rec.priority === 'high' ? 'text-red-600' :
                        rec.priority === 'medium' ? 'text-yellow-600' : 'text-blue-600'
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{rec.message}</p>
                      <Badge 
                        variant="outline" 
                        className="mt-1"
                        style={{
                          color: rec.priority === 'high' ? '#dc2626' :
                                rec.priority === 'medium' ? '#d97706' : '#2563eb'
                        }}
                      >
                        {rec.priority} priority
                      </Badge>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    {rec.action}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Security Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Security Activity
          </CardTitle>
          <CardDescription>
            Your recent security events and login activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          {dashboard.recentEvents.length > 0 ? (
            <div className="space-y-3">
              {dashboard.recentEvents.slice(0, 10).map((event, index) => (
                <div key={event.id} className="flex items-center gap-3 p-3 rounded-lg border">
                  {getEventIcon(event.event_type)}
                  <div className="flex-1">
                    <p className="font-medium text-sm">{event.event_description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(event.created_at), { 
                          addSuffix: true, 
                          locale: nl 
                        })}
                      </p>
                      {event.ip_address && (
                        <>
                          <Separator orientation="vertical" className="h-3" />
                          <p className="text-xs text-muted-foreground">
                            IP: {String(event.ip_address)}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                  <Badge 
                    variant="outline"
                    className={
                      event.risk_level === 'critical' ? 'border-red-200 text-red-700' :
                      event.risk_level === 'high' ? 'border-orange-200 text-orange-700' :
                      event.risk_level === 'medium' ? 'border-yellow-200 text-yellow-700' :
                      'border-green-200 text-green-700'
                    }
                  >
                    {event.risk_level}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              No security events recorded yet
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityDashboard;