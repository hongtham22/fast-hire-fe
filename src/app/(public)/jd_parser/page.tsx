"use client";
import JobEditor from '@/components/JD/jobEditor'
import JobKeyword from '@/components/JD/jobKeyword'
import React, { useState } from 'react'
import Link from 'next/link';


function Page() {
  const [keywords, setKeywords] = useState<{ [category: string]: string[] } | null>(null);
  return (
    <div className="bg-gray-100 w-full flex flex-col gap-8 pt-[80px] pb-20 px-12">
      <Link href="/cv_parser" className="text-md font-bold text-emerald-500 pt-2">
        &gt;&gt;&gt; Link to CV Parser
      </Link>
      <div className="flex flex-row gap-6">
        <JobEditor setKeywords={setKeywords} />
        <JobKeyword keywords={keywords} />
      </div>
    </div>
  )
}

export default Page