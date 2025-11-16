'use client'

import { useState, useEffect } from 'react';
import { Dumbbell, Activity, Heart, ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';
import * as Progress from '@radix-ui/react-progress';
import { BottomNav } from '@/components/navigation/bottom-nav';
import { AmbientBackground } from '@/components/layout/ambient-background';

type WorkoutPlan = {
    id: string;
    name: string;
    description: string;
    recommendedFor: string;
    icon: React.ComponentType<{ className?: string }>;
    expectedStats: {
        strengthGain: string;
        enduranceGain: string;
        muscleGain: string;
        benchPress: string;
        squat: string;
        deadlift: string;
        focusAreas: string[];
    };
};

type StatItemProps = {
    title: string;
    value: string;
    description: string;
};

function StatItem({ title, value, description }: StatItemProps) {
    return (
        <div className="p-4 border rounded-lg bg-card">
            <div className="flex justify-between items-center">
                <h3 className="font-medium">{title}</h3>
                <span className="text-lg font-bold text-primary">{value}</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
    );
}

export default function SimulatePage() {
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
    const [duration, setDuration] = useState<number>(4);
    const [showResults, setShowResults] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [progress, setProgress] = useState(0);

    // Add this utility function at the top of your file, right after the imports
    function easeOutCubic(t: number): number {
        return 1 - Math.pow(1 - t, 3);
    }

// Then modify your useEffect to use the easing function
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isLoading) {
            const duration = 3000; // 3 seconds
            const startTime = Date.now();
            
            interval = setInterval(() => {
                const elapsed = Date.now() - startTime;
                const progressRatio = Math.min(elapsed / duration, 1);
                const easedProgress = easeOutCubic(progressRatio) * 100;
                
                setProgress(easedProgress);
                
                if (progressRatio >= 1) {
                    clearInterval(interval);
                    setTimeout(() => setIsLoading(false), 100);
                }
            }, 16); 
        }
        return () => clearInterval(interval);
    }, [isLoading]);

    const workoutPlans: WorkoutPlan[] = [
        {
            id: 'push-pull-legs',
            name: 'Push, Pull, Legs',
            description: 'Split focusing on pushing, pulling, and leg movements',
            recommendedFor: 'Recommended for guys',
            icon: Dumbbell,
            expectedStats: {
                strengthGain: '120%',
                enduranceGain: '60%',
                muscleGain: '8-12 lbs',
                benchPress: '225 lbs',
                squat: '275 lbs',
                deadlift: '315 lbs',
                focusAreas: ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms']
            }
        },
        {
            id: 'full-body',
            name: 'Full Body',
            description: 'Balanced full body workout',
            recommendedFor: 'Balanced approach',
            icon: Activity,
            expectedStats: {
                strengthGain: '70%',
                enduranceGain: '120%',
                muscleGain: '5-8 lbs',
                benchPress: '185 lbs',
                squat: '225 lbs',
                deadlift: '265 lbs',
                focusAreas: ['Full Body', 'Core', 'Functional Movement']
            }
        },
        {
            id: 'lower-focus',
            name: 'Lower Focus',
            description: 'Emphasis on lower body development',
            recommendedFor: 'Recommended for girls',
            icon: Heart,
            expectedStats: {
                strengthGain: '90%',
                enduranceGain: '60%',
                muscleGain: '6-10 lbs',
                benchPress: '185 lbs',
                squat: '275 lbs',
                deadlift: '355 lbs',
                focusAreas: ['Glutes', 'Quads', 'Hamstrings', 'Calves']
            }
        },
    ];

    const handleStartSimulation = () => {
        if (selectedPlan) {
            setIsLoading(true);
            setProgress(0);
            setShowResults(true);
        }
    };

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isLoading) {
            const duration = 3000; // 3 seconds
            const intervalTime = 50; // Update every 50ms
            const increment = (intervalTime / duration) * 100;
            
            interval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        setTimeout(() => setIsLoading(false), 100);
                        return 100;
                    }
                    return prev + increment;
                });
            }, intervalTime);
        }
        return () => clearInterval(interval);
    }, [isLoading]);

    const resetSimulation = () => {
        setShowResults(false);
        setSelectedPlan(null);
    };

    if (showResults && selectedPlan) {
        const plan = workoutPlans.find(p => p.id === selectedPlan);
        if (!plan) return null;

        return (
            <div className="container mx-auto px-4 py-8 max-w-3xl">
                {isLoading ? (
                    <div className="text-center space-y-6 py-12">
                        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
                        <h2 className="text-2xl font-semibold">Simulating your results...</h2>
                        <div className="w-full max-w-md mx-auto">
                            <Progress.Root 
                                className="relative overflow-hidden bg-gray-200 rounded-full w-full h-2.5"
                                value={progress}
                            >
                                <Progress.Indicator
                                    className="bg-primary w-full h-full transition-transform duration-300 ease-out"
                                    style={{ transform: `translateX(-${100 - progress}%)` }}
                                />
                            </Progress.Root>
                            <p className="text-sm text-muted-foreground mt-2">
                                {Math.round(progress)}% complete
                            </p>
                        </div>
                    </div>
                ) : (
                    <>
                        <button 
                            onClick={resetSimulation}
                            className="flex items-center gap-2 text-primary mb-6 hover:underline"
                        >
                            <ArrowLeft size={16} /> Back to plans
                        </button>
                        
                        <div className="bg-card p-8 rounded-xl border">
                            <h1 className="text-3xl font-bold mb-2">Your {duration}-Months Projection</h1>
                            <p className="text-muted-foreground mb-8">Based on the {plan.name} plan</p>
                            
                            <div className="grid gap-6">
                                <div className="p-6 bg-primary/5 rounded-xl border border-primary/20">
                                    <h2 className="text-xl font-semibold mb-4">Expected Results</h2>
                                    <div className="grid gap-4">
                                        <StatItem 
                                            title="Strength Gain" 
                                            value={plan.expectedStats.strengthGain} 
                                            description="Increase in your 1RM for major lifts"
                                        />
                                        <StatItem 
                                            title="Muscle Gain" 
                                            value={plan.expectedStats.muscleGain} 
                                            description="Expected muscle mass increase"
                                        />
                                        <StatItem 
                                            title="Endurance" 
                                            value={plan.expectedStats.enduranceGain} 
                                            description="Improvement in workout endurance"
                                        />
                                        <StatItem 
                                            title="Bench Press" 
                                            value={plan.expectedStats.benchPress} 
                                            description="Expected bench press increase"
                                        />
                                        <StatItem 
                                            title="Squat" 
                                            value={plan.expectedStats.squat} 
                                            description="Expected squat increase"
                                        />
                                        <StatItem 
                                            title="Deadlift" 
                                            value={plan.expectedStats.deadlift} 
                                            description="Expected deadlift increase"
                                        />
                                    </div>
                                </div>

                                <div className="p-6 bg-card rounded-xl border">
                                    <h3 className="font-medium mb-3">Focus Areas</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {plan.expectedStats.focusAreas.map((area) => (
                                            <span key={area} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm bg-primary/10 text-primary rounded-full">
                                                <CheckCircle className="h-3.5 w-3.5" />
                                                {area}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    onClick={resetSimulation}
                                    className="mt-4 w-full bg-primary text-primary-foreground py-3 px-4 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                                >
                                    Try Another Plan
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        );
    }

    return (
        <AmbientBackground className="pb-24">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-2">Workout Simulation</h1>
                <p className="text-muted-foreground mb-8">Select a plan and duration to see your potential results</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {workoutPlans.map((plan) => {
                    const Icon = plan.icon;
                    const isSelected = selectedPlan === plan.id;

                    return (
                        <div
                            key={plan.id}
                            onClick={() => setSelectedPlan(plan.id)}
                            className={`rounded-xl p-6 border-2 cursor-pointer transition-all ${
                                isSelected
                                    ? 'border-primary bg-primary/10'
                                    : 'border-gray-200 hover:border-primary/50 hover:bg-primary/5'
                            }`}
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                    <Icon className="h-6 w-6" />
                                </div>
                                <h2 className="text-xl font-semibold">{plan.name}</h2>
                            </div>
                            <p className="text-muted-foreground mb-2">{plan.description}</p>
                            <span className="text-sm text-primary font-medium">
                                {plan.recommendedFor}
                            </span>
                        </div>
                    );
                })}
            </div>

            {selectedPlan && (
                <div className="max-w-md mx-auto bg-card p-6 rounded-xl border">
                    <h3 className="font-medium mb-4">Simulation Duration</h3>
                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                            <label htmlFor="duration" className="text-sm font-medium">
                                Months: <span className="font-bold">{duration}</span>
                            </label>
                            <span className="text-xs text-muted-foreground">
                                {duration} {duration === 1 ? 'month' : 'months'}
                            </span>
                        </div>
                        <input
                            type="range"
                            id="duration"
                            min="1"
                            max="36"
                            step="1"
                            value={duration}
                            onChange={(e) => setDuration(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                        />
                    </div>

                    <button
                        onClick={handleStartSimulation}
                        className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                    >
                        Simulate Results
                    </button>
                </div>
            )}
        </div>
        <BottomNav />
        </AmbientBackground>
    );
}