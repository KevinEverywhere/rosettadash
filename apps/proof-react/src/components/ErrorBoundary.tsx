import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  label: string;
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error(`[${this.props.label}]`, error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <section className="da-panel da-error-panel" role="alert">
          <h2>Something went wrong</h2>
          <p>
            The <strong>{this.props.label}</strong> screen hit an error. Other tabs should still
            work.
          </p>
          <pre className="da-error-panel__trace">{this.state.error.message}</pre>
        </section>
      );
    }
    return this.props.children;
  }
}
