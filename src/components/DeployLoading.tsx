import React, {useEffect, useState} from 'react';
import {AlertCircle, CheckCircle, Cloud, Loader} from 'lucide-react';

interface DeployLoadingProps {
    onComplete: () => void;
}

const DeployLoading: React.FC<DeployLoadingProps> = ({onComplete}) => {
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState<'deploying' | 'success' | 'error'>('deploying');
    const [timeRemaining, setTimeRemaining] = useState(120); // 2 minutes in seconds
    const [deployTriggered, setDeployTriggered] = useState(false);

    useEffect(() => {
        // Trigger deploy hook on component mount
        const triggerDeploy = async () => {
            try {
                const response = await fetch('https://api.render.com/deploy/srv-d0mtuue3jp1c738mf8e0?key=iYGo-4XRcVA', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    setDeployTriggered(true);
                    console.log('Deploy hook triggered successfully');
                } else {
                    console.error('Failed to trigger deploy hook');
                    setStatus('error');
                }
            } catch (error) {
                console.error('Error triggering deploy hook:', error);
                setStatus('error');
            }
        };

        triggerDeploy();
    }, []);

    useEffect(() => {
        if (!deployTriggered || status !== 'deploying') return;

        const interval = setInterval(() => {
            setTimeRemaining((prev) => {
                if (prev <= 1) {
                    setStatus('success');
                    clearInterval(interval);
                    setTimeout(() => {
                        onComplete();
                    }, 1000);
                    return 0;
                }
                return prev - 1;
            });

            // Update progress based on time remaining
            setProgress(((120 - timeRemaining) / 120) * 100);
        }, 1000);

        return () => clearInterval(interval);
    }, [deployTriggered, timeRemaining, onComplete, status]);

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const getStatusIcon = () => {
        switch (status) {
            case 'deploying':
                return <Loader className="w-8 h-8 animate-spin text-blue-500"/>;
            case 'success':
                return <CheckCircle className="w-8 h-8 text-green-500"/>;
            case 'error':
                return <AlertCircle className="w-8 h-8 text-red-500"/>;
        }
    };

    const getStatusMessage = () => {
        switch (status) {
            case 'deploying':
                return 'Waking up the server...';
            case 'success':
                return 'Server is ready!';
            case 'error':
                return 'Failed to wake up server';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full mb-4">
                        <Cloud className="w-8 h-8 text-white"/>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Hapo Cloud Technologies</h1>
                    <p className="text-gray-600 mt-2">Content Management System</p>
                </div>

                {/* Loading Card */}
                <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                    <div className="mb-6">
                        {getStatusIcon()}
                    </div>

                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        {getStatusMessage()}
                    </h2>

                    {status === 'deploying' && (
                        <>
                            <p className="text-gray-600 mb-6">
                                Please wait while we prepare your experience. This usually takes about 2 minutes.
                            </p>

                            {/* Progress Bar */}
                            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                                <div
                                    className="bg-blue-500 h-2 rounded-full transition-all duration-1000 ease-out"
                                    style={{width: `${progress}%`}}
                                />
                            </div>

                            {/* Time Remaining */}
                            <div className="text-sm text-gray-500 mb-4">
                                Time remaining: {formatTime(timeRemaining)}
                            </div>

                            {/* Loading Steps */}
                            <div className="text-left space-y-2 text-sm text-gray-600">
                                <div className="flex items-center">
                                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"/>
                                    Deploy hook triggered
                                </div>
                                <div className="flex items-center">
                                    <div
                                        className={`w-2 h-2 rounded-full mr-3 ${progress > 25 ? 'bg-green-500' : 'bg-gray-300'}`}/>
                                    Starting server instance
                                </div>
                                <div className="flex items-center">
                                    <div
                                        className={`w-2 h-2 rounded-full mr-3 ${progress > 50 ? 'bg-green-500' : 'bg-gray-300'}`}/>
                                    Loading application
                                </div>
                                <div className="flex items-center">
                                    <div
                                        className={`w-2 h-2 rounded-full mr-3 ${progress > 75 ? 'bg-green-500' : 'bg-gray-300'}`}/>
                                    Initializing database
                                </div>
                                <div className="flex items-center">
                                    <div
                                        className={`w-2 h-2 rounded-full mr-3 ${progress > 95 ? 'bg-green-500' : 'bg-gray-300'}`}/>
                                    Ready for connections
                                </div>
                            </div>
                        </>
                    )}

                    {status === 'success' && (
                        <p className="text-green-600 mb-4">
                            Server is now ready! Redirecting to sign in...
                        </p>
                    )}

                    {status === 'error' && (
                        <>
                            <p className="text-red-600 mb-4">
                                There was an issue waking up the server. You can still proceed to sign in.
                            </p>
                            <button
                                onClick={onComplete}
                                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                Continue to Sign In
                            </button>
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="text-center mt-8 text-sm text-gray-500">
                    <p>© 2025 Hapo Cloud Technologies. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
};

export default DeployLoading;