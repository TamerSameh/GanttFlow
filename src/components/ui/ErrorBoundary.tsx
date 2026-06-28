import { Component, type ReactNode, type ErrorInfo } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from './Button';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, _info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error);
  }

  handleRetry = () => {
    this.props.onReset?.();
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center" role="alert">
          <div className="flex size-16 items-center justify-center rounded-full bg-error-200 text-error-800 dark:bg-slate-800 dark:text-error-300 dark:ring-1 dark:ring-error-800/50">
            <AlertTriangle className="size-8" aria-hidden="true" />
          </div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50">
            Something went wrong
          </h3>
          <p className="max-w-sm text-sm text-slate-500 dark:text-slate-400">
            {this.state.error?.message ?? 'An unexpected error occurred. Please try again.'}
          </p>
          <div className="mt-2">
            <Button
              variant="secondary"
              onClick={this.handleRetry}
            >
              Try again
            </Button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
