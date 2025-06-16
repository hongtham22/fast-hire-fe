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
              Build Your Career at{" "}
              <span className="text-orange-primary">FastHire</span>
            </h1>
            <h2 className="text-8xl font-extrabold text-orange-dark mb-8 opacity-0 animate-fade-in-up animation-delay-500">
              Join Our Team
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto mb-12 opacity-0 animate-fade-in-up animation-delay-1000">
              Join FastHire and become part of a growing team working in the 
              recruitment technology space. Explore career opportunities, 
              develop your skills, and contribute to innovative solutions.
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
            Why Join <span className="text-orange-primary">FastHire?</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            We&apos;re building a modern recruitment platform and looking for 
            talented individuals to join our team. Here&apos;s what we offer 
            as a growing company.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: IoRocketOutline,
              title: "Modern Technology",
              description:
                "Work with current technology stack and contribute to product development.",
            },
            {
              icon: IoTrendingUpOutline,
              title: "Professional Growth",
              description:
                "Opportunities for skill development and career advancement within the company.",
            },
            {
              icon: IoPeopleOutline,
              title: "Collaborative Team",
              description:
                "Work alongside experienced professionals in a supportive environment.",
            },
            {
              icon: IoFlashOutline,
              title: "Dynamic Environment",
              description:
                "Be part of a startup culture where you can make a real difference.",
            },
            {
              icon: IoHeartOutline,
              title: "Work-Life Balance",
              description:
                "We value your personal time and offer flexible working arrangements.",
            },
            {
              icon: IoSchoolOutline,
              title: "Learning Opportunities",
              description:
                "Access to resources and training to help you stay current with industry trends.",
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
            What We <span className="text-orange-dark">Offer</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-8">
              Benefits & Perks
            </h3>
            <div className="space-y-6">
              {[
                "Competitive salary based on experience",
                "Health insurance coverage",
                "Remote work flexibility",
                "Learning and development budget",
                "Paid time off and holidays",
                "Opportunity for equity participation",
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
                Our Growing Team
              </h4>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-primary">
                    25+
                  </div>
                  <div className="text-sm text-gray-600">Team Members</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-dark">10+</div>
                  <div className="text-sm text-gray-600">Open Positions</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-primary">
                    Growing
                  </div>
                  <div className="text-sm text-gray-600">
                    Team Satisfaction
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-dark">2025</div>
                  <div className="text-sm text-gray-600">Founded</div>
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
            Our <span className="text-orange-primary">Values</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            At FastHire, we focus on building a positive work environment.
            Our team values are centered around collaboration, growth, and 
            mutual respect for everyone&apos;s contributions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="text-center p-6">
            <IoStarOutline className="h-16 w-16 text-orange-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-3">Quality</h3>
            <p className="text-gray-600">
              We aim to deliver quality work and continuously improve our 
              products and processes.
            </p>
          </div>
          <div className="text-center p-6">
            <IoShieldCheckmarkOutline className="h-16 w-16 text-orange-dark mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-3">Integrity</h3>
            <p className="text-gray-600">
              We believe in honest communication and transparent business 
              practices with our team and clients.
            </p>
          </div>
          <div className="text-center p-6">
            <IoHeartOutline className="h-16 w-16 text-orange-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-3">Support</h3>
            <p className="text-gray-600">
              We support each other&apos;s growth and work together to achieve 
              common goals.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 px-40 bg-gray-100">
        <div className="text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Ready to{" "}
            <span className="text-orange-primary">Explore</span> Opportunities?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            Interested in joining our team? Take a look at our current openings 
            and see if there&apos;s a role that matches your skills and interests.
          </p>

          <div className="flex gap-6 justify-center">
            <Link href="/careers">
              <button className="relative flex items-center justify-between overflow-hidden rounded-full border border-orange-primary py-4 pl-8 pr-16 bg-orange-primary group hover:shadow-xl transition-all duration-500">
                <div className="absolute inset-0 w-0 group-hover:w-full rounded-full bg-white transition-all duration-500 ease-in-out z-0"></div>

                {/* Text */}
                <span className="relative z-10 text-white group-hover:text-orange-dark font-extrabold text-lg transition-colors duration-500">
                  Browse Openings
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
                  Apply Now
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
