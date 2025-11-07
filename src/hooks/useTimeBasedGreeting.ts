import { useState, useEffect } from 'react';

export function useTimeBasedGreeting(): string {
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const getGreeting = () => {
      const hour = new Date().getHours();
      
      if (hour < 12) return "Goedemorgen";
      if (hour < 18) return "Goedemiddag";
      return "Goedenavond";
    };

    setGreeting(getGreeting());
    
    // Update greeting every minute
    const interval = setInterval(() => {
      setGreeting(getGreeting());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return greeting;
}
