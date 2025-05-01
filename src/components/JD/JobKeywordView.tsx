"use client";
import React from "react";
import { JobKeywordData } from "@/types/job";

interface JobKeywordViewProps {
  keywords: JobKeywordData | null;
}

const JobKeywordView: React.FC<JobKeywordViewProps> = ({ keywords }) => {
  if (!keywords) return null;

  return (
    <div className="w-full bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <h2 className="text-2xl font-semibold mb-4 text-blue-600 border-b pb-2">Extracted Keywords</h2>
      
      <div className="space-y-6">
        {/* Role and Experience */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-lg text-blue-600 mb-3 border-b border-gray-200 pb-1">Basic Requirements</h4>
          <div className="grid grid-cols-2 gap-3">
            {keywords.role_job && (
              <div className="flex">
                <span className="font-medium text-gray-700 w-24">Role:</span>
                <span className="text-gray-900">{keywords.role_job.value}</span>
              </div>
            )}
            {keywords.experience_years && (
              <div className="flex">
                <span className="font-medium text-gray-700 w-24">Experience:</span>
                <span className="text-gray-900">{keywords.experience_years.value} years</span>
              </div>
            )}
          </div>
        </div>

        {/* Education */}
        {keywords.education && keywords.education.length > 0 && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-lg text-blue-600 mb-3 border-b border-gray-200 pb-1">Education</h4>
            {keywords.education.map((edu, index) => (
              <div key={index} className="mb-3 border-l-2 border-blue-600 pl-3">
                <div className="grid grid-cols-2 gap-2">
                  {edu.degree && (
                    <div className="flex">
                      <span className="font-medium text-gray-700 w-32">Degree:</span>
                      <span className="text-gray-900">{edu.degree.value}</span>
                    </div>
                  )}
                  {edu.major && (
                    <div className="flex">
                      <span className="font-medium text-gray-700 w-32">Major:</span>
                      <span className="text-gray-900">{edu.major.value}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Skills & Technologies */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-lg text-blue-600 mb-3 border-b border-gray-200 pb-1">Skills & Technologies</h4>
          <div className="grid grid-cols-2 gap-4">
            {/* Technical Skills */}
            {keywords.technical_skill && keywords.technical_skill.length > 0 && (
              <div className="bg-white p-3 rounded shadow-sm">
                <h5 className="font-medium text-blue-600 mb-2">Technical Skills</h5>
                <div className="flex flex-wrap gap-2">
                  {keywords.technical_skill.map((skill, index) => (
                    <span 
                      key={index} 
                      className={`px-2 py-1 rounded-full text-sm ${
                        skill.requirement_type === 'must_have' 
                          ? 'bg-red-100 text-red-800 border border-red-200' 
                          : 'bg-blue-100 text-blue-800 border border-blue-200'
                      }`}
                    >
                      {skill.value}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Programming Languages */}
            {keywords.programing_langugue && keywords.programing_langugue.length > 0 && (
              <div className="bg-white p-3 rounded shadow-sm">
                <h5 className="font-medium text-blue-600 mb-2">Programming Languages</h5>
                <div className="flex flex-wrap gap-2">
                  {keywords.programing_langugue.map((lang, index) => (
                    <span 
                      key={index} 
                      className={`px-2 py-1 rounded-full text-sm ${
                        lang.requirement_type === 'must_have' 
                          ? 'bg-red-100 text-red-800 border border-red-200' 
                          : 'bg-blue-100 text-blue-800 border border-blue-200'
                      }`}
                    >
                      {lang.value}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Soft Skills */}
            {keywords.soft_skill && keywords.soft_skill.length > 0 && (
              <div className="bg-white p-3 rounded shadow-sm">
                <h5 className="font-medium text-blue-600 mb-2">Soft Skills</h5>
                <div className="flex flex-wrap gap-2">
                  {keywords.soft_skill.map((skill, index) => (
                    <span 
                      key={index} 
                      className={`px-2 py-1 rounded-full text-sm ${
                        skill.requirement_type === 'must_have' 
                          ? 'bg-red-100 text-red-800 border border-red-200' 
                          : 'bg-blue-100 text-blue-800 border border-blue-200'
                      }`}
                    >
                      {skill.value}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Languages */}
        {keywords.language && keywords.language.length > 0 && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-lg text-blue-600 mb-3 border-b border-gray-200 pb-1">Languages</h4>
            <div className="flex flex-wrap gap-3">
              {keywords.language.map((lang, index) => (
                <div 
                  key={index} 
                  className={`px-3 py-2 rounded-lg ${
                    lang.language.requirement_type === 'must_have' 
                      ? 'bg-red-100 text-red-800 border border-red-200' 
                      : 'bg-blue-100 text-blue-800 border border-blue-200'
                  }`}
                >
                  <span className="font-medium">{lang.language.value}</span>
                  <span className="ml-2 text-sm">({lang.level.value})</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certificates */}
        {keywords.certificate && keywords.certificate.length > 0 && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-lg text-blue-600 mb-3 border-b border-gray-200 pb-1">Certificates</h4>
            <div className="flex flex-wrap gap-2">
              {keywords.certificate.map((cert, index) => (
                <span 
                  key={index} 
                  className={`px-3 py-1 rounded-lg text-sm ${
                    cert.requirement_type === 'must_have' 
                      ? 'bg-red-100 text-red-800 border border-red-200' 
                      : 'bg-blue-100 text-blue-800 border border-blue-200'
                  }`}
                >
                  {cert.value}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Key Responsibilities */}
        {keywords.key_responsibilities && keywords.key_responsibilities.length > 0 && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-lg text-blue-600 mb-3 border-b border-gray-200 pb-1">Key Responsibilities</h4>
            <ul className="list-disc list-inside space-y-2">
              {keywords.key_responsibilities.map((resp, index) => (
                <li 
                  key={index} 
                  className={`${
                    resp.requirement_type === 'must_have' 
                      ? 'text-red-800' 
                      : 'text-blue-800'
                  }`}
                >
                  {resp.value}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-500">
          <span className="inline-block px-2 py-1 mr-2 rounded-full text-xs bg-red-100 text-red-800 border border-red-200">Must Have</span> 
          indicates essential requirements, while 
          <span className="inline-block px-2 py-1 mx-2 rounded-full text-xs bg-blue-100 text-blue-800 border border-blue-200">Nice to Have</span> 
          indicates preferred skills/qualifications.
        </p>
      </div>
    </div>
  );
};

export default JobKeywordView; 