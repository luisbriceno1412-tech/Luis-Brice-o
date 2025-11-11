
import React from 'react';

interface DisplayProps {
  expression: string;
  result: string;
}

const Display: React.FC<DisplayProps> = ({ expression, result }) => {
  const resultFontSize = result.length > 10 ? 'text-3xl' : 'text-5xl';
  const expressionFontSize = expression.length > 20 ? 'text-base' : 'text-xl';

  return (
    <div className="bg-gray-900/50 rounded-lg p-4 text-right border-2 border-gray-700 mb-4 h-32 flex flex-col justify-between">
      <div className={`text-gray-400 break-all display-font transition-font-size duration-150 ${expressionFontSize}`}>
        {expression || ' '}
      </div>
      <div className={`text-white font-bold break-all display-font transition-font-size duration-150 ${resultFontSize}`}>
        {result}
      </div>
    </div>
  );
};

export default Display;
