import React from "react";
import Navbar from "./navbar";
import Image from "next/image";
import { FaUserMd, FaRobot, FaChartLine, FaHospitalUser } from "react-icons/fa";
import { MdSecurity, MdIntegrationInstructions } from "react-icons/md";

const AboutPage = () => {
  const features = [
    {
      icon: <FaUserMd className="text-4xl text-primary" />,
      title: "Patient-Centric Care",
      description: "Upload and manage your complete medical history, from lab results to prescriptions, ensuring seamless continuity of care across healthcare providers."
    },
    {
      icon: <FaRobot className="text-4xl text-primary" />,
      title: "AI-Powered Diagnostics",
      description: "Our future AI integration will analyze medical data patterns to assist in early diagnosis and provide evidence-based treatment suggestions."
    },
    {
      icon: <MdSecurity className="text-4xl text-primary" />,
      title: "Secure Health Records",
      description: "Take control of your health data through our secure, user-friendly patient portal while maintaining strict privacy standards."
    },
    {
      icon: <FaChartLine className="text-4xl text-primary" />,
      title: "Administrative Intelligence",
      description: "Our AI chatbot provides real-time operational insights, reducing administrative burden and saving healthcare organizations billions annually."
    },
    {
      icon: <MdIntegrationInstructions className="text-4xl text-primary" />,
      title: "Seamless Integration",
      description: "Bridge the gap between hospitals with our interoperable system, ensuring your medical history follows you wherever you go."
    },
    {
      icon: <FaHospitalUser className="text-4xl text-primary" />,
      title: "Easy Appointment Management",
      description: "Book appointments, track visits, and share records with healthcare providers through our intuitive interface."
    }
  ];

  return (
    <div className="relative min-h-screen">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/back9.webp"
          alt="Healthcare Background"
          fill // Use fill instead of layout="fill"
          sizes="100vw" // Add sizes prop
          style={{
            objectFit: 'cover',
            objectPosition: 'center',
          }} // Use style instead of objectFit prop
          quality={100}
          priority
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/95 via-gray-900/90 to-gray-900/95" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Navbar />
        
        {/* Hero Section */}
        <div className="px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl">
                Revolutionizing Healthcare Management
              </h1>
              <p className="mt-3 max-w-md mx-auto text-base text-gray-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                Bridging the gap in healthcare systems with AI-powered solutions, comprehensive patient records, and seamless hospital management.
              </p>
            </div>
          </div>
        </div>

        {/* Problem Statement */}
        <div className="bg-graykl-900/90 backdrop-blur-sm py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center">
              <h2 className="text-3xl text-primary font-semibold">The Challenge</h2>
              <p className="mt-4 max-w-3xl mx-auto text-xl text-gray-300">
                Healthcare systems in our region face critical challenges in diagnostic accuracy due to:
              </p>
              <ul className="mt-6 text-gray-300 text-lg space-y-4 list-disc list-inside">
                <li>Fragmented medical records across different healthcare providers</li>
                <li>Poor interoperability between hospital systems</li>
                <li>Limited patient access to their complete medical history</li>
                <li>Missed patterns that could aid in early diagnosis</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-primary text-center mb-12">
              Our Solution
            </h2>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-6 hover:bg-gray-800/70 transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white text-center mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 text-center">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gray-900/50 backdrop-blur-sm py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-8">
              Ready to Transform Healthcare Management?
            </h2>
            <div className="flex justify-center gap-4">
              <button className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary/80 transition-colors duration-300">
                Get Started
              </button>
              <button className="border border-primary text-primary px-8 py-3 rounded-lg hover:bg-primary hover:text-white transition-colors duration-300">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;