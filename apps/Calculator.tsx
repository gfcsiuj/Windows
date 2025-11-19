import React, { useState } from 'react';
import { AppProps } from '../types';

export const CalculatorApp: React.FC<AppProps> = () => {
  const [display, setDisplay] = useState('0');
  
  const handleBtn = (val: string) => {
    if (val === 'C') setDisplay('0');
    else if (val === '=') {
      try {
        // eslint-disable-next-line no-eval
        setDisplay(String(eval(display)));
      } catch {
        setDisplay('Error');
      }
    } else if (val === '<') {
      setDisplay(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
    } else {
      setDisplay(prev => prev === '0' ? val : prev + val);
    }
  };

  const buttons = [
    'C', '%', '/', '<',
    '7', '8', '9', '*',
    '4', '5', '6', '-',
    '1', '2', '3', '+',
    '00', '0', '.', '='
  ];

  return (
    <div className="h-full bg-[#f3f3f3] p-1 flex flex-col">
      <div className="bg-white p-4 mb-1 text-right text-4xl font-semibold rounded h-24 flex items-end justify-end overflow-hidden break-all">
        {display}
      </div>
      <div className="grid grid-cols-4 gap-1 flex-1">
        {buttons.map(btn => (
          <button 
            key={btn}
            className={`bg-white hover:bg-gray-100 rounded font-bold text-lg transition active:scale-95
              ${btn === '=' ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}
            `}
            onClick={() => handleBtn(btn)}
          >
            {btn}
          </button>
        ))}
      </div>
    </div>
  );
};