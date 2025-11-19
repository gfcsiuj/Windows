import React, { useState, useEffect } from 'react';
import { AppProps } from '../types';
import { RotateCw, Trophy } from 'lucide-react';

export const TicTacToe: React.FC<AppProps> = ({ isDark }) => {
  const [board, setBoard] = useState<string[]>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [winner, setWinner] = useState<string | null>(null);
  const [isDraw, setIsDraw] = useState(false);
  const [scores, setScores] = useState({ X: 0, O: 0 });

  const checkWinner = (squares: string[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const handleClick = (i: number) => {
    if (winner || board[i]) return;
    const newBoard = [...board];
    newBoard[i] = xIsNext ? 'X' : 'O';
    setBoard(newBoard);
    
    const win = checkWinner(newBoard);
    if (win) {
        setWinner(win);
        setScores(prev => ({ ...prev, [win]: prev[win as keyof typeof prev] + 1 }));
    } else if (!newBoard.includes(null)) {
        setIsDraw(true);
    } else {
        setXIsNext(!xIsNext);
    }
  };

  const resetGame = () => {
      setBoard(Array(9).fill(null));
      setWinner(null);
      setIsDraw(false);
  };

  const bgClass = isDark ? 'bg-[#1a1a1a] text-white' : 'bg-white text-gray-900';
  const squareClass = isDark ? 'bg-[#333] border-[#444] hover:bg-[#444]' : 'bg-gray-100 border-gray-200 hover:bg-gray-200';

  return (
    <div className={`h-full flex flex-col items-center justify-center ${bgClass}`}>
        <div className="flex justify-between w-64 mb-6 text-lg font-bold">
            <div className={`px-4 py-2 rounded flex flex-col items-center ${!xIsNext && !winner ? 'opacity-50' : 'bg-blue-500/20 text-blue-500'}`}>
                <span>Player X</span>
                <span className="text-2xl">{scores.X}</span>
            </div>
            <div className={`px-4 py-2 rounded flex flex-col items-center ${xIsNext && !winner ? 'opacity-50' : 'bg-red-500/20 text-red-500'}`}>
                <span>Player O</span>
                <span className="text-2xl">{scores.O}</span>
            </div>
        </div>

        <div className="grid grid-cols-3 gap-2 w-64 h-64">
            {board.map((val, i) => (
                <button 
                    key={i} 
                    className={`text-4xl font-bold rounded shadow-sm transition-all duration-200 flex items-center justify-center ${squareClass} ${val === 'X' ? 'text-blue-500' : 'text-red-500'}`}
                    onClick={() => handleClick(i)}
                >
                    {val}
                </button>
            ))}
        </div>

        <div className="mt-8 h-12 flex items-center justify-center">
            {winner && <div className="text-xl font-bold animate-bounce flex items-center gap-2 text-green-500"><Trophy /> الفائز: {winner}</div>}
            {isDraw && <div className="text-xl font-bold text-gray-500">تعادل!</div>}
            {!winner && !isDraw && <div className="text-sm opacity-60">الدور على: {xIsNext ? 'X' : 'O'}</div>}
        </div>

        <button onClick={resetGame} className="mt-4 px-6 py-2 bg-gray-200 dark:bg-[#333] rounded-full flex items-center gap-2 hover:bg-gray-300 dark:hover:bg-[#444] transition">
            <RotateCw size={16} /> لعبة جديدة
        </button>
    </div>
  );
};