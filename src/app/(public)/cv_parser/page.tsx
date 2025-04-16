"use client";
import CVUploader from '@/components/CV/cvUploader'
import CVText from '@/components/CV/cvText'
import React, { useState } from 'react'
import Link from 'next/link';

interface StructuredData {
  candidate: {
    name: string;
    location: string;
    email: string;
    phone: string;
    role_job: string;
    experience_years: string;
  };
  experience: Array<{
    role: string;
    company: string;
    duration: string;
    projects: Array<{
      name: string;
      tasks: string[];
    }>;
  }>;
  education: Array<{
    major: string;
    university: string;
    gpa: string;
    degree: string;
    graduation_year: string;
    duration: string;
  }>;
  language: Array<{
    language: string;
    level: string;
  }>;
  programing_langugue: string[];
  technical_skill: string[];
  soft_skill: string[];
  certificate: string[];
}

function Page() {
  const [cvText, setCvText] = useState<string | null>(null);
  const [structuredData, setStructuredData] = useState<StructuredData | null>(null);
  
  return (
    <div className="bg-gray-100 w-full h-screen flex flex-col pt-[80px] pb-20 px-12">
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