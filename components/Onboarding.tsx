
import React, { useState, useEffect } from 'react';
import { UserSettings } from '../types';
import { COMMON_DEMONS, BRAND_CONFIG } from '../constants';
import * as LucideIcons from 'lucide-react';
import { 
  Target, 
  Ghost, 
  ArrowRight, 
  X, 
  Flame, 
  AlertCircle, 
  Activity, 
  Zap, 
  Terminal, 
  Shield, 
  Radio,
  Plus,
  Monitor,
  Search,
  Loader2,
  RefreshCw,
  Cpu,
  ChevronRight,
  Database,
  Lock,
  Crosshair,
  Hash,
  Dna,
  Timer,
  BarChart3,
  Scale,
  Maximize2,
  ChevronUp,
  ChevronDown,
  Info
} from 'lucide-react';

interface Props {
  onComplete: (settings: UserSettings) => void;
}

const BrandIcon = ({ name, size = 18, className = "", isSelected = false }: { name: string; size?: number; className?: string; isSelected?: boolean }) => {
  const n = name.toLowerCase();
  const config = BRAND_CONFIG[n];
  const IconComponent = (config && (LucideIcons as any)[config.icon]) || LucideIcons.Ghost;
  
  let color = '#1A1A1A';
  if (isSelected) {
    color = config?.color || '#FF3B3B';
  } else {
    color = '#334155';
  }
  
  return (
    <div 
      className={`flex items-center justify-center rounded-sm transition-all duration-300 ${!isSelected ? 'border border-white/10' : ''}`}
      style={{ 
        width: size + 12, 
        height: size + 12,
        backgroundColor: isSelected ? 'transparent' : '#1A1A1A'
      }}
    >
      <IconComponent size={size} className={className} style={{ color: isSelected ? color : '#64748b' }} />
    </div>
  );
};

