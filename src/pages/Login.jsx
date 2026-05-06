import { useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../hooks/useAuth";

export const Login = () => {
  const { user } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleOAuth = async (provider) => {
    setError(null);
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider,
    });
    if (authError) {
      setError(authError.message);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (isSignUp) {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              display_name: displayName,
            },
          },
        });

        if (signUpError) {
          throw signUpError;
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          throw signInError;
        }
      }
    } catch (authError) {
      setError(authError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-neutral-900">
          Welcome to Quotidian
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          Sign in to save your favourite quotes
        </p>

        <div className="mt-6 space-y-3">
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
            onClick={() => handleOAuth("google")}
          >
            <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden="true">
              <path
                fill="#FFC107"
                d="M43.6 20.5H42V20H24v8h11.3C33.6 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8.1 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z"
              />
              <path
                fill="#FF3D00"
                d="M6.3 14.7 12.9 19.5C14.7 15.1 18.9 12 24 12c3.1 0 5.9 1.2 8.1 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
              />
              <path
                fill="#4CAF50"
                d="M24 44c5.1 0 9.9-2 13.5-5.3l-6.2-5.3c-2 1.5-4.6 2.6-7.3 2.6-5.2 0-9.6-3.3-11.2-7.9l-6.6 5.1C9.7 39.7 16.3 44 24 44z"
              />
              <path
                fill="#1976D2"
                d="M43.6 20.5H42V20H24v8h11.3c-1 2.7-2.9 4.9-5.4 6.4l6.2 5.3C38.5 37.3 44 32.7 44 24c0-1.3-.1-2.3-.4-3.5z"
              />
            </svg>
            Continue with Google
          </button>
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#24292e] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#1f2428]"
            onClick={() => handleOAuth("github")}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
              <path
                fill="currentColor"
                d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"
              />
            </svg>
            Continue with GitHub
          </button>
        </div>

        <div className="my-6 flex items-center gap-3">
          <span className="h-px flex-1 bg-neutral-200" />
          <span className="text-xs uppercase tracking-widest text-neutral-400">
            or continue with email
          </span>
          <span className="h-px flex-1 bg-neutral-200" />
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {isSignUp && (
            <div>
              <label className="text-sm font-medium text-neutral-700">
                Display name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                className="mt-2 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 focus:border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-200"
                placeholder="Your name"
              />
            </div>
          )}
          <div>
            <label className="text-sm font-medium text-neutral-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 focus:border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-200"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-neutral-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 focus:border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-200"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSignUp ? "Create account" : "Sign in"}
          </button>
        </form>

        {error && (
          <p className="mt-4 text-sm text-rose-600" role="alert">
            {error}
          </p>
        )}

        <button
          type="button"
          className="mt-6 w-full text-sm font-medium text-neutral-600 hover:text-neutral-800"
          onClick={() => setIsSignUp((prev) => !prev)}
        >
          {isSignUp
            ? "Already have an account? Sign in"
            : "Don't have an account? Sign up"}
        </button>
      </div>
    </div>
  );
};
