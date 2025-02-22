'use client'
import React, { useState, useEffect } from 'react'
import TimeCapsuleCard from './components/TimeCapsuleCard'
import { mockTimeCapsules } from './data/mockData'
import { TimeCapsuleData } from './types'
import { useAuth, useUser } from '@clerk/nextjs'
import ErrorBoundary from './components/ErrorBoundary'

interface FormData {
  description: string;
  caption: string;
  file: File | null;
  endTime: string;
  files: File[];
}

const Page = () => {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const { user } = useUser();
  const [formData, setFormData] = useState<FormData>({
    description: '',
    caption: '',
    file: null,
    endTime: '',
    files: []
  });

  const [timeCapsules, setTimeCapsules] = useState<TimeCapsuleData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Add state for controlling modal positions
  const [fileInputPos, setFileInputPos] = useState<{ x: number, y: number } | null>(null);
  const [dateInputPos, setDateInputPos] = useState<{ x: number, y: number } | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (isLoaded && isSignedIn) {
          const token = await getToken();
          // Use token for API calls
        }
      } catch (error) {
        console.error('Authentication error:', error);
        // Handle error appropriately
      }
    };

    initAuth();
  }, [isLoaded, isSignedIn, getToken]);

  useEffect(() => {
    fetchTimeCapsules();
  }, []);

  const fetchTimeCapsules = async () => {
    try {
      const response = await fetch('/api/timeCapsules');
      const result = await response.json();
      if (result.capsules) {
        setTimeCapsules(result.capsules);
      }
    } catch (error) {
      console.error('Failed to fetch time capsules:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setFormData(prev => ({
        ...prev,
        files: Array.from(e.target.files!)
      }));
    }
  };

  // Function to handle icon clicks and position the inputs
  const handleIconClick = (e: React.MouseEvent, type: 'file' | 'date') => {
    const rect = e.currentTarget.getBoundingClientRect();
    const position = {
      x: rect.left,
      y: rect.bottom + window.scrollY
    };
    
    if (type === 'file') {
      setFileInputPos(fileInputPos ? null : position);
      setDateInputPos(null);
    } else {
      setDateInputPos(dateInputPos ? null : position);
      setFileInputPos(null);
    }
  };

  const handleDateSelect = (day: number) => {
    const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setFormData(prev => ({
      ...prev,
      endTime: selectedDate.toISOString()
    }));
    setShowCalendar(false);
  };

  const changeMonth = (offset: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + offset);
    setCurrentDate(newDate);
  };

  const changeYear = (offset: number) => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(currentDate.getFullYear() + offset);
    setCurrentDate(newDate);
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
    const firstDay = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-8" />);
    }

    // Add the days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(
        <button
          key={day}
          onClick={() => handleDateSelect(day)}
          className="h-8 w-8 rounded-full hover:bg-zinc-700 flex items-center justify-center text-white"
        >
          {day}
        </button>
      );
    }

    return days;
  };

  const handleSubmit = async () => {
    try {
      if (!formData.description || !formData.caption || !formData.endTime) {
        alert('Please fill in all required fields');
        return;
      }

      const filesData = await Promise.all(
        formData.files.map(async (file) => {
          const fileData = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
          });

          return {
            fileType: file.type.startsWith('image') ? 'image' as const : 'video' as const,
            fileData
          };
        })
      );

      const newCapsule: TimeCapsuleData = {
        _id: '',
        userId: user?.id || '',
        description: formData.description,
        caption: formData.caption,
        files: filesData,
        endTime: formData.endTime,
        createdAt: new Date().toISOString()
      };

      const response = await fetch('/api/timeCapsules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCapsule),
      });

      const result = await response.json();
      
      if (result.success) {
        fetchTimeCapsules();
        setFormData({
          description: '',
          caption: '',
          file: null,
          endTime: '',
          files: []
        });
      }
    } catch (error) {
      console.error('Failed to create time capsule:', error);
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-900">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-900">
        <div className="text-white">
          Please sign in to continue
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-zinc-900 p-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-zinc-800 rounded-2xl p-8">
            <h1 className="text-4xl text-white font-normal mb-8">Welcome Back!</h1>
            
            <div className="flex gap-4 mb-4">
              <textarea
                name="description"
                placeholder="What's your time capsule idea?"
                value={formData.description}
                onChange={handleInputChange}
                className="w-[70%] bg-zinc-900 rounded-lg p-4 text-white resize-none placeholder:text-zinc-400"
                rows={6}
              />
              
              <textarea
                name="caption"
                placeholder="Caption"
                value={formData.caption}
                onChange={handleInputChange}
                className="w-[30%] bg-zinc-900 rounded-lg p-4 text-white resize-none placeholder:text-zinc-400"
                rows={6}
              />
            </div>

            <div className="flex justify-between items-center relative">
              <div className="flex gap-4">
                {/* Link icon */}
                <button 
                  className="text-white relative"
                  onClick={(e) => handleIconClick(e, 'file')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  
                  {fileInputPos && (
                    <div 
                      className="absolute z-10 mt-2"
                      style={{ 
                        top: '100%',
                        left: 0,
                      }}
                    >
                      <input
                        type="file"
                        onChange={handleFileChange}
                        className="w-64 bg-zinc-900 rounded-lg p-3 text-white"
                        accept="image/*,video/*,text/*"
                      />
                    </div>
                  )}
                </button>
                
                {/* Calendar icon */}
                <button 
                  className="text-white relative"
                  onClick={() => setShowCalendar(!showCalendar)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  
                  {showCalendar && (
                    <div className="absolute z-10 mt-2 p-4 bg-zinc-800 rounded-lg shadow-xl" style={{ width: '300px' }}>
                      {/* Calendar Header */}
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => changeMonth(-1)} className="text-white hover:bg-zinc-700 p-1 rounded">
                            ←
                          </button>
                          <select 
                            value={currentDate.getMonth()} 
                            onChange={(e) => {
                              const newDate = new Date(currentDate);
                              newDate.setMonth(parseInt(e.target.value));
                              setCurrentDate(newDate);
                            }}
                            className="bg-zinc-800 text-white border-none outline-none"
                          >
                            {months.map((month, index) => (
                              <option key={month} value={index}>{month}</option>
                            ))}
                          </select>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button onClick={() => changeYear(-1)} className="text-white hover:bg-zinc-700 p-1 rounded">
                            ←
                          </button>
                          <span className="text-white">{currentDate.getFullYear()}</span>
                          <button onClick={() => changeYear(1)} className="text-white hover:bg-zinc-700 p-1 rounded">
                            →
                          </button>
                        </div>
                        
                        <button onClick={() => changeMonth(1)} className="text-white hover:bg-zinc-700 p-1 rounded">
                          →
                        </button>
                      </div>

                      {/* Day headers */}
                      <div className="grid grid-cols-7 gap-1 mb-2">
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                          <div key={day} className="text-center text-zinc-400 text-sm">
                            {day}
                          </div>
                        ))}
                      </div>

                      {/* Calendar grid */}
                      <div className="grid grid-cols-7 gap-1">
                        {renderCalendar()}
                      </div>
                    </div>
                  )}
                </button>
              </div>

              <button
                onClick={handleSubmit}
                className="bg-black text-white px-6 py-2 rounded-lg"
              >
                Create
              </button>
            </div>
          </div>

          <div className="hidden">
            // ... existing code for file input and time capsules grid ...
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

const UpcomingEvents = () => {
  return (
    <div className="upcoming-events-panel">
      <h2>Upcoming capsule events</h2>
      
      {/* Event items */}
      <div className="event-item">
        <div className="event-icon">
          {/* Add your SVG icon here */}
        </div>
        <div className="event-details">
          <div className="event-title">Outdoor gathering</div>
          <div className="event-meta">Sat 16 June, Venue Name</div>
        </div>
      </div>
      
      {/* Repeat similar structure for other events */}
    </div>
  );
};

export default Page;