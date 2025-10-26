import React, { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(onClose, 500); // Wait for exit animation
    }, 4500);

    return () => clearTimeout(timer);
  }, [onClose]);

  const handleClose = () => {
    setExiting(true);
    setTimeout(onClose, 500);
  };

  return (
    <div 
        className={`bg-green-500 text-white font-bold py-3 px-5 rounded-lg shadow-lg flex items-center justify-between transition-all duration-500 ${exiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'}`}
        role="alert"
    >
      <span>{message}</span>
      <button onClick={handleClose} className="ml-4 text-xl font-semibold opacity-80 hover:opacity-100">&times;</button>
    </div>
  );
};

export default Toast;
