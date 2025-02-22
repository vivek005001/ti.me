declare global {
  interface Window {
    google: typeof google;
  }
}

'use client';
import { useEffect, useRef, useState } from 'react';

interface LocationInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function LocationInput({ value, onChange }: LocationInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!window.google || !inputRef.current) return;

    const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
      fields: ['formatted_address'],
      types: ['geocode']
    });

    const listener = autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place.formatted_address) {
        onChange(place.formatted_address);
        setIsOpen(false);
      }
    });

    return () => {
      if (google && google.maps && listener) {
        google.maps.event.removeListener(listener);
      }
    };
  }, [onChange]);

  return (
    <div className="inline-flex items-center">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer p-3 hover:bg-zinc-800 rounded-xl"
      >
        <span className="material-icons text-white">location_on</span>
      </button>
      
      {isOpen && (
        <div className="absolute mt-2 ml-12 w-64 z-50">
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Add location"
            className="w-full bg-black p-3 rounded-xl text-white"
          />
        </div>
      )}
    </div>
  );
} 