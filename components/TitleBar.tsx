import React, { useState, useEffect } from 'react';
import { Shield, Radio } from 'lucide-react';

export const TitleBar: React.FC = () => {
  const [isMaximized, setIsMaximized] = useState(false);
  
  // Safe way to get Electron in this environment
  const electron = (window as any).require ? (window as any).require('electron') : null;

  const handleMinimize = () => {
    if (electron) {
      electron.ipcRenderer.send('window-minimize');
    } else {
      console.log("MINIMIZE_SIMULATED: Node cannot be stowed in browser context.");
    }
  };

  const handleToggleMaximize = () => {
    setIsMaximized(!isMaximized); // Toggle UI state for visual feedback
    if (electron) {
      electron.ipcRenderer.send('window-toggle-maximize');
    } else {
      console.log("MAXIMIZE_SIMULATED: UI Reflow triggered.");
    }
  };

  const handleClose = () => {
    if (electron) {
      electron.ipcRenderer.send('window-close');
    } else {
      console.log("TERMINATE_SIMULATED: Link severed. Simulation mode remains active.");
      // Optional: Visual feedback for browser users
      document.body.classList.add('scarring-jitter');
      setTimeout(() => document.body.classList.remove('scarring-jitter'), 500);
    }
  };

  return (
    <div 
      className="h-9 w-full bg-black border-b border-white/5 flex justify-between items-center select-none z-[500] relative"
      style={{ WebkitAppRegion: 'drag' } as any}
    >
      {/* App Branding (Non-draggable so it doesn't conflict with clicks if added later) */}
      <div 
        className="flex items-center gap-3 px-4 relative z-10 no-drag shrink-0" 
        style={{ WebkitAppRegion: 'no-drag' } as any}
      >
        <div className="relative">
          <Shield size={14} className="text-red-600 animate-pulse" />
          <div className="absolute inset-0 bg-red-600 blur-md opacity-20 animate-pulse"></div>
        </div>
        <span className="font-mono text-[9px] font-black tracking-[0.5em] text-slate-400 uppercase">
          REALITY_MIRROR_SYSTEM_V2.7
        </span>
        <div className="flex items-center gap-2 px-2 py-0.5 bg-red-600/5 border border-red-600/20 hidden sm:flex">
          <div className="w-1 h-1 bg-red-600 rounded-full animate-ping"></div>
          <span className="text-[7px] text-red-600 font-black uppercase tracking-widest">LIVE_SURVEILLANCE</span>
        </div>
      </div>

      {/* Empty space between branding and buttons remains draggable by default via parent */}
      <div className="flex-1 h-full"></div>

      {/* Unique HUD Window Controls */}
      <div 
        className="flex items-center h-full relative z-20 shrink-0" 
        style={{ WebkitAppRegion: 'no-drag' } as any}
      >
        
        {/* Minimize / STOW */}
        <button 
          className="group h-full px-5 hover:bg-white/5 transition-all flex items-center justify-center border-l border-white/5"
          onClick={handleMinimize}
          title="STOW_PROCESS"
        >
          <div className="w-3 h-0.5 bg-slate-500 group-hover:bg-cyan-400 transition-colors shadow-[0_0_5px_rgba(34,211,238,0)] group-hover:shadow-[0_0_8px_rgba(34,211,238,0.5)]"></div>
        </button>

        {/* Maximize / EXPAND */}
        <button 
          className="group h-full px-5 hover:bg-white/5 transition-all flex items-center justify-center border-l border-white/5"
          onClick={handleToggleMaximize}
          title={isMaximized ? "RESTORE_CORE" : "EXPAND_ARRAY"}
        >
          <div className="relative w-3.5 h-3.5 border border-slate-500 group-hover:border-white transition-all flex items-center justify-center">
             {isMaximized ? (
               <div className="w-1.5 h-1.5 bg-white"></div>
             ) : (
               <>
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-0.5 bg-slate-500 group-hover:bg-white"></div>
                 <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1px] h-0.5 bg-slate-500 group-hover:bg-white"></div>
                 <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-[1px] bg-slate-500 group-hover:bg-white"></div>
                 <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0.5 h-[1px] bg-slate-500 group-hover:bg-white"></div>
               </>
             )}
          </div>
        </button>

        {/* Close / TERMINATE */}
        <button 
          className="group h-full px-6 hover:bg-red-600 transition-all flex items-center justify-center border-l border-white/5 relative"
          onClick={handleClose}
          title="TERMINATE_LINK"
        >
          <div className="relative">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="transition-transform group-hover:scale-110 group-active:scale-90">
              <path 
                d="M4 4L20 20M4 20L20 4" 
                stroke="currentColor" 
                strokeWidth="3.5" 
                strokeLinecap="square"
                className="text-slate-500 group-hover:text-white"
              />
            </svg>
            {/* Pulsing Glitch Effect on Hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 animate-pulse pointer-events-none">
               <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-white blur-[1px] translate-x-[1px]">
                  <path d="M4 4L20 20M4 20L20 4" stroke="currentColor" strokeWidth="2" />
               </svg>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};