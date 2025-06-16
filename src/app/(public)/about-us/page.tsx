"use client";

import React from "react";
import Link from "next/link";
import {
  IoArrowForwardOutline,
  IoCheckmarkCircleOutline,
  IoShieldCheckmarkOutline,
  IoPeopleOutline,
  IoRocketOutline,
  IoStarOutline,
  IoHeartOutline,
  IoGlobeOutline,
  IoEyeOutline,
  IoAtOutline,
} from "react-icons/io5";

function AboutUsPage() {
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gray-100 pt-32 pb-20 px-40 overflow-hidden">
        <div className="relative z-10">
          <div className="text-center mb-16">
            <h1 className="text-6xl font-bold text-gray-900 mb-6 opacity-0 animate-fade-in-up">
              About <span className="text-orange-primary">FastHire</span>
            </h1>
            <h2 className="text-8xl font-extrabold text-orange-dark mb-8 opacity-0 animate-fade-in-up animation-delay-500">
              Our Story
            </h2>
            <p className="text-xl text-gray-700 max-w-4xl mx-auto mb-12 opacity-0 animate-fade-in-up animation-delay-1000">
              FastHire is a modern recruitment platform that uses technology to 
              help connect job seekers with employers in Vietnam. We&apos;re 
              working to improve the hiring process for both candidates and companies.
            </p>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-orange-primary/5 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-gradient-to-r from-orange-dark/5 to-transparent"></div>
      </section>

      {/* Company Story Section */}
      <section className="py-20 px-40 bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-5xl font-bold text-gray-900 mb-8">
              Building a Better{" "}
              <span className="text-orange-primary">Recruitment Experience</span>
            </h2>
            <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
              <p>
                FastHire was founded with the goal of making recruitment more 
                efficient and accessible. We recognized that both job seekers 
                and employers face challenges in the traditional hiring process, 
                and we wanted to create a platform that could address these issues.
              </p>
              <p>
                Our team started by focusing on understanding the needs of both 
                candidates and companies in the Vietnamese job market. We built 
                our platform to help streamline the application and screening 
                process, making it easier for the right people to find each other.
              </p>
              <p>
                Today, FastHire serves companies and professionals across Vietnam, 
                using modern technology to help facilitate better matches between 
                employers and job seekers.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-primary/10 to-orange-dark/10 p-8 rounded-2xl">
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-primary mb-2">
                  150+
                </div>
                <div className="text-sm text-gray-600">Registered Users</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-dark mb-2">
                  50+
                </div>
                <div className="text-sm text-gray-600">Partner Companies</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-primary mb-2">
                  Growing
                </div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-dark mb-2">
                  2024
                </div>
                <div className="text-sm text-gray-600">Founded</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 px-40 bg-gray-100">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Our <span className="text-orange-primary">Mission</span> &{" "}
            <span className="text-orange-dark">Vision</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-white p-10 rounded-2xl shadow-lg">
            <div className="flex items-center mb-6">
              <IoAtOutline className="h-12 w-12 text-orange-primary mr-4" />
              <h3 className="text-3xl font-bold text-gray-900">Mission</h3>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed">
              To improve the recruitment process by connecting job seekers with 
              suitable opportunities and helping companies find qualified candidates. 
              We aim to make hiring more efficient and accessible for everyone 
              involved.
            </p>
          </div>

          <div className="bg-white p-10 rounded-2xl shadow-lg">
            <div className="flex items-center mb-6">
              <IoEyeOutline className="h-12 w-12 text-orange-dark mr-4" />
              <h3 className="text-3xl font-bold text-gray-900">Vision</h3>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed">
              To become a trusted recruitment platform in Vietnam, where job 
              seekers can easily find opportunities that match their skills and 
              career goals, and where employers can efficiently connect with 
              qualified candidates.
            </p>
          </div>
        </div>
      </section>

      {/* Leadership Team Section */}
      <section className="py-20 px-40 bg-white">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Meet Our{" "}
            <span className="text-orange-primary">Team</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            The passionate individuals behind FastHire who are committed to 
            improving the recruitment experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: "Nguyen Van A",
              position: "CEO & Co-Founder",
              background:
                "Software engineer with 8+ years experience in web development and startups",
              image: "👨‍💼",
            },
            {
              name: "Tran Thi B",
              position: "CTO & Co-Founder",
              background:
                "Full-stack developer with expertise in modern web technologies and system design",
              image: "👩‍💻",
            },
            {
              name: "Le Van C",
              position: "Head of Operations",
              background:
                "Business development professional with 6+ years in HR and recruitment",
              image: "👨‍💻",
            },
          ].map((leader, index) => (
            <div
              key={index}
              className="bg-gray-50 p-8 rounded-xl text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-2"
            >
              <div className="text-6xl mb-4">{leader.image}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {leader.name}
              </h3>
              <h4 className="text-orange-primary font-semibold mb-4">
                {leader.position}
              </h4>
              <p className="text-gray-600 text-sm">{leader.background}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-20 px-40 bg-gray-100">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Our <span className="text-orange-dark">Core Values</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            These values guide every decision we make and every interaction we
            have with our community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: IoRocketOutline,
              title: "Innovation",
              description:
                "We explore new technologies and approaches to improve our platform.",
            },
            {
              icon: IoShieldCheckmarkOutline,
              title: "Integrity",
              description:
                "We prioritize honest communication and transparent business practices.",
            },
            {
              icon: IoPeopleOutline,
              title: "User-Focused",
              description:
                "We build features based on real user needs and feedback.",
            },
            {
              icon: IoStarOutline,
              title: "Quality",
              description:
                "We strive to deliver reliable service and continuously improve our offering.",
            },
          ].map((value, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-xl text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-2 group"
            >
              <value.icon className="h-12 w-12 text-orange-primary mx-auto mb-4 group-hover:text-orange-dark transition-colors duration-300" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {value.title}
              </h3>
              <p className="text-gray-600">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-20 px-40 bg-white">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Our <span className="text-orange-primary">Journey</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              icon: IoRocketOutline,
              title: "Platform Launch",
              description:
                "Successfully launched our recruitment platform with core features",
              year: "2024",
            },
            {
              icon: IoPeopleOutline,
              title: "Growing User Base",
              description: "Reached our first milestone of registered users",
              year: "2024",
            },
            {
              icon: IoGlobeOutline,
              title: "Feature Expansion",
              description:
                "Added new features based on user feedback and market needs",
              year: "202",
            },
            {
              icon: IoCheckmarkCircleOutline,
              title: "Security Implementation",
              description:
                "Implemented robust security measures to protect user data",
              year: "2025",
            },
          ].map((achievement, index) => (
            <div
              key={index}
              className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <achievement.icon className="h-8 w-8 text-orange-primary flex-shrink-0 mt-1" />
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">
                      {achievement.title}
                    </h3>
                    <span className="text-sm bg-orange-primary text-white px-2 py-1 rounded-full">
                      {achievement.year}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">
                    {achievement.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 px-40 bg-gray-100">
        <div className="text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Interested in{" "}
            <span className="text-orange-primary">Working With Us?</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            Whether you&apos;re looking for career opportunities or want to 
            partner with us as an employer, we&apos;d love to hear from you.
          </p>

          <div className="flex gap-6 justify-center">
            <Link href="/careers">
              <button className="relative flex items-center justify-between overflow-hidden rounded-full border border-orange-primary py-4 pl-8 pr-16 bg-orange-primary group hover:shadow-xl transition-all duration-500">
                {/* Overlay hover effect */}
                <div className="absolute inset-0 w-0 group-hover:w-full rounded-full bg-white transition-all duration-500 ease-in-out z-0"></div>

                {/* Text */}
                <span className="relative z-10 text-white group-hover:text-orange-dark font-extrabold text-lg transition-colors duration-500">
                  Explore Careers
                </span>

                {/* Icon */}
                <div className="relative z-10 h-12 w-12 rounded-full bg-white flex items-center justify-center ml-4 transition-colors duration-500 group-hover:bg-orange-primary">
                  <IoArrowForwardOutline className="h-6 w-6 text-orange-primary group-hover:text-white transition-colors duration-500" />
                </div>
              </button>
            </Link>

            <Link href="/contact">
              <button className="relative flex items-center justify-between overflow-hidden rounded-full border border-orange-dark py-4 pl-8 pr-16 bg-white group hover:shadow-xl transition-all duration-500">
                {/* Overlay hover effect */}
                <div className="absolute inset-0 w-0 group-hover:w-full rounded-full bg-orange-dark transition-all duration-500 ease-in-out z-0"></div>

                {/* Text */}
                <span className="relative z-10 text-orange-dark group-hover:text-white font-extrabold text-lg transition-colors duration-500">
                  Contact Us
                </span>

                {/* Icon */}
                <div className="relative z-10 h-12 w-12 rounded-full bg-orange-dark flex items-center justify-center ml-4 transition-colors duration-500 group-hover:bg-white">
                  <IoHeartOutline className="h-6 w-6 text-white group-hover:text-orange-dark transition-colors duration-500" />
                </div>
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutUsPage;
