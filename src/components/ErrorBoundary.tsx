import React, { Component, ErrorInfo } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  previousLocation: string;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    previousLocation: window.location.pathname
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
      previousLocation: window.location.pathname
    });
    
    // Log error to your error tracking service
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });

    // Navigate back to the previous route
    window.history.pushState(null, '', this.state.previousLocation);
    window.location.reload();
  };

  private handleGoHome = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <AlertTriangle className="w-8 h-8" />
              <h2 className="text-xl font-semibold">Something went wrong</h2>
            </div>
            
            <div className="bg-red-50 border border-red-100 rounded-lg p-4 mb-6">
              <p className="text-red-800 font-mono text-sm break-all">
                {this.state.error?.message || 'An unexpected error occurred'}
              </p>
              {this.state.error?.stack && (
                <pre className="mt-2 text-xs text-red-700 overflow-auto">
                  {this.state.error.stack}
                </pre>
              )}
            </div>

            <div className="flex justify-end gap-4">
              <button
                onClick={this.handleGoHome}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Go to Home
              </button>
              <button
                onClick={this.handleRetry}
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}