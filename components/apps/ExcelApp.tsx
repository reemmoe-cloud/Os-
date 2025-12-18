import React, { useState } from 'react';
import { Icons } from '../ui/Icons';

export const ExcelApp: React.FC = () => {
  const [cells, setCells] = useState<{[key: string]: string}>({});
  const [selectedCell, setSelectedCell] = useState<string | null>(null);
  
  const COLS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
  const ROWS = Array.from({ length: 20 }, (_, i) => i + 1);

  const handleCellChange = (id: string, value: string) => {
    setCells(prev => ({ ...prev, [id]: value }));
  };

  const Cell = ({ id, col }: { id: string, col: string }) => {
    const isSelected = selectedCell === id;
    return (
      <div 
        className={`border-r border-b border-gray-200 relative min-h-[30px] ${isSelected ? 'ring-2 ring-green-500 z-10' : ''}`}
        onClick={() => setSelectedCell(id)}
      >
        <input 
            type="text"
            className={`w-full h-full px-2 py-1 text-sm bg-transparent outline-none ${isSelected ? 'bg-white' : ''}`}
            value={cells[id] || ''}
            onChange={(e) => handleCellChange(id, e.target.value)}
        />
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-white font-sans text-gray-800">
      {/* Header / Ribbon */}
      <div className="bg-green-700 text-white p-4">
        <div className="flex items-center gap-3 mb-4">
            <div className="bg-white p-1.5 rounded-lg">
                <Icons.Excel size={24} className="text-green-700" />
            </div>
            <div>
                <h1 className="font-bold text-lg leading-tight">XL POO</h1>
                <p className="text-xs text-green-100 opacity-80">Yellow OS Spreadsheet</p>
            </div>
        </div>
        
        {/* Toolbar */}
        <div className="flex gap-2">
            <button className="p-2 bg-green-600 hover:bg-green-500 rounded-md transition-colors"><Icons.Save size={18} /></button>
            <div className="w-px bg-green-500 mx-1"></div>
            <button className="p-2 bg-green-600 hover:bg-green-500 rounded-md transition-colors font-bold font-serif">B</button>
            <button className="p-2 bg-green-600 hover:bg-green-500 rounded-md transition-colors italic font-serif">I</button>
            <button className="p-2 bg-green-600 hover:bg-green-500 rounded-md transition-colors underline font-serif">U</button>
            <div className="w-px bg-green-500 mx-1"></div>
            <button className="p-2 bg-green-600 hover:bg-green-500 rounded-md transition-colors"><Icons.List size={18} /></button>
            <button className="p-2 bg-green-600 hover:bg-green-500 rounded-md transition-colors"><Icons.Download size={18} /></button>
        </div>
      </div>

      {/* Formula Bar */}
      <div className="flex items-center gap-2 p-2 bg-gray-100 border-b border-gray-300">
        <div className="bg-white border border-gray-300 rounded px-2 py-1 text-sm w-12 text-center font-bold text-gray-500">
            {selectedCell || 'A1'}
        </div>
        <div className="text-gray-400 font-serif italic">fx</div>
        <input 
            className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-green-500"
            value={selectedCell ? (cells[selectedCell] || '') : ''}
            onChange={(e) => selectedCell && handleCellChange(selectedCell, e.target.value)}
            placeholder="Function or value"
        />
      </div>

      {/* Grid Container */}
      <div className="flex-1 overflow-auto bg-gray-50 relative">
        <div className="min-w-max">
            {/* Column Headers */}
            <div className="flex sticky top-0 z-20 shadow-sm">
                <div className="w-10 bg-gray-100 border-r border-b border-gray-300"></div>
                {COLS.map(col => (
                    <div key={col} className="w-24 bg-gray-100 border-r border-b border-gray-300 text-center py-1 text-xs font-bold text-gray-600">
                        {col}
                    </div>
                ))}
            </div>

            {/* Rows */}
            {ROWS.map(row => (
                <div key={row} className="flex">
                    {/* Row Header */}
                    <div className="w-10 bg-gray-100 border-r border-b border-gray-300 flex items-center justify-center text-xs font-bold text-gray-600 sticky left-0 z-10">
                        {row}
                    </div>
                    {/* Cells */}
                    {COLS.map(col => {
                        const cellId = `${col}${row}`;
                        return (
                             <div key={cellId} className="w-24 bg-white">
                                <Cell id={cellId} col={col} />
                             </div>
                        );
                    })}
                </div>
            ))}
        </div>
      </div>
      
      {/* Sheets Footer */}
      <div className="h-8 bg-gray-200 flex items-center px-2 gap-1 border-t border-gray-300">
          <button className="px-4 py-1 bg-white rounded-t-lg text-xs font-bold text-green-700 shadow-sm">Sheet 1</button>
          <button className="px-2 py-1 hover:bg-gray-300 rounded-full text-gray-500"><Icons.Plus size={14} /></button>
      </div>
    </div>
  );
};