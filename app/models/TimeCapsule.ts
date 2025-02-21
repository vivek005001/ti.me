import mongoose from 'mongoose';

const timeCapsuleSchema = new mongoose.Schema({
  description: { type: String, required: true },
  caption: { type: String, required: true },
  fileUrl: { type: String, required: true },
  fileType: { type: String, enum: ['image', 'video', 'text'], required: true },
  endTime: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const TimeCapsule = mongoose.models.TimeCapsule || mongoose.model('TimeCapsule', timeCapsuleSchema); 