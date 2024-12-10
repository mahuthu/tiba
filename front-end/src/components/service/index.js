import React from "react";
import Navbar from "../About/navbar";
import Image from "next/image";
import { 
  FaUserMd, 
  FaUserNurse, 
  FaHospitalUser,
  FaFlask,
  FaClinicMedical,
  FaMoneyBillWave
} from "react-icons/fa";
import { 
  MdDashboard, 
  MdInventory,
  MdOutlineHealthAndSafety
} from "react-icons/md";
import { BsRobot } from "react-icons/bs";
import { AiOutlineDatabase } from "react-icons/ai";
import Link from 'next/link';

const ServicesPage = () => {
  const services = [
    {
      icon: <BsRobot className="text-5xl text-primary" />,
      title: "AI-Powered Features",
      description: "Advanced AI capabilities for diagnostic suggestions, pattern recognition, and predictive analytics based on comprehensive patient history.",
      features: [
        "Intelligent diagnostic assistance",
        "Pattern recognition in patient histories",
        "Predictive health analytics",
        "AI-powered chatbot for instant support"
      ]
    },
    {
      icon: <MdDashboard className="text-5xl text-primary" />,
      title: "Patient Dashboard",
      description: "Comprehensive patient portal for managing personal health information and interactions with healthcare providers.",
      features: [
        "Complete medical history access",
        "Appointment scheduling",
        "Test results viewing",
        "Prescription management",
        "Secure communication with healthcare providers"
      ]
    },
    {
      icon: <FaUserMd className="text-5xl text-primary" />,
      title: "Doctor's Dashboard",
      description: "Streamlined interface for healthcare providers to manage patient care efficiently.",
      features: [
        "Patient history review",
        "Digital prescription writing",
        "Lab result analysis",
        "Treatment planning tools",
        "Appointment management"
      ]
    },
    {
      icon: <FaUserNurse className="text-5xl text-primary" />,
      title: "Nursing Management",
      description: "Comprehensive tools for nursing staff to monitor and manage patient care.",
      features: [
        "Patient vital monitoring",
        "Care plan execution",
        "Medication administration",
        "Patient observation notes",
        "Task management"
      ]
    },
    {
      icon: <FaHospitalUser className="text-5xl text-primary" />,
      title: "Reception Dashboard",
      description: "Efficient front office management system for smooth patient processing.",
      features: [
        "Patient registration",
        "Appointment scheduling",
        "Visitor management",
        "Queue management",
        "Patient information updates"
      ]
    },
    {
      icon: <MdOutlineHealthAndSafety className="text-5xl text-primary" />,
      title: "Pharmacy Management",
      description: "Complete pharmacy operations management system.",
      features: [
        "Inventory tracking",
        "Prescription processing",
        "Drug interaction checking",
        "Stock alerts",
        "Billing integration"
      ]
    },
    {
      icon: <FaFlask className="text-5xl text-primary" />,
      title: "Laboratory Management",
      description: "Comprehensive lab test management and reporting system.",
      features: [
        "Test order management",
        "Result recording",
        "Sample tracking",
        "Report generation",
        "Quality control monitoring"
      ]
    },
    {
      icon: <MdInventory className="text-5xl text-primary" />,
      title: "Inventory Management",
      description: "Advanced inventory control system for medical supplies and equipment.",
      features: [
        "Stock tracking",
        "Automated reordering",
        "Supplier management",
        "Usage analytics",
        "Expiry date monitoring"
      ]
    },
    {
      icon: <FaMoneyBillWave className="text-5xl text-primary" />,
      title: "Billing Dashboard",
      description: "Comprehensive financial management and billing system.",
      features: [
        "Insurance processing",
        "Payment tracking",
        "Invoice generation",
        "Financial reporting",
        "Payment integration"
      ]
    },
    {
      icon: <AiOutlineDatabase className="text-5xl text-primary" />,
      title: "Data Integration",
      description: "Seamless integration of all hospital data for better decision making.",
      features: [
        "Cross-department data sharing",
        "Real-time updates",
        "Automated reporting",
        "Analytics dashboard",
        "Data backup and security"
      ]
    }
  ];

  return (
    <div className="relative min-h-screen">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/images/back4.jpg"
          alt="Healthcare Services Background"
          layout="fill"
          objectFit="cover"
          quality={100}
          priority
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-gray-900/90 " />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Navbar />
        
        {/* Hero Section */}
        <div className="px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl">
              Our Services
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Comprehensive Healthcare Management Solutions Powered by AI
            </p>
          </div>
        </div>

        {/* Services Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <div 
                key={index}
                className="bg-gray-900/50 backdrop-blur-sm rounded-lg p-6 hover:bg-gray-800/70 transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex justify-center mb-4">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold text-white text-center mb-4">
                  {service.title}
                </h3>
                <p className="text-gray-300 text-center mb-4">
                  {service.description}
                </p>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="text-gray-400 flex items-center">
                      <span className="mr-2">•</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gray-900/50 backdrop-blur-sm py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-8">
              Ready to Transform Your Healthcare Management?
            </h2>
            <div className="flex justify-center gap-4">
              <Link href="/auth/register">
                <button className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary/80 transition-colors duration-300">
                  Get Started
                </button>
              </Link>
              <Link href="/contact">
                <button className="border border-primary text-primary px-8 py-3 rounded-lg hover:bg-primary hover:text-white transition-colors duration-300">
                  Contact Us
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;