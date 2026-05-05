export const ShareModal = ({ isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-neutral-800">Share</h2>
          <button
            type="button"
            className="rounded-md p-1 text-neutral-500 hover:bg-neutral-100"
            onClick={onClose}
            aria-label="Close share modal"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
              <path
                d="M6 6l12 12M18 6l-12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
        <p className="mt-3 text-sm text-neutral-500">
          Share options will be available soon.
        </p>
      </div>
    </div>
  );
};
