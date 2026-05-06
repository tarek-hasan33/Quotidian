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
      <div className="relative mx-3 mb-3 w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-xl sm:mx-0 sm:mb-0 sm:h-auto sm:max-h-[90vh]">
        <div className="max-h-[85vh] overflow-y-auto p-6 sm:max-h-[90vh]">
          {children}
        </div>
      </div>
    </div>
  );
};
