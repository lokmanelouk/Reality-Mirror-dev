
import React from 'react';
import { X, Minus, Square, Shield, Radio } from 'lucide-react';

export const TitleBar: React.FC = () => {
  return (
    <div className="h-8 w-full bg-black border-b border-white/10 flex justify-between items-center select-none z-[100] relative">
      {/* Draggable Area */}
      <div className="absolute inset-0 cursor-move" style={{ WebkitAppRegion: 'drag' } as any}></div>
      
      {/* App Branding */}
      <div className="flex items-center gap-3 px-4 relative z-10 no-drag pointer-events-none">
        <Shield size={12} className="text-red-600 animate-pulse" />
        <span className="font-mono text-[9px] font-black tracking-[0.4em] text-slate-500 uppercase">
          REALITY_MIRROR_SYSTEM_V2.7
        </span>
        <div className="flex items-center gap-2 px-2 py-0.5 bg-red-600/10 border border-red-600/20">
          <Radio size={8} className="text-red-600" />
          <span className="text-[7px] text-red-600 font-bold uppercase">LIVE_SURVEILLANCE</span>
        </div>
      </div>

      {/* Window Controls */}
      <div className="flex items-center h-full relative z-20" style={{ WebkitAppRegion: 'no-drag' } as any}>
        <button className="h-full px-4 text-slate-600 hover:bg-white/5 transition-colors">
          <Minus size={14} />
        </button>
        <button className="h-full px-4 text-slate-600 hover:bg-white/5 transition-colors">
          <Square size={10} />
        </button>
        <button 
          className="h-full px-4 text-slate-600 hover:bg-red-600 hover:text-white transition-all"
          onClick={() => window.close()}
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
};
