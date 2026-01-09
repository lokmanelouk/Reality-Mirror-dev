
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  LineChart, Line, Tooltip, AreaChart, Area
} from 'recharts';
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
  Info,
  AlertOctagon,
  Flame,
  Ghost,
  Globe,
  TrendingDown,
  Clock,
  ZapOff,
  TrendingUp,
  UserCheck,
  ShieldAlert,
  UserX,
  Fingerprint
} from 'lucide-react';

interface Props {
  settings: UserSettings;
  activities: ActivityRecord[];
  onReset: () => void;
  onLogActivity: (record: ActivityRecord) => void;
}

// --- Component: ScarredButton (Mental Fog Simulation) ---
const ScarredButton = ({ 
  onClick, 
  children, 
  className, 
  isScarred, 
  disabled,
  icon: Icon
}: { 
  onClick: () => void | Promise<void>; 
  children?: React.ReactNode; 
  className?: string; 
  isScarred: boolean;
  disabled?: boolean;
  icon?: any;
}) => {
  const [holding, setHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<number | null>(null);
  const holdDuration = 1500; // 1.5s hold required when scarred

  const startHold = () => {
    if (disabled) return;
    if (!isScarred) {
      onClick();
      return;
    }
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
        onClick();
      }
    }, 20);
  };

  const endHold = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setHolding(false);
    setProgress(0);
  };

  return (
    <button
      onMouseDown={startHold}
      onMouseUp={endHold}
      onMouseLeave={endHold}
      onTouchStart={startHold}
      onTouchEnd={endHold}
      disabled={disabled}
      className={`${className} relative transition-all active:scale-95 ${isScarred && holding ? 'bg-red-950 text-red-600' : ''}`}
    >
      {isScarred && progress > 0 && (
        <div 
          className="absolute left-0 bottom-0 h-full bg-red-600/30 transition-all pointer-events-none" 
          style={{ width: `${progress}%` }}
        ></div>
      )}
      <div className="relative z-10 flex items-center justify-center gap-2">
        {Icon && <Icon size={10} className={isScarred && holding ? 'animate-spin' : ''} />}
        {isScarred && holding ? 'FOCUSING...' : children}
        {isScarred && !holding && !disabled && <Fingerprint size={10} className="opacity-40 animate-pulse" />}
      </div>
    </button>
  );
};

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

const NeuralSynthesis = ({ stepIndex }: { stepIndex: number }) => {
  const progress = ((stepIndex + 1) / LOADING_STEPS.length) * 100;
  
  return (
    <div className="flex flex-col items-center justify-center gap-12 w-full max-w-md relative z-10 p-8">
       <div className="relative">
          <div className="absolute inset-0 bg-red-600/10 blur-2xl animate-pulse rounded-full"></div>
          <div className="relative w-32 h-32 border-2 border-dashed border-red-600/20 rounded-full flex items-center justify-center animate-spin" style={{ animationDuration: '8s' }}>
             <div className="w-24 h-24 border border-white/10 rounded-full flex items-center justify-center animate-reverse-spin" style={{ animationDuration: '4s' }}>
                <Dna size={32} className="text-red-600 animate-pulse" />
             </div>
          </div>
       </div>

       <div className="w-full space-y-6">
          <div className="flex flex-col gap-2">
             <div className="flex justify-between items-end font-mono text-[9px] uppercase tracking-widest text-red-600 font-black">
                <span className="flex items-center gap-2"><Activity size={10} className="animate-bounce" /> {LOADING_STEPS[stepIndex].text}</span>
                <span>{Math.round(progress)}%</span>
             </div>
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
       </div>
    </div>
  );
};

