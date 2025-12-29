
import { toast } from "sonner";

// Base URL for the backend
const API_URL = 'https://wpworld-ai-backend-production.up.railway.app';

export interface SiteData {
    domain: string;
    site_url: string;
    site_name: string;
    site_token?: string;
    wp_version?: string;
    php_version?: string;
    plugin_version?: string;
    admin_email?: string;
    language?: string;
    timezone?: string;
    registered_at?: string;
}

export interface ProgressData {
    progress: number;
    status: 'pending' | 'active' | 'completed';
    completedTasks: number;
    totalTasks: number;
    phase: number;
    reportUrl?: string;
    tasks: AISeoTask[];
}

export interface AISeoTask {
    taskType: string;
    status: 'pending' | 'running' | 'completed' | 'failed';
    result?: any;
    timestamp?: string;
}

class AIService {
    private token: string | null = null;
    private siteId: string | null = null;

    constructor() {
        // In a real app, we might persist this in localStorage or a database
        this.token = localStorage.getItem('wpworld_ai_token');
        this.siteId = localStorage.getItem('wpworld_ai_site_id');
    }

    setToken(token: string) {
        this.token = token;
        localStorage.setItem('wpworld_ai_token', token);
    }

    setSiteId(siteId: string) {
        this.siteId = siteId;
        localStorage.setItem('wpworld_ai_site_id', siteId);
    }

    getSiteId() {
        return this.siteId;
    }

    private async request(endpoint: string, options: RequestInit = {}) {
        const url = `${API_URL}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            ...(this.token ? { 'Authorization': `Bearer ${this.token}` } : {}),
            ...options.headers,
        };

        try {
            const response = await fetch(url, { ...options, headers });

            if (!response.ok) {
                const errorBody = await response.text();
                console.error('API Error:', response.status, errorBody);
                throw new Error(`API Error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Request failed:', error);
            throw error;
        }
    }

    async registerSite(url: string): Promise<{ site_id: string; token: string } | null> {
        try {
            // Simulate data collection from the URL
            const siteData: SiteData = {
                domain: new URL(url).hostname,
                site_url: url,
                site_name: "My Website", // Placeholder
                admin_email: "user@example.com", // Placeholder
                language: navigator.language,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                registered_at: new Date().toISOString(),
                plugin_version: '1.1.2-react'
            };

            const result = await this.request('/api/v1/sites/register', {
                method: 'POST',
                body: JSON.stringify(siteData),
            });

            if (result && result.site_id) {
                this.setSiteId(result.site_id);
                // In a real scenario, the backend might return a token or we generate one
                // For now, we'll store a placeholder if none returned
                this.setToken(result.token || 'placeholder-token');
                return result;
            }
            return null;
        } catch (error) {
            toast.error("Failed to register site. Please check the URL and try again.");
            return null;
        }
    }

    async getProgress(): Promise<ProgressData | null> {
        if (!this.siteId) return null;

        try {
            const data = await this.request(`/api/v1/sites/${this.siteId}/progress`);
            return data;
        } catch (error) {
            console.error("Failed to fetch progress", error);
            return null;
        }
    }

    // Simulate the daily sync/scan
    async syncData() {
        if (!this.siteId) return;

        // In the PHP plugin, this sends full wp_options, plugins list etc.
        // We will send a lighter version here.
        const syncData = {
            site_url: window.location.origin, // purely example
            collected_at: new Date().toISOString()
        };

        try {
            await this.request(`/api/v1/sites/${this.siteId}/data`, {
                method: 'POST',
                body: JSON.stringify(syncData)
            });
            console.log("Sync completed");
        } catch (e) {
            console.error("Sync failed", e);
        }
    }
}

export const aiService = new AIService();
