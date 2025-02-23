export interface TimeCapsuleData {
  _id: string;
  caption: string;
  description: string;
  endTime: string;
  createdAt: string;
  files: {
    fileType: 'image' | 'video';
    fileData: string;
  }[];
  userId: string;
  groupId: string;
  location?: string;
}

export interface Group {
  _id: string;
  name: string;
  description: string;
  createdBy: string;
  members: string[];
  createdAt: string;
  isPrivate: boolean;
} 