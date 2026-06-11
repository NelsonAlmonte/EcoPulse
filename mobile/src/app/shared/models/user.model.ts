export interface User {
  id: string;
  name: string;
  last: string;
  email: string;
  createdAt: string;
  isActive: boolean;
  issues: number;
}

export interface Counters {
  issues: number;
  highlightsGiven: number;
  highlightsReceived: number;
}

export interface Bounds {
  north: number;
  south: number;
  east: number;
  west: number;
}
