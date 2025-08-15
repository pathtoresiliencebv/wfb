import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Send, Mail } from 'lucide-react';

interface SupplierContactSectionProps {
  supplierName: string;
  description?: string;
  contactInfo?: {
    telegram?: string;
    wire?: string;
    email?: string;
  };
}

export const SupplierContactSection: React.FC<SupplierContactSectionProps> = ({
  supplierName,
  description,
  contactInfo
}) => {
  const defaultDescription = `Heb je vragen of wil je een bestelling plaatsen bij ${supplierName}? Neem dan contact met ons op via een van de onderstaande kanalen. We helpen je graag verder!`;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-primary" />
          Contact Opnemen
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {description || defaultDescription}
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {contactInfo?.wire && (
            <div className="text-center p-4 border rounded-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 hover:shadow-md transition-all duration-200 cursor-pointer group"
                 onClick={() => window.open(`https://wire.com/u/${contactInfo.wire.replace('@', '')}`, '_blank')}>
              <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-200">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <h4 className="font-medium text-sm mb-1">Wire</h4>
              <p className="text-xs text-muted-foreground">@{contactInfo.wire}</p>
              <Button variant="outline" size="sm" className="mt-2 w-full">
                Contact via Wire
              </Button>
            </div>
          )}
          
          {contactInfo?.telegram && (
            <div className="text-center p-4 border rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 hover:shadow-md transition-all duration-200 cursor-pointer group"
                 onClick={() => window.open(`https://t.me/${contactInfo.telegram.replace('@', '')}`, '_blank')}>
              <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-200">
                <Send className="h-6 w-6 text-white" />
              </div>
              <h4 className="font-medium text-sm mb-1">Telegram</h4>
              <p className="text-xs text-muted-foreground">@{contactInfo.telegram}</p>
              <Button variant="outline" size="sm" className="mt-2 w-full">
                Contact via Telegram
              </Button>
            </div>
          )}
          
          {contactInfo?.email && (
            <div className="text-center p-4 border rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 hover:shadow-md transition-all duration-200 cursor-pointer group"
                 onClick={() => window.open(`mailto:${contactInfo.email}`, '_blank')}>
              <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-200">
                <Mail className="h-6 w-6 text-white" />
              </div>
              <h4 className="font-medium text-sm mb-1">Email</h4>
              <p className="text-xs text-muted-foreground">{contactInfo.email}</p>
              <Button variant="outline" size="sm" className="mt-2 w-full">
                Stuur Email
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};