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
}

export function ApplicationEvaluationForm({
  initialNote = '',
  initialResult = null,
  onSubmit,
  isLoading = false,
}: ApplicationEvaluationFormProps) {
  const [note, setNote] = useState(initialNote);
  const [result, setResult] = useState<boolean | null>(initialResult);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ note, result });
  };

  const handleValueChange = (value: string) => {
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