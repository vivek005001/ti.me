export interface TimeCapsuleData {
  id?: string;
  description: string;
  caption: string;
  fileData: string; // Base64 encoded file data
  fileType: 'image' | 'video' | 'text';
  endTime: string;
  createdAt: string;
} 