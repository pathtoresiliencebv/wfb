import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, ArrowRight, ArrowLeft, Users, MessageSquare, Trophy, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  component: React.ReactNode;
}

export const OnboardingFlow: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    displayName: '',
    bio: '',
    interests: [] as string[],
    experience: '',
    goals: ''
  });
  const { user } = useAuth();
  const { toast } = useToast();

  const availableInterests = [
    'Cannabis Wetgeving', 'Medicinale Cannabis', 'Thuiskweek', 'CBD Producten',
    'Cannabis Onderzoek', 'Internationale Wetgeving', 'Cannabis Business',
    'Cannabis Cultuur', 'Harm Reduction', 'Cannabis Advocacy'
  ];

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welkom bij Wietforum',
      description: 'Laten we je profiel instellen zodat je het meeste uit onze community kunt halen',
      icon: <Users className="h-6 w-6" />,
      component: (
        <div className="space-y-4">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Welkom bij onze community!</h3>
              <p className="text-muted-foreground">
                Wietforum is de grootste Nederlandse community voor cannabis discussies, 
                wetgeving updates en kennisdeling.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="text-center p-4 border rounded-lg">
              <MessageSquare className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="font-medium">Discussies</p>
              <p className="text-sm text-muted-foreground">Deel kennis en ervaringen</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Trophy className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="font-medium">Achievements</p>
              <p className="text-sm text-muted-foreground">Verdien badges en reputatie</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'profile',
      title: 'Profiel Instellen',
      description: 'Vertel ons iets over jezelf',
      icon: <Settings className="h-6 w-6" />,
      component: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">Weergavenaam</Label>
              <Input
                id="displayName"
                value={formData.displayName}
                onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                placeholder="Hoe wil je dat anderen je zien?"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Vertel iets over jezelf..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="experience">Cannabis ervaring</Label>
              <select
                className="w-full p-2 border rounded-md"
                value={formData.experience}
                onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
              >
                <option value="">Selecteer je ervaringsniveau</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Gemiddeld</option>
                <option value="experienced">Ervaren</option>
                <option value="expert">Expert</option>
              </select>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'interests',
      title: 'Interesses',
      description: 'Welke onderwerpen interesseren je?',
      icon: <Trophy className="h-6 w-6" />,
      component: (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Selecteer je interessegebieden om relevante content te krijgen
          </p>
          <div className="grid grid-cols-2 gap-2">
            {availableInterests.map((interest) => (
              <button
                key={interest}
                onClick={() => {
                  setFormData(prev => ({
                    ...prev,
                    interests: prev.interests.includes(interest)
                      ? prev.interests.filter(i => i !== interest)
                      : [...prev.interests, interest]
                  }));
                }}
                className={`p-3 text-sm border rounded-lg text-left transition-colors ${
                  formData.interests.includes(interest)
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
          <div className="text-sm text-muted-foreground">
            Geselecteerd: {formData.interests.length} onderwerpen
          </div>
        </div>
      )
    },
    {
      id: 'goals',
      title: 'Doelen',
      description: 'Wat hoop je te bereiken in onze community?',
      icon: <CheckCircle className="h-6 w-6" />,
      component: (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="goals">Wat zijn je doelen?</Label>
            <Textarea
              id="goals"
              value={formData.goals}
              onChange={(e) => setFormData(prev => ({ ...prev, goals: e.target.value }))}
              placeholder="Bijvoorbeeld: leren over wetgeving, kennisdeling, netwerken..."
              rows={4}
            />
          </div>
          <div className="space-y-3">
            <h4 className="font-medium">Populaire doelen in onze community:</h4>
            <div className="space-y-2">
              {[
                'Bijblijven met cannabis wetgeving',
                'Leren over medicinale cannabis',
                'Ervaringen delen over cannabis gebruik',
                'Netwerken met gelijkgestemden',
                'Bijdragen aan cannabis advocacy'
              ].map((goal, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  {goal}
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    }
  ];

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCompletedSteps(prev => [...prev, steps[currentStep].id]);
      setCurrentStep(prev => prev + 1);
    } else {
      // Complete onboarding
      await completeOnboarding();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const completeOnboarding = async () => {
    try {
      // Update user profile with onboarding data
      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: formData.displayName,
          bio: formData.bio,
          // Store additional onboarding data in a metadata field
        })
        .eq('user_id', user?.id);

      if (error) throw error;

      toast({
        title: "Onboarding voltooid!",
        description: "Welkom bij de Wietforum community. Je kunt nu beginnen met posten en discussiëren.",
      });

      // Award first achievement
      await supabase.rpc('award_achievement', {
        target_user_id: user?.id,
        achievement_name: 'welcome_aboard'
      });

      // Redirect to main forum
      window.location.href = '/';
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast({
        title: "Fout",
        description: "Er ging iets mis bij het voltooien van de onboarding.",
        variant: "destructive",
      });
    }
  };

  const canProceed = () => {
    switch (steps[currentStep].id) {
      case 'welcome':
        return true;
      case 'profile':
        return formData.displayName.trim().length > 0;
      case 'interests':
        return formData.interests.length > 0;
      case 'goals':
        return formData.goals.trim().length > 0;
      default:
        return true;
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {steps[currentStep].icon}
                <CardTitle>{steps[currentStep].title}</CardTitle>
              </div>
              <Badge variant="outline">
                {currentStep + 1} van {steps.length}
              </Badge>
            </div>
            <CardDescription>{steps[currentStep].description}</CardDescription>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Voortgang</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {steps[currentStep].component}
          
          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Vorige
            </Button>
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex items-center gap-2"
            >
              {currentStep === steps.length - 1 ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Voltooien
                </>
              ) : (
                <>
                  Volgende
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};