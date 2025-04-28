"use client";
import CVUploader from '@/components/CV/cvUploader'
import CVText from '@/components/CV/cvText'
import React, { useState } from 'react'
import Link from 'next/link';
import { StructuredData } from '@/types/cv';

function Page() {
  const [cvText, setCvText] = useState<string | null>(null);
  const [structuredData, setStructuredData] = useState<StructuredData | null>(null);
  
  return (
    <div className="bg-gray-100 w-full h-full flex flex-col pt-[80px] pb-20 px-12">
      <Link href="/jd_parser" className="text-md font-bold text-emerald-500 pt-2">
        &gt;&gt;&gt; Link to JD Parser
      </Link>
      <div className="flex flex-row gap-6">
        <CVUploader setCvText={setCvText} setStructuredData={setStructuredData} />
        <CVText cvText={cvText} structuredData={structuredData} />
      </div>
    </div>
  )
}

export default Page