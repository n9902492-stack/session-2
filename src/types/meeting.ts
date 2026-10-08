export interface Participant {
  id: string;
  name: string;
  role: 'host' | 'co-host' | 'guest';
  avatarColor: string;
  isMuted: boolean;
  isCameraOff: boolean;
  isSpeaking: boolean;
  isHandRaised: boolean;
  isScreenSharing: boolean;
  isSelf: boolean;
  stream?: MediaStream | null;
  reaction?: string | null;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  text: string;
  timestamp: string;
  isSelf: boolean;
}

export interface ScheduledMeeting {
  id: string;
  code: string;
  title: string;
  host: string;
  date: string;
  time: string;
  durationMinutes: number;
  description: string;
}

export type VirtualBackground = 'none' | 'blur' | 'warm-glow' | 'studio-dark';

export interface DeviceSettings {
  audioInputId: string;
  videoInputId: string;
  virtualBackground: VirtualBackground;
  isNoiseSuppressed: boolean;
  resolution: '720p' | '1080p' | '4k';
}
