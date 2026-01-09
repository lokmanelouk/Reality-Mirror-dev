
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, Tooltip
} from 'recharts';
import { UserSettings, ActivityRecord } from '../types';
import { getBrutalVerdict } from '../services/geminiService';
import { BRAND_CONFIG } from '../constants';
import { 
  Activity, 
  Eye, 
  LayoutGrid, 
  Shield, 
  Wifi, 
  Target, 
  Skull, 
  Hexagon, 
  Database, 
  Clock, 
  Globe, 
  Save, 
  Terminal, 
  Timer, 
  Flame, 
  Ghost,
  Dna,
  Zap,
  Trash2,
  Info,
  TrendingDown,
  Activity as PulseIcon,
  AlertTriangle,
  Users
} from 'lucide-react';

interface Props {
  settings: UserSettings;
  activities: ActivityRecord[];
  onReset: () => void;
  onLogActivity: (record: ActivityRecord) => void;
  onUpdateSettings: (settings: UserSettings) => void;
}

type DashboardTab = 'main' | 'settings' | 'logs';

const HazardTerminateButton = ({ onReset }: { onReset: () => void }) => {
  const [holding, setHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<number | null>(null);
  const holdDuration = 2000;

  const startHold = () => {
    setHolding(true);
    const start = Date.now();
    timerRef.current = window.setInterval(() => {
      const elapsed = Date.now() - start;
      const p = Math.min((elapsed / holdDuration) * 100, 100);
      setProgress(p);
      if (elapsed >= holdDuration) {
        if (timerRef.current) clearInterval(timerRef.current);
        setHolding(false);
        setProgress(0);
        onReset();
      }
    }, 20);
  };

  const endHold = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setHolding(false);
    setProgress(0);
  };

  return (
    <button
      onMouseDown={startHold}
      onMouseUp={endHold}
      onMouseLeave={endHold}
      className={`w-12 h-12 relative flex items-center justify-center transition-all border ${
        holding ? 'border-red-600 bg-red-600/10 scale-105' : 'border-red-950/20 bg-black hover:border-red-700'
      }`}
    >
      {holding && (
        <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
          <circle cx="50%" cy="50%" r="40%" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="100" strokeDashoffset={100 - progress} />
        </svg>
      )}
      <Trash2 size={20} className={holding ? 'text-white' : 'text-red-950'} />
      {holding && <span className="absolute -top-8 bg-red-600 text-white text-[6px] font-black px-1.5 py-0.5 whitespace-nowrap uppercase">ERASING</span>}
    </button>
  );
};

const GlobalShameTicker = () => {
  return (
    <div className="flex items-center gap-6 overflow-hidden max-w-[400px] border-l border-red-900/50 pl-6 h-10 group cursor-help">
       <div className="flex flex-col shrink-0">
          <span className="text-[6px] font-black text-red-900 uppercase tracking-widest flex items-center gap-1">
             <Users size={8} className="animate-pulse" /> GLOBAL_FAILURE_FEED
          </span>
          <span className="text-[8px] font-mono text-slate-800 animate-pulse uppercase">Syncing_Sector_A12</span>
       </div>
       <div className="flex items-center gap-4 bg-red-600/5 px-3 py-1 border border-red-600/10 animate-flicker-intense">
          <div className="flex flex-col">
             <span className="text-[7px] font-black text-red-600 uppercase tracking-tighter">SUBJECT_8291_VOID_BREACH</span>
             <span className="text-[10px] font-black font-mono text-white leading-none">08:14:22 IN THE VOID</span>
          </div>
          <AlertTriangle size={14} className="text-red-600 animate-bounce" />
       </div>
    </div>
  );
};

