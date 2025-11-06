import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faPaperPlane, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faTelegram } from '@fortawesome/free-brands-svg-icons';

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
    <Card data-contact-section>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <FontAwesomeIcon icon={faComments} className="h-6 w-6 text-primary" />
          Contact Opnemen
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-lg text-muted-foreground mb-6">
          {description || `Neem direct contact op met ${supplierName} voor bestellingen, vragen of meer informatie.`}
        </p>
        
        <div className="grid md:grid-cols-3 gap-4 mt-6">
          {/* Wire Contact */}
          <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-primary/20 hover:border-primary hover:scale-105">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary/80 to-primary rounded-2xl flex items-center justify-center shadow-lg">
                <FontAwesomeIcon icon={faPaperPlane} className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Wire</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Veilig en versleuteld chatten
              </p>
              <div className="bg-primary/5 rounded-lg p-3 mb-4">
                <p className="text-sm font-mono text-foreground">
                  {contactInfo?.wire || '@wire_username'}
                </p>
              </div>
              <Button 
                className="w-full bg-primary hover:bg-primary/90"
                onClick={() => window.open(`https://wfb.pathtoresilience.dev/contact/wire/${(contactInfo?.wire || 'wire_username').replace('@', '')}`, '_blank', 'noopener,noreferrer')}
              >
                <FontAwesomeIcon icon={faPaperPlane} className="h-4 w-4 mr-2" />
                Contact via Wire
              </Button>
            </CardContent>
          </Card>

          {/* Telegram Contact */}
          <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-primary/20 hover:border-primary hover:scale-105">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary/80 to-primary rounded-2xl flex items-center justify-center shadow-lg">
                <FontAwesomeIcon icon={faTelegram} className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Telegram</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Direct en snel chatten
              </p>
              <div className="bg-primary/5 rounded-lg p-3 mb-4">
                <p className="text-sm font-mono text-foreground">
                  {contactInfo?.telegram || '@telegram_username'}
                </p>
              </div>
              <Button 
                className="w-full bg-primary hover:bg-primary/90"
                onClick={() => window.open(`https://wfb.pathtoresilience.dev/contact/telegram/${(contactInfo?.telegram || 'telegram_username').replace('@', '')}`, '_blank', 'noopener,noreferrer')}
              >
                <FontAwesomeIcon icon={faTelegram} className="h-4 w-4 mr-2" />
                Contact via Telegram
              </Button>
            </CardContent>
          </Card>

          {/* Email Contact */}
          <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-primary/20 hover:border-primary hover:scale-105">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary/80 to-primary rounded-2xl flex items-center justify-center shadow-lg">
                <FontAwesomeIcon icon={faEnvelope} className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Email</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Professioneel contact
              </p>
              <div className="bg-primary/5 rounded-lg p-3 mb-4">
                <p className="text-sm font-mono text-foreground">
                  {contactInfo?.email || 'contact@email.com'}
                </p>
              </div>
              <Button 
                className="w-full bg-primary hover:bg-primary/90"
                onClick={() => window.open(`https://wfb.pathtoresilience.dev/contact/email/${contactInfo?.email || 'contact@email.com'}`, '_blank', 'noopener,noreferrer')}
              >
                <FontAwesomeIcon icon={faEnvelope} className="h-4 w-4 mr-2" />
                Stuur Email
              </Button>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};