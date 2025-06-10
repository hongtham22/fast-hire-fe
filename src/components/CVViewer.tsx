import { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface CVViewerProps {
  cvFileUrl: string;
}

export function CVViewer({ cvFileUrl }: CVViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setError('Failed to load CV file');
    setIsLoading(false);
  };

  return (
    <div className="relative w-full h-[900px] rounded-lg border bg-white">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      )}
      
      {error ? (
        <div className="flex h-full items-center justify-center text-red-500">
          {error}
        </div>
      ) : (
        <iframe
          src={cvFileUrl}
          className="w-full h-full"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          title="CV Viewer"
        />
      )}
    </div>
  );
} 