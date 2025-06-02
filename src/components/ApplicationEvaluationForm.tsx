import { useState } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';

interface ApplicationEvaluationFormProps {
  initialNote?: string;
  initialResult?: boolean | null;
  onSubmit: (data: { note?: string; result: boolean | null }) => Promise<void>;
  isLoading?: boolean;
  disabled?: boolean;
}

export function ApplicationEvaluationForm({
  initialNote = '',
  initialResult = null,
  onSubmit,
  isLoading = false,
  disabled = false,
}: ApplicationEvaluationFormProps) {
  const [note, setNote] = useState(initialNote);
  const [result, setResult] = useState<boolean | null>(initialResult);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled) return;
    await onSubmit({ note, result });
  };

  const handleValueChange = (value: string) => {
    if (disabled) return;
    switch (value) {
      case 'accept':
        setResult(true);
        break;
      case 'reject':
        setResult(false);
        break;
      case 'undecided':
        setResult(null);
        break;
    }
  };

  const getRadioValue = () => {
    if (result === null) return 'undecided';
    return result ? 'accept' : 'reject';
  };

  if (disabled) {
    return (
      <div className="space-y-6 opacity-60">
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Job Closed
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>This job posting has been closed. Evaluation is no longer available.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <Label>Decision</Label>
          <RadioGroup
            value={getRadioValue()}
            disabled={true}
            className="flex gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="accept" id="accept" disabled />
              <Label htmlFor="accept" className="text-green-600">Accept</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="reject" id="reject" disabled />
              <Label htmlFor="reject" className="text-red-600">Reject</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="undecided" id="undecided" disabled />
              <Label htmlFor="undecided" className="text-gray-600">Undecided</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-4">
          <Label htmlFor="note">Evaluation Notes</Label>
          <Textarea
            id="note"
            value={note}
            disabled={true}
            placeholder="Add your evaluation notes here..."
            className="min-h-[150px]"
          />
        </div>

        <Button
          type="button"
          disabled={true}
          className="w-full"
        >
          Evaluation Disabled
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <Label>Decision</Label>
        <RadioGroup
          value={getRadioValue()}
          onValueChange={handleValueChange}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="accept" id="accept" />
            <Label htmlFor="accept" className="text-green-600">Accept</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="reject" id="reject" />
            <Label htmlFor="reject" className="text-red-600">Reject</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="undecided" id="undecided" />
            <Label htmlFor="undecided" className="text-gray-600">Undecided</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-4">
        <Label htmlFor="note">Evaluation Notes</Label>
        <Textarea
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add your evaluation notes here..."
          className="min-h-[150px]"
        />
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? 'Saving...' : 'Submit Evaluation'}
      </Button>
    </form>
  );
} 