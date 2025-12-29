
import React, { useState } from 'react';
import { useAIProject } from '@/hooks/useAIProject';
import { ProgressSection } from '@/components/ai-seo/ProgressSection';
import { StatusCards } from '@/components/ai-seo/StatusCards';
import { TaskList } from '@/components/ai-seo/TaskList';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon, Sparkles, Link as LinkIcon, ExternalLink } from 'lucide-react';
import { seobot } from '@/lib/seobot';
import { Badge } from '@/components/ui/badge';

const AIVisibilityDashboard = () => {
    const { isRegistered, isLoading, progressData, registerSite } = useAIProject();
    const [urlInput, setUrlInput] = useState('');

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        if (urlInput) {
            registerSite(urlInput);
        }
    };

    return (
        <div className="container mx-auto p-6 max-w-7xl animate-fade-in space-y-8">
            <div className="flex items-center space-x-3 mb-8">
                <div className="p-3 bg-primary/10 rounded-xl">
                    <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">AI & SEO Visibility</h1>
                    <p className="text-muted-foreground">Optimize your presence for AI Search Engines & ChatGPT</p>
                </div>
            </div>

            {/* Registration Form */}
            {!isRegistered && (
                <Card className="mb-8 border-primary/20 shadow-lg">
                    <CardHeader className="bg-primary/5 border-b border-primary/10">
                        <CardTitle className="text-primary">Start Optimization</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <form onSubmit={handleRegister} className="flex gap-4 items-end">
                            <div className="flex-1 space-y-2">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Website URL
                                </label>
                                <Input
                                    placeholder="https://example.com"
                                    value={urlInput}
                                    onChange={(e) => setUrlInput(e.target.value)}
                                    className="h-12 text-lg"
                                />
                            </div>
                            <Button size="lg" className="h-12 px-8" disabled={isLoading || !urlInput}>
                                {isLoading ? "Starting..." : "Start Scan"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            )}

            {/* Progress Section */}
            <ProgressSection
                isRegistered={isRegistered}
                progress={progressData?.progress || 0}
                phase={progressData?.phase || 0}
                status={progressData?.status || 'pending'}
                completedTasks={progressData?.completedTasks || 0}
                totalTasks={progressData?.totalTasks || 0}
            />

            {/* Status Cards */}
            <StatusCards
                isRegistered={isRegistered}
                siteId={localStorage.getItem('wpworld_ai_site_id')} // Direct access for now, cleaner to pass from hook
                progress={progressData?.progress || 0}
                tasks={progressData?.tasks || []}
            />

            {/* Task List (Only show if registered) */}
            {isRegistered && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <TaskList tasks={progressData?.tasks || []} />
                    </div>

                    <div className="space-y-6">
                        {/* Info Box */}
                        <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-100">
                            <CardHeader>
                                <CardTitle className="flex items-center text-indigo-900">
                                    <InfoIcon className="w-5 h-5 mr-2" />
                                    How It Works
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-indigo-800 space-y-3">
                                <p>This tool optimizes your website for AI systems like ChatGPT, Gemini, and Perplexity while improving SEO rankings.</p>
                                <ul className="list-disc pl-4 space-y-2">
                                    <li><strong>AI Summary Page:</strong> Dedicated page for AI bots.</li>
                                    <li><strong>Schema Markup:</strong> Structured data injection.</li>
                                    <li><strong>Search Indexing:</strong> Fast submission to Google/Bing.</li>
                                    <li><strong>AI Citations:</strong> External references on Notion, etc.</li>
                                </ul>
                            </CardContent>
                        </Card>

                        {/* SEOBot Blog Connection */}
                        <Card className={seobot.isConfigured() ? "border-green-200 bg-green-50/50" : "border-orange-200 bg-orange-50/50"}>
                            <CardHeader>
                                <CardTitle className="flex items-center text-sm font-bold">
                                    <LinkIcon className="w-4 h-4 mr-2" />
                                    Blog Connection (SEOBot)
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Status</span>
                                    {seobot.isConfigured() ? (
                                        <Badge variant="default" className="bg-green-600">Verbonden</Badge>
                                    ) : (
                                        <Badge variant="secondary">Niet geconfigureerd</Badge>
                                    )}
                                </div>
                                {!seobot.isConfigured() && (
                                    <p className="text-xs text-muted-foreground italic">
                                        Voeg je SEOBot API key toe aan de environment variables om blog artikelen te synchroniseren.
                                    </p>
                                )}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full flex items-center justify-center gap-2"
                                    onClick={() => window.open('https://seobot.io', '_blank')}
                                >
                                    Open SEOBot <ExternalLink className="w-3 h-3" />
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Report CTA */}
                        {progressData?.reportUrl && (
                            <Card className="bg-green-50 border-green-200">
                                <CardContent className="pt-6 text-center">
                                    <div className="text-3xl mb-2">🎉</div>
                                    <h3 className="text-lg font-bold text-green-900 mb-2">Report Ready!</h3>
                                    <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => window.open(progressData.reportUrl, '_blank')}>
                                        View Full Report
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AIVisibilityDashboard;
