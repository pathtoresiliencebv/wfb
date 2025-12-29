
import { useState, useEffect, useCallback } from 'react';
import { aiService, ProgressData } from '@/lib/ai-service';
import { toast } from 'sonner';

export function useAIProject() {
    const [isLoading, setIsLoading] = useState(false);
    const [progressData, setProgressData] = useState<ProgressData | null>(null);
    const [isRegistered, setIsRegistered] = useState(!!aiService.getSiteId());

    const fetchProgress = useCallback(async () => {
        if (!aiService.getSiteId()) return;

        try {
            const data = await aiService.getProgress();
            if (data) {
                setProgressData(data);
            }
        } catch (error) {
            console.error("Error fetching progress:", error);
        }
    }, []);

    const registerSite = async (url: string) => {
        setIsLoading(true);
        try {
            const result = await aiService.registerSite(url);
            if (result) {
                setIsRegistered(true);
                toast.success("Site registered successfully! Analysis starting...");
                await fetchProgress();
            }
        } catch (error) {
            toast.error("Registration failed.");
        } finally {
            setIsLoading(false);
        }
    };

    // Initial load and polling
    useEffect(() => {
        if (isRegistered) {
            fetchProgress();
            // Poll every 10 seconds
            const interval = setInterval(fetchProgress, 10000);
            return () => clearInterval(interval);
        }
    }, [isRegistered, fetchProgress]);

    return {
        isRegistered,
        isLoading,
        progressData,
        registerSite,
        refresh: fetchProgress
    };
}
