import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { MobileDrawer } from "./MobileDrawer";

const navLinkClass = ({ isActive }) =>
  `text-sm font-medium transition-colors ${
    isActive ? "text-primary-600" : "text-neutral-600 hover:text-neutral-900"
  }`;

export const Navbar = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const displayName =
    user?.user_metadata?.full_name || user?.email || "Account";
  const avatarInitial = displayName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-50 h-[60px] border-b border-neutral-200 bg-white">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-4">
        <Link
          to="/"
          className="font-serif text-xl text-neutral-900"
          aria-label="Quotidian home"
        >
          Quotidian
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <NavLink to="/" className={navLinkClass} end>
            Home
          </NavLink>
          <NavLink to="/feed" className={navLinkClass}>
            Discover
          </NavLink>
          <NavLink to="/favourites" className={navLinkClass}>
            Favourites
          </NavLink>

          {user ? (
            <Link
              to="/profile"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 text-sm font-semibold text-neutral-700"
              aria-label="Profile"
            >
              {avatarInitial}
            </Link>
          ) : (
            <Link
              to="/login"
              className="rounded-lg border border-neutral-200 px-3 py-1.5 text-sm font-medium text-neutral-700 hover:text-neutral-900"
            >
              Login
            </Link>
          )}
        </nav>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 text-neutral-700 hover:bg-neutral-100 md:hidden"
          aria-label="Open menu"
          onClick={() => setIsOpen(true)}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
            <path
              d="M4 6h16M4 12h16M4 18h16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      <MobileDrawer isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="flex flex-col">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex min-h-[44px] items-center text-sm font-medium transition-colors ${
                isActive ? "text-primary-600" : "text-neutral-600 hover:text-neutral-900"
              }`
            }
            onClick={() => setIsOpen(false)}
            end
          >
            Home
          </NavLink>
          <NavLink
            to="/feed"
            className={({ isActive }) =>
              `flex min-h-[44px] items-center text-sm font-medium transition-colors ${
                isActive ? "text-primary-600" : "text-neutral-600 hover:text-neutral-900"
              }`
            }
            onClick={() => setIsOpen(false)}
          >
            Discover
          </NavLink>
          <NavLink
            to="/favourites"
            className={({ isActive }) =>
              `flex min-h-[44px] items-center text-sm font-medium transition-colors ${
                isActive ? "text-primary-600" : "text-neutral-600 hover:text-neutral-900"
              }`
            }
            onClick={() => setIsOpen(false)}
          >
            Favourites
          </NavLink>

          {user ? (
            <Link
              to="/profile"
              className="flex min-h-[44px] items-center text-sm font-medium text-neutral-700"
              onClick={() => setIsOpen(false)}
            >
              Profile
            </Link>
          ) : (
            <Link
              to="/login"
              className="flex min-h-[44px] items-center text-sm font-medium text-neutral-700"
              onClick={() => setIsOpen(false)}
            >
              Login
            </Link>
          )}
        </div>
      </MobileDrawer>
    </header>
  );
};
