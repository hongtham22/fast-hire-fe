import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

interface MissingRequirementsCardProps {
  feedback: string | null;
}

const formatFeedback = (text: string) => {
  // Split the text by ** markers
  const parts = text.split(/\*\*/);
  
  // Map through parts and wrap every second part (the ones between **) with <strong>
  return parts.map((part, index) => {
    if (index % 2 === 1) {
      // This is a part between ** **
      return <strong key={index} className="font-bold">{part}</strong>;
    }
    // This is regular text
    return <span key={index}>{part}</span>;
  });
};

export function MissingRequirementsCard({ feedback }: MissingRequirementsCardProps) {
  if (!feedback) return null;

  return (
    <Alert variant="destructive" className="bg-red-50">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Missing Requirements</AlertTitle>
      <AlertDescription className="mt-2 whitespace-pre-wrap text-sm">
        {formatFeedback(feedback)}
      </AlertDescription>
    </Alert>
  );
} 