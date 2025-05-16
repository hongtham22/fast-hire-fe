import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

interface MissingRequirementsCardProps {
  feedback: string | null;
}

export function MissingRequirementsCard({ feedback }: MissingRequirementsCardProps) {
  if (!feedback) return null;

  return (
    <Alert variant="destructive" className="bg-red-50">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Missing Requirements</AlertTitle>
      <AlertDescription className="mt-2 whitespace-pre-wrap text-sm">
        {feedback}
      </AlertDescription>
    </Alert>
  );
} 