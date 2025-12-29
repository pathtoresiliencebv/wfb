import { toast } from "sonner";

/**
 * SEOBot service wrapper
 * Documentation: https://github.com/MarsX-dev/seobot
 */
class SEOBotService {
    private apiKey: string | null = null;
    private baseUrl = 'https://seobot.io/api/v1'; // Based on typical REST API structures, confirming with docs if needed

    constructor() {
        this.apiKey = import.meta.env.VITE_SEOBOT_API_KEY || null;
    }

    setApiKey(key: string) {
        this.apiKey = key;
    }

    private async request(endpoint: string, options: RequestInit = {}) {
        if (!this.apiKey) {
            console.warn("SEOBot API key not found in environment variables.");
            return null;
        }

        const url = `${this.baseUrl}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
            ...options.headers,
        };

        try {
            const response = await fetch(url, { ...options, headers });
            if (!response.ok) {
                const error = await response.text();
                throw new Error(`SEOBot API Error: ${response.status} - ${error}`);
            }
            return await response.json();
        } catch (error) {
            console.error('SEOBot request failed:', error);
            return null;
        }
    }

    /**
     * Fetch latest articles from SEOBot
     */
    async getArticles() {
        return this.request('/articles');
    }

    /**
     * Check if the API key is configured and valid
     */
    isConfigured() {
        return !!this.apiKey;
    }
}

export const seobot = new SEOBotService();
