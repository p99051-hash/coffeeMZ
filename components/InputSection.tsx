
import React, { useState } from 'react';
import { RoastLevel, ProcessMethod, CoffeeParams } from '../types';

interface Props {
  params: CoffeeParams;
  onChange: (updates: Partial<CoffeeParams>) => void;
}

const RetroSelect: React.FC<{
  label: string;
  value: string;
  options: string[];
  onSelect: (val: string) => void;
  showCustom?: boolean;
}> = ({ label, value, options, onSelect, showCustom }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative mb-6">
      <label className="block text-[10px] font-black uppercase tracking-widest mb-2">{label}</label>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 retro-border-sm bg-white text-left flex justify-between items-center font-bold"
      >
        {value || '請選擇...'}
        <span>▼</span>
      </button>
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white retro-border-sm shadow-xl max-h-48 overflow-y-auto">
          {options.map(o => (
            <button key={o} className="w-full p-3 text-left hover:bg-black hover:text-white font-bold border-b border-black/10 last:border-0" onClick={() => { onSelect(o); setIsOpen(false); }}>{o}</button>
          ))}
          {showCustom && (
            <input 
              type="text" 
              placeholder="手動輸入..." 
              className="w-full p-3 border-t-2 border-black focus:outline-none"
              onChange={(e) => onSelect(e.target.value)}
            />
          )}
        </div>
      )}
    </div>
  );
};

export const InputSection: React.FC<Props> = ({ params, onChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-10 bg-white retro-border retro-shadow">
      <div className="space-y-4">
        <RetroSelect label="咖啡產區" value={params.origin} options={['衣索比亞', '肯亞', '巴拿馬 Geisha', '哥倫比亞']} onSelect={(v) => onChange({origin:v})} showCustom />
        <RetroSelect label="烘焙程度" value={params.roast} options={Object.values(RoastLevel)} onSelect={(v) => onChange({roast:v})} />
        <div className="mb-4">
          <label className="block text-[10px] font-black uppercase tracking-widest mb-2">處理法</label>
          <select className="w-full p-4 retro-border-sm bg-white font-bold" value={params.process} onChange={(e) => onChange({process: e.target.value})}>
            {Object.values(ProcessMethod).map(m => <option key={m}>{m}</option>)}
          </select>
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-[10px] font-black uppercase mb-4 tracking-widest">目標沖煮量: {params.targetVolume}cc</label>
          <input type="range" min="100" max="800" step="10" className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black" value={params.targetVolume} onChange={(e) => onChange({targetVolume: parseInt(e.target.value)})} />
        </div>
        <RetroSelect label="選擇濾杯" value={params.dripper} options={['V60', '蛋糕濾杯', '摺紙濾杯', '聰明濾杯']} onSelect={(v) => onChange({dripper:v})} showCustom />
      </div>
    </div>
  );
};
