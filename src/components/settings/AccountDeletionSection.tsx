import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Trash2, 
  AlertTriangle, 
  Clock, 
  Shield,
  Info
} from 'lucide-react';
import { useAccountDeletion } from '@/hooks/useAccountDeletion';
import { formatDistanceToNow } from 'date-fns';
import { nl } from 'date-fns/locale';

const AccountDeletionSection: React.FC = () => {
  const {
    isLoading,
    deletionRequest,
    requestAccountDeletion,
    cancelAccountDeletion,
    checkDeletionRequest,
    confirmAccountDeletion,
  } = useAccountDeletion();

  const [showDeleteForm, setShowDeleteForm] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');
  const [delayDays, setDelayDays] = useState(7);
  const [verificationToken, setVerificationToken] = useState('');
  const [showVerification, setShowVerification] = useState(false);

  useEffect(() => {
    checkDeletionRequest();
  }, [checkDeletionRequest]);

  const handleRequestDeletion = async () => {
    const success = await requestAccountDeletion(deleteReason, delayDays);
    if (success) {
      setShowDeleteForm(false);
      setDeleteReason('');
    }
  };

  const handleCancelDeletion = async () => {
    const success = await cancelAccountDeletion();
    if (success) {
      setShowDeleteForm(false);
    }
  };

  const handleConfirmDeletion = async () => {
    const success = await confirmAccountDeletion(verificationToken);
    if (success) {
      setShowVerification(false);
      setVerificationToken('');
    }
  };

  // Check if deletion is scheduled for today or past
  const canDeleteNow = deletionRequest && 
    new Date(deletionRequest.scheduled_for) <= new Date();

  return (
    <div className="space-y-6">
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700">
            <Trash2 className="h-5 w-5" />
            Account Deletion
          </CardTitle>
          <CardDescription>
            Permanently delete your account and all associated data. This action cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">
              <strong>Warning:</strong> Account deletion is permanent and cannot be reversed. 
              All your data including topics, replies, messages, and profile information will be permanently removed.
            </AlertDescription>
          </Alert>

          {deletionRequest && deletionRequest.status === 'pending' ? (
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Clock className="h-5 w-5 text-orange-600" />
                  <div>
                    <h4 className="font-medium text-orange-800">
                      Account Deletion Scheduled
                    </h4>
                    <p className="text-sm text-orange-700">
                      Your account is scheduled for deletion on{' '}
                      {new Date(deletionRequest.scheduled_for).toLocaleDateString('nl-NL')} at{' '}
                      {new Date(deletionRequest.scheduled_for).toLocaleTimeString('nl-NL')}
                    </p>
                  </div>
                </div>

                <Separator className="my-3" />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Status:</span>
                    <Badge variant="outline" className="border-orange-300 text-orange-700">
                      {deletionRequest.status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Time remaining:</span>
                    <span className="text-sm font-medium">
                      {formatDistanceToNow(new Date(deletionRequest.scheduled_for), { 
                        addSuffix: true, 
                        locale: nl 
                      })}
                    </span>
                  </div>

                  {deletionRequest.reason && (
                    <div>
                      <span className="text-sm font-medium">Reason:</span>
                      <p className="text-sm text-muted-foreground mt-1">
                        {deletionRequest.reason}
                      </p>
                    </div>
                  )}
                </div>

                <Separator className="my-3" />

                <div className="flex gap-2">
                  {canDeleteNow ? (
                    <Button 
                      onClick={() => setShowVerification(true)}
                      variant="destructive"
                      size="sm"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Now
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleCancelDeletion}
                      variant="outline"
                      size="sm"
                      disabled={isLoading}
                    >
                      Cancel Deletion
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {!showDeleteForm ? (
                <div className="space-y-4">
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      Account deletion includes a grace period. You can cancel the deletion request 
                      before the scheduled date.
                    </AlertDescription>
                  </Alert>

                  <Button 
                    onClick={() => setShowDeleteForm(true)}
                    variant="destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Request Account Deletion
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="delete-reason">
                      Reason for deletion (optional)
                    </Label>
                    <Textarea
                      id="delete-reason"
                      placeholder="Help us understand why you're leaving..."
                      value={deleteReason}
                      onChange={(e) => setDeleteReason(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="delay-days">
                      Grace period (days)
                    </Label>
                    <Input
                      id="delay-days"
                      type="number"
                      min="1"
                      max="30"
                      value={delayDays}
                      onChange={(e) => setDelayDays(Number(e.target.value))}
                    />
                    <p className="text-xs text-muted-foreground">
                      Number of days before your account is permanently deleted (1-30 days)
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      onClick={() => setShowDeleteForm(false)}
                      variant="outline"
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleRequestDeletion}
                      variant="destructive"
                      disabled={isLoading}
                    >
                      Request Deletion
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Verification Modal */}
      {showVerification && (
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <Shield className="h-5 w-5" />
              Verify Account Deletion
            </CardTitle>
            <CardDescription>
              Enter the verification token sent to your email to confirm account deletion.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">
                This is your final confirmation. Once confirmed, your account and all data 
                will be permanently deleted within 24 hours.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="verification-token">
                Verification Token
              </Label>
              <Input
                id="verification-token"
                placeholder="Enter verification token from email"
                value={verificationToken}
                onChange={(e) => setVerificationToken(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Check your email for the verification token. It may take a few minutes to arrive.
              </p>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={() => setShowVerification(false)}
                variant="outline"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleConfirmDeletion}
                variant="destructive"
                disabled={isLoading || !verificationToken}
              >
                Confirm Deletion
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AccountDeletionSection;