export interface User {
  id: string;
  name: string;
  last: string;
  email: string;
  createdAt: string;
  isActive: boolean;
}

export interface Counters {
  issues?: number;
  highlightsGiven?: number;
  highlightsReceived?: number;
}
