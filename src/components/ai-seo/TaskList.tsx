
import React from 'react';
import { CheckCircle, Circle, Clock, Loader2, PlayCircle } from 'lucide-react';
import { AISeoTask } from '@/lib/ai-service';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface TaskListProps {
    tasks: AISeoTask[];
}

const getTaskLabel = (type: string) => {
    const labels: Record<string, { name: string; desc: string }> = {
        'collect_data': { name: 'Data Collection', desc: 'Analyzing website content' },
        'generate_ai_summary': { name: 'AI Summary Gen', desc: 'Creating AI-optimized summary' },
        'create_ai_summary_page': { name: 'AI Summary Page', desc: 'Publishing discovery page' },
        'inject_schema': { name: 'Schema Markup', desc: 'Adding structured data' },
        'optimize_meta': { name: 'Meta Optimization', desc: 'Enhancing titles & descriptions' },
        'ping_indexing': { name: 'Search Ping', desc: 'Notifying Google & Bing' },
        'scan_performance_before': { name: 'Initial Scan', desc: 'Measuring baseline metrics' },
        'create_citation_notion': { name: 'Notion Citation', desc: 'Publishing on Notion' },
        // Add more mappings as needed from the PHP file...
    };

    return labels[type] || { name: type.replace(/_/g, ' '), desc: 'Processing...' };
};

export const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
    if (!tasks || tasks.length === 0) return null;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Optimization Tasks</CardTitle>
                <CardDescription>Real-time tracking of AI agents working on your site.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {tasks.map((task, idx) => {
                        const { name, desc } = getTaskLabel(task.taskType);
                        const isCompleted = task.status === 'completed';
                        const isRunning = task.status === 'running';
                        const isFailed = task.status === 'failed';

                        return (
                            <div
                                key={idx}
                                className={cn(
                                    "flex items-start p-3 rounded-lg border",
                                    isCompleted ? "bg-green-50/50 border-green-100" :
                                        isRunning ? "bg-blue-50/50 border-blue-100" :
                                            "bg-gray-50/50 border-gray-100"
                                )}
                            >
                                <div className="mt-1 mr-3">
                                    {isCompleted ? (
                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                    ) : isRunning ? (
                                        <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
                                    ) : isFailed ? (
                                        <Circle className="h-5 w-5 text-red-400" />
                                    ) : (
                                        <Clock className="h-5 w-5 text-gray-300" />
                                    )}
                                </div>
                                <div>
                                    <h4 className={cn("font-medium text-sm", isCompleted && "text-green-900", isRunning && "text-blue-900")}>
                                        {name}
                                    </h4>
                                    <p className="text-xs text-muted-foreground">{desc}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
};
