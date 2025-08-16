import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Send, Mail } from 'lucide-react';
import telegramIcon from '@/assets/icons/telegram.webp';
import wireIcon from '@/assets/icons/wire.webp';

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
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <MessageCircle className="h-6 w-6 text-green-600" />
          Contact Opnemen
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-lg text-muted-foreground mb-6">
          {description || `Neem direct contact op met ${supplierName} voor bestellingen, vragen of meer informatie.`}
        </p>
        
        <div className="grid md:grid-cols-3 gap-4 mt-6">
          {/* Wire Contact */}
          <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-blue-200 hover:border-blue-400 hover:scale-105">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <img src={wireIcon} alt="Wire" className="w-8 h-8" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Wire</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Veilig en versleuteld chatten
              </p>
              <div className="bg-blue-50 rounded-lg p-3 mb-4">
                <p className="text-sm font-mono text-blue-700">
                  {contactInfo?.wire || '@wire_username'}
                </p>
              </div>
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => window.open(`https://wfb.pathtoresilience.dev/contact/wire/${(contactInfo?.wire || 'wire_username').replace('@', '')}`, '_blank', 'noopener,noreferrer')}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Contact via Wire
              </Button>
            </CardContent>
          </Card>

          {/* Telegram Contact */}
          <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-blue-200 hover:border-blue-400 hover:scale-105">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                <img src={telegramIcon} alt="Telegram" className="w-8 h-8" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Telegram</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Direct en snel chatten
              </p>
              <div className="bg-blue-50 rounded-lg p-3 mb-4">
                <p className="text-sm font-mono text-blue-700">
                  {contactInfo?.telegram || '@telegram_username'}
                </p>
              </div>
              <Button 
                className="w-full bg-blue-500 hover:bg-blue-600"
                onClick={() => window.open(`https://wfb.pathtoresilience.dev/contact/telegram/${(contactInfo?.telegram || 'telegram_username').replace('@', '')}`, '_blank', 'noopener,noreferrer')}
              >
                <Send className="h-4 w-4 mr-2" />
                Contact via Telegram
              </Button>
            </CardContent>
          </Card>

          {/* Email Contact */}
          <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-green-200 hover:border-green-400 hover:scale-105">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Email</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Professioneel contact
              </p>
              <div className="bg-green-50 rounded-lg p-3 mb-4">
                <p className="text-sm font-mono text-green-700">
                  {contactInfo?.email || 'contact@email.com'}
                </p>
              </div>
              <Button 
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={() => window.open(`https://wfb.pathtoresilience.dev/contact/email/${contactInfo?.email || 'contact@email.com'}`, '_blank', 'noopener,noreferrer')}
              >
                <Mail className="h-4 w-4 mr-2" />
                Stuur Email
              </Button>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};