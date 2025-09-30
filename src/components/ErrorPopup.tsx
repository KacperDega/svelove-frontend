import React, { useEffect } from 'react';

interface PopupProps {
  error: string | null;
  showError: boolean;
  setShowError: React.Dispatch<React.SetStateAction<boolean>>;
}

const ErrorPopup: React.FC<PopupProps> = ({ error, showError, setShowError }) => {
  useEffect(() => {
    if (showError) {
      const timer = setTimeout(() => {
        setShowError(false);
      }, 6000);

      return () => clearTimeout(timer);
    }
  }, [showError, setShowError]);

  if (!error) return null;

  return (
      <div
        className={`fixed top-4 left-1/2 transform -translate-x-1/2 alert alert-error max-w-md mx-auto mt-8 z-50
                    transition-all duration-500 ease-in-out ${showError ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
      >
        <span>{error}</span>
      </div>
  );
};

export default ErrorPopup;
