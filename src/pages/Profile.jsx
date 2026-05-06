import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useSavedQuotes } from "../hooks/useSavedQuotes";

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
  const [isSigningOut, setIsSigningOut] = useState(false);

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

  return (
    <div className="min-h-[calc(100vh-60px)] bg-neutral-50 px-4 py-10">
      <div className="mx-auto w-full max-w-2xl">
        <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-100 text-lg font-semibold text-primary-700">
              {avatarInitial}
            </div>
            <div>
              <p className="text-lg font-semibold text-neutral-900">
                {displayName}
              </p>
              {memberSince && (
                <p className="text-sm text-neutral-600">
                  Member since {memberSince}
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-neutral-200 bg-neutral-50 p-5">
            <p className="text-sm text-neutral-600">Saved quotes</p>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-3xl font-semibold text-neutral-900">
                {savedQuotes.length}
              </span>
              <Link
                to="/favourites"
                className="text-sm font-medium text-primary-600 hover:text-primary-700"
              >
                View favourites
              </Link>
            </div>
          </div>

          <p className="mt-6 text-sm text-neutral-600">
            Your quote of the day is waiting on the home page.{" "}
            <Link
              to="/"
              className="font-medium text-primary-600 hover:text-primary-700"
            >
              Go home
            </Link>
          </p>

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
      </div>
    </div>
  );
};
