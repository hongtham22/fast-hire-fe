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

interface ValidationErrors {
  jobTitle?: string;
  experienceYear?: string;
  locationId?: string;
  mustHave?: string;
  niceToHave?: string;
  languageSkills?: string;
  keyResponsibility?: string;
  ourOffer?: string;
  expireDate?: string;
}

export default function CreateJobModal({ isOpen, onClose, onJobCreated }: CreateJobModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [locationsLoading, setLocationsLoading] = useState(false);
  const [maxScores, setMaxScores] = useState<Record<string, number>>({});
  const [maxScoresError, setMaxScoresError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  // Form state
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

  // Validation functions
  const validateField = (fieldName: string, value: string | number): string | undefined => {
    switch (fieldName) {
      case 'jobTitle':
        const title = (value as string).trim();
        if (!title) return 'Job title is required';
        if (title.length < 3) return 'Job title must be at least 3 characters';
        if (title.length > 255) return 'Job title must be less than 255 characters';
        break;
      
      case 'experienceYear':
        const years = value as number;
        if (years < 0) return 'Experience cannot be negative';
        if (years > 50) return 'Experience cannot exceed 50 years';
        break;
      
      case 'locationId':
        if (!(value as string)) return 'Location is required';
        break;
      
      case 'mustHave':
        const mustHaveText = (value as string).trim();
        if (!mustHaveText) return 'Must have skills is required';
        if (mustHaveText.length < 10) return 'Must have skills must be at least 10 characters';
        if (mustHaveText.length > 2000) return 'Must have skills must be less than 3000 characters';
        break;
      
      case 'niceToHave':
        if ((value as string).length > 2000) return 'Nice to have skills must be less than 3000 characters';
        break;
      
      case 'keyResponsibility':
        if ((value as string).length > 2000) return 'Key responsibilities must be less than 3000 characters';
        break;
      
      case 'languageSkills':
        if ((value as string).length > 1000) return 'Language skills must be less than 3000 characters';
        break;
      
      case 'ourOffer':
        if ((value as string).length > 3000) return 'Our offer must be less than 3000 characters';
        break;
      
      case 'expireDate':
        if (value as string) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const expire = new Date(value as string);
          if (expire <= today) return 'Expire date must be in the future';
        }
        break;
    }
    return undefined;
  };

  const handleFieldChange = (fieldName: string, value: string | number) => {
    // Clear previous error for this field
    setValidationErrors(prev => ({ ...prev, [fieldName]: undefined }));
    
    // Validate field
    const error = validateField(fieldName, value);
    if (error) {
      setValidationErrors(prev => ({ ...prev, [fieldName]: error }));
    }
  };

  // Auto-resize textarea function
  const handleTextareaResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  };

  // Auto-resize all textareas on mount and when values change
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

    // Small delay to ensure DOM is fully rendered and modal is visible
    const timer = setTimeout(resizeAllTextareas, 200);
    
    return () => clearTimeout(timer);
  }, [isOpen, keyResponsibility, mustHave, niceToHave, languageSkills, ourOffer]);

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
    
    // Validate all fields
    const errors: ValidationErrors = {};
    
    errors.jobTitle = validateField('jobTitle', jobTitle);
    errors.experienceYear = validateField('experienceYear', experienceYear);
    errors.locationId = validateField('locationId', locationId);
    errors.mustHave = validateField('mustHave', mustHave);
    errors.niceToHave = validateField('niceToHave', niceToHave);
    errors.keyResponsibility = validateField('keyResponsibility', keyResponsibility);
    errors.languageSkills = validateField('languageSkills', languageSkills);
    errors.ourOffer = validateField('ourOffer', ourOffer);
    errors.expireDate = validateField('expireDate', expireDate);
    
    // Remove undefined errors
    Object.keys(errors).forEach((key) => {
      if (!errors[key as keyof ValidationErrors]) {
        delete errors[key as keyof ValidationErrors];
      }
    });
    
    // Check max scores
    const totalMaxScores = Object.values(maxScores).reduce((sum, score) => sum + score, 0);
    if (totalMaxScores !== 100) {
      setMaxScoresError(`Total score weights must equal 100. Current total: ${totalMaxScores}`);
      return;
    }
    
    // If there are validation errors, show them and return
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setError('Please fix the validation errors above');
      return;
    }
    
    setLoading(true);
    setError(null);
    setValidationErrors({});

    try {
      // Create job and extract keywords in one API call
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
          // Include max scores
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

      // Success - notify parent component
      onJobCreated();
    } catch (err) {
      console.error('Error creating job:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Helper function to get input classes with error state
  const getInputClasses = (fieldName: keyof ValidationErrors, baseClasses: string = "w-full rounded-md border px-3 py-2 text-sm") => {
    const hasError = validationErrors[fieldName];
    return `${baseClasses} ${hasError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'}`;
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
                onChange={(e) => {
                  setJobTitle(e.target.value);
                  handleFieldChange('jobTitle', e.target.value);
                }}
                className={getInputClasses('jobTitle')}
                placeholder="e.g. Senior Software Engineer"
              />
              {validationErrors.jobTitle && (
                <p className="mt-1 text-xs text-red-600">{validationErrors.jobTitle}</p>
              )}
              <p className="mt-1 text-xs text-gray-400">{jobTitle.length}/255</p>
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
                <>
                  <select
                    value={locationId}
                    onChange={(e) => {
                      setLocationId(e.target.value);
                      handleFieldChange('locationId', e.target.value);
                    }}
                    className={getInputClasses('locationId')}
                    required
                  >
                    <option value="" disabled>Select a location</option>
                    {locations.map((location) => (
                      <option key={location.id} value={location.id}>
                        {location.name}
                      </option>
                    ))}
                  </select>
                  {validationErrors.locationId && (
                    <p className="mt-1 text-xs text-red-600">{validationErrors.locationId}</p>
                  )}
                </>
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
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  setExperienceYear(value);
                  handleFieldChange('experienceYear', value);
                }}
                className={getInputClasses('experienceYear')}
              />
              {validationErrors.experienceYear && (
                <p className="mt-1 text-xs text-red-600">{validationErrors.experienceYear}</p>
              )}
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
                onChange={(e) => {
                  setExpireDate(e.target.value);
                  handleFieldChange('expireDate', e.target.value);
                }}
                className={getInputClasses('expireDate')}
              />
              {validationErrors.expireDate && (
                <p className="mt-1 text-xs text-red-600">{validationErrors.expireDate}</p>
              )}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Key Responsibilities*
            </label>
            <textarea
              value={keyResponsibility}
              required
              onChange={(e) => {
                setKeyResponsibility(e.target.value);
                handleFieldChange('keyResponsibility', e.target.value);
                handleTextareaResize(e);
              }}
              className={getInputClasses('keyResponsibility', "w-full rounded-md border px-3 py-2 text-sm min-h-[100px] resize-none overflow-hidden")}
              placeholder="List the key responsibilities for this role"
            ></textarea>
            {validationErrors.keyResponsibility && (
              <p className="mt-1 text-xs text-red-600">{validationErrors.keyResponsibility}</p>
            )}
            <p className="mt-1 text-xs text-gray-400">{keyResponsibility.length}/3000</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Must Have Skills*
            </label>
            <textarea
              required
              value={mustHave}
              onChange={(e) => {
                setMustHave(e.target.value);
                handleFieldChange('mustHave', e.target.value);
                handleTextareaResize(e);
              }}
              className={getInputClasses('mustHave', "w-full rounded-md border px-3 py-2 text-sm min-h-[100px] resize-none overflow-hidden")}
              placeholder="Required skills and qualifications"
            ></textarea>
            {validationErrors.mustHave && (
              <p className="mt-1 text-xs text-red-600">{validationErrors.mustHave}</p>
            )}
            <p className="mt-1 text-xs text-gray-400">{mustHave.length}/3000</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nice to Have Skills*
            </label>
            <textarea
              value={niceToHave}
              required
              onChange={(e) => {
                setNiceToHave(e.target.value);
                handleFieldChange('niceToHave', e.target.value);
                handleTextareaResize(e);
              }}
              className={getInputClasses('niceToHave', "w-full rounded-md border px-3 py-2 text-sm min-h-[100px] resize-none overflow-hidden")}
              placeholder="Preferred skills and qualifications"
            ></textarea>
            {validationErrors.niceToHave && (
              <p className="mt-1 text-xs text-red-600">{validationErrors.niceToHave}</p>
            )}
            <p className="mt-1 text-xs text-gray-400">{niceToHave.length}/3000</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Language Skills*
            </label>
            <textarea
              value={languageSkills}
              required
              onChange={(e) => {
                setLanguageSkills(e.target.value);
                handleFieldChange('languageSkills', e.target.value);
                handleTextareaResize(e);
              }}
              className={getInputClasses('languageSkills', "w-full rounded-md border px-3 py-2 text-sm min-h-[80px] resize-none overflow-hidden")}
              placeholder="Required language proficiency"
            ></textarea>
            {validationErrors.languageSkills && (
              <p className="mt-1 text-xs text-red-600">{validationErrors.languageSkills}</p>
            )}
            <p className="mt-1 text-xs text-gray-400">{languageSkills.length}/3000</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Our Offer*
            </label>
            <textarea
              value={ourOffer}
              required
              onChange={(e) => {
                setOurOffer(e.target.value);
                handleFieldChange('ourOffer', e.target.value);
                handleTextareaResize(e);
              }}
              className={getInputClasses('ourOffer', "w-full rounded-md border px-3 py-2 text-sm min-h-[100px] resize-none overflow-hidden")}
              placeholder="Benefits, perks, and other offerings"
            ></textarea>
            {validationErrors.ourOffer && (
              <p className="mt-1 text-xs text-red-600">{validationErrors.ourOffer}</p>
            )}
            <p className="mt-1 text-xs text-gray-400">{ourOffer.length}/3000</p>
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
              disabled={loading || !!maxScoresError || Object.keys(validationErrors).length > 0}
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