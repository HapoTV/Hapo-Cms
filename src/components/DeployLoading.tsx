import React, {useEffect, useState} from 'react';
import {CheckCircle, Cloud} from 'lucide-react';
import {Card, LoadingSpinner} from './ui';
import {useTheme} from '../contexts/ThemeContext';

interface DeployLoadingProps {
    onComplete: () => void;
}

export const DeployLoading: React.FC<DeployLoadingProps> = ({onComplete}) => {
    const {currentTheme} = useTheme();
    const [progress, setProgress] = useState(0);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);

    const steps = [
        {label: 'Initializing deployment...', duration: 2000},
        {label: 'Building application...', duration: 3000},
        {label: 'Optimizing assets...', duration: 2500},
        {label: 'Deploying to cloud...', duration: 3500},
        {label: 'Finalizing setup...', duration: 2000}
    ];

    const currentStep = steps[currentStepIndex];

    useEffect(() => {
        const totalDuration = steps.reduce((sum, step) => sum + step.duration, 0);
        let elapsed = 0;

        const interval = setInterval(() => {
            elapsed += 100;
            const newProgress = Math.min((elapsed / totalDuration) * 100, 100);
            setProgress(newProgress);

            // Update current step based on elapsed time
            let stepElapsed = 0;
            for (let i = 0; i < steps.length; i++) {
                stepElapsed += steps[i].duration;
                if (elapsed <= stepElapsed) {
                    setCurrentStepIndex(i);
                    break;
                }
            }

            if (elapsed >= totalDuration) {
                clearInterval(interval);
                setTimeout(onComplete, 500);
            }
        }, 100);

        return () => clearInterval(interval);
    }, [onComplete]);

    return (
        <div
            className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center p-4"
            style={{backgroundColor: currentTheme.colors.background.primary}}
        >
            <Card
                className="max-w-md w-full text-center backdrop-blur-lg bg-white/10 border-white/20"
                padding="xl"
                style={{backgroundColor: 'rgba(255, 255, 255, 0.1)'}}
            >
                <div className="flex justify-center mb-6">
                    <div
                        className="rounded-full p-4"
                        style={{backgroundColor: 'rgba(255, 255, 255, 0.2)'}}
                    >
                        <Cloud className="w-12 h-12 text-white"/>
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-white mb-2">
                    Deploying Your Site
                </h2>
                <p className="text-white/80 mb-8">
                    Please wait while we deploy your website to the cloud
                </p>

                <div className="flex items-center justify-center gap-3 mb-6">
                    <LoadingSpinner size="lg" style={{color: 'white'}}/>
                    <span className="text-white font-medium">
            {currentStep.label}
          </span>
                </div>

                <div className="w-full bg-white/20 rounded-full h-2 mb-4">
                    <div
                        className="bg-white rounded-full h-2 transition-all duration-300 ease-out"
                        style={{width: `${progress}%`}}
                    />
                </div>

                <div className="text-white/60 text-sm">
                    {Math.round(progress)}% complete
                    {progress === 100 && (
                        <div className="flex items-center justify-center gap-2 mt-2">
                            <CheckCircle className="w-4 h-4 text-green-400"/>
                            <span className="text-green-400">Deployment successful!</span>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};