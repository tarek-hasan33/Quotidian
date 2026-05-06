import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "../lib/supabase";

export const ResetPassword = () => {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const redirectTimerRef = useRef(null);

  const passwordHasUppercase = /[A-Z]/.test(newPassword);
  const passwordHasSpecial = /[!@#$%^&*()_+\-=\[\]{}|;':",.<>?\\/]/.test(
    newPassword
  );
  const passwordHasMinLength = newPassword.length >= 8;
  const passwordStrength = !newPassword
    ? null
    : !passwordHasMinLength
    ? "weak"
    : passwordHasUppercase && passwordHasSpecial
    ? "strong"
    : "fair";

  useEffect(() => {
    return () => {
      if (redirectTimerRef.current) {
        clearTimeout(redirectTimerRef.current);
      }
    };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    if (!passwordHasMinLength || !passwordHasUppercase || !passwordHasSpecial) {
      setError(
        "Password must be at least 8 characters with one uppercase letter and one special character"
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        throw updateError;
      }

      setSuccess(true);
      setNewPassword("");
      setConfirmPassword("");
      redirectTimerRef.current = setTimeout(() => {
        navigate("/", { replace: true });
      }, 2000);
    } catch (authError) {
      setError(authError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full overflow-x-hidden flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-semibold text-neutral-900">
          Reset password
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          Choose a new password for your account.
        </p>

        {success && (
          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
            <p className="text-sm text-emerald-800">
              Password updated successfully!
            </p>
          </div>
        )}

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm font-medium text-neutral-700">
              New password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(event) => {
                  setNewPassword(event.target.value);
                  setError(null);
                }}
                className="mt-2 w-full rounded-lg border border-neutral-200 px-3 py-2 pr-10 text-sm text-neutral-700 focus:border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-200"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                onClick={() => setShowNewPassword((prev) => !prev)}
                aria-label={
                  showNewPassword ? "Hide new password" : "Show new password"
                }
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Eye className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
            </div>
            {passwordStrength && (
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
                        key={`reset-strength-bar-${index}`}
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
          </div>

          <div>
            <label className="text-sm font-medium text-neutral-700">
              Confirm password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(event) => {
                  setConfirmPassword(event.target.value);
                  setError(null);
                }}
                className="mt-2 w-full rounded-lg border border-neutral-200 px-3 py-2 pr-10 text-sm text-neutral-700 focus:border-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-200"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                aria-label={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Eye className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-500" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting || success}
            className="w-full rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Updating password…" : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
};
