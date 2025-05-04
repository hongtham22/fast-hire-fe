"use client";

import { useState, useEffect } from 'react';
import { Loader2, X } from 'lucide-react';
import { API_BASE_URL, getLocations, Location } from '@/lib/api';

interface CreateJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJobCreated: () => void;
}

export default function CreateJobModal({ isOpen, onClose, onJobCreated }: CreateJobModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [locationsLoading, setLocationsLoading] = useState(false);

  // Form state
  const [jobTitle, setJobTitle] = useState("");
  const [experienceYear, setExperienceYear] = useState(1);
  const [locationId, setLocationId] = useState("");
  const [mustHave, setMustHave] = useState("");
  const [niceToHave, setNiceToHave] = useState("");
  const [languageSkills, setLanguageSkills] = useState("");
  const [keyResponsibility, setKeyResponsibility] = useState("");
  const [ourOffer, setOurOffer] = useState("");
  const [expireDate, setExpireDate] = useState("");

  // Fetch locations on component mount
  useEffect(() => {
    const fetchLocations = async () => {
      setLocationsLoading(true);
      try {
        const { data, error } = await getLocations();
        if (error) {
          console.error('Error fetching locations:', error);
        } else if (data) {
          setLocations(data);
          // Set default location if available
          if (data.length > 0) {
            setLocationId(data[0].id);
          }
        }
      } catch (err) {
        console.error('Error fetching locations:', err);
      } finally {
        setLocationsLoading(false);
      }
    };

    if (isOpen) {
      fetchLocations();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Create job and extract keywords in one API call
      const response = await fetch(`${API_BASE_URL}/jobs/create-with-keywords`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobTitle,
          experienceYear,
          locationId: locationId || undefined,
          mustHave,
          niceToHave,
          languageSkills,
          keyResponsibility,
          ourOffer,
          expireDate: expireDate || undefined,
          status: 'approved'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create job');
      }

      // Success - notify parent component
      onJobCreated();
    } catch (err) {
      console.error('Error creating job:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between border-b p-4">
          <h2 className="text-xl font-bold">Create New Job Posting</h2>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded bg-red-50 text-red-700 text-sm">
              {error}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Title*
              </label>
              <input
                type="text"
                required
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                placeholder="e.g. Senior Software Engineer"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location*
              </label>
              {locationsLoading ? (
                <div className="flex items-center space-x-2 h-9 text-sm text-gray-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Loading locations...</span>
                </div>
              ) : (
                <select
                  value={locationId}
                  onChange={(e) => setLocationId(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  required
                >
                  <option value="" disabled>Select a location</option>
                  {locations.map((location) => (
                    <option key={location.id} value={location.id}>
                      {location.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Experience (years)*
              </label>
              <input
                type="number"
                required
                min="0"
                value={experienceYear}
                onChange={(e) => setExperienceYear(parseInt(e.target.value))}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expire Date
              </label>
              <input
                type="date"
                value={expireDate}
                onChange={(e) => setExpireDate(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Key Responsibilities
            </label>
            <textarea
              value={keyResponsibility}
              onChange={(e) => setKeyResponsibility(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm min-h-[100px]"
              placeholder="List the key responsibilities for this role"
            ></textarea>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Must Have Skills*
            </label>
            <textarea
              required
              value={mustHave}
              onChange={(e) => setMustHave(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm min-h-[100px]"
              placeholder="Required skills and qualifications"
            ></textarea>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nice to Have Skills
            </label>
            <textarea
              value={niceToHave}
              onChange={(e) => setNiceToHave(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm min-h-[100px]"
              placeholder="Preferred skills and qualifications"
            ></textarea>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Language Skills
            </label>
            <textarea
              value={languageSkills}
              onChange={(e) => setLanguageSkills(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              placeholder="Required language proficiency"
            ></textarea>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Our Offer
            </label>
            <textarea
              value={ourOffer}
              onChange={(e) => setOurOffer(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm min-h-[100px]"
              placeholder="Benefits, perks, and other offerings"
            ></textarea>
          </div>
          
          <div className="pt-4 border-t flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-70 flex items-center"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                'Create Job'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 