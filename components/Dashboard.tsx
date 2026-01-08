
import React, { useState, useMemo, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from 'recharts';
import { UserSettings, ActivityRecord } from '../types';
import { getBrutalVerdict } from '../services/geminiService';
import { BRAND_CONFIG } from '../constants';
import * as LucideIcons from 'lucide-react';
import { 
  Activity, 
  Target, 
  Trash2, 
  AlertTriangle, 
  Zap, 
  Skull, 
  ShieldX,
  History,
  Terminal,
  Eye,
  ChevronRight,
  Database,
  Cpu,
  Search,
  Code,
  Layers,
  Settings,
  LayoutGrid,
  BarChart2,
  Shield,
  Dna,
  Wifi,
  Radio,
  Crosshair,
  Timer,
  Info
} from 'lucide-react';

interface Props {
  settings: UserSettings;
  activities: ActivityRecord[];
  onReset: () => void;
  onLogActivity: (record: ActivityRecord) => void;
}

const LOADING_STEPS = [
  { id: 'AUTH', text: "VALIDATING_DAEMON_PERMISSIONS...", icon: ShieldX },
  { id: 'SCAN', text: "SCANNING_TEMPORAL_BUFFER...", icon: Search },
  { id: 'PARS', text: "PARSING_SHAME_VECTORS...", icon: Code },
  { id: 'AI_P', text: "CONSULTING_VOID_INTELLIGENCE...", icon: Cpu },
  { id: 'EXTR', text: "EXTRACTING_BRUTAL_TRUTH...", icon: AlertTriangle },
  { id: 'SYNC', text: "MIRROR_CONSTRUCT_FINALIZING.", icon: Eye }
];

const BrandIcon = ({ name, isDistraction, size = 12 }: { name: string, isDistraction: boolean, size?: number }) => {
  const n = name.toLowerCase();
  const config = BRAND_CONFIG[n];
  const IconComponent = (config && (LucideIcons as any)[config.icon]) || 
                 (isDistraction ? Skull : Zap);
                 
  const color = config?.color || (isDistraction ? '#FF3B3B' : '#FFFFFF');

  if (!config) {
    return (
      <div 
        className="flex items-center justify-center border border-white/20"
        style={{ width: size + 8, height: size + 8, backgroundColor: '#1A1A1A' }}
      >
        <IconComponent size={size} style={{ color }} />
      </div>
    );
  }

  return <IconComponent size={size} style={{ color }} />;
};

// Advanced Loading Visualization
const NeuralSynthesis = ({ stepIndex }: { stepIndex: number }) => {
  const progress = ((stepIndex + 1) / LOADING_STEPS.length) * 100;
  
  return (
    <div className="flex flex-col items-center justify-center gap-12 w-full max-w-md relative z-10 p-8">
       {/* Central Spinning Core */}
       <div className="relative">
          <div className="absolute inset-0 bg-red-600/10 blur-2xl animate-pulse rounded-full"></div>
          <div className="relative w-32 h-32 border-2 border-dashed border-red-600/20 rounded-full flex items-center justify-center animate-spin" style={{ animationDuration: '8s' }}>
             <div className="w-24 h-24 border border-white/10 rounded-full flex items-center justify-center animate-reverse-spin" style={{ animationDuration: '4s' }}>
                <Dna size={32} className="text-red-600 animate-pulse" />
             </div>
          </div>
          
          {/* Orbital Bits */}
          {Array.from({length: 4}).map((_, i) => (
             <div 
                key={i} 
                className="absolute w-2 h-2 bg-white rounded-full animate-ping"
                style={{ 
                   top: '50%', 
                   left: '50%', 
                   transform: `rotate(${i * 90}deg) translateY(-60px)`,
                   animationDelay: `${i * 0.5}s`
                }}
             ></div>
          ))}
       </div>

       {/* Text and Segmented Progress Bar */}
       <div className="w-full space-y-6">
          <div className="flex flex-col gap-2">
             <div className="flex justify-between items-end font-mono text-[9px] uppercase tracking-widest text-red-600 font-black">
                <span className="flex items-center gap-2"><Activity size={10} className="animate-bounce" /> {LOADING_STEPS[stepIndex].text}</span>
                <span>{Math.round(progress)}%</span>
             </div>
             
             {/* Segmented Bar */}
             <div className="flex gap-1 h-3">
                {Array.from({length: 20}).map((_, i) => {
                   const isActive = (i / 20) * 100 < progress;
                   return (
                      <div 
                        key={i} 
                        className={`flex-1 transition-all duration-500 ${isActive ? 'bg-red-600' : 'bg-black border border-white/5'}`}
                        style={{ transform: isActive ? 'skewX(-15deg) scaleY(1.2)' : 'skewX(-15deg)' }}
                      ></div>
                   );
                })}
             </div>
          </div>
          
          <div className="bg-white/5 p-4 border border-white/10">
             <p className="font-mono text-[7px] text-slate-400 uppercase leading-relaxed text-center italic">
                Splicing temporal reality fragments with neural intent... {Math.random().toString(16).substr(2, 8).toUpperCase()}
             </p>
          </div>
       </div>
    </div>
  );
};

export const Dashboard: React.FC<Props> = ({ settings, activities, onReset, onLogActivity }) => {
  const [verdict, setVerdict] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [isVerdictHovered, setIsVerdictHovered] = useState(false);
  const [localTime, setLocalTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => setLocalTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let interval: number;
    if (isGenerating) {
      setLoadingStep(0);
      interval = window.setInterval(() => {
        setLoadingStep(prev => (prev < LOADING_STEPS.length - 1 ? prev + 1 : prev));
      }, 900);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  const stats = useMemo(() => {
    const workMinutes = activities.filter(a => !a.isDistraction).reduce((acc, curr) => acc + (curr.endTime - curr.startTime) / (1000 * 60), 0);
    const wasteMinutes = activities.filter(a => a.isDistraction).reduce((acc, curr) => acc + (curr.endTime - curr.startTime) / (1000 * 60), 0);
    
    return {
      work: workMinutes,
      waste: wasteMinutes,
      goal: settings.targetWorkHours * 60,
      focusScore: (workMinutes + wasteMinutes) > 0 ? Math.round((workMinutes / (workMinutes + wasteMinutes)) * 100) : 100
    };
  }, [activities, settings]);

  const chartData = [
    { name: 'QUOTA', value: stats.goal, color: '#0a0a0a' },
    { name: 'FOCUS', value: stats.work, color: '#ffffff' },
    { name: 'VOID', value: stats.waste, color: '#ff0000' },
  ];

  const handleGenerateVerdict = async () => {
    if (activities.length === 0) return;
    setIsGenerating(true);
    const text = await getBrutalVerdict(settings, activities);
    setVerdict(text);
    setIsGenerating(false);
  };

  const simulateActivity = (isDistraction: boolean) => {
    const now = Date.now();
    const duration = 1000 * 60 * 15;
    const appName = isDistraction 
      ? (settings.blacklist[Math.floor(Math.random() * settings.blacklist.length)] || 'YouTube')
      : 'VS Code';

    onLogActivity({
      id: Math.random().toString(36),
      appName,
      windowTitle: isDistraction ? 'Dissolving neural potential...' : 'Synthesizing professional value...',
      startTime: now - duration,
      endTime: now,
      isDistraction
    });
  };

  return (
    <div className="min-h-screen max-h-screen bg-black text-white flex overflow-hidden">
      
      {/* Sidebar Rail */}
      <div className="w-16 lg:w-20 border-r border-white/5 flex flex-col items-center py-6 justify-between bg-black z-50 shrink-0 relative overflow-hidden">
         <div className="absolute inset-0 pointer-events-none opacity-10">
            <div className="w-full h-[1px] bg-red-600 animate-scan-v"></div>
         </div>
         
         <div className="space-y-8 flex flex-col items-center relative z-10">
            <div className="w-8 h-8 bg-red-600 flex items-center justify-center animate-pulse shadow-[0_0_12px_rgba(255,0,0,0.5)] shrink-0">
               <Eye size={16} className="text-white" />
            </div>
            <div className="flex flex-col gap-8 text-slate-700">
               <button className="hover:text-white transition-all transform hover:scale-110"><LayoutGrid size={18} /></button>
               <button className="hover:text-white transition-all transform hover:scale-110 text-red-600"><Shield size={18} /></button>
               <button className="hover:text-white transition-all transform hover:scale-110"><Wifi size={18} /></button>
            </div>
         </div>
         <div className="flex flex-col gap-4 text-slate-800 mb-2 shrink-0 relative z-10">
            <button onClick={onReset} className="hover:text-red-600 transition-colors"><Trash2 size={16} /></button>
            <button className="hover:text-white transition-colors"><Settings size={16} /></button>
         </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top Header */}
        <div className="w-full border-b border-white/5 px-6 py-4 flex justify-between items-center font-mono text-[8px] tracking-[0.4em] uppercase text-slate-600 bg-black/50 backdrop-blur-sm shrink-0">
           <div className="flex items-center gap-4">
              <span className="text-red-600 font-black flex items-center gap-2">
                 <Activity size={10} className="animate-pulse" /> STATUS: 0x{stats.focusScore.toString(16).toUpperCase()}
              </span>
              <div className="h-2 w-[1px] bg-slate-900"></div>
              <span>GOAL: {settings.targetWorkHours}H</span>
           </div>
           <div className="flex items-center gap-4">
              <span className="animate-pulse flex items-center gap-2"><Radio size={10} /> {localTime}</span>
              <div className="h-2 w-[1px] bg-slate-900"></div>
              <span>V2.5.0</span>
           </div>
        </div>

        {/* Content Viewport */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-black p-6 lg:p-10">
          <div className="w-full flex flex-col gap-10 max-w-[1400px]">
            
            {/* Professional Objective Module */}
            <div className="relative p-6 border border-white/5 bg-white/[0.01] overflow-hidden">
               <div className="absolute top-0 left-0 w-2 h-2 bg-red-600"></div>
               <div className="absolute bottom-0 right-0 w-2 h-2 bg-white/20"></div>
               
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                  <div className="flex items-center gap-5">
                     <div className="p-3 bg-red-600/10 border border-red-600/20 text-red-600">
                        <Crosshair size={24} />
                     </div>
                     <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-1">
                           <span className="text-[8px] font-black uppercase text-red-600 tracking-widest">Active_Directive</span>
                           <div className="h-[1px] w-6 bg-slate-800"></div>
                           <span className="text-[7px] font-mono text-slate-700">OBJ_ID: {Math.random().toString(36).substr(2, 6).toUpperCase()}</span>
                        </div>
                        <h1 className={`text-2xl md:text-3xl lg:text-4xl font-black uppercase tracking-tighter leading-none transition-all duration-700 ${isVerdictHovered ? 'text-red-600 glitch-active' : 'text-slate-100'}`}>
                           {settings.mission}
                        </h1>
                     </div>
                  </div>
                  
                  <div className="flex items-center gap-8 border-l border-white/5 pl-8 hidden lg:flex">
                     <div className="text-right">
                        <p className="text-[7px] font-mono text-slate-700 uppercase">Integrity</p>
                        <span className="text-xl font-black font-mono">{stats.focusScore}%</span>
                     </div>
                     <div className="text-right">
                        <p className="text-[7px] font-mono text-slate-700 uppercase">Quota</p>
                        <span className="text-xl font-black font-mono">{settings.targetWorkHours}H</span>
                     </div>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
              
              {/* Stats Block */}
              <div className="xl:col-span-5 space-y-6 min-w-0">
                <div className="bg-white/[0.01] border border-white/5 p-6 relative overflow-hidden group">
                  <div className="flex justify-between items-start mb-6 relative z-10">
                    <div className="space-y-1">
                       <p className="font-mono text-[8px] text-slate-700 tracking-[0.3em] uppercase font-black">Metrics</p>
                       <div className="h-[1px] w-6 bg-red-600"></div>
                    </div>
                  </div>

                  <div className="h-[200px] w-full mb-6 relative z-10">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 0, right: 0, left: -40, bottom: 0 }}>
                        <XAxis 
                          dataKey="name" 
                          fontSize={7} 
                          stroke="transparent" 
                          tick={{fill: '#1a1a1a', fontWeight: 900, letterSpacing: '4px'}} 
                        />
                        <Bar dataKey="value" barSize={24}>
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={index === 0 ? 0.2 : 1} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="grid grid-cols-2 gap-3 relative z-10">
                     <div className="p-4 border border-white/5 bg-black/40">
                        <p className="text-[7px] font-black text-slate-700 tracking-widest mb-2 uppercase flex items-center gap-2">
                           <Target size={9} /> Focus
                        </p>
                        <span className="text-xl font-black font-mono">{(stats.work / 60).toFixed(1)}H</span>
                     </div>
                     <div className="p-4 border border-white/5 bg-black/40 text-red-950">
                        <p className="text-[7px] font-black tracking-widest mb-2 uppercase flex items-center gap-2">
                           <Skull size={9} /> Void
                        </p>
                        <span className="text-xl font-black font-mono">{(stats.waste / 60).toFixed(1)}H</span>
                     </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                   <button onClick={() => simulateActivity(false)} className="group relative py-4 border border-white/5 text-[8px] font-black uppercase tracking-[0.3em] overflow-hidden hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2">
                     <Zap size={10} className="relative z-10" />
                     <span className="relative z-10">Push_Core</span>
                   </button>
                   <button onClick={() => simulateActivity(true)} className="group relative py-4 border border-red-900/20 text-red-900/60 text-[8px] font-black uppercase tracking-[0.3em] overflow-hidden hover:bg-red-600 hover:text-white transition-all flex items-center justify-center gap-2">
                     <Skull size={10} className="relative z-10" />
                     <span className="relative z-10">Feed_Void</span>
                   </button>
                </div>
              </div>

              {/* Verdict Block - Sophisticated Loading */}
              <div className="xl:col-span-7 space-y-6 min-w-0">
                 <div className="relative group/verdict" onMouseEnter={() => setIsVerdictHovered(true)} onMouseLeave={() => setIsVerdictHovered(false)}>
                    <div className={`bg-white text-black p-8 lg:p-10 min-h-[450px] relative overflow-hidden transition-all duration-700 flex flex-col ${isVerdictHovered ? 'shadow-[30px_30px_0px_rgba(255,0,0,0.1)] ring-2 ring-red-600/10' : 'shadow-[10px_10px_0px_rgba(255,255,255,0.02)]'}`}>
                      <div className="relative z-10 flex flex-col h-full">
                        <div className="flex justify-between items-center gap-6 mb-8 border-b border-black/[0.06] pb-6">
                          <h2 className={`text-[9px] font-black uppercase tracking-[0.5em] flex items-center gap-2 ${isVerdictHovered ? 'text-red-600' : 'text-black/40'}`}>
                            <Database size={10} /> Neural_Output
                          </h2>
                          <button 
                            onClick={handleGenerateVerdict}
                            disabled={isGenerating || activities.length === 0}
                            className={`group relative text-[8px] font-black uppercase tracking-[0.2em] px-5 py-2.5 border border-black transition-all flex items-center gap-2 ${isGenerating ? 'opacity-30 cursor-not-allowed' : 'hover:bg-black hover:text-white'}`}
                          >
                            <Layers size={10} className={isGenerating ? 'animate-spin' : ''} />
                            <span>{isGenerating ? 'ANALYZING...' : 'REFRESH'}</span>
                          </button>
                        </div>

                        {isGenerating ? (
                          <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden">
                             <NeuralSynthesis stepIndex={loadingStep} />
                          </div>
                        ) : verdict ? (
                          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700 flex-1">
                            <p className={`text-lg md:text-xl font-black tracking-tighter leading-tight uppercase transition-all duration-700 ${isVerdictHovered ? 'vibration-active' : ''}`}>
                              {verdict}
                            </p>
                            <div className="pt-6 border-t border-black/5 mt-auto flex flex-col lg:flex-row justify-between font-mono text-[8px] text-slate-400 uppercase tracking-[0.5em] gap-4">
                              <span className="opacity-20 italic">ID_0x{Math.random().toString(36).substr(2, 6).toUpperCase()}</span>
                              <span className="transition-colors font-black flex items-center gap-2 text-red-600">
                                 <ShieldX size={10} /> DAEMON_SIGNED
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex-1 flex flex-col items-center justify-center text-center opacity-10 hover:opacity-40 transition-all duration-700 p-16 cursor-default">
                            <Database size={48} className="mb-8" />
                            <p className="text-[10px] font-black uppercase tracking-[0.8em] leading-loose">
                              DATA_REQUIRED<br/>FOR_JUDGEMENT.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                 </div>

                 {/* Activity History */}
                 <div className="space-y-4 min-w-0">
                    <div className="flex justify-between items-end border-b border-white/5 pb-3">
                       <h3 className="text-[9px] font-black uppercase text-slate-800 tracking-[0.6em] flex items-center gap-2">
                          <History size={10} /> Neural_Log
                       </h3>
                       <span className="font-mono text-[8px] text-slate-900 uppercase tracking-[0.3em]">{activities.length} ENTRIES</span>
                    </div>

                    <div className="grid grid-cols-1 gap-[1px] bg-white/[0.01] max-h-[350px] overflow-y-auto custom-scrollbar pr-2">
                       {activities.length === 0 ? (
                         <div className="py-24 text-center">
                           <p className="text-[8px] font-mono text-slate-900 uppercase tracking-[1.2em]">EMPTY_BUFFER</p>
                         </div>
                       ) : (
                         [...activities].reverse().slice(0, 15).map((a, i) => (
                           <div key={a.id} className="group flex items-center gap-4 p-4 bg-black/40 border border-transparent hover:border-white/5 transition-all">
                              <div className="font-mono text-[8px] text-slate-900 w-6">0x{i.toString(16).toUpperCase()}</div>
                              <div className="flex-1 min-w-0 flex items-center justify-between">
                                 <div className="min-w-0">
                                    <p className={`text-xs font-black uppercase tracking-wider mb-0.5 truncate pr-2 ${a.isDistraction ? 'text-red-900' : 'text-slate-300'}`}>
                                       {a.appName}
                                    </p>
                                    <p className="text-[7px] font-mono text-slate-800 uppercase tracking-widest truncate group-hover:text-slate-500 italic">
                                       {a.windowTitle}
                                    </p>
                                 </div>
                                 <div className="text-right shrink-0 ml-4">
                                    <div className="flex items-center gap-2 mb-0.5 justify-end">
                                       <span className="text-[7px] font-mono text-slate-800 uppercase">{new Date(a.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                       <BrandIcon name={a.appName} isDistraction={a.isDistraction} size={14} />
                                    </div>
                                    <p className={`text-[8px] font-black tracking-tighter ${a.isDistraction ? 'text-red-950' : 'text-slate-700'}`}>15M</p>
                                 </div>
                              </div>
                           </div>
                         ))
                       )}
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
