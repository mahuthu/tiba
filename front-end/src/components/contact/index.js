import React, { useState } from "react";
import Navbar from "../About/navbar";
import Image from "next/image";
import { 
  FaPhone, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaWhatsapp 
} from "react-icons/fa";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Add your form submission logic here
      // Example: await axios.post('/api/contact', formData);
      setNotification({
        show: true,
        message: 'Message sent successfully!',
        type: 'success'
      });
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      setNotification({
        show: true,
        message: 'Failed to send message. Please try again.',
        type: 'error'
      });
    } finally {
      setLoading(false);
      setTimeout(() => {
        setNotification({ show: false, message: '', type: '' });
      }, 3000);
    }
  };

  const contactInfo = [
    {
      icon: <FaPhone className="text-2xl text-primary" />,
      title: "Phone",
      details: ["+254 793704217", "+254 726258462"],
      action: "tel:+254793704217"
    },
    {
      icon: <FaEnvelope className="text-2xl text-primary" />,
      title: "Email",
      details: ["info@savannahinc.co.ke", "support@tiba.co.ke"],
      action: "mailto:info@savannahinc.co.ke"
    },
    {
      icon: <FaMapMarkerAlt className="text-2xl text-primary" />,
      title: "Location",
      details: ["Nairobi, Kenya", "Business Center, 2nd Floor"],
      action: "https://maps.google.com/?q=YourLocation"
    },
    {
      icon: <FaWhatsapp className="text-2xl text-primary" />,
      title: "WhatsApp",
      details: ["Chat with us", "Available 24/7"],
      action: "https://wa.me/254793704217"
    }
  ];

  return (
    <div className="relative min-h-screen">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/images/back10.jpg"
          alt="Contact Background"
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
        
        {/* Notification */}
        {notification.show && (
          <div className={`fixed top-4 right-4 p-4 rounded-md ${
            notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white z-50`}>
            {notification.message}
          </div>
        )}

        {/* Hero Section */}
        <div className="px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl">
              Get in Touch
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Have questions about our HIMS? We&apos;re here to help!
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-lg border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-white">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md bg-gray-800/50 border-gray-600 focus:border-primary focus:ring-primary text-white placeholder-gray-400"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-white">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md bg-gray-800/50 border-gray-600 focus:border-primary focus:ring-primary text-white placeholder-gray-400"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-white">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    id="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md bg-gray-800/50 border-gray-600 focus:border-primary focus:ring-primary text-white placeholder-gray-400"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-white">
                    Message
                  </label>
                  <textarea
                    name="message"
                    id="message"
                    rows={4}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md bg-gray-800/50 border-gray-600 focus:border-primary focus:ring-primary text-white placeholder-gray-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-white py-3 px-6 rounded-md hover:bg-primary/80 transition-colors duration-300 disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {contactInfo.map((info, index) => (
                <a
                  key={index}
                  href={info.action}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700 hover:bg-gray-800/50 transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="flex items-center gap-4 mb-4">
                    {info.icon}
                    <h3 className="text-xl font-semibold text-white">{info.title}</h3>
                  </div>
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="text-gray-300">{detail}</p>
                  ))}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;