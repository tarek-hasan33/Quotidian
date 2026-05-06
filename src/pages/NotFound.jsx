import { Link } from "react-router-dom";

export const NotFound = () => (
  <div className="w-full min-h-[calc(100vh-60px)] bg-neutral-50 flex items-center justify-center px-4 py-10">
    <div className="max-w-xl text-center">
      <div className="text-6xl font-serif text-primary-100">404</div>
      <h1 className="mt-4 text-2xl font-semibold text-neutral-800">
        Page not found
      </h1>
      <p className="mt-2 text-sm text-neutral-400">
        The page you're looking for doesn't exist.
      </p>
      <div className="mt-6">
        <Link
          to="/"
          className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700"
        >
          Go home
        </Link>
      </div>
    </div>
  </div>
);
