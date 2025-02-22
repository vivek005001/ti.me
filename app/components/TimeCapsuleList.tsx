'use client';
import React from 'react';
import TimeCapsuleCard from './TimeCapsuleCard';
import { TimeCapsuleData } from '../types';

interface TimeCapsuleListProps {
  timeCapsules: TimeCapsuleData[];
  isLoading: boolean;
}

export default function TimeCapsuleList({ timeCapsules, isLoading }: TimeCapsuleListProps) {
  if (isLoading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {timeCapsules.map(capsule => (
        <TimeCapsuleCard key={capsule._id} capsule={capsule} />
      ))}
    </div>
  );
} 