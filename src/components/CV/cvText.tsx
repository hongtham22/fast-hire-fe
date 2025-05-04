"use client";
import React from 'react';
import { StructuredData } from '@/types/cv';

interface CVTextProps {
  cvText: string | null;
  structuredData: StructuredData | null;
}

const CVText: React.FC<CVTextProps> = ({ cvText, structuredData }) => {
  if (!cvText) return null;

  return (
    <div className="w-1/2 mt-8 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <h2 className="text-2xl font-semibold mb-4 text-emerald-500 border-b pb-2">CV Content</h2>
      
      {structuredData && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 text-emerald-500">Structured Information</h3>
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-lg text-emerald-500 mb-3 border-b border-gray-200 pb-1">Candidate Info</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex">
                  <span className="font-medium text-gray-700 w-24">Name:</span>
                  <span className="text-gray-900">{structuredData.candidate.name}</span>
                </div>
                <div className="flex">
                  <span className="font-medium text-gray-700 w-24">Location:</span>
                  <span className="text-gray-900">{structuredData.candidate.location}</span>
                </div>
                <div className="flex">
                  <span className="font-medium text-gray-700 w-24">Email:</span>
                  <span className="text-gray-900">{structuredData.candidate.email}</span>
                </div>
                <div className="flex">
                  <span className="font-medium text-gray-700 w-24">Phone:</span>
                  <span className="text-gray-900">{structuredData.candidate.phone}</span>
                </div>
                <div className="flex">
                  <span className="font-medium text-gray-700 w-24">Role:</span>
                  <span className="text-gray-900">{structuredData.candidate.role_job}</span>
                </div>
                <div className="flex">
                  <span className="font-medium text-gray-700 w-24">Experience:</span>
                  <span className="text-gray-900">{structuredData.candidate.experience_years} years</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-lg text-emerald-500 mb-3 border-b border-gray-200 pb-1">Experience</h4>
              {structuredData.experience.map((exp, index) => (
                <div key={index} className="mb-4 border-l-2 border-emerald-600 pl-3">
                  <p className="font-medium text-gray-800">{exp.role} <span className="text-emerald-500">at</span> {exp.company}</p>
                  <p className="text-gray-600 text-sm mb-2">{exp.duration}</p>
                  {exp.projects.map((project, pIndex) => (
                    <div key={pIndex} className="ml-4 mt-2 bg-white p-2 rounded border-l-2 border-emerald-600">
                      <p className="font-medium text-gray-700">{project.name}</p>
                      <ul className="list-disc list-inside">
                        {project.tasks.map((task, tIndex) => (
                          <li key={tIndex} className="text-sm text-gray-700">{task}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-lg text-emerald-500 mb-3 border-b border-gray-200 pb-1">Education</h4>
              {structuredData.education.map((edu, index) => (
                <div key={index} className="mb-3 border-l-2 border-emerald-600 pl-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex">
                      <span className="font-medium text-gray-700 w-32">Degree:</span>
                      <span className="text-gray-900">{edu.degree}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium text-gray-700 w-32">Major:</span>
                      <span className="text-gray-900">{edu.major}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium text-gray-700 w-32">University:</span>
                      <span className="text-gray-900">{edu.university}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium text-gray-700 w-32">GPA:</span>
                      <span className="text-gray-900">{edu.gpa}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium text-gray-700 w-32">Duration:</span>
                      <span className="text-gray-900">{edu.duration}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium text-gray-700 w-32">Graduation Year:</span>
                      <span className="text-gray-900">{edu.graduation_year}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-lg text-emerald-500 mb-3 border-b border-gray-200 pb-1">Skills & Technologies</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-3 rounded shadow-sm">
                  <h5 className="font-medium text-emerald-500 mb-2">Technical Skills</h5>
                  <div className="flex flex-wrap gap-2">
                    {structuredData.technical_skill.map((skill, index) => (
                      <span key={index} className="bg-[#fff8e1] text-[#FF7A00] border border-orange-100 px-2 py-1 rounded-full text-sm">{skill}</span>
                    ))}
                  </div>
                </div>
                <div className="bg-white p-3 rounded shadow-sm">
                  <h5 className="font-medium text-emerald-500 mb-2">Programming Languages</h5>
                  <div className="flex flex-wrap gap-2">
                    {structuredData.programming_language.map((lang, index) => (
                      <span key={index} className="bg-[#fff8e1] text-[#FF7A00] border border-orange-100 px-2 py-1 rounded-full text-sm">{lang}</span>
                    ))}
                  </div>
                </div>
                <div className="bg-white p-3 rounded shadow-sm">
                  <h5 className="font-medium text-emerald-500 mb-2">Soft Skills</h5>
                  <div className="flex flex-wrap gap-2">
                    {structuredData.soft_skill.map((skill, index) => (
                      <span key={index} className="bg-[#fff8e1] text-[#FF7A00] border border-orange-100 px-2 py-1 rounded-full text-sm">{skill}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-lg text-emerald-500 mb-3 border-b border-gray-200 pb-1">Languages</h4>
              <div className="flex flex-wrap gap-3">
                {structuredData.language.map((lang, index) => (
                  <div key={index} className="bg-[#fff8e1] text-[#FF7A00] border border-orange-100 px-3 py-2 rounded-lg">
                    <span className="font-medium text-orange-primary">{lang.language}</span>
                    <span className="text-orange-primary ml-2 text-sm">({lang.level})</span>
                  </div>
                ))}
              </div>
            </div>

            {structuredData.certificate && structuredData.certificate.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-lg text-emerald-500 mb-3 border-b border-gray-200 pb-1">Certificates</h4>
                <div className="flex flex-wrap gap-2">
                  {structuredData.certificate.map((cert, index) => (
                    <span key={index} className="bg-[#fff8e1] text-orange-primary px-3 py-1 rounded-lg text-sm border border-orange-100">{cert}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-4">
        <h3 className="text-xl font-semibold mb-4 text-emerald-500 border-b pb-2">Raw Text</h3>
        <textarea
          className="w-full h-[400px] p-4 border border-gray-300 rounded-lg font-mono text-sm bg-gray-50"
          value={cvText}
          readOnly
        />
      </div>
    </div>
  );
};

export default CVText; 