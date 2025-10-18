export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department: 'input' | 'output' | 'playout' | 'admin' | 'management';
  role: 'reporter' | 'editor' | 'producer' | 'director' | 'admin' | 'manager';
  fullName: string;
  permissions: string[];
  preferences: {
    theme: 'light' | 'dark' | 'auto';
    notifications: {
      email: boolean;
      push: boolean;
      desktop: boolean;
    };
    dashboard: {
      layout: string;
      widgets: string[];
    };
  };
  workSchedule: {
    timezone: string;
    workingHours: {
      start: string;
      end: string;
    };
    workingDays: string[];
  };
  lastLogin: string | null;
  isActive: boolean;
}

export type StoryStatus = 
  | 'draft' 
  | 'submitted' 
  | 'under_review' 
  | 'approved' 
  | 'rejected' 
  | 'scheduled' 
  | 'broadcasted' 
  | 'archived';

export type StoryPriority = 
  | 'low' 
  | 'normal' 
  | 'high' 
  | 'urgent' 
  | 'breaking';

export type StoryCategory = 
  | 'breaking' 
  | 'politics' 
  | 'business' 
  | 'sports' 
  | 'entertainment' 
  | 'technology' 
  | 'health' 
  | 'world' 
  | 'local' 
  | 'weather';

export interface MediaItem {
  url: string;
  caption?: string;
  alt?: string;
  order?: number;
  duration?: number;
  thumbnail?: string;
  name?: string;
  type?: string;
  size?: number;
}

export interface StoryMedia {
  images: MediaItem[];
  videos: MediaItem[];
  audio: MediaItem[];
  documents: MediaItem[];
}

export interface StoryMetadata {
  wordCount: number;
  readingTime: number;
  language: string;
  location?: {
    city?: string;
    state?: string;
    country?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  source: 'original' | 'wire' | 'press_release' | 'social_media' | 'interview' | 'press_conference';
  externalId?: string;
  externalUrl?: string;
}

export interface StoryScheduling {
  publishAt?: string;
  broadcastAt?: string;
  duration?: number; // in minutes
  channel?: string;
  segment?: string;
}

export interface WorkflowStep {
  step: string;
  status: 'pending' | 'in_progress' | 'completed' | 'skipped';
  assignedTo?: string;
  startedAt?: string;
  completedAt?: string;
  comments?: string;
}

export interface StoryWorkflow {
  currentStep: string;
  steps: WorkflowStep[];
  estimatedCompletion?: string;
  actualCompletion?: string;
}

export interface StoryAnalytics {
  views: number;
  shares: number;
  engagement: number;
  feedback: {
    positive: number;
    negative: number;
    neutral: number;
  };
}

export interface StoryVersion {
  content: string;
  modifiedBy: string;
  modifiedAt: string;
  reason: string;
}

export interface Story {
  id: string;
  title: string;
  slug?: string;
  content: string;
  summary?: string;
  category: StoryCategory;
  priority: StoryPriority;
  status: StoryStatus;
  department: 'input' | 'output' | 'playout';
  author: User;
  assignedTo?: User;
  reviewers?: Array<{
    user: User;
    status: 'pending' | 'approved' | 'rejected';
    comments?: string;
    reviewedAt?: string;
  }>;
  tags: string[];
  media: StoryMedia;
  metadata: StoryMetadata;
  scheduling?: StoryScheduling;
  workflow: StoryWorkflow;
  analytics: StoryAnalytics;
  isBreaking: boolean;
  isArchived: boolean;
  archivedAt?: string;
  version: number;
  previousVersions?: StoryVersion[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateStoryData {
  title: string;
  content: string;
  summary?: string;
  category: StoryCategory;
  priority: StoryPriority;
  tags: string[];
  media?: Partial<StoryMedia>;
  metadata?: Partial<StoryMetadata>;
  scheduling?: Partial<StoryScheduling>;
}

export interface UpdateStoryData extends Partial<CreateStoryData> {
  status?: StoryStatus;
  assignedTo?: string;
  reviewers?: Array<{
    user: string;
    status: 'pending' | 'approved' | 'rejected';
    comments?: string;
  }>;
  workflow?: Partial<StoryWorkflow>;
}