// --- Component: Ghost of Potential ---
const GhostOfPotential = ({ stats, settings }: { stats: any, settings: UserSettings }) => {
  const ghostWork = settings.targetWorkHours * 60; // Minutes
  const actualWork = stats.work;
  const gap = ghostWork - actualWork;
  const productivityMultiplier = actualWork > 0 ? Math.round((ghostWork / actualWork) * 100) : 1000;

  return (
    <div className="relative group overflow-hidden border border-white/5 bg-white/[0.01] p-6 mb-6">
      <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-20 transition-opacity">
        <Ghost size={80} className="text-white" />
      </div>
      
      <div className="relative z-10 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/5 border border-white/10 text-slate-400">
            <Ghost size={16} className="animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] font-black text-slate-500 tracking-[0.3em] uppercase">Spectral_Anchor</span>
            <h4 className="text-[10px] font-black uppercase text-white tracking-widest">Ghost_of_Potential</h4>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-[8px] font-mono text-slate-600 uppercase">
              <span>Actualization_Gap</span>
              <span className="text-red-600 font-black">-{Math.max(0, gap)} MIN</span>
            </div>
            <div className="w-full h-1 bg-slate-900 overflow-hidden flex">
              <div 
                className="h-full bg-cyan-500/40" 
                style={{ width: `${Math.min(100, (actualWork / ghostWork) * 100)}%` }}
              ></div>
              <div 
                className="h-full bg-white/5 animate-pulse" 
                style={{ width: `${Math.max(0, 100 - (actualWork / ghostWork) * 100)}%` }}
              ></div>
            </div>
          </div>

          <div className="p-3 bg-white/[0.02] border border-white/5">
             <p className="text-[9px] font-mono text-slate-400 uppercase leading-relaxed italic">
               "The Version of You That Succeeded is currently <span className="text-white font-black">{productivityMultiplier}%</span> more productive. They are existing while you are merely consuming."
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Component: Circadian Heatmap ---
const CircadianHeatmap = ({ activities }: { activities: ActivityRecord[] }) => {
  const hourlyData = useMemo(() => {
    const hours = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      work: 0,
      waste: 0,
    }));

    activities.forEach(a => {
      const startHour = new Date(a.startTime).getHours();
      const duration = (a.endTime - a.startTime) / 60000;

      // Simplification: assign to start hour
      if (a.isDistraction) {
        hours[startHour].waste += duration;
      } else {
        hours[startHour].work += duration;
      }
    });

    return hours;
  }, [activities]);

  const vulnerability = useMemo(() => {
    let maxWaste = 0;
    let worstHour = -1;
    hourlyData.forEach(h => {
      if (h.waste > maxWaste) {
        maxWaste = h.waste;
        worstHour = h.hour;
      }
    });
    return worstHour;
  }, [hourlyData]);

  return (
    <div className="bg-white/[0.01] border border-white/5 p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-mono text-[8px] text-slate-700 tracking-[0.3em] uppercase font-black flex items-center gap-2">
          <Clock size={10} /> Circadian_Vulnerability
        </h3>
        {vulnerability !== -1 && (
          <div className="flex items-center gap-2 text-red-600 font-black text-[7px] tracking-widest animate-pulse">
            <ZapOff size={10} /> CRITICAL_VULNERABILITY_WINDOW: {vulnerability}:00
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-12 gap-1">
        {hourlyData.map((h, i) => {
          const total = h.work + h.waste;
          const wasteRatio = total > 0 ? h.waste / total : 0;
          const isVulnerable = h.hour === vulnerability && h.waste > 0;
          
          let bgColor = 'bg-slate-900/40';
          if (total > 0) {
            if (wasteRatio > 0.6) bgColor = 'bg-red-600';
            else if (wasteRatio > 0.2) bgColor = 'bg-red-900/60';
            else bgColor = 'bg-cyan-500/60';
          }

          return (
            <div 
              key={i}
              className={`h-10 relative group transition-all duration-300 border border-white/5 ${bgColor} ${isVulnerable ? 'cell-vulnerable vibration-active' : ''}`}
            >
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/80 z-10">
                <span className="text-[6px] font-mono text-white">{h.hour}:00</span>
              </div>
              {h.waste > 20 && (
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-red-600 shadow-[0_0_8px_red]"></div>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex justify-between font-mono text-[6px] text-slate-800 uppercase tracking-widest pt-2">
        <span>00:00</span>
        <span>12:00</span>
        <span>23:59</span>
      </div>
    </div>
  );
};

// --- Component: Neural Scarring Timeline ---
const NeuralScarring = ({ activities }: { activities: ActivityRecord[] }) => {
  if (activities.length === 0) return null;

  const totalDuration = activities.reduce((acc, a) => acc + (a.endTime - a.startTime), 0);

  return (
    <div className="w-full h-12 bg-black border border-white/5 relative flex items-center px-1 overflow-hidden">
      <div className="absolute top-0 left-0 p-1 font-mono text-[6px] text-slate-800 uppercase tracking-widest z-10">Neural_Scarring_Stream</div>
      {activities.map((a, i) => {
        const width = ((a.endTime - a.startTime) / totalDuration) * 100;
        return (
          <div 
            key={a.id} 
            className={`h-6 group relative transition-all duration-500 hover:h-8 ${a.isDistraction ? 'bg-red-600 jagged-scar scar-bleeding mx-[1px]' : 'bg-white h-[2px] mx-0.5 opacity-60'}`}
            style={{ width: `${width}%` }}
            title={`${a.appName}: ${Math.round((a.endTime - a.startTime)/60000)}m`}
          >
             <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black border border-white/10 p-1 hidden group-hover:block z-50 whitespace-nowrap">
                <p className="text-[6px] font-mono uppercase text-white">{a.appName}</p>
             </div>
          </div>
        );
      })}
    </div>
  );
};

// --- Component: Global Void Ticker (Expanded for Social Shame) ---
const GlobalVoidTicker = () => {
  const [secondsLost, setSecondsLost] = useState(142084910);
  const [tickerMode, setTickerMode] = useState<'global' | 'shame'>('global');
  const [mockFailure, setMockFailure] = useState({ id: 'ID_VOID_772', hours: '8.4H', activity: 'DIGITAL_ROT' });
  
  const failures = useMemo(() => [
    { id: 'VOID_NODE_88', hours: '9.1H', activity: 'BINGE_LOOP' },
    { id: 'ALPHA_NULL', hours: '12.4H', activity: 'ENDLESS_SCROLL' },
    { id: 'ID_BRAVO_9', hours: '7.8H', activity: 'NEURAL_STAGNATION' },
    { id: 'ANON_USER_X', hours: '15.2H', activity: 'DEEP_VOID_FEED' },
    { id: 'MIRROR_SLAVE_3', hours: '10.0H', activity: 'SOCIAL_DECAY' }
  ], []);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLost(prev => prev + Math.floor(Math.random() * 40) + 10);
    }, 1200);

    const switchTimer = setInterval(() => {
      setTickerMode(prev => {
        if (prev === 'global') {
          const randomFailure = failures[Math.floor(Math.random() * failures.length)];
          setMockFailure(randomFailure);
          return 'shame';
        }
        return 'global';
      });
    }, 10000);

    return () => {
      clearInterval(timer);
      clearInterval(switchTimer);
    };
  }, [failures]);

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return {
      h: h.toLocaleString(),
      m: m.toString().padStart(2, '0'),
      s: s.toString().padStart(2, '0')
    };
  };

  const time = formatTime(secondsLost);

  return (
    <div className="flex items-center gap-4 border-l border-white/5 pl-4 group w-[220px]">
      <div className={`flex flex-col items-end w-full transition-all duration-500 ${tickerMode === 'shame' ? 'translate-y-[-2px]' : ''}`}>
        {tickerMode === 'global' ? (
          <>
            <span className="text-[7px] font-black text-red-600/50 uppercase tracking-[0.2em] flex items-center gap-1">
              <Globe size={8} /> GLOBAL_POTENTIAL_LOST
            </span>
            <div className="font-mono text-[10px] font-black text-red-600 flex items-center gap-1 group-hover:glitch-active transition-all">
              <TrendingDown size={10} className="animate-pulse" />
              <span>{time.h}H</span>
              <span className="opacity-40">{time.m}M</span>
              <span className="opacity-20">{time.s}S</span>
            </div>
          </>
        ) : (
          <>
            <span className="text-[7px] font-black text-white/50 uppercase tracking-[0.2em] flex items-center gap-1">
              <ShieldAlert size={8} className="text-red-600" /> TOP_INDIVIDUAL_SHAME
            </span>
            <div className="font-mono text-[9px] font-black text-white flex items-center gap-2 glitch-active">
              <UserX size={10} className="text-red-600" />
              <span className="text-red-600">{mockFailure.id}</span>
              <span className="opacity-40">|</span>
              <span>{mockFailure.hours}</span>
              <span className="text-[6px] opacity-20 hidden md:inline">{mockFailure.activity}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// --- Component: TemporalIntegrityChart (Ghost of Potential) ---
const TemporalIntegrityChart = ({ activities, settings }: { activities: ActivityRecord[], settings: UserSettings }) => {
  const chartData = useMemo(() => {
    // Last 12 hours
    const now = new Date();
    const data = [];
    const hourlyTargetMinutes = (settings.targetWorkHours * 60) / 24;

    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 3600000);
      const h = d.getHours();
      
      const hourWork = activities
        .filter(a => !a.isDistraction)
        .filter(a => new Date(a.startTime).getHours() === h)
        .reduce((acc, curr) => acc + (curr.endTime - curr.startTime) / 60000, 0);

      data.push({
        time: `${h}:00`,
        actual: Math.round(hourWork),
        ghost: Math.round(60), // The 'Perfect' version works consistently
      });
    }
    return data;
  }, [activities, settings]);

  return (
    <div className="h-[200px] w-full bg-white/[0.01] border border-white/5 p-4 relative group">
      <div className="absolute top-2 left-4 z-10">
        <p className="text-[7px] font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
          <Activity size={10} /> Temporal_Integrity_Contrast
        </p>
      </div>
      <div className="absolute top-2 right-4 z-10 flex gap-4">
        <div className="flex items-center gap-1">
          <div className="w-2 h-[2px] bg-white"></div>
          <span className="text-[6px] text-slate-700 uppercase">Actual</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-[2px] bg-cyan-500 opacity-30 border border-dashed border-cyan-500"></div>
          <span className="text-[6px] text-cyan-900 uppercase">Ghost</span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ffffff" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorGhost" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.05}/>
              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="time" 
            hide 
          />
          <YAxis hide domain={[0, 65]} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.1)', fontSize: '8px', fontFamily: 'monospace' }}
            itemStyle={{ color: '#fff' }}
          />
          <Area 
            type="monotone" 
            dataKey="ghost" 
            stroke="#06b6d4" 
            strokeDasharray="5 5"
            strokeOpacity={0.2} 
            fillOpacity={1} 
            fill="url(#colorGhost)" 
            isAnimationActive={false}
          />
          <Area 
            type="monotone" 
            dataKey="actual" 
            stroke="#ffffff" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorActual)" 
          />
        </AreaChart>
      </ResponsiveContainer>
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
    
    const demonTotals: Record<string, number> = {};
    activities.filter(a => a.isDistraction).forEach(a => {
      demonTotals[a.appName] = (demonTotals[a.appName] || 0) + (a.endTime - a.startTime) / 60000;
    });

    const demonData = Object.entries(demonTotals)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 6)
      .map(([name, value]) => ({ subject: name.toUpperCase(), A: value, fullMark: Math.max(...Object.values(demonTotals)) }));

    return {
      work: workMinutes,
      waste: wasteMinutes,
      goal: settings.targetWorkHours * 60,
      focusScore: (workMinutes + wasteMinutes) > 0 ? Math.round((workMinutes / (workMinutes + wasteMinutes)) * 100) : 100,
      demonData
    };
  }, [activities, settings]);

  const isScarred = stats.focusScore < 30;

  const entropy = useMemo(() => {
    const score = stats.focusScore;
    if (score >= 90) return 0;
    return (100 - score) / 100;
  }, [stats.focusScore]);

  useEffect(() => {
    document.documentElement.style.setProperty('--entropy-level', entropy.toString());
  }, [entropy]);

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

  const showBreach = entropy > 0.6;

  return (
    <div className={`min-h-screen max-h-screen bg-black text-white flex overflow-hidden relative ${entropy > 0.4 ? 'aberration-active' : ''} ${isScarred ? 'scarring-active' : ''}`}>
      
      {showBreach && (
        <div className="fixed inset-0 z-[60] breach-overlay pointer-events-none flex items-center justify-center">
          <div className="bg-red-600/20 backdrop-blur-md p-10 border border-red-600 flex flex-col items-center gap-4 animate-pulse">
             <AlertOctagon size={48} className="text-red-600" />
             <p className="font-mono text-xs text-red-600 font-black tracking-[0.5em] uppercase">REALITY_FAILURE_DETECTED</p>
             <p className="font-mono text-[8px] text-red-600/60 uppercase">VOID_CONCENTRATION_CRITICAL</p>
          </div>
        </div>
      )}

      {/* Sidebar Rail */}
      <div className={`w-16 lg:w-20 border-r border-white/5 flex flex-col items-center py-6 justify-between bg-black z-50 shrink-0 relative overflow-hidden ${isScarred ? 'scarring-jitter' : ''}`}>
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
            <ScarredButton onClick={onReset} isScarred={isScarred} icon={Trash2} className="p-2 text-slate-800 hover:text-red-600 transition-colors">
               <span className="hidden">RESET</span>
            </ScarredButton>
            <button className="hover:text-white transition-colors"><Settings size={16} /></button>
         </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Header Bar */}
        <div className="w-full border-b border-white/5 px-6 py-4 flex justify-between items-center font-mono text-[8px] tracking-[0.4em] uppercase text-slate-600 bg-black/50 backdrop-blur-sm shrink-0">
           <div className="flex items-center gap-4">
              <span className={`text-red-600 font-black flex items-center gap-2 ${entropy > 0.3 ? 'glitch-active' : ''} ${isScarred ? 'scarring-text' : ''}`}>
                 <Activity size={10} className="animate-pulse" /> STATUS: 0x{stats.focusScore.toString(16).toUpperCase()}
              </span>
              <div className="h-2 w-[1px] bg-slate-900"></div>
              <span className={isScarred ? 'scarring-text' : ''}>GOAL: {settings.targetWorkHours}H</span>
           </div>
           
           <div className="flex items-center gap-6">
              <GlobalVoidTicker />
              <div className="h-4 w-[1px] bg-white/5"></div>
              <span className="animate-pulse flex items-center gap-2"><Radio size={10} /> {localTime}</span>
              <div className="h-2 w-[1px] bg-slate-900"></div>
              <span>V3.2.0_GHOST</span>
           </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar bg-black p-6 lg:p-10">
          <div className="w-full flex flex-col gap-10 max-w-[1400px]">
            
            <div className={`relative p-6 border border-white/5 bg-white/[0.01] overflow-hidden ${isScarred ? 'scarring-jitter' : ''}`}>
               <div className="absolute top-0 left-0 w-2 h-2 bg-red-600"></div>
               <div className="absolute bottom-0 right-0 w-2 h-2 bg-white/20"></div>
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                  <div className="flex items-center gap-5">
                     <div className="p-3 bg-red-600/10 border border-red-600/20 text-red-600">
                        <Crosshair size={24} />
                     </div>
                     <div className="flex flex-col">
                        <div className="flex items-center gap-3">
                           <span className="text-[10px] font-black text-red-600 tracking-[0.4em] uppercase">Active_Directive</span>
                           <div className="h-[1px] w-6 bg-slate-800"></div>
                           <span className="text-[7px] font-mono text-slate-700 uppercase">OBJ_ID: {Math.random().toString(36).substr(2, 6).toUpperCase()}</span>
                        </div>
                        <h1 className={`text-2xl md:text-3xl lg:text-4xl font-black uppercase tracking-tighter leading-none transition-all duration-700 ${isVerdictHovered || entropy > 0.5 ? 'text-red-600 glitch-active' : 'text-slate-100'} ${isScarred ? 'scarring-text' : ''}`}>
                           {settings.mission}
                        </h1>
                     </div>
                  </div>
                  <div className={`flex items-center gap-8 border-l border-white/5 pl-8 hidden lg:flex ${isScarred ? 'scarring-text' : ''}`}>
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
              
              <div className="xl:col-span-5 space-y-6 min-w-0">
                <GhostOfPotential stats={stats} settings={settings} />

                <div className={`bg-white/[0.01] border border-white/5 p-6 relative overflow-hidden group ${entropy > 0.6 ? 'animate-flicker-intense' : ''} ${isScarred ? 'scarring-jitter' : ''}`}>
                  <div className="flex justify-between items-start mb-6 relative z-10">
                    <div className="space-y-1">
                       <p className={`font-mono text-[8px] text-slate-700 tracking-[0.3em] uppercase font-black ${isScarred ? 'scarring-text' : ''}`}>Demon_Concentration</p>
                       <div className="h-[1px] w-6 bg-red-600"></div>
                    </div>
                  </div>

                  {stats.demonData.length > 0 ? (
                    <div className="h-[250px] w-full mb-6 relative z-10">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={stats.demonData}>
                          <PolarGrid stroke="#1a1a1a" />
                          <PolarAngleAxis dataKey="subject" tick={{ fill: '#334155', fontSize: 6, fontWeight: 900 }} />
                          <Radar name="Void" dataKey="A" stroke="#ff0000" fill="#ff0000" fillOpacity={0.4} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="h-[250px] flex items-center justify-center opacity-10">
                      <p className="text-[8px] font-mono uppercase tracking-[1em]">VOID_STABLE</p>
                    </div>
                  )}

                  <CircadianHeatmap activities={activities} />

                  <div className="grid grid-cols-2 gap-3 relative z-10 mt-6">
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
                   <ScarredButton 
                     onClick={() => simulateActivity(false)} 
                     isScarred={isScarred} 
                     icon={Zap}
                     className={`group relative py-4 border border-white/5 text-[8px] font-black uppercase tracking-[0.3em] overflow-hidden hover:bg-white hover:text-black transition-all ${isScarred ? 'scarring-jitter' : ''}`}
                   >
                     Push_Core
                   </ScarredButton>
                   <ScarredButton 
                     onClick={() => simulateActivity(true)} 
                     isScarred={isScarred} 
                     icon={Skull}
                     className={`group relative py-4 border border-red-900/20 text-red-900/60 text-[8px] font-black uppercase tracking-[0.3em] overflow-hidden hover:bg-red-600 hover:text-white transition-all ${isScarred ? 'scarring-jitter' : ''}`}
                   >
                     Feed_Void
                   </ScarredButton>
                </div>
              </div>

              <div className="xl:col-span-7 space-y-6 min-w-0">
                 {/* Ghost of Potential Chart */}
                 <TemporalIntegrityChart activities={activities} settings={settings} />

                 <div className="relative group/verdict" onMouseEnter={() => setIsVerdictHovered(true)} onMouseLeave={() => setIsVerdictHovered(false)}>
                    <div className={`bg-white text-black p-8 lg:p-10 min-h-[450px] relative overflow-hidden transition-all duration-700 flex flex-col ${isVerdictHovered ? 'shadow-[30px_30px_0px_rgba(255,0,0,0.1)] ring-2 ring-red-600/10' : 'shadow-[10px_10px_0px_rgba(255,255,255,0.02)]'} ${isScarred ? 'scarring-jitter' : ''}`}>
                      <div className="relative z-10 flex flex-col h-full">
                        <div className="flex justify-between items-center gap-6 mb-8 border-b border-black/[0.06] pb-6">
                          <h2 className={`text-[9px] font-black uppercase tracking-[0.5em] flex items-center gap-2 ${isVerdictHovered ? 'text-red-600' : 'text-black/40'} ${isScarred ? 'scarring-text' : ''}`}>
                            <Database size={10} /> Neural_Output
                          </h2>
                          <ScarredButton 
                            onClick={handleGenerateVerdict}
                            isScarred={isScarred}
                            disabled={isGenerating || activities.length === 0}
                            icon={Layers}
                            className={`group relative text-[8px] font-black uppercase tracking-[0.2em] px-5 py-2.5 border border-black transition-all ${isGenerating ? 'opacity-30 cursor-not-allowed' : 'hover:bg-black hover:text-white'}`}
                          >
                            {isGenerating ? 'ANALYZING...' : 'REFRESH'}
                          </ScarredButton>
                        </div>
                        {isGenerating ? (
                          <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden">
                             <NeuralSynthesis stepIndex={loadingStep} />
                          </div>
                        ) : verdict ? (
                          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700 flex-1">
                            <p className={`text-lg md:text-xl font-black tracking-tighter leading-tight uppercase transition-all duration-700 ${isVerdictHovered || entropy > 0.4 ? 'vibration-active' : ''} ${isScarred ? 'scarring-text' : ''}`}>
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

                 {/* Neural Scarring & History */}
                 <div className="space-y-4 min-w-0">
                    <div className="flex justify-between items-end border-b border-white/5 pb-3">
                       <h3 className={`text-[9px] font-black uppercase text-slate-800 tracking-[0.6em] flex items-center gap-2 ${isScarred ? 'scarring-text' : ''}`}>
                          <History size={10} /> Neural_Log
                       </h3>
                       <span className="font-mono text-[8px] text-slate-900 uppercase tracking-[0.3em]">{activities.length} ENTRIES</span>
                    </div>

                    <NeuralScarring activities={activities} />

                    <div className="grid grid-cols-1 gap-[1px] bg-white/[0.01] max-h-[350px] overflow-y-auto custom-scrollbar pr-2">
                       {activities.length === 0 ? (
                         <div className="py-24 text-center">
                           <p className="text-[8px] font-mono text-slate-900 uppercase tracking-[1.2em]">EMPTY_BUFFER</p>
                         </div>
                       ) : (
                         [...activities].reverse().slice(0, 15).map((a, i) => (
                           <div key={a.id} className={`group flex items-center gap-4 p-4 bg-black/40 border border-transparent hover:border-white/5 transition-all ${isScarred ? 'scarring-jitter' : ''}`}>
                              <div className="font-mono text-[8px] text-slate-900 w-6">0x{i.toString(16).toUpperCase()}</div>
                              <div className="flex-1 min-w-0 flex items-center justify-between">
                                 <div className="min-w-0">
                                    <p className={`text-xs font-black uppercase tracking-wider mb-0.5 truncate pr-2 ${a.isDistraction ? 'text-red-900' : 'text-slate-300'} ${entropy > 0.4 && a.isDistraction ? 'glitch-active' : ''} ${isScarred && a.isDistraction ? 'scarring-text' : ''}`}>
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
                                    <p className={`text-[8px] font-black tracking-tighter ${a.isDistraction ? 'text-red-950' : 'text-slate-700'}`}>
                                       {Math.round((a.endTime - a.startTime)/60000)}M
                                    </p>
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
