
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Clock, AlertTriangle, Cloud, FileText, Database, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatusCardsProps {
    isRegistered: boolean;
    siteId: string | null;
    progress: number;
    tasks: any[];
}

export const StatusCards: React.FC<StatusCardsProps> = ({ isRegistered, siteId, tasks }) => {
    // Determine statuses based on tasks
    const hasAiSummary = tasks.some(t => t.taskType === 'create_ai_summary_page' && t.status === 'completed');
    const hasSchema = tasks.some(t => t.taskType === 'inject_schema' && t.status === 'completed');
    const hasIndexing = tasks.some(t => t.taskType === 'ping_indexing' && t.status === 'completed');

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {/* Backend Connection */}
            <Card className={cn("border-l-4", isRegistered ? "border-l-green-500" : "border-l-yellow-500")}>
                <CardContent className="pt-6">
                    <div className="flex items-center space-x-4">
                        <div className={cn("p-2 rounded-full", isRegistered ? "bg-green-100" : "bg-yellow-100")}>
                            <Cloud className={cn("h-6 w-6", isRegistered ? "text-green-600" : "text-yellow-600")} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Backend Connection</p>
                            <h3 className="text-lg font-bold">{isRegistered ? 'Connected' : 'Not Connected'}</h3>
                            {isRegistered && siteId && (
                                <p className="text-xs text-muted-foreground">ID: {siteId.substring(0, 8)}...</p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* AI Summary Page */}
            <Card className={cn("border-l-4", hasAiSummary ? "border-l-green-500" : "border-l-blue-500")}>
                <CardContent className="pt-6">
                    <div className="flex items-center space-x-4">
                        <div className={cn("p-2 rounded-full", hasAiSummary ? "bg-green-100" : "bg-blue-100")}>
                            <FileText className={cn("h-6 w-6", hasAiSummary ? "text-green-600" : "text-blue-600")} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">AI Summary Page</p>
                            <h3 className="text-lg font-bold">{hasAiSummary ? 'Active' : 'Pending'}</h3>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Schema Markup */}
            <Card className={cn("border-l-4", hasSchema ? "border-l-green-500" : "border-l-blue-500")}>
                <CardContent className="pt-6">
                    <div className="flex items-center space-x-4">
                        <div className={cn("p-2 rounded-full", hasSchema ? "bg-green-100" : "bg-blue-100")}>
                            <Database className={cn("h-6 w-6", hasSchema ? "text-green-600" : "text-blue-600")} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Schema Markup</p>
                            <h3 className="text-lg font-bold">{hasSchema ? 'Enabled' : 'Pending'}</h3>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Search Indexing */}
            <Card className={cn("border-l-4", hasIndexing ? "border-l-green-500" : "border-l-blue-500")}>
                <CardContent className="pt-6">
                    <div className="flex items-center space-x-4">
                        <div className={cn("p-2 rounded-full", hasIndexing ? "bg-green-100" : "bg-blue-100")}>
                            <Globe className={cn("h-6 w-6", hasIndexing ? "text-green-600" : "text-blue-600")} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Search Indexing</p>
                            <h3 className="text-lg font-bold">{hasIndexing ? 'Pinged' : 'Pending'}</h3>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
