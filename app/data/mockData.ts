import { TimeCapsuleData } from '../types';

export const mockTimeCapsules: TimeCapsuleData[] = [
  {
    id: '1',
    description: 'My first time capsule memory from our trip to the mountains',
    caption: 'Mountain Adventures 2024',
    fileUrl: '/images/mountain.jpg',
    fileType: 'image',
    endTime: '2024-12-31T23:59:59',
    createdAt: '2024-03-20T10:00:00'
  },
  {
    id: '2',
    description: 'Special video from the concert night',
    caption: 'Summer Concert 2024',
    fileUrl: '/videos/concert.mp4',
    fileType: 'video',
    endTime: '2024-06-30T23:59:59',
    createdAt: '2024-03-19T15:30:00'
  }
]; 