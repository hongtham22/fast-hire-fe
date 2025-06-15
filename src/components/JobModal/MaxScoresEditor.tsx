import { useState, useEffect } from 'react';

const SCORE_FIELDS = [
  { id: 'maxScoreRoleJob', label: 'Job Title', defaultValue: 10 },
  { id: 'maxScoreExperienceYears', label: 'Experience Years', defaultValue: 15 },
  { id: 'maxScoreProgrammingLanguage', label: 'Programming Languages', defaultValue: 15 },
  { id: 'maxScoreKeyResponsibilities', label: 'Key Responsibilities', defaultValue: 15 },
  { id: 'maxScoreCertificate', label: 'Certificates', defaultValue: 10 },
  { id: 'maxScoreLanguage', label: 'Languages', defaultValue: 10 },
  { id: 'maxScoreSoftSkill', label: 'Soft Skills', defaultValue: 10 },
  { id: 'maxScoreTechnicalSkill', label: 'Technical Skills', defaultValue: 15 },
];

interface MaxScoresEditorProps {
  values: Record<string, number>;
  onChange: (scores: Record<string, number>) => void;
  error?: string | null;
}

export default function MaxScoresEditor({ values, onChange, error }: MaxScoresEditorProps) {
  const [scores, setScores] = useState<Record<string, number>>(values);
  const [total, setTotal] = useState<number>(100);
  const [inputValues, setInputValues] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!values || Object.keys(values).length === 0) {
      const defaults: Record<string, number> = {};
      SCORE_FIELDS.forEach(field => {
        defaults[field.id] = field.defaultValue;
      });
      setScores(defaults);
      onChange(defaults);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (values && Object.keys(values).length > 0) {
      setScores(values);
      const stringValues: Record<string, string> = {};
      Object.entries(values).forEach(([key, value]) => {
        stringValues[key] = String(value);
      });
      setInputValues(stringValues);
    }
  }, [values]);

  useEffect(() => {
    const newTotal = Object.values(scores).reduce((sum, value) => sum + value, 0);
    setTotal(newTotal);
  }, [scores]);

  const updateScore = (fieldId: string, value: number) => {
    const clampedValue = Math.max(0, Math.min(100, value));
    const newScores = { ...scores, [fieldId]: clampedValue };
    setScores(newScores);
    onChange(newScores);
    setInputValues(prev => ({ ...prev, [fieldId]: String(clampedValue) }));
  };

  const handleSliderChange = (fieldId: string, value: number) => {
    updateScore(fieldId, value);
  };

  const handleInputChange = (fieldId: string, inputValue: string) => {
    if (inputValue === '' || /^\d+$/.test(inputValue)) {
      setInputValues(prev => ({ ...prev, [fieldId]: inputValue }));
      
      if (inputValue !== '') {
        const numValue = Number(inputValue);
        if (!isNaN(numValue)) {
          updateScore(fieldId, numValue);
        }
      }
    }
  };

  const handleInputBlur = (fieldId: string) => {
    const inputValue = inputValues[fieldId] || '';
    if (inputValue === '') {
      setInputValues(prev => ({ ...prev, [fieldId]: String(scores[fieldId] || 0) }));
    } else {
      const numValue = Number(inputValue);
      const clampedValue = Math.max(0, Math.min(100, numValue));
      setInputValues(prev => ({ ...prev, [fieldId]: String(clampedValue) }));
    }
  };

  const handleResetToDefaults = () => {
    const defaults: Record<string, number> = {};
    const defaultInputs: Record<string, string> = {};
    SCORE_FIELDS.forEach(field => {
      defaults[field.id] = field.defaultValue;
      defaultInputs[field.id] = String(field.defaultValue);
    });
    setScores(defaults);
    setInputValues(defaultInputs);
    onChange(defaults);
  };

  const handleDistributeEqually = () => {
    const equalValue = Math.floor(100 / SCORE_FIELDS.length);
    const remainder = 100 % SCORE_FIELDS.length;
    const distributed: Record<string, number> = {};
    const distributedInputs: Record<string, string> = {};

    SCORE_FIELDS.forEach((field, index) => {
      const value = equalValue + (index < remainder ? 1 : 0);
      distributed[field.id] = value;
      distributedInputs[field.id] = String(value);
    });

    setScores(distributed);
    setInputValues(distributedInputs);
    onChange(distributed);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-md font-medium text-gray-700">Matching Score Weights</h3>
        <div className="flex items-center">
          <span className="text-sm font-medium mr-2">Total:</span>
          <span className={`text-sm font-semibold ${total === 100 ? 'text-green-600' : 'text-red-600'}`}>
            {total}/100
          </span>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded bg-red-50 text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-x-6 gap-y-6">
        {SCORE_FIELDS.map((field) => (
          <div key={field.id} className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor={field.id} className="text-sm font-medium text-gray-700">
                {field.label}
              </label>
              <input
                type="text"
                value={inputValues[field.id] ?? String(scores[field.id] || 0)}
                onChange={(e) => handleInputChange(field.id, e.target.value)}
                onBlur={() => handleInputBlur(field.id)}
                className="w-12 px-1 py-2 text-sm text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength={3}
              />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500 w-6 text-center">0</span>
              <div className="flex-1 relative">
                <input
                  id={field.id}
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={scores[field.id] || 0}
                  onChange={(e) => handleSliderChange(field.id, parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${scores[field.id] || 0}%, #e5e7eb ${scores[field.id] || 0}%, #e5e7eb 100%)`
                  }}
                />
              </div>
              <span className="text-xs text-gray-500 w-6 text-center">100</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <button
          type="button"
          onClick={handleDistributeEqually}
          className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
        >
          Distribute equally
        </button>
        <button
          type="button"
          onClick={handleResetToDefaults}
          className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded transition-colors"
        >
          Reset to default
        </button>
      </div>

      <style jsx>{`
        .slider {
          -webkit-appearance: none;
          appearance: none;
          height: 8px;
          border-radius: 4px;
          outline: none;
        }
        
        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          height: 18px;
          width: 18px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 6px rgba(59, 130, 246, 0.4), 0 1px 3px rgba(0, 0, 0, 0.1);
          transition: all 0.2s ease;
        }
        
        .slider::-webkit-slider-thumb:hover {
          transform: scale(1.15);
          background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.5), 0 2px 6px rgba(0, 0, 0, 0.15);
        }
        
        .slider::-moz-range-thumb {
          height: 18px;
          width: 18px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 6px rgba(59, 130, 246, 0.4), 0 1px 3px rgba(0, 0, 0, 0.1);
          transition: all 0.2s ease;
        }
        
        .slider::-moz-range-thumb:hover {
          transform: scale(1.15);
          background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.5), 0 2px 6px rgba(0, 0, 0, 0.15);
        }
        
        .slider:focus {
          outline: none;
        }
        
        .slider:focus::-webkit-slider-thumb {
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.3);
        }
        
        .slider:focus::-moz-range-thumb {
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.3);
        }
        
        /* Hide default track for Firefox */
        .slider::-moz-range-track {
          background: transparent;
          border: none;
        }
      `}</style>
    </div>
  );
}
