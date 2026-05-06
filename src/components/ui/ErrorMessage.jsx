export const ErrorMessage = ({
  title = "Something went wrong",
  description,
  actionLabel,
  onAction,
}) => (
  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
    <div className="font-medium">{title}</div>
    {description && <p className="mt-1 text-red-600">{description}</p>}
    {actionLabel && onAction && (
      <button
        type="button"
        className="mt-3 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-700"
        onClick={onAction}
      >
        {actionLabel}
      </button>
    )}
  </div>
);
