
import React from 'react';

interface CalculatorButtonProps {
  label: string;
  onClick: () => void;
  className?: string;
}

const CalculatorButton: React.FC<CalculatorButtonProps> = ({ label, onClick, className = '' }) => {
  const baseClasses = "text-xl sm:text-2xl font-bold rounded-lg h-16 transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-indigo-400 flex items-center justify-center";
  
  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${className}`}
    >
      {label}
    </button>
  );
};

export default CalculatorButton;
