export const MobileDrawer = ({ isOpen, onClose, children }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <button
        type="button"
        aria-label="Close menu"
        className="absolute inset-0 bg-neutral-900/30"
        onClick={onClose}
      />
      <div className="absolute right-0 top-0 h-full w-64 bg-white p-6 shadow-xl">
        {children}
      </div>
    </div>
  );
};
