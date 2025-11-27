export interface User {
    id: string;
    name?: string | null;
    email: string;
    image?: string | null;
    timezone: string;
    location?: string | null;
    trialEndsAt?: Date | null;
    isPremium: boolean;
    subscriptionTier?: string | null;
  }
  
  export interface DailyNote {
    id: string;
    userId: string;
    date: Date;
    content: string;
    aiParsed: boolean;
    entities?: any;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface Task {
    id: string;
    userId: string;
    title: string;
    description?: string | null;
    completed: boolean;
    priority: string;
    dueDate?: Date | null;
    dueTime?: string | null;
    category?: string | null;
    linkedPageId?: string | null;
    aiGenerated: boolean;
    aiIntent?: string | null;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface FollowUp {
    id: string;
    userId: string;
    title: string;
    description?: string | null;
    completed: boolean;
    priority: string;
    dueDate?: Date | null;
    source?: string | null;
    sourceId?: string | null;
    linkedPageId?: string | null;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface VoiceRecording {
    id: string;
    userId: string;
    audioUrl: string;
    transcription?: string | null;
    duration?: number | null;
    analyzed: boolean;
    mom?: string | null;
    keyDecisions?: any;
    actionItems?: any;
    followUps?: any;
    detectedPages?: any;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface WeatherData {
    temp: number;
    condition: string;
    icon: string;
    location: string;
  }