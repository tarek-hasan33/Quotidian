import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useSavedQuotes } from "../hooks/useSavedQuotes";
import { supabase } from "../lib/supabase";

const formatMemberSince = (dateString) => {
  if (!dateString) return "";
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

  // ── Auth / session state ──────────────────────────────────────────
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  // ── Profile / display name state ─────────────────────────────────
  const [profileName, setProfileName] = useState(null); // null = not yet loaded
  const [isEditingName, setIsEditingName] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [isSavingName, setIsSavingName] = useState(false);
  const [nameSaved, setNameSaved] = useState(false);
  const [nameError, setNameError] = useState(null);
  const inputRef = useRef(null);
  const nameSavedTimerRef = useRef(null);

  const memberSince = formatMemberSince(user?.created_at);

  // Fetch display_name from profiles table on mount
  useEffect(() => {
    if (!user?.id) return;

    const fetchProfile = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("display_name")
        .eq("id", user.id)
        .single();

      setProfileName(data?.display_name ?? "");
    };

    fetchProfile();
  }, [user?.id]);

  // Focus input when edit mode opens
  useEffect(() => {
    if (isEditingName) {
      inputRef.current?.focus();
    }
  }, [isEditingName]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (nameSavedTimerRef.current) clearTimeout(nameSavedTimerRef.current);
    };
  }, []);

  const handleStartEdit = () => {
    setEditValue(profileName ?? "");
    setNameError(null);
    setIsEditingName(true);
  };

  const handleCancelEdit = () => {
    setIsEditingName(false);
    setNameError(null);
  };

  const handleSaveName = async () => {
    if (isSavingName) return;
    setIsSavingName(true);
    setNameError(null);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ display_name: editValue.trim(), updated_at: new Date().toISOString() })
        .eq("id", user.id);

      if (error) throw error;

      setProfileName(editValue.trim());
      setIsEditingName(false);
      setNameSaved(true);
      nameSavedTimerRef.current = setTimeout(() => setNameSaved(false), 2000);
    } catch (err) {
      setNameError(err?.message ?? "Failed to update name.");
    } finally {
      setIsSavingName(false);
    }
  };

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
      await signOut();
      navigate("/", { replace: true });
    } catch (err) {
      setDeleteError(err?.message ?? "Failed to delete account. Please try again.");
      setIsDeletingAccount(false);
    }
  };

  // Derived display values
  const shownName = profileName || null;
  const avatarInitial =
    (profileName || user?.email || "?").charAt(0).toUpperCase();

  return (
    <div className="w-full overflow-x-hidden min-h-[calc(100vh-60px)] bg-neutral-50 px-4 py-10">
      <div className="mx-auto w-full max-w-2xl space-y-4">

        {/* ── Main profile card ── */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">

          {/* Avatar + info */}
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-white text-base font-semibold text-neutral-800 ring-2 ring-neutral-200 ring-offset-2">
              {avatarInitial}
            </div>

            <div className="min-w-0 flex-1">
              {/* Display name row */}
              {isEditingName ? (
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSaveName();
                      if (e.key === "Escape") handleCancelEdit();
                    }}
                    className="h-8 flex-1 rounded-lg border border-neutral-200 px-3 text-sm text-neutral-800 focus:border-neutral-400 focus:outline-none min-w-0"
                    placeholder="Your display name"
                    disabled={isSavingName}
                  />
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={handleSaveName}
                      disabled={isSavingName}
                      className="rounded-lg bg-neutral-900 px-3 py-1 text-xs font-medium text-white hover:bg-neutral-800 disabled:opacity-60"
                    >
                      {isSavingName ? "Saving…" : "Save"}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      disabled={isSavingName}
                      className="rounded-lg border border-neutral-200 px-3 py-1 text-xs font-medium text-neutral-600 hover:bg-neutral-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-2">
                  {shownName ? (
                    <p className="text-lg font-semibold text-neutral-900">
                      {shownName}
                    </p>
                  ) : (
                    <p className="text-lg italic text-neutral-400">
                      No name set
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={handleStartEdit}
                    className="rounded-md border border-neutral-200 px-2 py-0.5 text-xs font-medium text-neutral-500 hover:bg-neutral-50 hover:text-neutral-700"
                  >
                    Edit name
                  </button>
                  {nameSaved && (
                    <span className="text-xs text-emerald-600">Name updated!</span>
                  )}
                </div>
              )}

              {nameError && (
                <p className="mt-1 text-xs text-rose-600">{nameError}</p>
              )}

              {/* Email */}
              {user?.email && (
                <p className="mt-0.5 text-sm text-neutral-500">{user.email}</p>
              )}

              {/* Member since */}
              {memberSince && (
                <p className="mt-0.5 text-xs text-neutral-400">
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

        {/* ── Danger zone card ── */}
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
