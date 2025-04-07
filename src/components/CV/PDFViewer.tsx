'use client';

import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

interface PDFViewerProps {
  file: File;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ file }) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [workerSrc, setWorkerSrc] = useState<string>('');

  useEffect(() => {
    // Set worker source on client-side only
    setWorkerSrc(`https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.mjs`);
  }, []);

  useEffect(() => {
    if (workerSrc) {
      pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
    }
  }, [workerSrc]);

  const onLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  return (
    <div className="flex flex-col items-center h-[800px] overflow-y-auto">
      {workerSrc && (
        <Document file={file} onLoadSuccess={onLoadSuccess}>
          {Array.from(new Array(numPages), (el, index) => (
            <Page key={`page_${index + 1}`} pageNumber={index + 1} width={600} />
          ))}
        </Document>
      )}
    </div>
  );
};

export default PDFViewer;