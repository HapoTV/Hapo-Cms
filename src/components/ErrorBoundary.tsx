// src/components/ErrorBoundary.tsx

import React, {Component, ErrorInfo} from 'react';
import {AlertTriangle, RefreshCw} from 'lucide-react';
import {useTheme} from '../contexts/ThemeContext';
import {Card} from './ui/Card';
import {Alert} from './ui/Alert';
import {Button} from './ui/Button';

// --- UI Component (Functional, can use hooks) ---

interface ErrorBoundaryUIProps {
    error: Error | null;
    onGoHome: () => void;
    onRetry: () => void;
}

const ErrorBoundaryUI: React.FC<ErrorBoundaryUIProps> = ({error, onGoHome, onRetry}) => {
    const {currentTheme} = useTheme();

    return (
        <div
            className="min-h-screen flex items-center justify-center p-4"
            style={{backgroundColor: currentTheme.colors.background.secondary}}
        >
            <Card elevated padding="lg" className="max-w-lg w-full">
                <div className="flex items-center gap-3 mb-4" style={{color: currentTheme.colors.status.error}}>
                    <AlertTriangle className="w-8 h-8"/>
                    <h2 className="text-xl font-semibold">Something went wrong</h2>
                </div>

                <Alert variant="error" title={error?.message || 'An unexpected error occurred'}>
                    {error?.stack && (
                        <pre className="mt-2 text-xs overflow-auto">
              {error.stack}
            </pre>
                    )}
                </Alert>

                <div className="flex justify-end gap-4 mt-6">
                    <Button variant="secondary" onClick={onGoHome}>
                        Go to Home
                    </Button>
                    <Button variant="primary" onClick={onRetry} leftIcon={<RefreshCw className="w-4 h-4"/>}>
                        Try Again
                    </Button>
                </div>
            </Card>
        </div>
    );
};


// --- Logic Component (Class, handles state and lifecycle) ---

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

    public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
      console.error("Uncaught error:", error, errorInfo);
  }

  private handleRetry = () => {
      // A safer way to retry is to reload the page.
      // Navigating can be complex if the error is in the routing logic itself.
    window.location.reload();
  };

  private handleGoHome = () => {
      // This is a safe way to navigate home
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
          <ErrorBoundaryUI
              error={this.state.error}
              onGoHome={this.handleGoHome}
              onRetry={this.handleRetry}
          />
      );
    }

    return this.props.children;
  }
}