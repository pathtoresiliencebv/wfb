import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Download, 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Database,
  MessageSquare,
  User,
  Activity
} from 'lucide-react';
import { useDataExport } from '@/hooks/useDataExport';
import { formatDistanceToNow } from 'date-fns';
import { nl } from 'date-fns/locale';

const DataExportSection: React.FC = () => {
  const {
    isLoading,
    exportRequests,
    requestDataExport,
    fetchExportRequests,
    downloadExport,
  } = useDataExport();

  useEffect(() => {
    fetchExportRequests();
  }, [fetchExportRequests]);

  const getExportIcon = (type: string) => {
    switch (type) {
      case 'full':
        return <Database className="h-4 w-4" />;
      case 'activity':
        return <Activity className="h-4 w-4" />;
      case 'messages':
        return <MessageSquare className="h-4 w-4" />;
      case 'profile':
        return <User className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getExportLabel = (type: string) => {
    switch (type) {
      case 'full':
        return 'Complete Data Export';
      case 'activity':
        return 'Activity Data';
      case 'messages':
        return 'Messages Data';
      case 'profile':
        return 'Profile Data';
      default:
        return type;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'processing':
        return <Clock className="h-4 w-4 text-blue-600 animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown';
    
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Data Export
          </CardTitle>
          <CardDescription>
            Download your data in compliance with GDPR regulations. You can export different types of data separately.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertDescription>
              Data exports may take some time to process. You'll be notified when your export is ready for download.
              Exports expire after 7 days for security reasons.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Database className="h-5 w-5 text-blue-600" />
                  <div>
                    <h4 className="font-medium">Complete Data Export</h4>
                    <p className="text-sm text-muted-foreground">
                      All your data including profile, topics, replies, and activity
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={() => requestDataExport('full')} 
                  disabled={isLoading}
                  className="w-full"
                >
                  Export All Data
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <User className="h-5 w-5 text-green-600" />
                  <div>
                    <h4 className="font-medium">Profile Data</h4>
                    <p className="text-sm text-muted-foreground">
                      Your profile information and settings
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={() => requestDataExport('profile')} 
                  disabled={isLoading}
                  variant="outline"
                  className="w-full"
                >
                  Export Profile
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Activity className="h-5 w-5 text-purple-600" />
                  <div>
                    <h4 className="font-medium">Activity Data</h4>
                    <p className="text-sm text-muted-foreground">
                      Your activity feed and interaction history
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={() => requestDataExport('activity')} 
                  disabled={isLoading}
                  variant="outline"
                  className="w-full"
                >
                  Export Activity
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <MessageSquare className="h-5 w-5 text-orange-600" />
                  <div>
                    <h4 className="font-medium">Messages Data</h4>
                    <p className="text-sm text-muted-foreground">
                      Your private messages and conversations
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={() => requestDataExport('messages')} 
                  disabled={isLoading}
                  variant="outline"
                  className="w-full"
                >
                  Export Messages
                </Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Export History */}
      {exportRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Export History</CardTitle>
            <CardDescription>
              Your recent data export requests and downloads
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {exportRequests.map((request) => (
                <div 
                  key={request.id} 
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    {getExportIcon(request.request_type)}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {getExportLabel(request.request_type)}
                        </span>
                        <Badge variant="outline" className="flex items-center gap-1">
                          {getStatusIcon(request.status)}
                          {request.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <span>
                          Requested {formatDistanceToNow(new Date(request.created_at), { 
                            addSuffix: true, 
                            locale: nl 
                          })}
                        </span>
                        {request.file_size_bytes && (
                          <>
                            <span>•</span>
                            <span>{formatFileSize(request.file_size_bytes)}</span>
                          </>
                        )}
                        {request.expires_at && new Date(request.expires_at) > new Date() && (
                          <>
                            <span>•</span>
                            <span>
                              Expires {formatDistanceToNow(new Date(request.expires_at), { 
                                addSuffix: true, 
                                locale: nl 
                              })}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {request.status === 'completed' && request.file_url && (
                    <Button 
                      onClick={() => downloadExport(request)}
                      variant="outline"
                      size="sm"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DataExportSection;