// HUD Loading Scan Circle Component
const ScanCircle = () => {
  const [phase, setPhase] = useState<'loading' | 'complete'>('loading');

  useEffect(() => {
    const timer = setInterval(() => {
      setPhase(p => p === 'loading' ? 'complete' : 'loading');
    }, 6000); 
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 py-6 px-4 border border-white/5 bg-white/[0.01] relative overflow-hidden group">
      <div className="relative">
        <div className={`transition-all duration-1000 ${phase === 'loading' ? 'rotate-180 scale-100 opacity-100' : 'rotate-0 scale-75 opacity-20'}`}>
          <RefreshCw size={48} className="text-red-950 animate-spin transition-all duration-1000" style={{ animationDuration: '6s' }} />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
           <Cpu size={20} className={`transition-all duration-500 ${phase === 'complete' ? 'text-red-600 scale-125' : 'text-slate-800 scale-100'}`} />
        </div>
      </div>
      <div className="h-[1px] w-full bg-slate-900 overflow-hidden relative">
         <div className={`absolute inset-0 bg-red-600 transition-transform duration-[6000ms] ease-linear ${phase === 'loading' ? 'translate-x-[-100%]' : 'translate-x-0'}`}></div>
      </div>
      <p className={`font-mono text-[7px] tracking-[0.4em] uppercase transition-all duration-500 ${phase === 'complete' ? 'text-red-600 animate-pulse' : 'text-slate-700'}`}>
        {phase === 'loading' ? 'SYNCING_TEMPORAL_VECTORS' : 'NEURAL_LINK_STABLE'}
      </p>
    </div>
  );
};

export const Onboarding: React.FC<Props> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [mission, setMission] = useState('');
  const [hours, setHours] = useState(6);
  const [blacklist, setBlacklist] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  const next = () => setStep(s => s + 1);

  const toggleDemon = (name: string) => {
    const upperName = name.toUpperCase();
    setBlacklist(prev => 
      prev.includes(upperName) ? prev.filter(t => t !== upperName) : [...prev, upperName]
    );
  };

  const addCustomTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTag.trim()) {
      const tag = newTag.trim().toUpperCase();
      if (!blacklist.includes(tag)) {
        setBlacklist(prev => [...prev, tag]);
      }
      setNewTag('');
    }
  };

  const finish = () => {
    onComplete({
      mission,
      targetWorkHours: hours,
      blacklist,
      isOnboarded: true
    });
  };

  const getIntensityInfo = () => {
    if (hours < 4) return { label: 'LOW_INTENSITY', icon: <Activity size={14} className="text-cyan-500" />, desc: 'Insufficient drive. Likely to be forgotten by history.', color: 'text-cyan-500', bg: 'bg-cyan-500', shadow: 'shadow-[0_0_20px_rgba(6,182,212,0.4)]' };
    if (hours < 7) return { label: 'SUSTAINABLE', icon: <Target size={14} className="text-yellow-500" />, desc: 'Human-grade effort. Safe, but perhaps too safe.', color: 'text-yellow-500', bg: 'bg-yellow-500', shadow: 'shadow-[0_0_20px_rgba(234,179,8,0.4)]' };
    if (hours < 10) return { label: 'HIGH_PRIORITY', icon: <Zap size={14} className="text-orange-500" />, desc: 'Ambitious load. Social life decay likely.', color: 'text-orange-500', bg: 'bg-orange-500', shadow: 'shadow-[0_0_20px_rgba(249,115,22,0.4)]' };
    return { label: 'TOTAL_DEVOTION', icon: <Flame size={14} className="text-red-600 animate-pulse" />, desc: 'System critical load. Madness or mastery awaits.', color: 'text-red-600', bg: 'bg-red-600', shadow: 'shadow-[0_0_20px_rgba(220,38,38,0.4)]' };
  };

  const info = getIntensityInfo();

  return (
    <div className="fixed inset-0 bg-black flex flex-col overflow-hidden">
      {/* Header Bar */}
      <div className="w-full border-b border-white/5 p-4 flex justify-between items-center font-mono text-[9px] tracking-[0.4em] uppercase text-slate-600 bg-black/80 backdrop-blur-md z-50 shrink-0">
        <div className="flex items-center gap-6">
          <span className="text-red-600 font-black animate-pulse flex items-center gap-2">
            <Radio size={10} /> REALITY_MIRROR_V2.5
          </span>
          <span className="hidden md:inline">SURVEILLANCE_INITIATED</span>
        </div>
        <div className="flex items-center gap-12">
          <span>STEP_0{step}_OF_03</span>
          <div className="w-32 h-[1px] bg-slate-900 hidden sm:block">
            <div className="bg-red-600 h-full transition-all duration-1000" style={{ width: `${(step/3)*100}%` }}></div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row h-full overflow-hidden">
        {/* Left Sidebar Logs */}
        <div className="w-full lg:w-72 border-r border-white/5 p-6 flex flex-col space-y-6 hidden lg:flex bg-white/[0.01] overflow-hidden shrink-0 relative">
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-5">
            <div className="w-full h-1 bg-white animate-scan-v"></div>
          </div>
          <div className="space-y-2 shrink-0 relative z-10">
            <p className="text-[9px] font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
              <Terminal size={10} className="animate-pulse" /> System_Logs
            </p>
            <div className="h-[1px] w-full bg-slate-900"></div>
          </div>
          <div className="font-mono text-[8px] space-y-3 text-slate-700 overflow-hidden flex-1 relative z-10">
            <div className="animate-logs-scroll space-y-4">
              {Array.from({length: 60}).map((_, i) => (
                <div key={i} className={`flex flex-col gap-1 transition-opacity duration-1000 ${i % 4 === 0 ? 'animate-terminal-flicker text-red-900/50' : ''}`}>
                  <p className="truncate">>> LOG_CHUNK_ID: 0x{Math.random().toString(16).substr(2, 4).toUpperCase()}</p>
                  <p className="opacity-40 italic">-- STATUS_REF: {Math.random() > 0.5 ? 'NOMINAL' : 'DRIFT_DETECTED'}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Step Container */}
        <div className="flex-1 p-8 lg:p-12 xl:p-16 overflow-y-auto custom-scrollbar relative bg-black">
          <div className="max-w-5xl mx-auto lg:mx-0">
            
            {step === 1 && (
              <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                <div className="flex flex-col gap-10">
                   <div className="flex items-start gap-6">
                      <div className="p-4 bg-red-600/10 border border-red-600/20 text-red-600">
                         <Crosshair size={32} className="animate-pulse" />
                      </div>
                      <div className="flex flex-col">
                         <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black text-red-600 tracking-[0.4em] uppercase">Phase_01</span>
                            <div className="h-[1px] w-12 bg-slate-900"></div>
                            <span className="text-[8px] font-mono text-slate-700 uppercase">Classified_Session_0x7F</span>
                         </div>
                         <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none text-white mt-3">
                            ESTABLISH YOUR<br/>
                            <span className="text-slate-900 glitch-active">PRIMARY DIRECTIVE.</span>
                         </h2>
                         <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest mt-4 flex items-center gap-2">
                            <Lock size={10} /> Encryption level: HIGH | Neural_Mapping: ACTIVE
                         </p>
                      </div>
                   </div>

                   <div className="max-w-xl">
                      <div className="relative p-6 md:p-8 bg-[#050505] border border-white/5 overflow-hidden group shadow-2xl">
                         <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-white/[0.02] to-transparent h-2 animate-scan-v opacity-30"></div>
                         <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-red-600/50 group-focus-within:border-red-600 transition-colors"></div>
                         <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-red-600/50 group-focus-within:border-red-600 transition-colors"></div>
                         <div className="relative z-10 flex flex-col gap-6">
                            <div className="flex justify-between items-center text-[8px] font-mono text-slate-700 uppercase tracking-tighter">
                               <span className="flex items-center gap-2"><Dna size={10} className="animate-spin" style={{ animationDuration: '4s' }} /> TARGET_IDENTITY_INPUT</span>
                               <span className="opacity-40">SEQ_001_A</span>
                            </div>
                            <div className="flex items-center gap-4 border-b border-slate-900 group-focus-within:border-red-600 transition-all duration-500 pb-2">
                               <span className="text-red-600 font-mono text-xl opacity-40">&gt;</span>
                               <input
                                 autoFocus
                                 className="flex-1 bg-transparent outline-none text-xl md:text-2xl font-mono uppercase font-black text-white selection:bg-red-600/40 placeholder:text-slate-900"
                                 placeholder="IDENTITY_STRING..."
                                 value={mission}
                                 onChange={e => setMission(e.target.value.toUpperCase())}
                               />
                               <Hash size={14} className={`transition-colors ${mission ? 'text-red-600' : 'text-slate-900'}`} />
                            </div>
                         </div>
                      </div>
                      <div className="mt-8 flex justify-start">
                        <button 
                          disabled={!mission}
                          onClick={next}
                          className="group relative px-12 py-5 bg-white text-black font-black uppercase tracking-[0.6em] transition-all hover:bg-red-600 hover:text-white disabled:opacity-20 disabled:grayscale overflow-hidden"
                          style={{ clipPath: 'polygon(10% 0, 100% 0, 90% 100%, 0 100%)' }}
                        >
                          <div className="absolute inset-0 bg-red-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0"></div>
                          <div className="relative z-10 flex items-center gap-4">
                             <Database size={16} className="group-hover:animate-bounce" />
                             <span className="text-xs">EXECUTE_PROTOCOL</span>
                          </div>
                        </button>
                      </div>
                   </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                <div className="flex flex-col gap-10">
                   <div className="flex items-start gap-6">
                      <div className="p-4 bg-red-600/10 border border-red-600/20 text-red-600">
                         <Timer size={32} className="animate-spin" style={{ animationDuration: '10s' }} />
                      </div>
                      <div className="flex flex-col">
                         <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black text-red-600 tracking-[0.4em] uppercase">Phase_02</span>
                            <div className="h-[1px] w-12 bg-slate-900"></div>
                            <span className="text-[8px] font-mono text-slate-700 uppercase">Temporal_Allocation_0x9B</span>
                         </div>
                         <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none text-white mt-3">
                            CALIBRATE YOUR<br/>
                            <span className="text-slate-900 glitch-active">PERFORMANCE QUOTA.</span>
                         </h2>
                         <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest mt-4 flex items-center gap-2">
                            <BarChart3 size={10} /> OPTIMIZATION STATUS: PENDING | TIME_SLICE: DEFINITIVE
                         </p>
                      </div>
                   </div>

                   <div className="max-w-4xl space-y-8">
                      <div className="relative p-6 md:p-8 bg-[#050505] border border-white/5 overflow-hidden group shadow-2xl">
                         <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-red-600/30"></div>
                         
                         <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-red-600/[0.03] to-transparent h-3 animate-scan-v"></div>

                         <div className="relative z-10 space-y-8">
                            <div className="space-y-4">
                               <div className="flex justify-between items-center text-[8px] font-mono text-slate-700 uppercase tracking-widest mb-2">
                                  <span className="flex items-center gap-2 animate-pulse"><Maximize2 size={10} /> TEMPORAL_LOAD_ARRAY</span>
                                  <span className="px-2 py-0.5 border border-slate-900 font-black">SEG_BIT_16</span>
                               </div>

                               <div className="relative p-4 border border-white/10 bg-black/50">
                                  <div className="flex gap-1.5 h-16">
                                     {Array.from({length: 16}).map((_, i) => {
                                        const hourVal = i + 1;
                                        const isActive = hourVal <= hours;
                                        return (
                                           <button 
                                             key={i} 
                                             onClick={() => setHours(hourVal)}
                                             className={`flex-1 transition-all duration-300 relative overflow-hidden group/seg ${
                                                isActive ? `${info.bg} ${info.shadow}` : 'bg-slate-900/20'
                                             }`}
                                             title={`${hourVal} HOURS`}
                                           >
                                              {isActive && <div className="absolute inset-0 bg-white/5 animate-flicker-intense"></div>}
                                              <div className={`absolute inset-0 border-r border-black/20 ${isActive ? 'opacity-100' : 'opacity-20'}`}></div>
                                           </button>
                                        );
                                     })}
                                  </div>

                                  <div className="flex justify-between font-mono text-[7px] text-slate-800 font-black uppercase mt-4">
                                     <span className="flex items-center gap-2"><ChevronUp size={8} /> 01H</span>
                                     <span className="flex items-center gap-2">16H <ChevronUp size={8} /></span>
                                  </div>
                               </div>

                               <div className="p-4 bg-black/80 border border-white/5 flex items-center justify-between gap-6">
                                  <div className="flex items-center gap-4">
                                    <div className="p-2 bg-slate-900/50 rounded-full">
                                      <Info size={14} className={info.color} />
                                    </div>
                                    <p className="text-[9px] font-mono text-slate-500 uppercase leading-relaxed font-bold italic tracking-wider">
                                      {info.desc}
                                    </p>
                                  </div>
                                  <div className="flex flex-col items-end shrink-0">
                                    <span className={`text-4xl font-black font-mono leading-none ${info.color}`}>{hours}</span>
                                    <span className="text-[8px] font-black text-slate-800 uppercase mt-1">HRS_ALLOCATED</span>
                                  </div>
                               </div>
                            </div>
                         </div>
                      </div>

                      <div className="flex justify-start">
                        <button 
                           onClick={next}
                           className="group relative px-12 py-5 bg-white text-black font-black uppercase tracking-[0.5em] transition-all hover:bg-red-600 hover:text-white overflow-hidden"
                           style={{ clipPath: 'polygon(10% 0, 100% 0, 90% 100%, 0 100%)' }}
                        >
                           <div className="absolute inset-0 bg-red-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0"></div>
                           <div className="relative z-10 flex items-center gap-4">
                              <Database size={16} />
                              <span className="text-xs">COMMIT_TEMPORAL_LINK</span>
                           </div>
                        </button>
                      </div>
                   </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                <div className="flex flex-col gap-10">
                   <div className="flex items-start gap-6">
                      <div className="p-4 bg-red-600/10 border border-red-600/20 text-red-600">
                         <Shield size={32} className="animate-pulse" />
                      </div>
                      <div className="flex flex-col">
                         <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black text-red-600 tracking-[0.4em] uppercase">Phase_03</span>
                            <div className="h-[1px] w-12 bg-slate-900"></div>
                            <span className="text-[8px] font-mono text-slate-700 uppercase">Neural_Waste_Detection</span>
                         </div>
                         <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none text-white mt-3">
                            FILTER YOUR<br/>
                            <span className="text-red-600">DISTRACTIONS.</span>
                         </h2>
                      </div>
                   </div>
                   
                   <div className="space-y-12">
                      <div className="flex justify-start">
                        <div className="relative group w-full max-w-xl">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-red-600 transition-colors">
                            <Search size={18} />
                          </div>
                          <input 
                            className="w-full bg-[#1A1A1A] border border-slate-800 focus:border-red-600 outline-none py-4 pl-12 pr-4 text-sm font-mono transition-all placeholder:text-slate-600 uppercase font-black text-white rounded-sm shadow-inner"
                            placeholder="MANUALLY ADD APP NAME..."
                            value={newTag}
                            onChange={e => setNewTag(e.target.value.toUpperCase())}
                            onKeyDown={addCustomTag}
                          />
                        </div>
                      </div>
                      <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))' }}>
                        {COMMON_DEMONS.map(demon => {
                          const isSelected = blacklist.includes(demon.toUpperCase());
                          return (
                            <button
                              key={demon}
                              onClick={() => toggleDemon(demon)}
                              className={`group p-3 border transition-all duration-300 flex flex-col items-center gap-2 rounded-sm ${
                                isSelected 
                                  ? 'border-red-600 bg-red-600/5 shadow-[0_0_20px_rgba(255,0,0,0.2)] scale-105' 
                                  : 'border-[#1A1A1A] bg-black opacity-60 hover:opacity-100 hover:border-slate-700'
                              }`}
                            >
                              <BrandIcon name={demon} size={20} isSelected={isSelected} />
                              <span className={`text-[9px] font-black uppercase tracking-widest truncate w-full text-center ${isSelected ? 'text-white' : 'text-slate-600'}`}>{demon}</span>
                            </button>
                          );
                        })}
                      </div>
                      <div className="flex flex-col md:flex-row gap-8 items-center pt-8 border-t border-white/5">
                       <div className="flex-1 flex items-start gap-4">
                         <Shield size={24} className="text-red-900 shrink-0 mt-1" />
                         <p className="text-[10px] font-mono text-slate-500 uppercase leading-relaxed max-w-sm">ANY ACTIVITY DETECTED MATCHING THESE IDENTIFIERS WILL BE LOGGED AS NEURAL WASTE. THE MIRROR DOES NOT FORGIVE.</p>
                       </div>
                       <button 
                        onClick={finish} 
                        className="group relative px-16 py-6 bg-red-600 text-white font-black uppercase tracking-[0.4em] transition-all hover:bg-white hover:text-black shadow-[0_0_40px_rgba(255,0,0,0.3)] text-sm overflow-hidden"
                        style={{ clipPath: 'polygon(5% 0, 100% 0, 95% 100%, 0 100%)' }}
                       >
                         <span className="relative z-10 flex items-center gap-3">
                            <Zap size={16} className="group-hover:animate-bounce" />
                            INITIATE_PROTOCOL
                         </span>
                       </button>
                     </div>
                   </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right HUD Sidebar */}
        <div className="w-full lg:w-72 border-l border-white/5 p-6 flex flex-col justify-between hidden xl:flex bg-black overflow-hidden shrink-0 relative">
           <div className="absolute inset-0 pointer-events-none opacity-5">
              <div className="absolute right-4 top-0 w-[1px] h-full bg-red-600/30 animate-pulse"></div>
           </div>
           <div className="space-y-10 flex-1 relative z-10">
              <div className="space-y-6">
                 <p className="text-[8px] font-black text-slate-800 uppercase tracking-widest border-b border-white/5 pb-2">Temporal_Shift</p>
                 <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                       <div key={i} className="flex flex-col gap-1">
                          <div className="flex justify-between font-mono text-[6px] text-slate-900">
                             <span>CH_{i.toString().padStart(2, '0')}</span>
                             <span>ACT_0{i}</span>
                          </div>
                          <div className="w-full h-[3px] bg-slate-900/50 rounded-full overflow-hidden">
                             <div 
                                className="h-full bg-red-600/60 animate-bar-yoyo" 
                                style={{ animationDelay: `${i * 1.5}s`, animationDuration: `${8 + i*0.5}s` }}
                             ></div>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
              <div className="space-y-4">
                 <p className="text-[8px] font-black text-slate-800 uppercase tracking-widest border-b border-white/5 pb-2">Daemon_Core</p>
                 <ScanCircle />
              </div>
           </div>
           <div className="text-[7px] font-mono text-slate-900 uppercase tracking-widest space-y-1 pt-4 border-t border-white/5 shrink-0 relative z-10">
              <p className="flex items-center gap-2"><span className="w-1 h-1 bg-red-600 rounded-full animate-ping"></span> LINK: ENCRYPTED</p>
              <p>SURVEILLANCE: ON</p>
           </div>
        </div>
      </div>
    </div>
  );
};
