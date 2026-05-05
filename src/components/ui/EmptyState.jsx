export const EmptyState = ({ title, description, actionLabel, actionHref }) => (
  <div className="flex flex-col items-center justify-center rounded-xl border border-neutral-200 bg-white px-6 py-10 text-center">
    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100">
      <svg
        viewBox="0 0 24 24"
        className="h-6 w-6 text-neutral-400"
        aria-hidden="true"
      >
        <path
          d="M5 4h10l4 4v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          d="M9 12h6M9 16h6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
    <h3 className="mt-4 text-lg font-medium text-neutral-700">{title}</h3>
    <p className="mt-2 text-sm text-neutral-400">{description}</p>
    {actionLabel && actionHref && (
      <a
        href={actionHref}
        className="mt-4 text-sm font-medium text-primary-600 hover:text-primary-700"
      >
        {actionLabel}
      </a>
    )}
  </div>
);
