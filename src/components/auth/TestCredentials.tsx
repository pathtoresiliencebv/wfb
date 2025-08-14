import React, { useState, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface TestAccount {
  username: string;
  password: string;
  role: string;
  email?: string;
  exists: boolean;
}

export const TestCredentials: React.FC = () => {
  const [testAccounts, setTestAccounts] = useState<TestAccount[]>([
    { username: 'admin', password: 'admin123', role: 'Admin', exists: false },
    { username: 'leverancier', password: '12345678', role: 'Leverancier', exists: false },
    { username: 'testuser', password: 'testuser123', role: 'Gebruiker', exists: false }
  ]);
  
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Check which accounts exist
  useEffect(() => {
    const checkAccounts = async () => {
      const updatedAccounts = await Promise.all(
        testAccounts.map(async (account) => {
          try {
            const { data, error } = await supabase
              .from('profiles')
              .select('username, role')
              .eq('username', account.username)
              .maybeSingle();
            
            return {
              ...account,
              exists: !error && !!data
            };
          } catch (e) {
            return { ...account, exists: false };
          }
        })
      );
      setTestAccounts(updatedAccounts);
    };

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

  const createMissingAccounts = async () => {
    setIsCreating(true);
    
    try {
      for (const account of testAccounts) {
        if (!account.exists) {
          try {
            const email = account.username === 'admin' 
              ? 'info@wietforumbelgie.com'
              : `${account.username}@test.com`;

            console.log(`Creating account for ${account.username}...`);
            
            const { data, error } = await supabase.auth.signUp({
              email: email,
              password: account.password,
              options: {
                emailRedirectTo: `${window.location.origin}/`,
                data: {
                  username: account.username,
                  display_name: account.username === 'admin' 
                    ? 'WietForum Admin' 
                    : account.username === 'leverancier'
                    ? 'Test Leverancier'
                    : 'Test Gebruiker',
                  role: account.username === 'admin' 
                    ? 'admin' 
                    : account.username === 'leverancier'
                    ? 'supplier'
                    : 'user',
                }
              }
            });

            if (error && !error.message.includes('already registered')) {
              console.error(`Error creating ${account.username}:`, error);
              continue;
            }

            // If supplier, create supplier profile
            if (account.username === 'leverancier' && data.user) {
              await supabase
                .from('supplier_profiles')
                .insert({
                  user_id: data.user.id,
                  business_name: 'Test Leverancier Shop',
                  description: 'Test leverancier voor ontwikkeling',
                  contact_info: {},
                  stats: {},
                  features: [],
                  ranking: 0,
                  is_active: true
                })
                .maybeSingle();
            }

            console.log(`✅ Account created/verified for ${account.username}`);
          } catch (e) {
            console.error(`Failed to create ${account.username}:`, e);
          }
        }
      }

      toast({
        title: "Accounts bijgewerkt",
        description: "Test accounts zijn aangemaakt of geverifieerd.",
      });

      // Recheck accounts
      setTimeout(() => {
        window.location.reload();
      }, 1000);

    } catch (error) {
      console.error('Error creating accounts:', error);
      toast({
        variant: "destructive",
        title: "Fout",
        description: "Er is een fout opgetreden bij het aanmaken van accounts.",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Card className="mt-6 border-dashed border-2 border-muted-foreground/25">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center justify-between">
          Test Accounts (Development)
          <Button
            variant="outline"
            size="sm"
            onClick={createMissingAccounts}
            disabled={isCreating}
            className="ml-2"
          >
            {isCreating ? 'Bezig...' : 'Accounts Aanmaken'}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        {testAccounts.map((account, index) => (
          <div key={index} className="grid grid-cols-3 gap-2 items-center p-2 rounded-md bg-muted/30">
            <div>
              <p className="text-xs font-medium text-muted-foreground">{account.role}</p>
              <div className="flex items-center gap-1">
                <code className="text-xs bg-background px-1 py-0.5 rounded">{account.username}</code>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0"
                  onClick={() => copyToClipboard(account.username, `${index}-username`)}
                >
                  {copiedField === `${index}-username` ? (
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
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                account.exists 
                  ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' 
                  : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
              }`}>
                {account.exists ? '✓ Bestaat' : '✗ Ontbreekt'}
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};