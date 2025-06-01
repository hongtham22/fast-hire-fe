"use client";

import React from "react";
import Link from "next/link";
import {
  IoArrowForwardOutline,
  IoCheckmarkCircleOutline,
  IoFlashOutline,
  IoTrendingUpOutline,
  IoShieldCheckmarkOutline,
  IoPeopleOutline,
  IoRocketOutline,
  IoStarOutline,
  IoHeartOutline,
  IoSchoolOutline,
} from "react-icons/io5";

function HomePage() {
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gray-100 pt-32 pb-20 px-40 overflow-hidden">
        <div className="relative z-10">
          <div className="text-center mb-16">
            <h1 className="text-6xl font-bold text-gray-900 mb-6 opacity-0 animate-fade-in-up">
              Your Dream Career Awaits at{" "}
              <span className="text-orange-primary">FastHire</span>
            </h1>
            <h2 className="text-8xl font-extrabold text-orange-dark mb-8 opacity-0 animate-fade-in-up animation-delay-500">
              Find Your Perfect Match
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-12 opacity-0 animate-fade-in-up animation-delay-1000">
              Join FastHire and become part of a revolutionary team that&apos;s
              transforming the recruitment industry. Discover exciting
              opportunities, grow your career, and make a real impact with
              cutting-edge AI technology.
            </p>

            <div className="flex gap-6 justify-center opacity-0 animate-fade-in-up animation-delay-1500">
              <Link href="/careers">
                <button className="relative flex items-center justify-between overflow-hidden rounded-full border border-orange-dark py-4 pl-8 pr-16 bg-orange-dark group hover:shadow-lg transition-all duration-500">
                  <div className="absolute inset-0 w-0 group-hover:w-full rounded-full bg-white transition-all duration-500 ease-in-out z-0"></div>

                  {/* Text */}
                  <span className="relative z-10 text-white group-hover:text-orange-dark font-extrabold text-lg transition-colors duration-500">
                    Browse Jobs
                  </span>

                  {/* Icon container */}
                  <div className="relative z-10 h-12 w-12 rounded-full bg-white flex items-center justify-center ml-4 transition-colors duration-500 group-hover:bg-orange-dark">
                    <IoArrowForwardOutline className="h-6 w-6 text-orange-dark group-hover:text-white transition-colors duration-500" />
                  </div>
                </button>
              </Link>

              <Link href="/careers">
                <button className="relative flex items-center justify-between overflow-hidden rounded-full border border-orange-primary py-4 pl-8 pr-16 bg-white group hover:shadow-lg transition-all duration-500">
                  {/* Background overlay grow from left to right */}
                  <div className="absolute inset-0 w-0 group-hover:w-full rounded-full bg-orange-primary transition-all duration-500 ease-in-out z-0"></div>

                  {/* Button text */}
                  <span className="relative z-10 text-orange-primary group-hover:text-white font-extrabold text-lg transition-colors duration-500">
                    Apply Now
                  </span>

                  {/* Icon container */}
                  <div className="relative z-10 h-12 w-12 rounded-full bg-orange-primary flex items-center justify-center ml-4 transition-colors duration-500 group-hover:bg-white">
                    <IoRocketOutline className="h-6 w-6 text-white group-hover:text-orange-primary transition-colors duration-500" />
                  </div>
                </button>
              </Link>
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-orange-primary/5 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-gradient-to-r from-orange-dark/5 to-transparent"></div>
      </section>

      {/* About Section */}
      <section className="py-20 px-40 bg-white">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Why Work at <span className="text-orange-primary">FastHire?</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            We&apos;re not just building the future of recruitment – we&apos;re
            creating an incredible workplace where innovation thrives, careers
            flourish, and every team member makes a meaningful impact.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: IoRocketOutline,
              title: "Innovation-Driven",
              description:
                "Work with cutting-edge AI technology and be at the forefront of recruitment revolution.",
            },
            {
              icon: IoTrendingUpOutline,
              title: "Career Growth",
              description:
                "Accelerate your professional development with mentorship and learning opportunities.",
            },
            {
              icon: IoPeopleOutline,
              title: "Amazing Team",
              description:
                "Collaborate with passionate, talented individuals who share your drive for excellence.",
            },
            {
              icon: IoFlashOutline,
              title: "Fast-Paced Environment",
              description:
                "Thrive in a dynamic workplace where your ideas can quickly become reality.",
            },
            {
              icon: IoHeartOutline,
              title: "Work-Life Balance",
              description:
                "Enjoy flexible working arrangements and comprehensive benefits that care for your wellbeing.",
            },
            {
              icon: IoSchoolOutline,
              title: "Continuous Learning",
              description:
                "Access to training, conferences, and resources to keep your skills sharp and current.",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-gray-50 p-8 rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-2 group"
            >
              <feature.icon className="h-12 w-12 text-orange-primary mb-4 group-hover:text-orange-dark transition-colors duration-300" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-40 bg-gray-100">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            What We <span className="text-orange-dark">Offer You</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-8">
              Comprehensive Benefits Package
            </h3>
            <div className="space-y-6">
              {[
                "Competitive salary with performance bonuses",
                "Comprehensive health insurance coverage",
                "Flexible remote work options",
                "Professional development allowance",
                "Generous vacation and personal time",
                "Stock options and equity participation",
              ].map((benefit, index) => (
                <div key={index} className="flex items-center gap-4">
                  <IoCheckmarkCircleOutline className="h-6 w-6 text-orange-primary flex-shrink-0" />
                  <span className="text-lg text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <div className="bg-gradient-to-br from-orange-primary/10 to-orange-dark/10 p-8 rounded-xl">
              <h4 className="text-2xl font-bold text-gray-900 mb-4">
                Join Our Growing Team
              </h4>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-primary">
                    50+
                  </div>
                  <div className="text-sm text-gray-600">Team Members</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-dark">15+</div>
                  <div className="text-sm text-gray-600">Open Positions</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-primary">
                    98%
                  </div>
                  <div className="text-sm text-gray-600">
                    Employee Satisfaction
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-dark">5★</div>
                  <div className="text-sm text-gray-600">Glassdoor Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Culture Section */}
      <section className="py-20 px-40 bg-white">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Our <span className="text-orange-primary">Culture</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            At FastHire, we believe that great products come from great people.
            Our culture is built on collaboration, innovation, and respect for
            every individual&apos;s unique contribution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="text-center p-6">
            <IoStarOutline className="h-16 w-16 text-orange-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-3">Excellence</h3>
            <p className="text-gray-600">
              We strive for excellence in everything we do, always pushing
              boundaries and raising the bar.
            </p>
          </div>
          <div className="text-center p-6">
            <IoShieldCheckmarkOutline className="h-16 w-16 text-orange-dark mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-3">Integrity</h3>
            <p className="text-gray-600">
              We act with honesty and transparency, building trust through our
              actions and decisions.
            </p>
          </div>
          <div className="text-center p-6">
            <IoHeartOutline className="h-16 w-16 text-orange-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-3">Care</h3>
            <p className="text-gray-600">
              We care deeply about our team, our customers, and the impact we
              make on the world.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 px-40 bg-gray-100">
        <div className="text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Ready to Start Your{" "}
            <span className="text-orange-primary">Journey</span> with Us?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            Don&apos;t just find a job – discover your calling. Join FastHire
            and be part of something extraordinary. Your next career adventure
            starts here.
          </p>

          <div className="flex gap-6 justify-center">
            <Link href="/careers">
              <button className="relative flex items-center justify-between overflow-hidden rounded-full border border-orange-primary py-4 pl-8 pr-16 bg-orange-primary group hover:shadow-xl transition-all duration-500">
                <div className="absolute inset-0 w-0 group-hover:w-full rounded-full bg-white transition-all duration-500 ease-in-out z-0"></div>

                {/* Text */}
                <span className="relative z-10 text-white group-hover:text-orange-dark font-extrabold text-lg transition-colors duration-500">
                  View Open Positions
                </span>

                {/* Icon container */}
                <div className="relative z-10 h-12 w-12 rounded-full bg-white flex items-center justify-center ml-4 transition-colors duration-500 group-hover:bg-orange-primary">
                  <IoArrowForwardOutline className="h-6 w-6 text-orange-primary group-hover:text-white transition-colors duration-500" />
                </div>
              </button>
            </Link>

            <Link href="/careers">
              <button className="relative flex items-center justify-between overflow-hidden rounded-full border border-orange-dark py-4 pl-8 pr-16 bg-white group hover:shadow-xl transition-all duration-500">
                {/* Hover overlay effect */}
                <div className="absolute inset-0 w-0 group-hover:w-full rounded-full bg-orange-dark transition-all duration-500 ease-in-out z-0"></div>

                {/* Button text */}
                <span className="relative z-10 text-orange-dark group-hover:text-white font-extrabold text-lg transition-colors duration-500">
                  Start Your Application
                </span>

                {/* Icon container */}
                <div className="relative z-10 h-12 w-12 rounded-full bg-orange-dark flex items-center justify-center ml-4 transition-colors duration-500 group-hover:bg-white">
                  <IoRocketOutline className="h-6 w-6 text-white group-hover:text-orange-dark transition-colors duration-500" />
                </div>
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
