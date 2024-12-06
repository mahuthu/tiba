import React from "react";
import Navbar from "./navbar";
import LandingVideo from "./landing-video";
import Link from "next/link";
import { useAuth } from "@/assets/hooks/use-auth";

const LandingPage = () => {
  return (
    <section className="heroSection sm:px-24 px-4 py-4">
      <Navbar />
      <section className="flex items-center justify-between h-[84vh]">
        <div className="md:w-7/12 w-full space-y-4">
          <h1 className="text-white md: font-thin md:text-4xl text-2xl" style={{ color: '#d6d6d6' }}>
            Innovating Care, Simplifying Lives.
          </h1>
          <p className="text-white font-thin md:text-sm text-xs">
            Revolutionize hospital management with our AI-powered Hospital Information Management System. 
            From intelligent patient record handling to predictive analytics and virtual assistance, 
            our system streamlines operations and empowers staff to deliver exceptional care effortlessly!
          </p>
          <div className="flex items-center gap-4">
            <button className="border border-white text-white px-4 py-3">
              Get Started
            </button>
            <Link href="/book-appointment">
              <button className="border border-white hover:bg-primary hover:text-white hover:border-none text-white px-4 py-3 transition duration-500 hover:scale-105">
                Book Appointment
              </button>
            </Link>
          </div>
        </div>
        <section className="w-5/12 md:block hidden">
          <div className="flex items-center justify-center">
            <LandingVideo />
          </div>
        </section>
      </section>
      <div className="absolute bottom-4 left-4 sm:left-24">
        <a
          href="https://savannahinc.co.ke"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white text-sm font-light hover:text-primary transition-colors duration-300 hover:underline"
        >
          Powered by Savannah Inc.
        </a>
      </div>
    </section>
  );
};

export default LandingPage;