const TemporalIntegrityChart = ({ activities }: { activities: ActivityRecord[] }) => {
  const chartData = useMemo(() => {
    const hours = Array.from({ length: 12 }, (_, i) => {
      const h = (new Date().getHours() - (11 - i) + 24) % 24;
      const hourWork = activities
        .filter(a => !a.isDistraction && new Date(a.startTime).getHours() === h)
        .reduce((acc, curr) => acc + (curr.endTime - curr.startTime) / 60000, 0);
      return { time: `${h}:00`, actual: Math.round(hourWork), goal: 60 };
    });
    return hours;
  }, [activities]);

  return (
    <div className="h-[140px] w-full bg-[#050505] border border-white/5 p-4 relative group">
      <div className="absolute top-2 left-4 z-10">
        <p className="text-[7px] font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
          <Activity size={10} /> Temporal_Integrity_Contrast
        </p>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/><stop offset="95%" stopColor="#ef4444" stopOpacity={0}/></linearGradient>
            <linearGradient id="colorGoal" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#06b6d4" stopOpacity={0.1}/><stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/></linearGradient>
          </defs>
          <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333', fontSize: '8px', fontFamily: 'monospace' }} />
          <Area type="monotone" dataKey="goal" stroke="#06b6d4" strokeDasharray="3 3" fillOpacity={1} fill="url(#colorGoal)" />
          <Area type="monotone" dataKey="actual" stroke="#ef4444" strokeWidth={2} fillOpacity={1} fill="url(#colorActual)" />
          <XAxis dataKey="time" hide /><YAxis hide domain={[0, 65]} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

const NeuralScarringGallery = ({ activities }: { activities: ActivityRecord[] }) => {
  const distractions = useMemo(() => {
    return activities
      .filter(a => a.isDistraction)
      .slice(-8);
  }, [activities]);

  if (distractions.length === 0) return (
    <div className="bg-[#050505] border border-white/5 p-6 flex flex-col items-center justify-center opacity-20 min-h-[120px]">
       <Shield size={24} className="mb-2" />
       <p className="text-[7px] font-black uppercase tracking-widest">NO_SCARRING_DETECTED</p>
    </div>
  );

  return (
    <div className="bg-[#050505] border border-white/10 p-5 relative overflow-hidden group flex flex-col gap-4">
       <div className="flex justify-between items-center relative z-10">
          <p className="font-mono text-[8px] text-red-700 tracking-[0.3em] uppercase flex items-center gap-2">
            <Skull size={12} className="text-red-600 animate-pulse"/> Neural_Scarring_Array
          </p>
          <span className="text-[6px] font-mono text-slate-800 uppercase">Sector_0xBF</span>
       </div>
       
       <div className="h-[100px] flex items-center justify-center gap-4 relative py-2">
          {distractions.map((d, i) => {
            const durationMinutes = (d.endTime - d.startTime) / 60000;
            const intensity = Math.min(1.5, durationMinutes / 10); 
            const pulseSpeed = Math.max(0.1, 2.5 - (intensity * 2.3)); 
            const size = 40 + (intensity * 80); 
            const rotation = ((i % 2 === 0 ? 1 : -1) * (15 + (intensity * 35)));

            return (
              <div key={d.id} className="relative group/scar">
                <div 
                  className="jagged-scar scar-bleeding bg-red-600/80 hover:bg-red-400 transition-all cursor-crosshair relative z-10"
                  style={{ 
                    width: `${size * 0.5}px`, 
                    height: `${size}px`,
                    animationDuration: `${pulseSpeed}s`,
                    opacity: 0.4 + (intensity * 0.6),
                    transform: `rotate(${rotation}deg)`,
                    boxShadow: intensity > 0.5 ? `0 0 ${40 * intensity}px rgba(255,0,0,0.8)` : 'none',
                    filter: `blur(${0.5 * intensity}px)`
                  }}
                />
                
                <div 
                  className="absolute inset-0 jagged-scar bg-red-600 opacity-40 blur-2xl animate-pulse"
                  style={{ 
                    transform: `rotate(${rotation}deg) scale(${1 + intensity})`, 
                    animationDuration: `${pulseSpeed * 0.5}s` 
                  }}
                />

                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 opacity-0 group-hover/scar:opacity-100 transition-all duration-300 pointer-events-none z-50 translate-y-2 group-hover/scar:translate-y-0">
                  <div className="bg-black border border-red-600 p-3 shadow-[0_0_40px_rgba(255,0,0,0.5)] min-w-[150px]">
                    <div className="flex justify-between items-center mb-1.5 border-b border-red-900 pb-1">
                      <span className="text-[6px] font-black text-red-600 uppercase tracking-widest flex items-center gap-1">
                        <PulseIcon size={8} /> TRACE_LOG
                      </span>
                      <span className="text-[5px] font-mono text-slate-800">SEQ_{i.toString().padStart(2, '0')}</span>
                    </div>
                    <p className="text-[11px] font-black text-white uppercase tracking-tighter truncate max-w-[160px] mb-1">{d.appName}</p>
                    <div className="flex justify-between items-end">
                      <p className="text-[9px] font-black font-mono text-red-500">{durationMinutes.toFixed(1)}M_LOSS</p>
                      <div className="h-1 flex-1 mx-2 bg-red-900/30 relative overflow-hidden mb-1">
                         <div className="absolute inset-0 bg-red-600 shadow-[0_0_10px_red]" style={{ width: `${Math.min(100, (durationMinutes/30)*100)}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
       </div>
    </div>
  );
};

const AmbitionDriftMonitor = ({ stats, settings }: { stats: any, settings: UserSettings }) => {
  const workHours = stats.work / 60;
  const progressPercent = Math.min(100, (workHours / settings.targetWorkHours) * 100);
  const driftPercent = Math.max(0, 100 - progressPercent);
  const remainingHours = Math.max(0, settings.targetWorkHours - workHours);

  const getStatus = () => {
    if (driftPercent > 90) return "GHOST_PHASE";
    if (driftPercent > 50) return "UNSTABLE_LINK";
    if (driftPercent > 10) return "REALIZING_POTENTIAL";
    return "DIRECTIVE_SYNCED";
  };

  return (
    <div className="bg-[#050505] border border-white/10 p-5 relative overflow-hidden group shadow-lg">
      <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity">
        <Ghost size={60} className="text-white" />
      </div>
      
      <div className="relative z-10 space-y-4">
        <div className="flex justify-between items-start">
           <div className="flex flex-col">
              <span className="text-[7px] font-black text-red-900 uppercase tracking-[0.4em]">Ambition_Drift</span>
              <h3 className="text-lg font-black text-white uppercase mt-0.5 leading-none tracking-tighter">POTENTIAL_GAP</h3>
           </div>
           <div className="flex flex-col items-end">
              <span className="text-[6px] font-mono text-slate-800 uppercase">System_State</span>
              <span className="text-[8px] font-black text-red-600 font-mono uppercase">{getStatus()}</span>
           </div>
        </div>

        <div className="space-y-2">
           <div className="flex justify-between text-[7px] font-mono text-slate-700 uppercase">
              <span className="flex items-center gap-1"><TrendingDown size={8}/> Drift_From_Directive</span>
              <span>{driftPercent.toFixed(1)}%</span>
           </div>
           <div className="h-1 w-full bg-slate-950 overflow-hidden relative">
              <div 
                className="h-full bg-red-600/40 transition-all duration-1000 ease-out absolute right-0" 
                style={{ width: `${driftPercent}%` }}
              ></div>
           </div>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
           <div className="flex flex-col">
              <span className="text-[6px] font-black text-slate-800 uppercase tracking-widest">Missing_Effort</span>
              <span className="text-lg font-black font-mono text-white">{remainingHours.toFixed(1)}H</span>
           </div>
           <div className="flex flex-col">
              <span className="text-[6px] font-black text-slate-800 uppercase tracking-widest">Neural_Waste</span>
              <span className="text-lg font-black font-mono text-red-900">{(stats.waste / 60).toFixed(1)}H</span>
           </div>
        </div>
        
        <p className="text-[6px] font-mono text-slate-900 uppercase italic opacity-40">
           The ghost is the version of you that completed the mission.
        </p>
      </div>
    </div>
  );
};

export const Dashboard: React.FC<Props> = ({ settings, activities, onReset, onLogActivity, onUpdateSettings }) => {
  const [activeTab, setActiveTab] = useState<DashboardTab>('main');
  const [verdict, setVerdict] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [localTime, setLocalTime] = useState(new Date().toLocaleTimeString());
  const lastProcessedActivityRef = useRef<number>(0);

  const [tempMission, setTempMission] = useState(settings.mission);
  const [tempHours, setTempHours] = useState(settings.targetWorkHours);

  useEffect(() => {
    const timer = setInterval(() => setLocalTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  const stats = useMemo(() => {
    const work = activities.filter(a => !a.isDistraction).reduce((acc, curr) => acc + (curr.endTime - curr.startTime) / 60000, 0);
    const waste = activities.filter(a => a.isDistraction).reduce((acc, curr) => acc + (curr.endTime - curr.startTime) / 60000, 0);
    const focusScore = (work + waste) > 0 ? Math.round((work / (work + waste)) * 100) : 100;
    
    const demonTotals: Record<string, number> = {};
    activities.filter(a => a.isDistraction).forEach(a => { demonTotals[a.appName] = (demonTotals[a.appName] || 0) + (a.endTime - a.startTime) / 60000; });
    const demonData = Object.entries(demonTotals).sort(([, a], [, b]) => b - a).slice(0, 6).map(([name, value]) => ({ subject: name.toUpperCase(), A: value }));
    
    const lastActivity = activities[activities.length - 1];

    return { work, waste, focusScore, demonData, lastActivity };
  }, [activities]);

  const handleGenerateVerdict = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    const text = await getBrutalVerdict(settings, activities);
    setVerdict(text);
    lastProcessedActivityRef.current = activities.length;
    setIsGenerating(false);
  };

  useEffect(() => {
    if (activeTab === 'main' && activities.length > lastProcessedActivityRef.current && activities.length > 0) {
      const timer = setTimeout(() => {
         handleGenerateVerdict();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [activeTab, activities.length]);

  const handleSaveSettings = () => {
    onUpdateSettings({ ...settings, mission: tempMission, targetWorkHours: tempHours });
    setActiveTab('main');
  };

  return (
    <div className="min-h-screen max-h-screen bg-black text-white flex overflow-hidden font-sans no-scrollbar">
      
      <div className="w-16 border-r border-white/5 flex flex-col items-center py-10 justify-between bg-black z-50 shrink-0">
         <div className="flex flex-col items-stretch w-full">
            <div className="flex justify-center mb-12">
               <div className="w-10 h-10 bg-red-600 flex items-center justify-center animate-pulse shadow-[0_0_20px_rgba(255,0,0,0.4)]">
                  <Eye size={20} className="text-white" />
               </div>
            </div>
            
            <nav className="flex flex-col gap-2">
              <button 
                onClick={() => setActiveTab('main')} 
                className={`w-full py-5 flex justify-center transition-all relative group ${activeTab === 'main' ? 'text-red-600 bg-red-600/5' : 'text-slate-800 hover:text-slate-400 hover:bg-white/[0.02]'}`}
              >
                <LayoutGrid size={22} className={`transition-all ${activeTab === 'main' ? 'drop-shadow-[0_0_8px_rgba(220,38,38,0.5)]' : ''}`} />
                {activeTab === 'main' && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[3px] h-8 bg-red-600 shadow-[0_0_12px_red]"></div>
                )}
              </button>
              
              <button 
                onClick={() => setActiveTab('settings')} 
                className={`w-full py-5 flex justify-center transition-all relative group ${activeTab === 'settings' ? 'text-red-600 bg-red-600/5' : 'text-slate-800 hover:text-slate-400 hover:bg-white/[0.02]'}`}
              >
                <Shield size={22} className={`transition-all ${activeTab === 'settings' ? 'drop-shadow-[0_0_8px_rgba(220,38,38,0.5)]' : ''}`} />
                {activeTab === 'settings' && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[3px] h-8 bg-red-600 shadow-[0_0_12px_red]"></div>
                )}
              </button>
              
              <button 
                onClick={() => setActiveTab('logs')} 
                className={`w-full py-5 flex justify-center transition-all relative group ${activeTab === 'logs' ? 'text-red-600 bg-red-600/5' : 'text-slate-800 hover:text-slate-400 hover:bg-white/[0.02]'}`}
              >
                <Wifi size={22} className={`transition-all ${activeTab === 'logs' ? 'drop-shadow-[0_0_8px_rgba(220,38,38,0.5)]' : ''}`} />
                {activeTab === 'logs' && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[3px] h-8 bg-red-600 shadow-[0_0_12px_red]"></div>
                )}
              </button>
            </nav>
         </div>

         <div className="mb-4">
            <HazardTerminateButton onReset={onReset} />
         </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden no-scrollbar">
        <header className="w-full border-b border-white/5 px-8 py-4 flex justify-between items-center bg-black/80 backdrop-blur-md z-40 shrink-0">
           <div className="flex items-center gap-8">
              <div className="flex flex-col">
                <span className={`text-[9px] font-black tracking-[0.4em] uppercase flex items-center gap-2 ${stats.lastActivity?.isDistraction ? 'text-red-700' : 'text-cyan-600 animate-pulse'}`}>
                   {stats.lastActivity?.isDistraction ? <Skull size={12} /> : <Zap size={12} />} 
                   {stats.lastActivity?.isDistraction ? 'FEEDING_THE_VOID' : 'PUSHING_THE_CORE'}
                </span>
                <span className="text-[7px] font-mono text-slate-800 mt-0.5 uppercase tracking-tighter">SURVEILLANCE_ACTIVE</span>
              </div>
              <div className="h-6 w-[1px] bg-white/5"></div>
              <div className="flex flex-col">
                <span className="text-[7px] font-mono text-slate-800 uppercase tracking-widest">Integrity</span>
                <span className="text-[10px] font-black text-white font-mono mt-0.5">{stats.focusScore}%</span>
              </div>
           </div>

           {/* TODAY'S BIGGEST FAILURE GLOBAL TICKER */}
           <div className="flex-1 px-10 flex justify-center">
              <GlobalShameTicker />
           </div>
           
           <div className="flex flex-col items-end">
             <span className="text-[6px] font-black text-red-950 uppercase tracking-[0.1em] flex items-center gap-1"><Globe size={8} /> Node_Clock</span>
             <div className="font-mono text-[10px] font-black text-red-700">{localTime}</div>
           </div>
        </header>

        <main className="flex-1 overflow-y-auto no-scrollbar p-6 lg:p-10 bg-[#020202]">
          <div className="max-w-[1200px] mx-auto space-y-10">
            
            {activeTab === 'main' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-10">
                <section className="relative p-8 border border-white/10 bg-white/[0.02] overflow-hidden group">
                   <div className="absolute inset-0 bg-gradient-to-r from-red-600/[0.01] to-transparent pointer-events-none"></div>
                   <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 relative z-10">
                      <div className="flex items-start gap-6">
                        <div className="p-4 bg-red-600/10 border border-red-600/20 text-red-600 shrink-0"><Target size={32} /></div>
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black text-red-600 tracking-[0.4em] uppercase">Directive</span>
                            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white leading-none mt-2">{settings.mission}</h1>
                        </div>
                      </div>
                      <div className="flex gap-10 border-l border-white/10 pl-10 hidden lg:flex">
                        <div className="text-right"><p className="text-[8px] font-mono text-slate-800 uppercase mb-1">Quota</p><span className="text-2xl font-black font-mono text-white">{settings.targetWorkHours}H</span></div>
                        <div className="text-right"><p className="text-[8px] font-mono text-slate-800 uppercase mb-1">Yield</p><span className="text-2xl font-black font-mono text-red-700">{stats.focusScore}%</span></div>
                      </div>
                   </div>
                </section>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-start">
                  <div className="xl:col-span-4 flex flex-col gap-8">
                    <AmbitionDriftMonitor stats={stats} settings={settings} />
                    
                    <NeuralScarringGallery activities={activities} />
                    
                    <div className="bg-[#050505] border border-white/5 p-6 flex flex-col">
                       <p className="font-mono text-[8px] text-slate-800 tracking-[0.3em] uppercase mb-6 flex items-center gap-2"><Flame size={12}/> Neural_Waste_Distribution</p>
                       <div className="h-[250px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <RadarChart data={stats.demonData}>
                              <PolarGrid stroke="#111" />
                              <PolarAngleAxis dataKey="subject" tick={{ fill: '#333', fontSize: 7, fontWeight: 900 }} />
                              <Radar name="Void" dataKey="A" stroke="#ef4444" fill="#ef4444" fillOpacity={0.4} />
                            </RadarChart>
                          </ResponsiveContainer>
                       </div>
                    </div>
                  </div>

                  <div className="xl:col-span-8 space-y-10">
                    <TemporalIntegrityChart activities={activities} />

                    <div className="bg-[#050505] border border-white/10 p-8 relative overflow-hidden flex flex-col shadow-2xl min-h-[450px]">
                       <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-600/[0.02] to-transparent h-1/4 animate-scan-v pointer-events-none"></div>
                       <div className="relative z-10 flex flex-col h-full">
                          <div className="flex justify-between items-center border-b border-white/10 pb-6 mb-8">
                             <div className="flex items-center gap-4">
                                <Hexagon size={24} className="text-red-700 animate-spin" style={{ animationDuration: '8s' }} />
                                <h2 className="text-[11px] font-black uppercase tracking-[0.6em] text-white">Neural_Output_Stream</h2>
                             </div>
                             {isGenerating && (
                               <div className="px-4 py-1 bg-red-600 text-white text-[8px] font-black uppercase tracking-widest animate-pulse">
                                 GENERATING_VERDICT...
                               </div>
                             )}
                          </div>

                          <div className="flex-1 overflow-y-auto no-scrollbar">
                             {isGenerating ? (
                               <div className="flex flex-col items-center justify-center h-full gap-4">
                                  <Dna size={32} className="text-red-700 animate-spin" />
                                  <span className="text-[9px] font-black uppercase tracking-[0.3em] animate-pulse">Processing_Neural_Failures...</span>
                               </div>
                             ) : verdict ? (
                               <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                  <p className="text-xl md:text-2xl font-black uppercase tracking-tight text-white leading-relaxed first-letter:text-5xl first-letter:text-red-700 first-letter:float-left first-letter:mr-3">
                                     {verdict}
                                  </p>
                                  <div className="mt-auto pt-8 border-t border-white/5 flex justify-between font-mono text-[8px] text-slate-800 uppercase">
                                     <span>AI_CONFIDENCE: 99.98%</span>
                                     <div className="h-[2px] w-32 bg-red-800"></div>
                                  </div>
                               </div>
                             ) : (
                               <div className="flex-1 flex flex-col items-center justify-center opacity-10 gap-6 py-10">
                                  <Database size={80} className="text-slate-500" />
                                  <p className="text-[12px] font-black uppercase tracking-[1em]">IDLE_NEURAL_LINK</p>
                               </div>
                             )}
                          </div>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-3xl space-y-10 pb-10 no-scrollbar">
                 <div className="border-b border-white/10 pb-6">
                    <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase text-white">Settings</h2>
                    <p className="text-[9px] font-mono text-slate-800 uppercase tracking-[0.5em] mt-1">Recalibrating_Node_0x{settings.mission.slice(0,4)}</p>
                 </div>

                 <div className="space-y-10">
                    <section className="space-y-3">
                       <label className="text-[9px] font-black text-red-700 uppercase tracking-widest flex items-center gap-3"><Terminal size={14}/> Primary Directive</label>
                       <input 
                        className="w-full bg-black border-b border-white/5 p-5 font-mono text-2xl uppercase font-black outline-none focus:border-red-600 transition-all text-white" 
                        value={tempMission} 
                        onChange={e => setTempMission(e.target.value.toUpperCase())} 
                       />
                    </section>

                    <section className="space-y-3">
                       <label className="text-[9px] font-black text-red-700 uppercase tracking-widest flex items-center gap-3"><Timer size={14}/> Daily Quota</label>
                       <div className="flex flex-wrap gap-1 p-3 border border-white/5 bg-white/[0.01]">
                          {Array.from({length: 16}).map((_, i) => (
                             <button key={i} onClick={() => setTempHours(i+1)} className={`w-8 h-8 md:w-10 md:h-10 transition-all text-[9px] font-black flex items-center justify-center ${i+1 <= tempHours ? 'bg-red-600 text-white shadow-[0_0_10px_red]' : 'bg-slate-950 text-slate-800'}`}>
                                {i+1}
                             </button>
                          ))}
                       </div>
                       <div className="flex items-center gap-4 mt-2">
                          <span className="text-5xl font-black font-mono text-white leading-none">{tempHours}</span>
                          <span className="text-xs font-black text-slate-900 uppercase">Hours_Allocated</span>
                       </div>
                    </section>

                    <div className="flex gap-4 pt-6">
                       <button onClick={handleSaveSettings} className="flex-1 bg-white text-black py-6 font-black uppercase tracking-[0.4em] hover:bg-red-600 hover:text-white transition-all text-sm flex items-center justify-center gap-4">
                          <Save size={20} /> Commit_Changes
                       </button>
                    </div>
                 </div>
              </div>
            )}

            {activeTab === 'logs' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-8 pb-10 no-scrollbar">
                 <div className="border-b border-white/10 pb-6">
                    <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase">Buffer</h2>
                    <p className="text-[9px] font-mono text-slate-800 uppercase tracking-[0.5em] mt-1">Decryption_History</p>
                 </div>
                 <div className="bg-[#050505] border border-white/10 divide-y divide-white/5">
                    {activities.length > 0 ? activities.slice().reverse().map((a, i) => (
                      <div key={a.id} className="grid grid-cols-12 p-4 font-mono text-[9px] hover:bg-white/[0.01] transition-all">
                        <div className={`col-span-1 font-black ${a.isDistraction ? 'text-red-950' : 'text-cyan-950'}`}>{a.isDistraction ? 'VOID' : 'CORE'}</div>
                        <div className="col-span-3 text-slate-600 font-black uppercase truncate pr-4">{a.appName}</div>
                        <div className="col-span-6 text-slate-800 truncate italic pr-6">{a.windowTitle}</div>
                        <div className="col-span-2 text-right text-slate-900 font-bold">{new Date(a.startTime).toLocaleTimeString()}</div>
                      </div>
                    )) : (
                      <div className="p-10 text-center opacity-20 font-mono text-[10px] uppercase tracking-widest">NO_LOGGED_DATA</div>
                    )}
                 </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
