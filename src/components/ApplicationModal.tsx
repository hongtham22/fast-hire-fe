"use client";

import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { IoArrowForwardOutline } from "react-icons/io5";

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobTitle: string;
  jobId: string;
}

export default function ApplicationModal({
  isOpen,
  onClose,
  jobTitle,
  jobId,
}: ApplicationModalProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeFile(file);
      setFileName(file.name);
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!fullName.trim()) newErrors.fullName = "Full name is required";
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }

    // Phone validation: exactly 10 digits
    if (!phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9]{10}$/.test(phone.trim())) {
      newErrors.phone = "Phone number must be exactly 10 digits";
    }

    // Resume file validation
    if (!resumeFile) {
      newErrors.resume = "Resume is required";
    } else {
      // Check file type
      if (!resumeFile.type.includes('pdf')) {
        newErrors.resume = "Only PDF files are allowed";
      }
      // Check file size (5MB = 5 * 1024 * 1024 bytes)
      else if (resumeFile.size > 5 * 1024 * 1024) {
        newErrors.resume = "File size must be less than 5MB";
      }
    }

    if (!agreedToTerms) newErrors.terms = "You must agree to the policies";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Create a FormData object for the file upload
      const formData = new FormData();
      formData.append('name', fullName);
      formData.append('email', email);
      formData.append('phone', phone);
      formData.append('jobId', jobId);
      
      // Append the CV file
      if (resumeFile) {
        formData.append('cv', resumeFile);
      }

      // Send the application to the API
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/applications/submit`, {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header, it will be set automatically with boundary for FormData
      });

      if (!response.ok) {
        throw new Error(`Application submission failed: ${response.status}`);
      }

      // Success message and close modal
      alert("Application submitted successfully!");
      onClose();
    } catch (error) {
      console.error("Error submitting application:", error);
      setErrors({
        submit: "Failed to submit application. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[100vh] overflow-y-auto">
        <div className="p-10">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-4xl font-bold">Application Form</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-800"
              aria-label="Close"
            >
              <IoClose size={24} />
            </button>
          </div>

          <p className="text-gray-600 mb-8">
            Please input your information to complete the application for: <span className="font-semibold">{jobTitle}</span>
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-8">
              <label htmlFor="fullName" className="block font-medium mb-1">
                FULL NAME <span className="text-red-500">*</span>
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={`w-full p-2 border rounded-md ${
                  errors.fullName ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter your full name"
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div>
                <label htmlFor="email" className="block font-medium mb-1">
                  EMAIL <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full p-2 border rounded-md ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block font-medium mb-1">
                  PHONE <span className="text-red-500">*</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`w-full p-2 border rounded-md ${
                    errors.phone ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter your phone number"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>
            </div>

            <div className="mb-8">
              <label className="block font-medium mb-1">
                RESUME/CV <span className="text-red-500">*</span>
              </label>
              <div
                className={`border ${
                  errors.resume ? "border-red-500" : "border-gray-300"
                } rounded-md p-2 flex items-center`}
              >
                <p className="flex-1 truncate">
                  {fileName ||
                    "Please upload your Resume/CV here as required in the application"}
                </p>
                <label className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md cursor-pointer hover:bg-gray-300 ml-2">
                  Upload Your CV
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".pdf"
                  />
                </label>
              </div>
              <p className="text-gray-500 text-xs mt-1">
                Only PDF files allowed, no password protected, maximum 5MB
              </p>
              {errors.resume && (
                <p className="text-red-500 text-sm mt-1">{errors.resume}</p>
              )}
            </div>

            <div className="mb-6">
              <label className="flex items-start">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mr-2 mt-1"
                />
                <span
                  className={`text-sm ${
                    errors.terms ? "text-red-500" : "text-gray-700"
                  }`}
                >
                  I have read, understood, and agreed to{" "}
                  <a href="#" className="text-orange-600 hover:underline">
                    FastHire&apos;s Personal Data Protection Policies
                  </a>
                  . I consent to sharing my personal data, which will be used
                  for the recruitment process.
                </span>
              </label>
            </div>

            {errors.submit && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                {errors.submit}
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="relative flex items-center justify-between overflow-hidden rounded-full border border-orange-dark py-3 pl-6 pr-14 w-[214px] xl:py-[15px] xl:pr-[55px] xl:w-[180px] bg-white group disabled:opacity-50"
              >
                <div className="absolute right-0 h-[500px] w-[500px] rounded-full shadow-2xl transition-transform duration-500 ease-in-out scale-0 bg-orange-dark group-hover:scale-100"></div>

                {isSubmitting ? (
                  <span className="relative z-10 transition-colors duration-500 text-orange-dark group-hover:text-white font-extrabold flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-orange-dark group-hover:text-white transition-colors duration-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  <span className="relative z-10 transition-colors duration-500 text-orange-dark group-hover:text-white font-extrabold">
                    Submit
                  </span>
                )}

                {!isSubmitting && (
                  <div className="absolute right-1 top-1/2 z-10 -translate-y-1/2 transform">
                    <div className="relative flex items-center justify-center">
                      <div className="h-10 w-10 rounded-full transition-all duration-500 ease-in-out bg-orange-dark flex items-center justify-center group-hover:bg-white">
                        <IoArrowForwardOutline className="h-5 w-5 text-white group-hover:text-orange-dark transition-colors duration-500" />
                      </div>
                    </div>
                  </div>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
