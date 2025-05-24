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

  // Initialize with default values if not provided
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

  // Update scores when values prop changes
  useEffect(() => {
    if (values && Object.keys(values).length > 0) {
      setScores(values);
    }
  }, [values]);

  // Calculate total whenever scores change
  useEffect(() => {
    const newTotal = Object.values(scores).reduce((sum, value) => sum + value, 0);
    setTotal(newTotal);
  }, [scores]);

  const handleChange = (fieldId: string, value: number) => {
    const newScores = { ...scores, [fieldId]: value };
    setScores(newScores);
    onChange(newScores);
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

      <div className="space-y-3">
        {SCORE_FIELDS.map((field) => (
          <div key={field.id}>
            <div className="flex justify-between mb-1">
              <label htmlFor={field.id} className="text-sm font-medium text-gray-700">
                {field.label}
              </label>
              <span className="text-sm font-medium">{scores[field.id] || 0}</span>
            </div>
            <input
              id={field.id}
              type="range"
              min="0"
              max="100"
              value={scores[field.id] || 0}
              onChange={(e) => handleChange(field.id, parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        ))}
      </div>

      {total !== 100 && (
        <div className="text-sm text-amber-600">
          Total score weights must equal 100. Current total: {total}
        </div>
      )}
    </div>
  );
} 