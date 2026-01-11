
export interface AITrend {
  id: string;
  title: string;
  description: string;
  sourceUrl?: string;
  category: string;
}

export interface LinkedInPost {
  content: string;
  hashtags: string[];
  suggestedImagePrompt: string;
}

export enum WorkflowStep {
  DISCOVER = 'DISCOVER',
  ANALYZE = 'ANALYZE',
  DRAFT = 'DRAFT',
  PUBLISHING = 'PUBLISHING',
  FINALIZE = 'FINALIZE'
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface LinkedInUser {
  name: string;
  role: string;
  avatar: string;
}
