import { useState } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Mail } from 'lucide-react';

interface ApplicationEvaluationFormProps {
  initialNote?: string;
  initialResult?: boolean | null;
  onSubmit: (data: { note?: string; result: boolean | null }) => Promise<void>;
  isLoading?: boolean;
  disabled?: boolean;
  disabledReason?: 'job-closed' | 'email-sent';
  noteOnlyMode?: boolean;
}

export function ApplicationEvaluationForm({
  initialNote = '',
  initialResult = null,
  onSubmit,
  isLoading = false,
  disabled = false,
  disabledReason = 'job-closed',
  noteOnlyMode = false,
}: ApplicationEvaluationFormProps) {
  const [note, setNote] = useState(initialNote);
  const [result, setResult] = useState<boolean | null>(initialResult);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled && !noteOnlyMode) return;
    
    const submitData = noteOnlyMode 
      ? { note, result: initialResult }
      : { note, result };
      
    await onSubmit(submitData);
  };

  const handleValueChange = (value: string) => {
    if (disabled || noteOnlyMode) return;
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
    const isJobClosed = disabledReason === 'job-closed';
    
    return (
      <div className="space-y-6 opacity-60">
        <div className={`p-4 border rounded-md ${
          isJobClosed 
            ? 'bg-yellow-50 border-yellow-200' 
            : 'bg-green-50 border-green-200'
        }`}>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              {isJobClosed ? (
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                </svg>
              )}
            </div>
            <div className="ml-3">
              <h3 className={`text-sm font-medium ${
                isJobClosed ? 'text-yellow-800' : 'text-green-800'
              }`}>
                {isJobClosed ? 'Job Closed' : 'Email Already Sent'}
              </h3>
              <div className={`mt-2 text-sm ${
                isJobClosed ? 'text-yellow-700' : 'text-green-700'
              }`}>
                <p>
                  {isJobClosed 
                    ? 'This job posting has been closed. Evaluation is no longer available.'
                    : 'An email has already been sent for this application. No further evaluations can be made.'
                  }
                </p>
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

  if (noteOnlyMode) {
    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Mail className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Email Already Sent
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>Decision has been finalized and email sent. You can still update notes for record keeping.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <Label>Final Decision</Label>
          <div className="p-3 bg-gray-50 rounded-md">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              initialResult === true 
                ? 'bg-green-100 text-green-800'
                : initialResult === false
                  ? 'bg-red-100 text-red-800'
                  : 'bg-gray-100 text-gray-800'
            }`}>
              {initialResult === true ? '✓ Accepted' : initialResult === false ? '✗ Rejected' : '• Undecided'}
            </span>
          </div>
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
          {isLoading ? 'Saving Notes...' : 'Update Notes'}
        </Button>
      </form>
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