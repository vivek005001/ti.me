'use client';
import { useState, useRef, useEffect } from 'react';

interface LocationInputProps {
  value: string;
  onChange: (value: string) => void;
}

interface Suggestion {
  display_name: string;
  // Additional fields from Nominatim response can be added here if needed.
}

export default function LocationInput({ value, onChange }: LocationInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Function to fetch suggestions from Nominatim
  const fetchSuggestions = async (query: string) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    // Only search if input is at least 3 characters
    if (newValue.length < 3) {
      setSuggestions([]);
      return;
    }

    // Debounce API calls to avoid overloading the free API
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(() => {
      fetchSuggestions(newValue);
    }, 300);
  };

  const handleSelectSuggestion = (suggestion: Suggestion) => {
    onChange(suggestion.display_name);
    setSuggestions([]);
    setIsOpen(false);
  };

  return (
    <div className="inline-flex items-center relative">
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
            onChange={handleInputChange}
            placeholder="Add location"
            className="w-full bg-black p-3 rounded-xl text-white"
          />
          {suggestions.length > 0 && (
            <ul className="bg-white text-black mt-2 rounded-xl shadow-lg max-h-60 overflow-auto">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="p-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => handleSelectSuggestion(suggestion)}
                >
                  {suggestion.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
