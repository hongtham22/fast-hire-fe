"use client";

import React, { useState, useEffect } from 'react';
import { Loader2, X } from 'lucide-react';
import { getLocations, Location, apiCall } from '@/lib/api';
import { Job } from '@/app/context/JobsContext';
import MaxScoresEditor from './MaxScoresEditor';

interface EditJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJobUpdated: () => void;
  job: Job;
}

export default function EditJobModal({ isOpen, onClose, onJobUpdated, job }: EditJobModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [locationsLoading, setLocationsLoading] = useState(false);
  const [maxScores, setMaxScores] = useState<Record<string, number>>({});
  const [maxScoresError, setMaxScoresError] = useState<string | null>(null);

  // Form state
  const [jobTitle, setJobTitle] = useState(job.jobTitle);
  const [experienceYear, setExperienceYear] = useState(job.experienceYear || 1);
  const [locationId, setLocationId] = useState(job.location.id);
  const [mustHave, setMustHave] = useState(job.mustHave || "");
  const [niceToHave, setNiceToHave] = useState(job.niceToHave || "");
  const [languageSkills, setLanguageSkills] = useState(job.languageSkills || "");
  const [keyResponsibility, setKeyResponsibility] = useState(job.keyResponsibility || "");
  const [ourOffer, setOurOffer] = useState(job.ourOffer || "");
  const [expireDate, setExpireDate] = useState(
    job.expireDate ? new Date(job.expireDate).toISOString().split('T')[0] : ""
  );

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
        }
      } catch (err) {
        console.error('Error fetching locations:', err);
      } finally {
        setLocationsLoading(false);
      }
    };

    const fetchJobDetails = async () => {
      try {
        const response = await apiCall(`/jobs/${job.id}`);
        if (!response) {
          throw new Error('Failed to fetch job details - no response');
        }
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch job details');
        }
        const jobData = await response.json();

        // Initialize max scores with values from the job if available
        const initialMaxScores = {
          maxScoreRoleJob: jobData.maxScoreRoleJob,
          maxScoreExperienceYears: jobData.maxScoreExperienceYears,
          maxScoreProgrammingLanguage: jobData.maxScoreProgrammingLanguage,
          maxScoreKeyResponsibilities: jobData.maxScoreKeyResponsibilities,
          maxScoreCertificate: jobData.maxScoreCertificate,
          maxScoreLanguage: jobData.maxScoreLanguage,
          maxScoreSoftSkill: jobData.maxScoreSoftSkill,
          maxScoreTechnicalSkill: jobData.maxScoreTechnicalSkill
        };
        
        // Filter out undefined values
        const filteredMaxScores = Object.fromEntries(
          Object.entries(initialMaxScores).filter(([, value]) => value !== undefined)
        );
        
        setMaxScores(filteredMaxScores);
      } catch (err) {
        console.error('Error fetching job details:', err);
      }
    };

    if (isOpen) {
      fetchLocations();
      fetchJobDetails();
    }
  }, [isOpen, job.id]);
  
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

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate that total max scores equals 100
    const totalMaxScores = Object.values(maxScores).reduce((sum, score) => sum + score, 0);
    if (totalMaxScores !== 100) {
      setMaxScoresError(`Total score weights must equal 100. Current total: ${totalMaxScores}`);
      setError('Please fix the max scores error below');
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      // Update job and extract keywords in one API call
      const response = await apiCall(`/jobs/${job.id}/update-with-keywords`, {
        method: 'PUT',
        body: JSON.stringify({
          jobTitle: jobTitle.trim(),
          experienceYear,
          locationId,
          mustHave: mustHave.trim(),
          niceToHave: niceToHave.trim(),
          languageSkills: languageSkills.trim(),
          keyResponsibility: keyResponsibility.trim(),
          ourOffer: ourOffer.trim(),
          expireDate: expireDate || undefined,
          status: 'pending', // Set status to pending when edited
          // Include max scores
          ...maxScores
        }),
      });

      if (!response) {
        throw new Error('Failed to update job - no response');
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update job');
      }

      // Success - notify parent component
      onJobUpdated();
    } catch (err) {
      console.error('Error updating job:', err);
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
          <h2 className="text-xl font-bold">Edit Job Posting</h2>
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
                Expire Date
              </label>
              <input
                type="date"
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
          
          {/* Add MaxScoresEditor */}
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
                  Updating...
                </>
              ) : (
                'Update Job'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 