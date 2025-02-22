import React, { useState } from 'react';

interface FormData {
  location: string;
  // ... other form fields
}

const [formData, setFormData] = useState<FormData>({
  location: '',
  // ... other initial values
});

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setFormData(prev => ({
    ...prev,
    [e.target.name]: e.target.value
  }));
};

<input
  type="text"
  name="location"
  placeholder="Add your location"
  className="bg-gray-700 text-white rounded p-2"
  value={formData.location}
  onChange={handleChange}
/> 