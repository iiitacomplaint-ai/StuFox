/**
 * Hero Component
 * UPDATED: Converted from crime reporting to college complaint management system
 * UPDATED: Changed messages to reflect complaint management themes
 * UPDATED: Changed illustration from Shield to Building/Complaint icons
 * UPDATED: Updated color scheme to purple/indigo theme
 * UPDATED: Changed button texts and navigation paths
 * UPDATED: Updated description to focus on college complaints
 * UPDATED: Added department categories display
 * 
 * @description Hero section for the landing page of College Complaint Management System
 * @version 2.0.0 (Complete rewrite for complaint management)
 */

import React, { useEffect, useState } from 'react';
import { ClipboardList, Users, ArrowRight, Building2, Wrench, Plug, Droplet, PaintRoller, Trash2, Cpu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Updated illustration component for complaint system
const ComplaintIllustration = () => (
  <div className="relative">
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-48 h-48 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-2xl shadow-2xl flex items-center justify-center transform rotate-6">
        <ClipboardList className="w-24 h-24 text-purple-600 opacity-80" strokeWidth={1.5} />
      </div>
    </div>
    <div className="absolute -top-8 -right-8 w-24 h-24 bg-purple-200 rounded-full opacity-60 blur-md"></div>
    <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-indigo-200 rounded-full opacity-60 blur-md"></div>
  </div>
);

const Hero = () => {
  const navigate = useNavigate();

  const messages = [
    "Submit College Complaints",
    "Track Issue Resolution",
    "Network & Maintenance Issues",
    "Cleanliness & Facilities",
    "PC & Equipment Problems",
    "Plumbing & Electricity",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentIndex(prev => (prev + 1) % messages.length);
        setFade(true);
      }, 800);
    }, 4800);

    return () => clearInterval(interval);
  }, [messages.length]);

  const departments = [
    { name: "Network", icon: Plug, color: "blue" },
    { name: "Cleaning", icon: Trash2, color: "green" },
    { name: "Carpentry", icon: Wrench, color: "orange" },
    { name: "PC Maintenance", icon: Cpu, color: "purple" },
    { name: "Plumbing", icon: Droplet, color: "cyan" },
    { name: "Electricity", icon: PaintRoller, color: "yellow" }
  ];

  return (
    <div className="relative font-sans bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background blobs with updated colors */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-purple-200 rounded-full opacity-50 mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute -bottom-24 -right-12 w-96 h-96 bg-indigo-200 rounded-full opacity-50 mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-purple-100 rounded-full opacity-40 mix-blend-multiply filter blur-2xl animate-blob animation-delay-4000 -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="relative z-10 container mx-auto px-6 md:px-12 text-center md:text-left">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">

          {/* Left Content */}
          <div className="md:w-1/2 lg:w-3/5">
            <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2 mb-6 shadow-sm">
              <Building2 className="text-purple-600 h-5 w-5" />
              <span className="text-sm font-semibold text-gray-700">
                College Complaint Management System
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-4">
              Efficient Way To&nbsp;
              <span
                className={`inline-block transition-opacity duration-500 ease-in-out bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent ${
                  fade ? 'opacity-100' : 'opacity-0'
                }`}
              >
                {messages[currentIndex]}
              </span>
            </h1>

            <p className="text-lg text-gray-600 max-w-xl mx-auto md:mx-0 mb-6">
              A comprehensive platform for students and staff to report college-related issues. 
              Get quick resolutions from dedicated department teams for all your campus needs.
            </p>

            {/* Department Tags */}
            <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-8">
              {departments.map((dept, idx) => (
                <span
                  key={idx}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 bg-${dept.color}-50 text-${dept.color}-700 rounded-full text-xs font-medium border border-${dept.color}-200`}
                >
                  <dept.icon className="h-3 w-3" />
                  {dept.name}
                </span>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <button
                onClick={() => navigate('/signup')}
                className="group inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Get Started
                <Users className="h-5 w-5 transform group-hover:rotate-12 transition-transform" />
              </button>
              <button
                onClick={() => navigate('/login')}
                className="group inline-flex items-center gap-2 bg-white text-purple-600 border-2 border-purple-200 px-8 py-4 rounded-full text-lg font-semibold hover:bg-purple-50 hover:border-purple-300 transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-1"
              >
                Submit a Complaint
                <ArrowRight className="h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Right Visual */}
          <div className="hidden md:block md:w-1/2 lg:w-2/5">
            <div className="relative">
              {/* Animated floating elements */}
              <div className="absolute -top-10 -left-10 animate-float-slow">
                <div className="w-16 h-16 bg-purple-200 rounded-full opacity-60"></div>
              </div>
              <div className="absolute -bottom-10 -right-10 animate-float-slow animation-delay-2000">
                <div className="w-20 h-20 bg-indigo-200 rounded-full opacity-60"></div>
              </div>
              <div className="absolute top-1/2 -right-5 animate-float-slow animation-delay-4000">
                <div className="w-12 h-12 bg-purple-300 rounded-full opacity-50"></div>
              </div>
              
              {/* Main Illustration */}
              <div className="relative bg-white/40 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/50">
                <div className="flex flex-col items-center gap-6">
                  <div className="w-32 h-32 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-2xl flex items-center justify-center shadow-lg">
                    <ClipboardList className="w-16 h-16 text-purple-600" strokeWidth={1.5} />
                  </div>
                  <div className="text-center">
                    <h3 className="font-semibold text-gray-800">Quick & Easy Reporting</h3>
                    <p className="text-sm text-gray-500 mt-1">Submit complaints in minutes</p>
                  </div>
                  <div className="flex gap-3">
                    {departments.slice(0, 3).map((dept, idx) => (
                      <div key={idx} className="text-center">
                        <div className={`w-10 h-10 bg-${dept.color}-100 rounded-full flex items-center justify-center`}>
                          <dept.icon className={`h-5 w-5 text-${dept.color}-600`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-15px) translateX(10px); }
          50% { transform: translateY(10px) translateX(-10px); }
          75% { transform: translateY(-10px) translateX(5px); }
        }
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
      `}</style>
    </div>
  );
};

export default Hero;