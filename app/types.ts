export interface TimeCapsuleData {
  _id: string;
  caption: string;
  description: string;
  endTime: string;
  createdAt: string;
  fileType?: 'image' | 'video';
  fileData?: string;
  userId: string;
} 