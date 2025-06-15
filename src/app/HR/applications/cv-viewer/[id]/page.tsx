"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import CVViewer from '@/components/CV/CVViewer';
import { getApplicationById } from '@/lib/api';

export default function CVViewerPage() {
  const params = useParams();
  const router = useRouter();
  const applicationId = params.id as string;
  const [cvFileUrl, setCvFileUrl] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchApplicationData = async () => {
      setLoading(true);
      try {
        const { data, error } = await getApplicationById(applicationId);
        
        if (error) {
          console.error('API Error:', error);
          setError(`Failed to fetch application data: ${error}`);
        } else if (data) {
          if (typeof data === 'object') {
            if ('cvFileUrl' in data) {
              setCvFileUrl(data.cvFileUrl);
            } 
          }
          
          if (!cvFileUrl) {
            console.warn('CV file URL not found in the API response');
          }
        } else {
          setError('No application data returned');
        }
      } catch (err) {
        console.error('Failed to fetch application data:', err);
        setError('Failed to load application data');
      } finally {
        setLoading(false);
      }
    };
    
    if (applicationId) {
      fetchApplicationData();
    }
  }, [applicationId, cvFileUrl]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-6 bg-red-50 text-red-700 rounded-md">
        <h2 className="text-xl font-semibold mb-2">Error</h2>
        <p>{error}</p>
        <button 
          onClick={() => router.back()}
          className="mt-4 inline-flex items-center gap-1 text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col pt-[40px] pb-20 px-12 bg-gray-100">
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-1 text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Applications
        </button>
      </div>
      
      <h1 className="text-2xl font-bold mb-6">CV Viewer</h1>
      
      <CVViewer applicationId={applicationId} cvFileUrl={cvFileUrl} />
    </div>
  );
} 