import { useMemo } from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Check, X } from 'lucide-react';

interface PasswordStrengthMeterProps {
  password: string;
}

interface PasswordCriteria {
  label: string;
  met: boolean;
}

export const PasswordStrengthMeter = ({ password }: PasswordStrengthMeterProps) => {
  const analysis = useMemo(() => {
    const criteria: PasswordCriteria[] = [
      {
        label: 'Minimaal 8 karakters',
        met: password.length >= 8,
      },
      {
        label: 'Bevat hoofdletters',
        met: /[A-Z]/.test(password),
      },
      {
        label: 'Bevat kleine letters',
        met: /[a-z]/.test(password),
      },
      {
        label: 'Bevat cijfers',
        met: /\d/.test(password),
      },
      {
        label: 'Bevat speciale karakters',
        met: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      },
    ];

    const metCount = criteria.filter(c => c.met).length;
    const strength = metCount === 0 ? 0 : (metCount / criteria.length) * 100;
    
    let strengthLevel = 'Zeer zwak';
    let strengthColor = 'destructive';
    
    if (metCount >= 5) {
      strengthLevel = 'Zeer sterk';
      strengthColor = 'default';
    } else if (metCount >= 4) {
      strengthLevel = 'Sterk';
      strengthColor = 'default';
    } else if (metCount >= 3) {
      strengthLevel = 'Gemiddeld';
      strengthColor = 'secondary';
    } else if (metCount >= 1) {
      strengthLevel = 'Zwak';
      strengthColor = 'destructive';
    }

    return {
      criteria,
      strength,
      strengthLevel,
      strengthColor,
      metCount,
    };
  }, [password]);

  if (!password) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Wachtwoord sterkte</span>
        <Badge variant={analysis.strengthColor as any}>
          {analysis.strengthLevel}
        </Badge>
      </div>
      
      <Progress value={analysis.strength} className="h-2" />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {analysis.criteria.map((criterion, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            {criterion.met ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <X className="h-4 w-4 text-muted-foreground" />
            )}
            <span className={criterion.met ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}>
              {criterion.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};