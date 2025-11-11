
import React, { useState, useEffect, useCallback } from 'react';
import CalculatorButton from './components/CalculatorButton';
import Display from './components/Display';

// Declare mathjs as a global object available from the CDN script
declare const math: any;

const App: React.FC = () => {
  const [expression, setExpression] = useState<string>('');
  const [result, setResult] = useState<string>('0');
  const [isRadians, setIsRadians] = useState<boolean>(true);

  const handleButtonClick = (value: string) => {
    if (result === 'Error') {
      setExpression('');
      setResult('0');
    }

    switch (value) {
      case '=':
        try {
          if (expression.trim() === '') {
            setResult('0');
            return;
          }
          const sanitizedExpression = expression
            .replace(/%/g, '/100')
            .replace(/π/g, 'pi')
            .replace(/e/g, 'e');
            
          const evalResult = math.evaluate(sanitizedExpression);
          setResult(String(evalResult));
        } catch (error) {
          setResult('Error');
        }
        break;
      case 'C':
        setExpression('');
        setResult('0');
        break;
      case 'CE':
        setExpression(prev => prev.slice(0, -1));
        break;
      case '±':
        setExpression(prev => {
            if (prev.startsWith('-')) {
                return prev.substring(1);
            }
            return `-${prev}`;
        });
        break;
      case 'sin':
      case 'cos':
      case 'tan':
      case 'asin':
      case 'acos':
      case 'atan':
      case 'log':
      case 'ln':
      case 'sqrt':
        setExpression(prev => `${prev}${value}(`);
        break;
      case 'x^y':
        setExpression(prev => `${prev}^`);
        break;
      case 'x!':
        setExpression(prev => `${prev}!`);
        break;
      case 'DEG':
      case 'RAD':
        setIsRadians(!isRadians);
        // Configure mathjs to use degrees or radians
        math.config({ number: 'BigNumber', precision: 64 });
        if (!isRadians) { // If it was degrees, switch to radians
            math.config({ unitSystem: 'rad' });
        } else { // If it was radians, switch to degrees
            math.config({ unitSystem: 'deg' });
        }
        break;
      default:
        setExpression(prev => prev + value);
        break;
    }
  };

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    const key = event.key;
    const validKeys = '0123456789.+-*/()^%'.split('');
    
    if (validKeys.includes(key)) {
      handleButtonClick(key);
    } else if (key === 'Enter' || key === '=') {
      event.preventDefault();
      handleButtonClick('=');
    } else if (key === 'Backspace') {
      handleButtonClick('CE');
    } else if (key.toLowerCase() === 'c') {
      handleButtonClick('C');
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  const buttonLayout = [
    ['sin', 'cos', 'tan', 'π', 'e'],
    ['asin', 'acos', 'atan', 'log', 'ln'],
    ['x^y', 'sqrt', 'x!', '(', ')'],
    ['C', 'CE', '%', '/'],
    ['7', '8', '9', '*'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['±', '0', '.', '=']
  ];

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto bg-gray-800 rounded-2xl shadow-lg p-6 border-4 border-indigo-500/50">
        <header className="mb-4">
          <h1 className="text-3xl font-bold text-indigo-400 text-center tracking-wider display-font">CECAL</h1>
          <p className="text-center text-gray-400 text-sm">Calculadora Científica</p>
        </header>

        <Display expression={expression} result={result} />
        
        <div className="grid grid-cols-5 gap-2 mt-4">
          <CalculatorButton 
            label={isRadians ? 'RAD' : 'DEG'} 
            onClick={() => handleButtonClick(isRadians ? 'RAD' : 'DEG')} 
            className="col-span-5 bg-gray-700 hover:bg-gray-600 text-indigo-300"
          />
          {buttonLayout.flat().map((btn) => {
            const isOperator = ['/', '*', '-', '+', '=', 'C', 'CE'].includes(btn);
            const isFunction = !isOperator && isNaN(Number(btn)) && btn !== '.';
            const isEqual = btn === '=';
            
            let btnClass = 'bg-gray-700 hover:bg-gray-600 text-white';
            if (isOperator) btnClass = 'bg-indigo-500 hover:bg-indigo-600 text-white';
            if (isFunction) btnClass = 'bg-gray-600 hover:bg-gray-500 text-indigo-300';
            if (isEqual) btnClass = 'col-span-2 bg-green-500 hover:bg-green-600 text-white';
            if (btn === 'C') btnClass = 'bg-red-500 hover:bg-red-600 text-white';

            return (
              <CalculatorButton
                key={btn}
                label={btn}
                onClick={() => handleButtonClick(btn)}
                className={btnClass}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default App;
