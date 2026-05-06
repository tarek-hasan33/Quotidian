export const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-neutral-900/40 sm:items-center sm:p-4">
      <button
        type="button"
        className="absolute inset-0"
        aria-label="Close modal"
        onClick={onClose}
      />
      <div className="relative w-full max-w-2xl overflow-y-auto rounded-t-2xl bg-white p-6 shadow-xl sm:h-auto sm:max-h-[90vh] sm:rounded-2xl">
        {children}
      </div>
    </div>
  );
};
