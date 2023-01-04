declare module '*.html?raw' {
  const content: string;

  export default content;
}

declare module '*.scss' {
  const content: string;

  export default content;
}

interface BatteryManager {
  readonly charging: boolean;
  readonly chargingTime: number;
  readonly dischargingTime: number;
  readonly level: number;
  addEventListener: (event: 'chargingchange' | 'levelchange' | 'chargingtimechange' | 'dischargingtimechange', callback: EventListenerOrEventListenerObject | null, options?: boolean | AddEventListenerOptions | undefined) => void;
  removeEventListener: (event: 'chargingchange' | 'levelchange' | 'chargingtimechange' | 'dischargingtimechange', callback: EventListenerOrEventListenerObject | null, options?: boolean | AddEventListenerOptions | undefined) => void;
}

interface NetworkInformation {
  readonly downlink: number;
  readonly downlinkMax: number | undefined;
  readonly effectiveType: 'slow-2g' | '2g' | '3g' | '4g';
  readonly rtt: number;
  readonly saveData: boolean;
  readonly type: 'bluetooth' | 'cellular' | 'ethernet' | 'none' | 'wifi' | 'wimax' | 'other' | 'unknown' | undefined;
  addEventListener: (event: 'change', callback: EventListenerOrEventListenerObject | null, options?: boolean | AddEventListenerOptions | undefined) => void;
  removeEventListener: (event: 'change', callback: EventListenerOrEventListenerObject | null, options?: boolean | AddEventListenerOptions | undefined) => void;
}

interface Navigator {
  readonly getBattery: () => Promise<BatteryManager>;
  readonly connection: NetworkInformation?;
  readonly mozConnection: NetworkInformation?;
  readonly navigator: NetworkInformation?;
}
