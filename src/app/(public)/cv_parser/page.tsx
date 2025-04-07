"use client";
import CVUploader from '@/components/CV/cvUploader'
import CVText from '@/components/CV/cvText'
import React, { useState } from 'react'

function Page() {
  const [cvText, setCvText] = useState<string | null>(null);
  
  return (
    <div className="bg-gray-100 w-full flex flex-row gap-8 pt-[80px] pb-20 px-12">
      <CVUploader setCvText={setCvText} />
      <CVText cvText={cvText} />
    </div>
  )
}

export default Page