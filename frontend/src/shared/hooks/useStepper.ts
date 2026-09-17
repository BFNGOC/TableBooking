import { useState } from 'react';

export function useStepper(defaultStep = 0) {
    const [currentStep, setCurrentStep] = useState(defaultStep);

    return {
        currentStep,

        next() {
            setCurrentStep((prev) => prev + 1);
        },

        previous() {
            setCurrentStep((prev) => Math.max(prev - 1, 0));
        },

        goTo(step: number) {
            setCurrentStep(step);
        },
    };
}
