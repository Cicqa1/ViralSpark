export type Platform = 'LinkedIn' | 'Twitter';

export interface PostInput {
  topic: string;
  tone: string;
  industry: string;
  platform: Platform;
}

export interface PresetTopic {
  label: string;
  category: string;
  topic: string;
  tone: string;
  industry: string;
  platform: Platform;
}

export interface GenerationState {
  loading: boolean;
  error: string | null;
  result: string | null;
}

export interface HistoryItem {
  id: string;
  topic: string;
  tone: string;
  industry: string;
  platform: Platform;
  post: string;
  timestamp: string;
  webhookStatus?: 'sent' | 'failed' | 'none';
}
