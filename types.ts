
export interface ThemeConfig {
  id: string;
  name: string;
  subtitle: string;
  monthName: string;
  monthIndex: number; // 0-11
  bgGradient: string;
  accentColor: string;
  fontFamily: string;
  icon: string;
  description: string;
  particleType: 'stars' | 'bubbles' | 'leaves' | 'rain' | 'snow' | 'none';
  geminiPrompt: string;
  gameTitle: string;
}
