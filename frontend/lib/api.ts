const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface BusinessIdea {
  userId: string;
  name: string;
  description: string;
  sector: string;
  resources?: any;
}

export interface AssessmentInput {
  carbonFootprint: number;
  waterUsage: number;
  wasteGenerated: number;
  renewableEnergy: boolean;
  jobsCreated: number;
  communityImpact: number;
}

export const api = {
  async createUser(email: string, name: string) {
    const res = await fetch(`${API_URL.replace('/api', '')}/api/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name }),
    });
    return res.json();
  },

  async createBusinessIdea(idea: BusinessIdea) {
    const res = await fetch(`${API_URL}/business/ideas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(idea),
    });
    return res.json();
  },

  async assessIdea(ideaId: string, input: AssessmentInput) {
    const res = await fetch(`${API_URL}/business/ideas/${ideaId}/assess`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    return res.json();
  },

  async getIdeas() {
    const res = await fetch(`${API_URL}/business/ideas`);
    return res.json();
  },
};