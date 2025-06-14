"use client";

import React, { useState, useEffect } from "react";
import {
  IoShareSocialOutline,
  IoCloseOutline,
  IoCopyOutline,
  IoCheckmarkCircleOutline,
} from "react-icons/io5";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobTitle: string;
  jobId: string;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, jobTitle, jobId }) => {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setShareUrl(`${window.location.origin}/careers/${jobId}`);
    }
  }, [jobId]);
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-2xl p-8 w-full max-w-lg mx-4 shadow-2xl transform animate-scale-in border-t-4 border-orange-primary">
        {/* Header with gradient background */}
        <div className="relative mb-6 -m-8 p-6 bg-gradient-to-r from-orange-primary/10 to-orange-dark/10 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-primary/10 rounded-full">
                <IoShareSocialOutline className="w-6 h-6 text-orange-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Share This Job</h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-all duration-200"
            >
              <IoCloseOutline className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        {/* Job Title Section */}
        <div className="mb-6">
          <p className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wide">Job Position</p>
          <p className="text-lg font-semibold text-gray-800 bg-gray-50 p-3 rounded-lg border-l-4 border-orange-primary">{jobTitle}</p>
        </div>
        
        {/* Share URL Section */}
        <div className="mb-6">
          <p className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wide">Share Link</p>
          <div className="relative">
            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 shadow-inner">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 bg-transparent text-sm text-gray-700 outline-none font-mono"
                onClick={(e) => (e.target as HTMLInputElement).select()}
              />
              <button
                onClick={copyToClipboard}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                  copied 
                    ? 'bg-green-500 text-white shadow-lg' 
                    : 'bg-orange-primary text-white hover:bg-orange-dark hover:shadow-lg'
                }`}
              >
                {copied ? (
                  <>
                    <IoCheckmarkCircleOutline className="w-4 h-4 animate-bounce" />
                    Copied!
                  </>
                ) : (
                  <>
                    <IoCopyOutline className="w-4 h-4" />
                    Copy Link
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-end pt-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-all duration-200 font-medium"
          >
            Close
          </button>
        </div>
      </div>
      
      {/* Custom Styles */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scale-in {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ShareModal; 