"use client";
import React, { useState } from "react";
import { Edit3, Loader2 } from "lucide-react";
import EditableTextarea from "../ui/editableTextarea";

interface JobEditorProps {
    setKeywords: React.Dispatch<React.SetStateAction<{
      [category: string]: string[];
    } | null>>;
  }

  
  const JobEditor: React.FC<JobEditorProps> = ({ setKeywords }) => {
  const [jobTitle, setJobTitle] = useState(
    "Senior Ruby on Rails Developer"
  );
  const [location, setLocation] = useState("Ha Noi");
  const [jobType, setJobType] = useState("Full time");
  const [keyResponsibilities, setKeyResponsibilities] = useState(`- Analyze system requirements, and develop web applications.
    - Ensure code quality, adhere to SOLID principles, apply design patterns, and optimize database performance.
    - Coordinate with the Project Manager and Bridge SE to resolve issues.
    - Coordinate with team members to resolve technical issues.
    - Research and develop new technology related to the project.
    - Mentor team members by sharing expertise, conducting code reviews, aligning strictly with coding standards, and suggesting best practices.
    - Help the team to detect and solve an issue as operating the whole system or in daily workflow.
    - Write technical documentation.
    `);
  const [mustHave, setMustHave] = useState(`- Graduated from a college or university with a degree in Information Technology or Computer Science.
    - 5+years of software development experience, with a focus on web applications technologies, work experience in Ruby on Rails framework.
    - 3+years experience in working with Search Engine (Elasticsearch, Solr).
    - Proficient in software engineering best practices throughout the development life cycle (coding standards, code reviews, version control, build processes, testing, operations, monitoring, etc.).
    - Strong at SOLID principles, design patterns, and optimizing website performance.
    - Strong teamwork, problem-solving, and good time management skills.
    - Highly motivated, with a "Can do attitude" and a product (client) mindset.
    - Can work effectively under high pressure.`)
  const [niceToHave, setNiceToHave] = useState(`- Experienced with FE and JS framework: VueJS, ReactJS.
    - Knowledge of CI/CD methodologies is preferable.
    - Knowledge of Cloud services such as GCP, and AWS is preferable.
    - Experienced with Apache or Nginx Web Server and Docker configuration.`)   
  const [languageSkills, setLanguageSkills] = useState(`- Communicate basically in English  (writing, reading)`)
  const [ourOffer, setOurOffer] = useState(`- Attractive salary based on your skills.
- 100% salary during the 2-month probation period.
- 13th-month salary and performance-based bonuses.
- 15-18 days of paid leave per year for employees with over 1 year of service.
- MacBook/ Laptop provided to meet your work requirements.
- Language support programs for learning Japanese and English.
- Performance appraisal and salary review twice a year.
- Full gross salary payment for compulsory insurance.
- Awards for outstanding performance on a quarterly and yearly basis.`)

  // Thêm các state cho kết quả phân tích
//   const [keywords, setKeywords] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  interface EditableTextProps {
    value: string;
    onChange: (value: string) => void;
  }

  const EditableText: React.FC<EditableTextProps> = ({ value, onChange }) => {
    const [isEditing, setIsEditing] = useState(false);
    return isEditing ? (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => setIsEditing(false)}
        autoFocus
        className="border-b-2 border-gray-400 focus:outline-none focus:border-orange-600 bg-transparent w-full"
      />
    ) : (
      <span
        className="relative cursor-pointer hover:bg-gray-200 px-1 rounded"
        onClick={() => setIsEditing(true)}
      >
        {value} <Edit3 size={14} className="inline ml-1 text-gray-500" />
      </span>
    );
  };

  // Hàm gửi dữ liệu đến API Flask
  const parseJobDescription = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://127.0.0.1:5000/parse-jd', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobTitle,
          location,
          jobType,
          keyResponsibilities,
          mustHave,
          niceToHave,
          languageSkills
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to parse job description');
      }

      const data = await response.json();
      console.log(data);
      setKeywords(data);
    //   setKeywords(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mt-8 mx-auto p-6 bg-white shadow-lg rounded-lg border border-gray-200">
        <div className="border-b border-gray-200 pb-4">
            <h1 className="text-4xl font-bold">
                <EditableText value={jobTitle} onChange={setJobTitle} />
            </h1>
            <div className="text-gray-600 my-4 flex space-x-4">
                <span>
                <strong>Location:</strong> <EditableText value={location} onChange={setLocation} />
                </span>
                <span>
                <strong>Type:</strong> <EditableText value={jobType} onChange={setJobType} />
                </span>
            </div>
        </div>
        <h2 className="mt-4 text-3xl font-semibold">Key responsibilities</h2>
        <div className="mt-4 text-md whitespace-pre-line">
            <EditableTextarea value={keyResponsibilities} onChange={setKeyResponsibilities} />
        </div>
        <hr className="my-4" />
        <h2 className="mt-4 text-3xl font-semibold">Your skills and technologies </h2>
        <h3 className="mt-4 text-2xl font-semibold text-orange-dark">Must have</h3>
        <div className="mt-4 text-md whitespace-pre-line">
            <EditableTextarea value={mustHave} onChange={setMustHave} />
        </div>
        <h3 className="mt-4 text-2xl font-semibold text-orange-dark">Nice to have</h3>
        <div className="mt-4 text-md whitespace-pre-line">
            <EditableTextarea value={niceToHave} onChange={setNiceToHave} />
        </div>
        <h3 className="mt-4 text-2xl font-semibold text-orange-dark">Language skills</h3>
        <div className="mt-4 text-md whitespace-pre-line">
            <EditableTextarea value={languageSkills} onChange={setLanguageSkills} />
        </div>
        <hr className="my-4" />
        <h2 className="mt-4 text-3xl font-semibold">Our offer</h2>
        <h3 className="mt-4 text-sm font-semibold text-orange-dark">At ZIGExN VeNtura, we believe in fostering an environment where our employees can thrive both professionally and personally. Here are some of the benefits and perks you can look forward to:</h3>
        <div className="mt-4 text-md whitespace-pre-line">
            <EditableTextarea value={ourOffer} onChange={setOurOffer} />
        </div>

        {/* Nút phân tích JD */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={parseJobDescription}
            disabled={loading}
            className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2 disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <span>Extract Keywords</span>
            )}
          </button>
        </div>

        {/* Hiển thị lỗi nếu có */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-300 rounded text-red-700">
            {error}
          </div>
        )}

        {/* Hiển thị kết quả */}
        {/* {renderKeywords()} */}
    </div>
  );
}

export default JobEditor;