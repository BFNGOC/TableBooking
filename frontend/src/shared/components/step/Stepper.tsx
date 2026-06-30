'use client';

import clsx from 'clsx';
import { Check } from 'lucide-react';
import type { ReactNode } from 'react';

export interface Step {
    title: string;
    description?: string;
    content?: ReactNode;
    icon?: ReactNode;
}

interface StepperProps {
    steps: Step[];
    currentStep: number;
    onStepChange?: (step: number) => void;
    clickable?: boolean;
    circleSize?: 'sm' | 'md' | 'lg';
    lineColor?: string;
    activeColor?: string;
    completedColor?: string;
    pendingColor?: string;
}

const sizeConfig = {
    sm: {
        circle: 'w-8 h-8',
        fontSize: 'text-xs',
        titleSize: 'text-xs',
        lineHeight: 'h-0.5',
        iconSize: 14,
    },
    md: {
        circle: 'w-10 h-10',
        fontSize: 'text-sm',
        titleSize: 'text-sm',
        lineHeight: 'h-1',
        iconSize: 18,
    },
    lg: {
        circle: 'w-12 h-12',
        fontSize: 'text-base',
        titleSize: 'text-base',
        lineHeight: 'h-1.5',
        iconSize: 24,
    },
};

export default function Stepper({
    steps,
    currentStep,
    onStepChange,
    clickable = false,
    circleSize = 'md',
    lineColor = 'bg-gray-300',
    activeColor = 'border-blue-500 text-blue-500',
    completedColor = 'bg-blue-500 text-white',
    pendingColor = 'border-gray-300 text-gray-400',
}: StepperProps) {
    const progressPercent = steps.length <= 1 ? 0 : (currentStep / (steps.length - 1)) * 100;
    const size = sizeConfig[circleSize];

    return (
        <div className="w-full">
            {/* STEPPER HEADER */}
            <div className="relative mb-6">
                {/* Background line - nền xám */}
                <div
                    className={`absolute left-0 top-1/4 -translate-y-1/2 w-full ${lineColor} transition-all duration-300`}
                    style={{
                        height: `${sizeConfig[circleSize].lineHeight === 'h-0.5' ? '2px' : sizeConfig[circleSize].lineHeight === 'h-1' ? '4px' : '6px'}`,
                    }}
                />

                {/* Progress line - xanh dần (đã hoàn thành) */}
                <div
                    className={`absolute left-0 top-1/4 -translate-y-1/2 bg-blue-500 transition-all duration-500`}
                    style={{
                        width: `${progressPercent}%`,
                        height: `${sizeConfig[circleSize].lineHeight === 'h-0.5' ? '2px' : sizeConfig[circleSize].lineHeight === 'h-1' ? '4px' : '6px'}`,
                    }}
                />

                {/* STEPS CIRCLES */}
                <div className="relative flex justify-between px-0">
                    {steps.map((step, index) => {
                        const completed = index < currentStep;
                        const active = index === currentStep;
                        const pending = index > currentStep;

                        return (
                            <div
                                key={index}
                                className={clsx(
                                    'flex flex-col items-center',
                                    clickable && 'cursor-pointer'
                                )}
                                onClick={() => {
                                    if (clickable && onStepChange) {
                                        onStepChange(index);
                                    }
                                }}
                            >
                                {/* CIRCLE */}
                                <div
                                    className={clsx(
                                        'flex items-center justify-center rounded-full border-2 font-bold transition-all duration-300 z-10 relative',
                                        size.circle,
                                        completed && `${completedColor} border-0`,
                                        active && `${activeColor} ring-2 ring-blue-300 bg-white`,
                                        pending && `${pendingColor} bg-white`
                                    )}
                                >
                                    {completed ? (
                                        <Check
                                            size={size.iconSize + 2}
                                            className="text-white font-bold"
                                            strokeWidth={4}
                                        />
                                    ) : step.icon ? (
                                        step.icon
                                    ) : (
                                        <span className={size.fontSize}>{index + 1}</span>
                                    )}
                                </div>

                                {/* TEXT BELOW CIRCLE */}
                                <div className="mt-3 text-center">
                                    <p
                                        className={clsx(
                                            'font-semibold transition-all duration-300',
                                            size.titleSize,
                                            completed && 'text-blue-600',
                                            active && 'text-blue-600 font-bold',
                                            pending && 'text-gray-400'
                                        )}
                                    >
                                        {step.title}
                                    </p>

                                    {step.description && (
                                        <p
                                            className={clsx(
                                                'text-xs mt-1 transition-all duration-300',
                                                completed && 'text-gray-600',
                                                active && 'text-gray-700',
                                                pending && 'text-gray-400'
                                            )}
                                        >
                                            {step.description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* CONTENT */}
            {steps[currentStep]?.content && (
                <div className="mb-2">{steps[currentStep].content}</div>
            )}
        </div>
    );
}
