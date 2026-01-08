
export const COLORS = {
  bg: '#000000',
  accent: '#FF0000',
  white: '#FFFFFF',
  slate950: '#020617',
  slate900: '#0F172A',
  slate800: '#1E293B',
  slate700: '#334155',
  discord: '#5865F2',
  steam: '#1b2838',
  netflix: '#E50914',
  spotify: '#1DB954',
  vscode: '#007ACC',
  terminal: '#00C853'
};

export const BRAND_CONFIG: Record<string, { color: string; icon: string }> = {
  youtube: { color: '#FF0000', icon: 'Youtube' },
  netflix: { color: '#E50914', icon: 'Play' },
  discord: { color: '#5865F2', icon: 'MessageSquare' },
  steam: { color: '#FF3B3B', icon: 'Gamepad2' },
  twitter: { color: '#1DA1F2', icon: 'Twitter' },
  x: { color: '#FFFFFF', icon: 'Twitter' },
  reddit: { color: '#FF4500', icon: 'MessageCircle' },
  facebook: { color: '#1877F2', icon: 'Facebook' },
  twitch: { color: '#9146FF', icon: 'Twitch' },
  tiktok: { color: '#EE1D52', icon: 'Music' },
  instagram: { color: '#E4405F', icon: 'Instagram' },
  linkedin: { color: '#0077B5', icon: 'Linkedin' },
  github: { color: '#FFFFFF', icon: 'Github' },
  slack: { color: '#4A154B', icon: 'Slack' },
  vscode: { color: '#007ACC', icon: 'Code' },
  terminal: { color: '#00C853', icon: 'Terminal' },
  spotify: { color: '#1DB954', icon: 'Music2' },
  chrome: { color: '#4285F4', icon: 'Chrome' },
  browser: { color: '#4285F4', icon: 'Globe' }
};

export const COMMON_DEMONS = [
  'YouTube', 'Netflix', 'Discord', 'Steam', 'Twitter', 'Reddit', 
  'Facebook', 'Twitch', 'TikTok', 'Instagram', 'Spotify', 'Chrome'
];

export const DEFAULT_BLACKLIST = [
  'YouTube', 'Netflix', 'Discord', 'Steam'
];

export const STORAGE_KEY = 'reality_mirror_settings_v2';
export const ACTIVITY_KEY = 'reality_mirror_activity_v2';
