"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  IoArrowForwardOutline,
  IoLocationOutline,
  IoCallOutline,
  IoMailOutline,
  IoTimeOutline,
  IoSendOutline,
  IoPersonOutline,
  IoBusinessOutline,
  IoChatbubbleOutline,
  IoGlobeOutline,
  IoLogoFacebook,
  IoLogoLinkedin,
  IoLogoTwitter,
  IoCheckmarkCircleOutline,
} from "react-icons/io5";

function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    subject: "",
    message: "",
    inquiryType: "general",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setIsSubmitted(true);

    // Reset form after success message
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: "",
        email: "",
        company: "",
        subject: "",
        message: "",
        inquiryType: "general",
      });
    }, 3000);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gray-100 pt-32 pb-20 px-40 overflow-hidden">
        <div className="relative z-10">
          <div className="text-center mb-16">
            <h1 className="text-6xl font-bold text-gray-900 mb-6 opacity-0 animate-fade-in-up">
              Contact <span className="text-orange-primary">FastHire</span>
            </h1>
            <h2 className="text-8xl font-extrabold text-orange-dark mb-8 opacity-0 animate-fade-in-up animation-delay-500">
              Get In Touch
            </h2>
            <p className="text-xl text-gray-700 max-w-4xl mx-auto mb-12 opacity-0 animate-fade-in-up animation-delay-1000">
              Have questions about our platform? Want to partner with us? Or
              just want to say hello? We&apos;d love to hear from you. Reach out
              to our team and let&apos;s start a conversation.
            </p>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-orange-primary/5 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-gradient-to-r from-orange-dark/5 to-transparent"></div>
      </section>

      {/* Contact Form & Info Section */}
      <section className="py-20 px-40 bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div>
            <h3 className="text-4xl font-bold text-gray-900 mb-8">
              Send Us a <span className="text-orange-primary">Message</span>
            </h3>

            {isSubmitted ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
                <IoCheckmarkCircleOutline className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h4 className="text-2xl font-bold text-green-800 mb-2">
                  Message Sent Successfully!
                </h4>
                <p className="text-green-600">
                  Thank you for reaching out. We&apos;ll get back to you within
                  24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Full Name *
                    </label>
                    <div className="relative">
                      <IoPersonOutline className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-primary focus:border-transparent outline-none transition-all duration-200"
                        placeholder="Your full name"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Email Address *
                    </label>
                    <div className="relative">
                      <IoMailOutline className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-primary focus:border-transparent outline-none transition-all duration-200"
                        placeholder="your.email@company.com"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="company"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Company
                  </label>
                  <div className="relative">
                    <IoBusinessOutline className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-primary focus:border-transparent outline-none transition-all duration-200"
                      placeholder="Your company name"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="inquiryType"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Type of Inquiry
                  </label>
                  <select
                    id="inquiryType"
                    name="inquiryType"
                    value={formData.inquiryType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-primary focus:border-transparent outline-none transition-all duration-200"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="partnership">
                      Partnership Opportunities
                    </option>
                    <option value="support">Technical Support</option>
                    <option value="careers">Career Opportunities</option>
                    <option value="press">Press & Media</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Subject *
                  </label>
                  <div className="relative">
                    <IoChatbubbleOutline className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-primary focus:border-transparent outline-none transition-all duration-200"
                      placeholder="What's this about?"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-primary focus:border-transparent outline-none transition-all duration-200"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="relative flex items-center justify-between overflow-hidden rounded-full border border-orange-primary py-4 pl-8 pr-16 bg-orange-primary group hover:shadow-xl transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {/* Overlay */}
                  <div className="absolute inset-0 w-0 group-hover:w-full rounded-full bg-white transition-all duration-500 ease-in-out z-0"></div>

                  {/* Text */}
                  <span className="relative z-10 text-white group-hover:text-orange-dark font-extrabold text-lg transition-colors duration-500">
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </span>

                  {/* Icon */}
                  <div className="relative z-10 h-12 w-12 rounded-full bg-white flex items-center justify-center ml-4 transition-colors duration-500 group-hover:bg-orange-primary">
                    <IoSendOutline className="h-6 w-6 text-orange-primary group-hover:text-white transition-colors duration-500" />
                  </div>
                </button>
              </form>
            )}
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-4xl font-bold text-gray-900 mb-8">
              Get in <span className="text-orange-dark">Touch</span>
            </h3>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="bg-orange-primary/10 p-3 rounded-lg">
                  <IoMailOutline className="h-6 w-6 text-orange-primary" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">
                    Email Us
                  </h4>
                  <p className="text-gray-600 mb-2">
                    General inquiries and business partnerships
                  </p>
                  <a
                    href="mailto:info@fasthire.vn"
                    className="text-orange-primary font-semibold hover:text-orange-dark transition-colors"
                  >
                    info@fasthire.vn
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-orange-primary/10 p-3 rounded-lg">
                  <IoCallOutline className="h-6 w-6 text-orange-primary" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">
                    Call Us
                  </h4>
                  <p className="text-gray-600 mb-2">
                    Speak directly with our team
                  </p>
                  <a
                    href="tel:+84838633399"
                    className="text-orange-primary font-semibold hover:text-orange-dark transition-colors"
                  >
                    (+84) 838-633-399
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-orange-primary/10 p-3 rounded-lg">
                  <IoTimeOutline className="h-6 w-6 text-orange-primary" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">
                    Business Hours
                  </h4>
                  <div className="text-gray-600 space-y-1">
                    <p>Monday - Friday: 8:00 AM - 6:00 PM</p>
                    <p>Saturday: 9:00 AM - 1:00 PM</p>
                    <p>Sunday: Closed</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-orange-primary/10 p-3 rounded-lg">
                  <IoGlobeOutline className="h-6 w-6 text-orange-primary" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">
                    Follow Us
                  </h4>
                  <p className="text-gray-600 mb-4">
                    Stay connected on social media
                  </p>
                  <div className="flex gap-3">
                    <a
                      href="#"
                      className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <IoLogoFacebook className="h-5 w-5" />
                    </a>
                    <a
                      href="#"
                      className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <IoLogoLinkedin className="h-5 w-5" />
                    </a>
                    <a
                      href="#"
                      className="bg-gray-800 text-white p-2 rounded-lg hover:bg-gray-900 transition-colors"
                    >
                      <IoLogoTwitter className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Office Locations Section */}
      <section className="py-20 px-40 bg-gray-100">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Our <span className="text-orange-primary">Office Locations</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Visit us at any of our offices across Vietnam. We&apos;d love to
            meet you in person.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              city: "Ho Chi Minh City",
              address:
                "Floor 11, VINA BUILDING, 131 Xo Viet Nghe Tinh, Ward 17, Binh Thanh District",
              type: "Headquarters",
              hours: "Mon-Fri: 8:00 AM - 6:00 PM",
            },
            {
              city: "Da Nang",
              address:
                "Diamond Time Complex, 35 Thai Phien Street, Phuoc Ninh Ward, Hai Chau District",
              type: "Regional Office",
              hours: "Mon-Fri: 8:30 AM - 5:30 PM",
            },
            {
              city: "Hanoi",
              address:
                "Floor 3, Dolphin Plaza Tower, 28 Tran Binh, My Dinh 2 Ward, Nam Tu Liem District",
              type: "Regional Office",
              hours: "Mon-Fri: 8:30 AM - 5:30 PM",
            },
          ].map((office, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="flex items-center gap-3 mb-4">
                <IoLocationOutline className="h-8 w-8 text-orange-primary" />
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {office.city}
                  </h3>
                  <span className="text-sm bg-orange-primary/10 text-orange-primary px-2 py-1 rounded-full">
                    {office.type}
                  </span>
                </div>
              </div>

              <p className="text-gray-600 mb-4 leading-relaxed">
                {office.address}
              </p>

              <div className="flex items-center gap-2 text-sm text-gray-500">
                <IoTimeOutline className="h-4 w-4" />
                <span>{office.hours}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-40 bg-white">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Frequently Asked <span className="text-orange-dark">Questions</span>
          </h2>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {[
            {
              question: "How quickly can I expect a response?",
              answer:
                "We typically respond to all inquiries within 24 hours during business days. For urgent matters, please call us directly.",
            },
            {
              question: "Do you offer partnerships or integrations?",
              answer:
                "Yes! We're always interested in strategic partnerships and API integrations. Please use our contact form and select 'Partnership Opportunities'.",
            },
            {
              question: "Can I schedule a demo of your platform?",
              answer:
                "Absolutely! We offer personalized demos for companies interested in using FastHire. Contact us to schedule a session with our team.",
            },
            {
              question: "Do you provide customer support?",
              answer:
                "Yes, we offer comprehensive customer support through email, phone, and our help center. Premium customers also get priority support.",
            },
          ].map((faq, index) => (
            <div key={index} className="bg-gray-50 p-6 rounded-xl">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">
                {faq.question}
              </h4>
              <p className="text-gray-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 px-40 bg-gray-100">
        <div className="text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Ready to <span className="text-orange-primary">Get Started?</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            Whether you&apos;re a job seeker looking for your next opportunity
            or a company seeking top talent, FastHire is here to help you
            succeed.
          </p>

          <div className="flex gap-6 justify-center">
            <Link href="/careers">
              <button className="relative flex items-center justify-between overflow-hidden rounded-full border border-orange-primary py-4 pl-8 pr-16 bg-orange-primary group hover:shadow-xl transition-all duration-500">
                {/* Overlay */}
                <div className="absolute inset-0 w-0 group-hover:w-full rounded-full bg-white transition-all duration-500 ease-in-out z-0"></div>

                {/* Text */}
                <span className="relative z-10 text-white group-hover:text-orange-dark font-extrabold text-lg transition-colors duration-500">
                  Browse Jobs
                </span>

                {/* Icon */}
                <div className="relative z-10 h-12 w-12 rounded-full bg-white flex items-center justify-center ml-4 transition-colors duration-500 group-hover:bg-orange-primary">
                  <IoArrowForwardOutline className="h-6 w-6 text-orange-primary group-hover:text-white transition-colors duration-500" />
                </div>
              </button>
            </Link>

            <Link href="/about-us">
              <button className="relative flex items-center justify-between overflow-hidden rounded-full border border-orange-dark py-4 pl-8 pr-16 bg-white group hover:shadow-xl transition-all duration-500">
                {/* Overlay */}
                <div className="absolute inset-0 w-0 group-hover:w-full rounded-full bg-orange-dark transition-all duration-500 ease-in-out z-0"></div>

                {/* Text */}
                <span className="relative z-10 text-orange-dark group-hover:text-white font-extrabold text-lg transition-colors duration-500">
                  Learn More About Us
                </span>

                {/* Icon */}
                <div className="relative z-10 h-12 w-12 rounded-full bg-orange-dark flex items-center justify-center ml-4 transition-colors duration-500 group-hover:bg-white">
                  <IoArrowForwardOutline className="h-6 w-6 text-white group-hover:text-orange-dark transition-colors duration-500" />
                </div>
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ContactPage;
