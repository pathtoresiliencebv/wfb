
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProgressSectionProps {
    progress: number;
    phase: number;
    status: 'pending' | 'active' | 'completed';
    completedTasks: number;
    totalTasks: number;
    isRegistered: boolean;
}

const STEPS = [
    { label: 'Data Collection', phase: 1 },
    { label: 'AI Summary', phase: 2 },
    { label: 'Schema Markup', phase: 3 },
    { label: 'Search Indexing', phase: 4 },
    { label: 'Citations', phase: 5 },
    { label: 'Report', phase: 6 },
];

export const ProgressSection: React.FC<ProgressSectionProps> = ({
    progress, status, completedTasks, totalTasks, isRegistered
}) => {
    if (!isRegistered || status === 'pending') {
        return (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8 flex flex-col items-center text-center">
                <div className="bg-blue-100 p-3 rounded-full mb-4">
                    <span className="text-2xl">⏳</span>
                </div>
                <h2 className="text-xl font-bold text-blue-900 mb-2">Awaiting Activation</h2>
                <p className="text-blue-700 max-w-lg">
                    Register your site URL to begin looking for visibility optimization opportunities.
                    Our AI agents will scan your site and generate a report.
                </p>
            </div>
        );
    }

    // Determine current phase based on progress somewhat arbitrarily or if backend provided phase
    // Mapping purely for visual since backend phase might differ
    const currentStepIndex = Math.floor((progress / 100) * STEPS.length);

    return (
        <div className="bg-white border rounded-lg p-6 mb-8 shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-xl font-bold">SEO & AI Visibility Generation</h2>
                    <span className={cn(
                        "inline-block px-2 py-1 rounded-full text-xs font-semibold mt-1",
                        status === 'completed' ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                    )}>
                        {status === 'active' ? 'In Progress' : status === 'completed' ? 'Complete' : 'Pending'}
                    </span>
                </div>
                <div className="text-right">
                    <div className="text-3xl font-bold text-blue-600">{progress}%</div>
                    <div className="text-sm text-muted-foreground">{completedTasks} of {totalTasks} tasks completed</div>
                </div>
            </div>

            <Progress value={progress} className="h-3 mb-8" />

            <div className="relative flex justify-between">
                {/* Timeline Line */}
                <div className="absolute top-4 left-0 w-full h-0.5 bg-gray-200 -z-10" />

                {STEPS.map((step, index) => {
                    const isCompleted = index < currentStepIndex || (index === currentStepIndex && progress >= ((index + 1) / STEPS.length) * 100);
                    const isCurrent = index === currentStepIndex;

                    return (
                        <div key={index} className="flex flex-col items-center">
                            <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center border-2 bg-white transition-colors",
                                isCompleted ? "border-green-500 bg-green-500 text-white" :
                                    isCurrent ? "border-blue-500 text-blue-500" : "border-gray-300 text-gray-300"
                            )}>
                                {isCompleted ? <Check className="w-4 h-4" /> : <span className="text-xs font-bold">{index + 1}</span>}
                            </div>
                            <span className={cn(
                                "text-xs mt-2 font-medium",
                                isCompleted || isCurrent ? "text-gray-900" : "text-gray-400"
                            )}>
                                {step.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
