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
  const inputRef = useRef<HTMLInputElement>(null);
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    if (!window.google || !inputRef.current) return;

    const autocomplete = new google.maps.places.Autocomplete(inputRef.current);
    
    const listener = autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place.formatted_address) {
        setInternalValue(place.formatted_address);
        onChange(place.formatted_address);
      }
    });

    return () => {
      google.maps.event.removeListener(listener);
    };
  }, []); // Empty dependency array

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInternalValue(e.target.value);
    onChange(e.target.value);
  };

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={internalValue}
        onChange={handleInputChange}
        placeholder="Add location"
        className="w-full bg-gray-800 rounded p-3 pl-10"
      />
      <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
        <span className="material-icons text-gray-400">location_on</span>
      </span>
    </div>
  );
} 