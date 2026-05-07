import React from "react";
import { ErrorMessage } from "./ErrorMessage";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error("Unhandled error in React tree:", error, info);
  }

  handleRefresh = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[100vh] flex items-center justify-center bg-neutral-50 p-6">
          <div className="w-full max-w-lg">
            <div className="rounded-xl border border-neutral-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-neutral-900">
                Something went wrong. Please refresh the page.
              </h2>
              <p className="mt-2 text-sm text-neutral-500">
                If the problem persists, try clearing your cache or contact
                support.
              </p>
              <div className="mt-4">
                <button
                  type="button"
                  className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
                  onClick={this.handleRefresh}
                >
                  Refresh
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
