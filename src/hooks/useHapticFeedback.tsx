import { useCallback } from 'react';

type HapticFeedbackType = 'light' | 'medium' | 'heavy' | 'selection' | 'impact' | 'notification';

export function useHapticFeedback() {
  const triggerHaptic = useCallback((type: HapticFeedbackType = 'light') => {
    // Check if device supports haptic feedback
    if ('vibrate' in navigator) {
      switch (type) {
        case 'light':
          navigator.vibrate(10);
          break;
        case 'medium':
          navigator.vibrate(20);
          break;
        case 'heavy':
          navigator.vibrate(40);
          break;
        case 'selection':
          navigator.vibrate([5, 5]);
          break;
        case 'impact':
          navigator.vibrate([10, 5, 10]);
          break;
        case 'notification':
          navigator.vibrate([50, 25, 50, 25, 50]);
          break;
        default:
          navigator.vibrate(10);
      }
    }

    // For iOS devices with haptic engine support
    if ('Haptics' in window) {
      try {
        switch (type) {
          case 'light':
            // @ts-ignore
            window.Haptics.impact({ style: 'light' });
            break;
          case 'medium':
            // @ts-ignore
            window.Haptics.impact({ style: 'medium' });
            break;
          case 'heavy':
            // @ts-ignore
            window.Haptics.impact({ style: 'heavy' });
            break;
          case 'selection':
            // @ts-ignore
            window.Haptics.selection();
            break;
          case 'notification':
            // @ts-ignore
            window.Haptics.notification({ type: 'success' });
            break;
        }
      } catch (error) {
        console.log('Haptic feedback not available');
      }
    }
  }, []);

  const isSupported = 'vibrate' in navigator || 'Haptics' in window;

  return {
    triggerHaptic,
    isSupported
  };
}