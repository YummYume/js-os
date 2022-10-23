declare module '*.html?raw' {
  const content: string;
  export default content;
}

declare module '*.scss' {
  const content: string;
  export default content;
}

interface BatteryManager {
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
  level: number;
  addEventListener: (event: 'chargingchange' | 'levelchange' | 'chargingtimechange' | 'dischargingtimechange', callback: EventListenerOrEventListenerObject | null, options?: boolean | AddEventListenerOptions | undefined) => void;
  removeEventListener: (event: 'chargingchange' | 'levelchange' | 'chargingtimechange' | 'dischargingtimechange', callback: EventListenerOrEventListenerObject | null, options?: boolean | AddEventListenerOptions | undefined) => void;
}

interface Navigator {
  getBattery: () => Promise<BatteryManager>;
}
