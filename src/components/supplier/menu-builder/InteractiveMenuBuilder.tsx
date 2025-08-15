import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Settings, List, Package } from 'lucide-react';
import { MenuSettingsManager } from './MenuSettingsManager';
import { PriceListManager } from './PriceListManager';
import { AutoCategoryManager } from './AutoCategoryManager';
import type { MenuBuilderStep } from '@/types/menuBuilder';

interface InteractiveMenuBuilderProps {
  supplierId: string;
}

export function InteractiveMenuBuilder({ supplierId }: InteractiveMenuBuilderProps) {
  const [activeTab, setActiveTab] = useState('settings');

  const steps: MenuBuilderStep[] = [
    {
      id: 'settings',
      title: 'Menu Instellingen',
      description: 'Algemene instellingen en contactinformatie',
      completed: false
    },
    {
      id: 'pricelists',
      title: 'Prijslijsten',
      description: 'Producten en prijzen beheren',
      completed: false
    },
    {
      id: 'categories',
      title: 'Categorieën',
      description: 'Automatisch gedetecteerde categorieën',
      completed: false
    }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Interactive Menu Builder</h1>
        <p className="text-muted-foreground">
          Bouw je professionele menukaart stap voor stap op
        </p>
      </div>

      {/* Progress Steps */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                  activeTab === step.id
                    ? 'border-primary bg-primary/5'
                    : 'border-muted hover:border-muted-foreground/50'
                }`}
                onClick={() => setActiveTab(step.id)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                    step.completed
                      ? 'bg-green-500 text-white'
                      : activeTab === step.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {index + 1}
                  </div>
                  <h3 className="font-medium text-sm">{step.title}</h3>
                  {step.completed && (
                    <Badge variant="secondary" className="text-xs">
                      Voltooid
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Instellingen
          </TabsTrigger>
          <TabsTrigger value="pricelists" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            Prijslijsten
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Categorieën
          </TabsTrigger>
        </TabsList>

        <TabsContent value="settings">
          <MenuSettingsManager supplierId={supplierId} />
        </TabsContent>

        <TabsContent value="pricelists">
          <PriceListManager supplierId={supplierId} />
        </TabsContent>

        <TabsContent value="categories">
          <AutoCategoryManager supplierId={supplierId} />
        </TabsContent>
      </Tabs>

      {/* Tips Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
        <CardContent className="p-6">
          <h3 className="font-medium mb-2">💡 Tips voor een perfecte menukaart:</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Gebruik duidelijke categorienamen zoals "Haze", "Kush", "Cali"</li>
            <li>• Maak herbruikbare prijslijsten voor categorieën met dezelfde prijzen</li>
            <li>• Kies "prijs per eenheid" voor cartridges, edibles en andere niet-gewicht producten</li>
            <li>• Voeg contactinformatie toe zodat klanten je gemakkelijk kunnen bereiken</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}