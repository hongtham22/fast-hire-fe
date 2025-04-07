"use client";
import React, { useState } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';

const PDFViewer = dynamic(() => import('@/components/CV/PDFViewer'), {
  ssr: false,
  loading: () => <p>Loading PDF viewer...</p>
});

interface CVUploaderProps {
  setCvText: React.Dispatch<React.SetStateAction<string | null>>;
}

const CVUploader: React.FC<CVUploaderProps> = ({ setCvText }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
        .includes(file.type)) {
      setError('Please upload a PDF, DOCX, or TXT file');
      return;
    }

    setSelectedFile(file);
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('cv_file', file);

      const response = await fetch('http://127.0.0.1:5000/parse-cv', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to parse CV');
      }

      const data = await response.json();
      setCvText(data.text);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-1/2 mt-8 bg-white p-6 rounded-lg border border-gray-200">
      <h2 className="text-2xl font-semibold mb-4">Upload CV</h2>
      
      <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-orange-600 transition-colors">
        <Upload size={48} className="text-gray-400 mb-4" />
        <label className="cursor-pointer">
          <span className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors">
            {loading ? (
              <div className="flex items-center gap-2">
                <Loader2 size={20} className="animate-spin" />
                <span>Processing...</span>
              </div>
            ) : (
              'Choose File'
            )}
          </span>
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
        <div className="mt-4 p-4 bg-red-50 border border-red-300 rounded text-red-700">
          {error}
        </div>
      )}

      {selectedFile && selectedFile.type === 'application/pdf' && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">PDF Preview</h3>
          <PDFViewer file={selectedFile} />
        </div>
      )}
    </div>
  );
};

export default CVUploader;