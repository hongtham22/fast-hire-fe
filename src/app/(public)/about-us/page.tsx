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
  IoTrophyOutline,
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
              FastHire is revolutionizing recruitment through cutting-edge AI
              technology, connecting top talent with exceptional opportunities
              across Vietnam and beyond. We&apos;re building the future of
              hiring, one perfect match at a time.
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
              Transforming Recruitment with{" "}
              <span className="text-orange-primary">AI Innovation</span>
            </h2>
            <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
              <p>
                Founded with a vision to revolutionize the recruitment industry,
                FastHire has emerged as Vietnam&apos;s leading AI-powered talent
                platform. We understand that finding the right job or the
                perfect candidate shouldn&apos;t be a time-consuming,
                frustrating process.
              </p>
              <p>
                Our journey began when our founders experienced firsthand the
                inefficiencies in traditional recruitment. They envisioned a
                platform that could intelligently match candidates with
                opportunities, reducing hiring time from weeks to days while
                ensuring higher quality matches.
              </p>
              <p>
                Today, FastHire serves thousands of companies and professionals
                across Vietnam, leveraging advanced machine learning algorithms
                to create meaningful connections in the job market.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-primary/10 to-orange-dark/10 p-8 rounded-2xl">
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-primary mb-2">
                  50,000+
                </div>
                <div className="text-sm text-gray-600">Active Job Seekers</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-dark mb-2">
                  5,000+
                </div>
                <div className="text-sm text-gray-600">Partner Companies</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-primary mb-2">
                  95%
                </div>
                <div className="text-sm text-gray-600">Match Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-dark mb-2">
                  24hrs
                </div>
                <div className="text-sm text-gray-600">Average Match Time</div>
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
              To democratize access to great career opportunities by leveraging
              AI technology to create perfect matches between talented
              individuals and forward-thinking companies. We strive to eliminate
              bias, reduce time-to-hire, and ensure every professional finds
              their ideal role.
            </p>
          </div>

          <div className="bg-white p-10 rounded-2xl shadow-lg">
            <div className="flex items-center mb-6">
              <IoEyeOutline className="h-12 w-12 text-orange-dark mr-4" />
              <h3 className="text-3xl font-bold text-gray-900">Vision</h3>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed">
              To become the global leader in AI-powered recruitment, where every
              job search leads to meaningful career growth and every hiring
              decision is data-driven and precise. We envision a world where the
              perfect job finds you, not the other way around.
            </p>
          </div>
        </div>
      </section>

      {/* Leadership Team Section */}
      <section className="py-20 px-40 bg-white">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Meet Our{" "}
            <span className="text-orange-primary">Leadership Team</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experienced leaders driving innovation and growth in the recruitment
            technology space.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: "Nguyen Van A",
              position: "Chief Executive Officer",
              background:
                "Former VP of Engineering at leading tech companies, 15+ years in AI/ML",
              image: "👨‍💼",
            },
            {
              name: "Tran Thi B",
              position: "Chief Technology Officer",
              background:
                "PhD in Machine Learning, former lead data scientist at Fortune 500 companies",
              image: "👩‍💻",
            },
            {
              name: "Le Van C",
              position: "Chief Operating Officer",
              background:
                "20+ years in HR operations and business development across Southeast Asia",
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
                "We constantly push the boundaries of what's possible in recruitment technology.",
            },
            {
              icon: IoShieldCheckmarkOutline,
              title: "Integrity",
              description:
                "We build trust through transparency, honesty, and ethical business practices.",
            },
            {
              icon: IoPeopleOutline,
              title: "People-First",
              description:
                "Every feature we build starts with understanding human needs and aspirations.",
            },
            {
              icon: IoStarOutline,
              title: "Excellence",
              description:
                "We deliver exceptional results and continuously improve our platform.",
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
            Our <span className="text-orange-primary">Achievements</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: IoTrophyOutline,
              title: "Vietnam Technology Fast 50",
              description:
                "Recognized by Deloitte for rapid growth and innovation in 2023",
              year: "2023",
            },
            {
              icon: IoStarOutline,
              title: "Great Place to Work",
              description: "Certified as one of the best employers in Vietnam",
              year: "2023",
            },
            {
              icon: IoRocketOutline,
              title: "AI Innovation Award",
              description:
                "Best use of AI in HR Technology by Vietnam Tech Awards",
              year: "2024",
            },
            {
              icon: IoGlobeOutline,
              title: "Regional Expansion",
              description:
                "Successfully launched operations in 3 Southeast Asian countries",
              year: "2024",
            },
            {
              icon: IoPeopleOutline,
              title: "1M+ Users Milestone",
              description:
                "Reached over 1 million registered users on our platform",
              year: "2024",
            },
            {
              icon: IoCheckmarkCircleOutline,
              title: "ISO 27001 Certified",
              description:
                "Achieved international standard for information security",
              year: "2024",
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
            Ready to{" "}
            <span className="text-orange-primary">Join Our Mission?</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            Whether you&apos;re looking for your next career opportunity or
            seeking to hire top talent, FastHire is here to make the perfect
            connection.
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
