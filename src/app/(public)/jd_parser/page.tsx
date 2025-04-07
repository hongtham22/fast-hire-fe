"use client";
import JobEditor from '@/components/JD/jobEditor'
import JobKeyword from '@/components/JD/jobKeyword'
import React, { useState } from 'react'

function Page() {
  const [keywords, setKeywords] = useState<{ [category: string]: string[] } | null>(null);
  return (
    <div className="bg-gray-100 w-full flex flex-row gap-8 pt-[80px] pb-20 px-12">
      <JobEditor setKeywords={setKeywords} />
      <JobKeyword keywords={keywords} />
    </div>
  )
}

export default Page