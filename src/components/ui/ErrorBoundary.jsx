import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center p-8 bg-slate-900/50 border border-red-500/20 rounded-xl text-center min-h-[300px]">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
          <p className="text-slate-400 mb-6 max-w-sm">
            We couldn't load this component. Please try refreshing the page.
          </p>
          <Button 
            onClick={() => window.location.reload()}
            variant="outline"
            className="border-red-500/50 text-red-500 hover:bg-red-500/10"
          >
            Reload Page
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;