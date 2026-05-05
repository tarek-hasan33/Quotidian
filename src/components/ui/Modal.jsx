export const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/40 p-4">
      <button
        type="button"
        className="absolute inset-0"
        aria-label="Close modal"
        onClick={onClose}
      />
      <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
        {children}
      </div>
    </div>
  );
};
