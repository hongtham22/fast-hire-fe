"use client";
import React, { useState } from 'react';
import { Upload, Loader2, AlertCircle } from 'lucide-react';
import dynamic from 'next/dynamic';
import { parseCV } from '@/lib/api';
import { StructuredData } from '@/types/cv';
import { MAX_FILE_SIZE, ACCEPTED_FILE_TYPES } from '@/lib/config';

const PDFViewer = dynamic(() => import('@/components/CV/PDFViewer'), {
  ssr: false,
  loading: () => <p>Loading PDF viewer...</p>
});

interface CVUploaderProps {
  setCvText: React.Dispatch<React.SetStateAction<string | null>>;
  setStructuredData: React.Dispatch<React.SetStateAction<StructuredData | null>>;
}

const CVUploader: React.FC<CVUploaderProps> = ({ setCvText, setStructuredData }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>('');

  const validateFile = (file: File): string | null => {
    // Check file type
    const validFileTypes = [
      ACCEPTED_FILE_TYPES.PDF,
      // ACCEPTED_FILE_TYPES.DOCX,
      // ACCEPTED_FILE_TYPES.TXT
    ];
    
    if (!validFileTypes.includes(file.type)) {
      return 'Invalid file format. Please upload a PDF.';
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return `File size exceeds maximum limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB.`;
    }

    return null;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = event.target.files?.[0];
    
    if (!file) {
      setError('No file selected. Please choose a file.');
      return;
    }

    // Validate file before uploading
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      event.target.value = ''; // Reset file input
      return;
    }

    setFileName(file.name);
    setSelectedFile(file);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('cv_file', file);

      const { data, error } = await parseCV(formData);
      
      if (error) {
        // Handle specific API errors with custom messages
        if (error.includes('No CV file provided')) {
          setError('The file could not be processed. Please make sure it contains readable text content.');
        } else {
          setError(error);
        }
        setCvText(null);
        setStructuredData(null);
      } else if (data) {
        setCvText(data.raw_text);
        setStructuredData(data.structured_data || null);
      } else {
        setError('No data returned from server.');
      }
    } catch (err) {
      setError('Failed to upload file. Please try again.');
      console.error('CV upload error:', err);
    } finally {
      setLoading(false);
    }
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setFileName('');
    setError(null);
    setCvText(null);
    setStructuredData(null);
  };

  return (
    <div className="w-1/2 mt-8 bg-white p-6 rounded-lg border border-gray-200 mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Upload CV</h2>
      
      <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-orange-600 transition-colors">
        <Upload size={48} className="text-gray-400 mb-4" />
        
        {fileName && (
          <div className="mb-3 bg-gray-100 px-3 py-1 rounded-md flex items-center">
            <span className="text-gray-700 font-medium mr-2">{fileName}</span>
            <button 
              onClick={resetUpload} 
              className="text-gray-500 hover:text-red-500"
              disabled={loading}
            >
              ✕
            </button>
          </div>
        )}
        
        <label className="cursor-pointer block">
          <div className={`inline-block bg-orange-600 text-white px-6 py-2 rounded-lg ${loading ? 'opacity-70' : 'hover:bg-orange-700'} transition-colors`}>
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 size={20} className="animate-spin" />
                <span>Processing...</span>
              </div>
            ) : (
              <span className="block w-full text-center">{fileName ? 'Change File' : 'Choose File'}</span>
            )}
          </div>
          <input
            type="file"
            className="hidden"
            accept=".pdf,.docx,.txt"
            onChange={handleFileUpload}
            disabled={loading}
          />
        </label>
        <p className="text-sm text-gray-500 mt-2">
          Supported formats: PDF, DOCX, TXT
        </p>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-300 rounded text-red-700 flex items-start">
          <AlertCircle size={18} className="mr-2 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {selectedFile && selectedFile.type === 'application/pdf' && !loading && !error && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">PDF Preview</h3>
          <PDFViewer file={selectedFile} />
        </div>
      )}
    </div>
  );
};

export default CVUploader;