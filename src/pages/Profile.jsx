import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useSavedQuotes } from "../hooks/useSavedQuotes";
import { supabase } from "../lib/supabase";

const getInitial = (user) => {
  const name = user?.user_metadata?.display_name || user?.email || "";
  return name ? name.charAt(0).toUpperCase() : "?";
};

const formatMemberSince = (dateString) => {
  if (!dateString) {
    return "";
  }

  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};

export const Profile = () => {
  const { user, signOut } = useAuth();
  const { savedQuotes } = useSavedQuotes();
  const navigate = useNavigate();

  const [isSigningOut, setIsSigningOut] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const displayName = user?.user_metadata?.display_name || user?.email || "";
  const memberSince = formatMemberSince(user?.created_at);
  const avatarInitial = getInitial(user);

  const handleSignOut = async () => {
    if (isSigningOut) return;
    setIsSigningOut(true);
    try {
      await signOut();
    } finally {
      setIsSigningOut(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (isDeletingAccount) return;
    setIsDeletingAccount(true);
    setDeleteError(null);

    try {
      const { error } = await supabase.functions.invoke("delete-account");
      if (error) throw error;

      // Sign out after successful deletion
      await signOut();
      navigate("/", { replace: true });
    } catch (err) {
      setDeleteError(err?.message ?? "Failed to delete account. Please try again.");
      setIsDeletingAccount(false);
    }
  };

  return (
    <div className="w-full overflow-x-hidden min-h-[calc(100vh-60px)] bg-neutral-50 px-4 py-10">
      <div className="mx-auto w-full max-w-2xl space-y-4">

        {/* Main profile card */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
          <div className="flex items-center gap-4">
            {/* Avatar with ring outline */}
            <div
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-base font-semibold text-neutral-800 ring-2 ring-neutral-200 ring-offset-2"
            >
              {avatarInitial}
            </div>
            <div>
              <p className="text-lg font-semibold text-neutral-900">
                {displayName}
              </p>
              {memberSince && (
                <p className="text-sm text-neutral-500">
                  Member since {memberSince}
                </p>
              )}
            </div>
          </div>

          {/* Saved quotes stat */}
          <div className="mt-6 rounded-xl border border-neutral-200 bg-neutral-50 p-5">
            <p className="text-sm text-neutral-600">Saved quotes</p>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-3xl font-semibold text-neutral-900">
                {savedQuotes.length}
              </span>
              <Link
                to="/favourites"
                className="text-sm font-medium text-neutral-700 underline-offset-2 hover:underline"
              >
                View favourites
              </Link>
            </div>
          </div>

          <p className="mt-6 text-sm text-neutral-600">
            Your quote of the day is waiting on the home page.{" "}
            <Link
              to="/"
              className="font-medium text-neutral-800 underline-offset-2 hover:underline"
            >
              Go home
            </Link>
          </p>

          {/* Sign out */}
          <div className="mt-8 flex justify-end">
            <button
              type="button"
              className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:border-neutral-300 hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-60"
              onClick={handleSignOut}
              disabled={isSigningOut}
            >
              {isSigningOut ? "Signing out..." : "Sign out"}
            </button>
          </div>
        </div>

        {/* Danger zone card */}
        <div className="rounded-2xl border border-red-100 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-widest text-red-400">
            Danger zone
          </p>

          {!showDeleteConfirm ? (
            <div className="mt-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-800">Delete account</p>
                <p className="mt-0.5 text-xs text-neutral-500">
                  Permanently removes your account and all saved quotes.
                </p>
              </div>
              <button
                type="button"
                className="ml-4 shrink-0 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 hover:border-red-300"
                onClick={() => setShowDeleteConfirm(true)}
              >
                Delete account
              </button>
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              <p className="text-sm text-neutral-700">
                Are you sure? This action is{" "}
                <span className="font-semibold">permanent</span> and cannot be
                undone. All your saved quotes will be lost.
              </p>

              {deleteError && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">
                  {deleteError}
                </p>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  className="flex-1 rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 disabled:opacity-60"
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeleteError(null);
                  }}
                  disabled={isDeletingAccount}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                  onClick={handleDeleteAccount}
                  disabled={isDeletingAccount}
                >
                  {isDeletingAccount ? "Deleting..." : "Yes, delete my account"}
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
