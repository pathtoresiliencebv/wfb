import React, { useState, useEffect } from 'react';
import { Copy, Check, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface TestAccount {
  username: string;
  password: string;
  role: string;
  email: string;
  exists: boolean;
  hasProfile: boolean;
  hasSupplierProfile?: boolean;
}

export const TestCredentials: React.FC = () => {
  const [testAccounts, setTestAccounts] = useState<TestAccount[]>([
    { username: 'admin', password: 'admin123', role: 'Admin', email: 'jason__m@outlook.com', exists: false, hasProfile: false },
    { username: 'leverancier', password: '12345678', role: 'Leverancier', email: 'leverancier@wietforumbelgie.com', exists: false, hasProfile: false, hasSupplierProfile: false },
    { username: 'testuser', password: 'testuser123', role: 'Gebruiker', email: 'testuser@wietforumbelgie.com', exists: false, hasProfile: false }
  ]);
  
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  // Check which accounts exist in database
  const checkAccounts = async () => {
    setIsChecking(true);
    
    try {
      const updatedAccounts = await Promise.all(
        testAccounts.map(async (account) => {
          try {
            // Check if profile exists
            const { data: profile } = await supabase
              .from('profiles')
              .select('username, role, user_id')
              .eq('username', account.username)
              .maybeSingle();
            
            let hasSupplierProfile = false;
            if (profile && account.username === 'leverancier') {
              const { data: supplierProfile } = await supabase
                .from('supplier_profiles')
                .select('id')
                .eq('user_id', profile.user_id)
                .maybeSingle();
              hasSupplierProfile = !!supplierProfile;
            }
            
            return {
              ...account,
              exists: !!profile,
              hasProfile: !!profile,
              hasSupplierProfile: account.username === 'leverancier' ? hasSupplierProfile : undefined
            };
          } catch (e) {
            console.error(`Error checking account ${account.username}:`, e);
            return { ...account, exists: false, hasProfile: false };
          }
        })
      );
      setTestAccounts(updatedAccounts);
    } catch (error) {
      console.error('Error checking accounts:', error);
      toast({
        variant: "destructive",
        title: "Fout",
        description: "Kon account status niet controleren.",
      });
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkAccounts();
  }, []);

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const getAccountStatus = (account: TestAccount) => {
    if (!account.exists || !account.hasProfile) {
      return { text: '✗ Ontbreekt', color: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' };
    }
    
    if (account.username === 'leverancier' && !account.hasSupplierProfile) {
      return { text: '⚠ Incompleet', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' };
    }
    
    return { text: '✓ Bestaat', color: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' };
  };

  return (
    <Card className="mt-6 border-dashed border-2 border-muted-foreground/25">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
          Test Accounts (Development)
          <Button
            variant="outline"
            size="sm"
            onClick={checkAccounts}
            disabled={isChecking}
            className="ml-2"
          >
            <RefreshCw className={`h-3 w-3 mr-1 ${isChecking ? 'animate-spin' : ''}`} />
            {isChecking ? 'Controleren...' : 'Vernieuwen'}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        {testAccounts.map((account, index) => (
          <div key={index} className="grid grid-cols-3 gap-2 items-center p-2 rounded-md bg-muted/30">
            <div>
              <p className="text-xs font-medium text-muted-foreground">{account.role}</p>
              <div className="flex items-center gap-1">
                <code className="text-xs bg-background px-1 py-0.5 rounded">{account.email}</code>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0"
                  onClick={() => copyToClipboard(account.email, `${index}-email`)}
                >
                  {copiedField === `${index}-email` ? (
                    <Check className="h-3 w-3 text-green-500" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </Button>
              </div>
            </div>
            
            <div>
              <p className="text-xs font-medium text-muted-foreground">Wachtwoord</p>
              <div className="flex items-center gap-1">
                <code className="text-xs bg-background px-1 py-0.5 rounded">{account.password}</code>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0"
                  onClick={() => copyToClipboard(account.password, `${index}-password`)}
                >
                  {copiedField === `${index}-password` ? (
                    <Check className="h-3 w-3 text-green-500" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </Button>
              </div>
            </div>

            <div className="text-right">
              {(() => {
                const status = getAccountStatus(account);
                return (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${status.color}`}>
                    {status.text}
                  </span>
                );
              })()}
            </div>
          </div>
        ))}
        
        {testAccounts.some(account => !account.exists) && (
          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-md border border-yellow-200 dark:border-yellow-800">
            <p className="text-xs text-yellow-800 dark:text-yellow-200 font-medium mb-2">
              Ontbrekende accounts aanmaken:
            </p>
            <p className="text-xs text-yellow-700 dark:text-yellow-300">
              Voor ontbrekende accounts: ga naar <strong>/register</strong> en registreer handmatig met de bovenstaande gegevens.
              <br />
              Gebruik het juiste e-mailadres en wachtwoord uit de tabel.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};