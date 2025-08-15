import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Send } from 'lucide-react';

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
        
        <div className="flex flex-wrap gap-3">
          {contactInfo?.telegram && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.open(`https://t.me/${contactInfo.telegram}`, '_blank')}
              className="flex items-center gap-2"
            >
              <Send className="h-4 w-4" />
              Telegram
            </Button>
          )}
          
          {contactInfo?.wire && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.open(`https://wire.com/u/${contactInfo.wire}`, '_blank')}
              className="flex items-center gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              Wire
            </Button>
          )}
          
          {contactInfo?.email && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.open(`mailto:${contactInfo.email}`, '_blank')}
              className="flex items-center gap-2"
            >
              <Send className="h-4 w-4" />
              Email
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};