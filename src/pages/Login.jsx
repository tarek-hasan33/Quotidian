import { useEffect, useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../hooks/useAuth";

export const Login = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [forgotPasswordError, setForgotPasswordError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [signUpEmail, setSignUpEmail] = useState(null); // success banner
  const [resetSent, setResetSent] = useState(false);
  const forgotTimerRef = useRef(null);

  const passwordHasUppercase = /[A-Z]/.test(password);
  const passwordHasSpecial = /[!@#$%^&*()_+\-=\[\]{}|;':",.<>?\\/]/.test(
    password
  );
  const passwordHasMinLength = password.length >= 8;
  const passwordStrength = !password
    ? null
    : !passwordHasMinLength
    ? "weak"
    : passwordHasUppercase && passwordHasSpecial
    ? "strong"
    : "fair";

  if (user) {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    return () => {
      if (forgotTimerRef.current) {
        clearTimeout(forgotTimerRef.current);
      }
    };
  }, []);

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
    setForgotPasswordError(null);
    setPasswordError(null);

    if (isForgotPassword) {
      setIsSubmitting(true);

      try {
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(
          email,
          {
            redirectTo: `${window.location.origin}/reset-password`,
          }
        );

        if (resetError) {
          throw resetError;
        }

        setResetSent(true);
        setEmail("");
        forgotTimerRef.current = setTimeout(() => {
          setIsForgotPassword(false);
          setResetSent(false);
        }, 3000);
      } catch (authError) {
        setForgotPasswordError(authError.message);
      } finally {
        setIsSubmitting(false);
      }

      return;
    }

    if (isSignUp) {
      if (
        !passwordHasMinLength ||
        !passwordHasUppercase ||
        !passwordHasSpecial
      ) {
        setPasswordError(
          "Password must be at least 8 characters with one uppercase letter and one special character"
        );
        return;
      }
    }

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

        // Show confirmation banner, switch to sign-in, clear fields
        setSignUpEmail(email);
        setIsSignUp(false);
        setDisplayName("");
        setEmail("");
        setPassword("");
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          setError(signInError.message);
        } else {
          navigate("/");
        }
      }
    } catch (authError) {
      setError(authError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full overflow-x-hidden flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
        {/* ── Sign-up success banner ── */}
        {signUpEmail && (
          <div className="mb-6 flex gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
            <span className="mt-0.5 text-lg leading-none" aria-hidden="true">
              📬
            </span>
            <p className="text-sm text-emerald-800">
              <span className="font-semibold">Check your email!</span> We sent a
              confirmation link to{" "}
              <span className="font-medium">{signUpEmail}</span>. Click the link
              to activate your account, then sign in below.
            </p>
          </div>
        )}

        {resetSent && (
          <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
            <p className="text-sm text-emerald-800">
              <span className="font-semibold">Password reset link sent!</span>{" "}
              Check your email and click the link to reset your password.
            </p>
          </div>
        )}

        {isForgotPassword && (
          <button
            type="button"
            onClick={() => {
              setIsForgotPassword(false);
              setForgotPasswordError(null);
            }}
            className="mb-3 text-sm font-medium text-neutral-600 hover:text-neutral-800"
          >
            ← Back to sign in
          </button>
        )}

        <h1 className="text-2xl font-semibold text-neutral-900">
          Welcome to Quotidian
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          {isForgotPassword
            ? "Enter your email to receive a reset link"
            : "Sign in to save your favourite quotes"}
        </p>

        {!isForgotPassword && (
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
        )}

        {!isForgotPassword && (
          <div className="my-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-neutral-200" />
            <span className="text-xs uppercase tracking-widest text-neutral-400">
              or continue with email
            </span>
            <span className="h-px flex-1 bg-neutral-200" />
          </div>
        )}

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
          {!isForgotPassword && (
            <div>
              <label className="text-sm font-medium text-neutral-700">
                Password
              </label>
              {isSignUp ? (
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value);
                      setPasswordError(null);
                    }}
                    className="mt-2 w-full rounded-lg border border-neutral-200 px-3 py-2 pr-10 text-sm text-neutral-700 focus:border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-200"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <Eye className="h-4 w-4" aria-hidden="true" />
                    )}
                  </button>
                </div>
              ) : (
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="mt-2 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 focus:border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-200"
                  placeholder="••••••••"
                  required
                />
              )}
              {isSignUp && passwordStrength && (
                <div className="mt-2">
                  <div className="flex gap-1">
                    {Array.from({ length: 3 }).map((_, index) => {
                      const filledCount =
                        passwordStrength === "weak"
                          ? 1
                          : passwordStrength === "fair"
                          ? 2
                          : 3;
                      const isFilled = index < filledCount;
                      const colorClass =
                        passwordStrength === "weak"
                          ? "bg-red-400"
                          : passwordStrength === "fair"
                          ? "bg-amber-400"
                          : "bg-emerald-400";

                      return (
                        <span
                          key={`strength-bar-${index}`}
                          className={`h-1.5 w-8 rounded-full ${
                            isFilled ? colorClass : "bg-neutral-200"
                          }`}
                        />
                      );
                    })}
                  </div>
                  <p
                    className={`mt-1 text-xs ${
                      passwordStrength === "weak"
                        ? "text-red-400"
                        : passwordStrength === "fair"
                        ? "text-amber-400"
                        : "text-emerald-400"
                    }`}
                  >
                    {passwordStrength === "weak"
                      ? "Weak"
                      : passwordStrength === "fair"
                      ? "Fair"
                      : "Strong"}
                  </p>
                  <p className="mt-1 text-xs text-neutral-400">
                    Min 8 characters, one uppercase, one special character
                  </p>
                </div>
              )}
              {isSignUp && passwordError && (
                <p className="mt-1 text-xs text-red-500" role="alert">
                  {passwordError}
                </p>
              )}
              {!isSignUp && (
                <div className="mt-2 text-right">
                  <button
                    type="button"
                    className="text-xs text-primary-600 hover:text-primary-700"
                    onClick={() => {
                      setIsForgotPassword(true);
                      setError(null);
                      setForgotPasswordError(null);
                    }}
                  >
                    Forgot password?
                  </button>
                </div>
              )}
            </div>
          )}
          {isForgotPassword && forgotPasswordError && (
            <p className="text-xs text-red-500" role="alert">
              {forgotPasswordError}
            </p>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting
              ? isForgotPassword
                ? "Sending reset link…"
                : isSignUp
                ? "Creating account…"
                : "Signing in…"
              : isForgotPassword
              ? "Send Reset Link"
              : isSignUp
              ? "Create account"
              : "Sign in"}
          </button>
        </form>

        {error && (
          <p className="mt-4 text-sm text-rose-600" role="alert">
            {error}
          </p>
        )}

        {!isForgotPassword && (
          <button
            type="button"
            className="mt-6 w-full text-sm font-medium text-neutral-600 hover:text-neutral-800"
            onClick={() => {
              setIsSignUp((prev) => !prev);
              setError(null);
              setPasswordError(null);
              setSignUpEmail(null);
              setShowPassword(false);
            }}
          >
            {isSignUp
              ? "Already have an account? Sign in"
              : "Don't have an account? Sign up"}
          </button>
        )}
      </div>
    </div>
  );
};
