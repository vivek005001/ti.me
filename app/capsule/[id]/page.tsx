'use client';
import { useEffect, useState, useRef } from 'react';
import { TimeCapsuleData } from '@/app/types';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

export default function CapsulePage({ params }: { params: { id: string } }) {
  const [capsule, setCapsule] = useState<TimeCapsuleData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const fetchCapsule = async () => {
      try {
        const response = await fetch(`/api/timeCapsules/${params.id}`);
        const data = await response.json();
        if (data.capsule) {
          setCapsule(data.capsule);
        }
      } catch (error) {
        console.error('Failed to fetch capsule:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCapsule();
  }, [params.id]);

  const handlePlayPause = async () => {
    if (audioRef.current) {
      try {
        if (isPlaying) {
          await audioRef.current.pause();
        } else {
          // Load the audio first if needed
          if (audioRef.current.readyState === 0) {
            await audioRef.current.load();
          }
          await audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
      } catch (error) {
        console.error('Error playing audio:', error);
        alert('Failed to play audio. The format might not be supported by your browser.');
      }
    }
  };

  if (isLoading || !isLoaded) {
    return <div className="min-h-screen bg-black text-white p-8">Loading...</div>;
  }

  if (!capsule) {
    return <div className="min-h-screen bg-black text-white p-8">Capsule not found</div>;
  }

  const isUnlocked = new Date(capsule.endTime) <= new Date();
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen glass mt-28 mx-6 rounded-xl text-white p-8">
      <div className="max-w-6xl mx-auto">
        <button 
          onClick={() => router.back()} 
          className="mb-8 flex items-center text-gray-400 hover:text-white transition-colors"
        >
          <span className="material-icons mr-2">arrow_back</span>
          Back
        </button>

        {/* Audio Player */}
        {isUnlocked && capsule.audioFile && (
          <div className="mb-8 glass p-4 rounded-xl">
            <button 
              onClick={handlePlayPause} 
              className="flex items-center text-gray-400 hover:text-white transition-colors"
            >
              <span className="material-icons mr-2">
                {isPlaying ? 'pause' : 'play_arrow'}
              </span>
              {isPlaying ? 'Pause Audio' : 'Play Audio'}
            </button>
            <audio 
              ref={audioRef} 
              preload="metadata"
              className="w-full mt-4"
            >
              <source src={capsule.audioFile.fileData} type="audio/webm;codecs=opus" />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Media Gallery */}
          <div className="glass rounded-xl p-6 space-y-4">
            {isUnlocked ? (
              <div className="grid grid-cols-2 gap-4">
                {capsule.files.map((file, index) => (
                  <div key={index} className="aspect-square bg-white/5 rounded-xl overflow-hidden hover:scale-105 transition-transform duration-300">
                    {file.fileType === 'image' ? (
                      <img 
                        src={file.fileData}
                        alt={`${capsule.caption} - ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <video 
                        src={file.fileData}
                        controls
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="aspect-square bg-white/5 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <div className="text-center p-8">
                  <span className="material-icons text-6xl mb-4 text-yellow-500">lock</span>
                  <p className="text-xl font-medium">This capsule is still locked</p>
                  <p className="text-gray-400 mt-2">Unlocks on {formatDate(capsule.endTime)}</p>
                </div>
              </div>
            )}
          </div>

          {/* Capsule Details */}
          <div className="glass rounded-xl p-6 space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-4">{capsule.caption}</h1>
              <p className="text-gray-300 text-lg leading-relaxed">{capsule.description}</p>
            </div>

            <div className="space-y-4 mt-8">
              <div className="flex items-center gap-3 text-gray-300">
                <span className="material-icons text-yellow-500/80">person</span>
                <span>{user?.fullName || 'Anonymous'}</span>
              </div>

              {capsule.location && (
                <div className="flex items-center gap-3 text-gray-300">
                  <span className="material-icons text-yellow-500/80">location_on</span>
                  <span>{capsule.location}</span>
                </div>
              )}

              <div className="flex items-center gap-3 text-gray-300">
                <span className="material-icons text-yellow-500/80">schedule</span>
                <div className="space-y-1">
                  <div>Created: {formatDate(capsule.createdAt)}</div>
                  <div>Unlocks: {formatDate(capsule.endTime)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 