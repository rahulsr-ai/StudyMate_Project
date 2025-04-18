import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react'; // npm install lucide-react

const Toast = ({ message, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose?.(); // optional callback
    }, 500);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-32 right-5
     bg-gray-200 text-white px-4 py-2 rounded-xl shadow-lg flex items-center space-x-3 opacity-100 
     transition-opacity duration-300 ease-in-out z-50">
    <span className="text-sm">{message}</span>
    <button
      onClick={() => {
        setVisible(false);
        onClose?.();
      }}
      className="text-white hover:text-red-400"
    >
      <X size={18} />
    </button>
  </div>


  );
};

export default Toast;
