"use client";

import { useState, useEffect } from 'react';
import { Loader2, X } from 'lucide-react';
import { getLocations, Location, apiCall } from '@/lib/api';
import MaxScoresEditor from './MaxScoresEditor';

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
  const [maxScores, setMaxScores] = useState<Record<string, number>>({});
  const [maxScoresError, setMaxScoresError] = useState<string | null>(null);

  const [jobTitle, setJobTitle] = useState("");
  const [experienceYear, setExperienceYear] = useState(1);
  const [locationId, setLocationId] = useState("");
  const [mustHave, setMustHave] = useState("");
  const [niceToHave, setNiceToHave] = useState("");
  const [languageSkills, setLanguageSkills] = useState("");
  const [keyResponsibility, setKeyResponsibility] = useState("");
  const [ourOffer, setOurOffer] = useState(`- Attractive salary based on your skills.
- 100% salary during the 2-month probation period.
- 13th-month salary and performance-based bonuses.
- 15-18 days of paid leave per year for employees with over 1 year of service.
- MacBook/ Laptop provided to meet your work requirements.
- Language support programs for learning Japanese and English.
- Performance appraisal and salary review twice a year.
- Full gross salary payment for compulsory insurance.
- Awards for outstanding performance on a quarterly and yearly basis.`);
  const [expireDate, setExpireDate] = useState("");

  const handleTextareaResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  };

  useEffect(() => {
    if (!isOpen) return;
    
    const resizeAllTextareas = () => {
      const textareas = document.querySelectorAll('textarea');
      textareas.forEach((textarea) => {
        const element = textarea as HTMLTextAreaElement;
        element.style.height = 'auto';
        element.style.height = element.scrollHeight + 'px';
      });
    };

    const timer = setTimeout(resizeAllTextareas, 200);
    
    return () => clearTimeout(timer);
  }, [isOpen, keyResponsibility, mustHave, niceToHave, languageSkills, ourOffer]);

  useEffect(() => {
    if (isOpen) {
      setError(null);
      setMaxScoresError(null);
    }
  }, [isOpen]);

  useEffect(() => {
    const fetchLocations = async () => {
      setLocationsLoading(true);
      try {
        const { data, error } = await getLocations();
        if (error) {
          console.error('Error fetching locations:', error);
        } else if (data) {
          setLocations(data);
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
  
  const handleMaxScoresChange = (scores: Record<string, number>) => {
    setMaxScores(scores);
    
    // Validate the total is 100
    const total = Object.values(scores).reduce((sum, score) => sum + score, 0);
    if (total !== 100) {
      setMaxScoresError(`Total score weights must equal 100. Current total: ${total}`);
    } else {
      setMaxScoresError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const totalMaxScores = Object.values(maxScores).reduce((sum, score) => sum + score, 0);
    if (totalMaxScores !== 100) {
      setMaxScoresError(`Total score weights must equal 100. Current total: ${totalMaxScores}`);
      setError('Please fix the max scores error below');
      return;
    }
    
    setLoading(true);
    setError(null);
    setMaxScoresError(null);

    try {
      const response = await apiCall('/jobs/create-with-keywords', {
        method: 'POST',
        body: JSON.stringify({
          jobTitle: jobTitle.trim(),
          experienceYear,
          locationId: locationId || undefined,
          mustHave: mustHave.trim(),
          niceToHave: niceToHave.trim(),
          languageSkills: languageSkills.trim(),
          keyResponsibility: keyResponsibility.trim(),
          ourOffer: ourOffer.trim(),
          expireDate: expireDate || undefined,
          status: 'pending',
          ...maxScores
          
        }),
      });

      if (!response) {
        throw new Error('No response received');
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create job');
      }

      onJobCreated();
    } catch (err) {
      console.error('Error creating job:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
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
                maxLength={255}
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-blue-500"
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
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-blue-500"
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
                max="50"
                value={experienceYear}
                onChange={(e) => setExperienceYear(parseInt(e.target.value))}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expire Date*
              </label>
              <input
                type="date"
                required
                min={getMinDate()}
                value={expireDate}
                onChange={(e) => setExpireDate(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-blue-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Key Responsibilities*
            </label>
            <textarea
              value={keyResponsibility}
              required
              maxLength={3000}
              onChange={(e) => {
                setKeyResponsibility(e.target.value);
                handleTextareaResize(e);
              }}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm min-h-[100px] resize-none overflow-hidden focus:ring-blue-500"
              placeholder="List the key responsibilities for this role"
            ></textarea>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Must Have Skills*
            </label>
            <textarea
              required
              maxLength={3000}
              value={mustHave}
              onChange={(e) => {
                setMustHave(e.target.value);
                handleTextareaResize(e);
              }}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm min-h-[100px] resize-none overflow-hidden focus:ring-blue-500"
              placeholder="Required skills and qualifications"
            ></textarea>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nice to Have Skills*
            </label>
            <textarea
              value={niceToHave}
              required
              maxLength={3000}
              onChange={(e) => {
                setNiceToHave(e.target.value);
                handleTextareaResize(e);
              }}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm min-h-[100px] resize-none overflow-hidden focus:ring-blue-500"
              placeholder="Preferred skills and qualifications"
            ></textarea>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Language Skills*
            </label>
            <textarea
              value={languageSkills}
              required
              maxLength={1000}
              onChange={(e) => {
                setLanguageSkills(e.target.value);
                handleTextareaResize(e);
              }}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm min-h-[80px] resize-none overflow-hidden focus:ring-blue-500"
              placeholder="Required language proficiency"
            ></textarea>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Our Offer*
            </label>
            <textarea
              value={ourOffer}
              required
              maxLength={3000}
              onChange={(e) => {
                setOurOffer(e.target.value);
                handleTextareaResize(e);
              }}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm min-h-[100px] resize-none overflow-hidden focus:ring-blue-500"
              placeholder="Benefits, perks, and other offerings"
            ></textarea>
          </div>
          
          <div className="border-t pt-4 mt-4">
            <MaxScoresEditor 
              values={maxScores}
              onChange={handleMaxScoresChange}
              error={maxScoresError}
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !!maxScoresError}
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