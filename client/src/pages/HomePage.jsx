// HomePage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Clock, 
  CheckCircle, 
  Users, 
  ArrowRight, 
  GraduationCap,
  Building,
  Wifi,
  Droplets,
  Zap,
  Hammer,
  Cpu,
  ChevronRight,
  Star,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const features = [
    {
      icon: <Clock className="h-8 w-8" />,
      title: "Quick Resolution",
      description: "Get your complaints resolved within 48 hours",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Secure & Private",
      description: "Your data is protected with enterprise-grade security",
      color: "from-green-500 to-green-600"
    },
    {
      icon: <CheckCircle className="h-8 w-8" />,
      title: "Real-time Tracking",
      description: "Track your complaint status in real-time",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Dedicated Support",
      description: "24/7 support for all your concerns",
      color: "from-orange-500 to-orange-600"
    }
  ];

  const departments = [
    { name: "Network", icon: <Wifi className="h-6 w-6" />, color: "bg-blue-100 text-blue-600" },
    { name: "Cleaning", icon: <Building className="h-6 w-6" />, color: "bg-green-100 text-green-600" },
    { name: "Carpentry", icon: <Hammer className="h-6 w-6" />, color: "bg-amber-100 text-amber-600" },
    { name: "PC Maintenance", icon: <Cpu className="h-6 w-6" />, color: "bg-purple-100 text-purple-600" },
    { name: "Plumbing", icon: <Droplets className="h-6 w-6" />, color: "bg-cyan-100 text-cyan-600" },
    { name: "Electricity", icon: <Zap className="h-6 w-6" />, color: "bg-red-100 text-red-600" }
  ];

  const testimonials = [
    {
      name: "Rahul Sharma",
      role: "BTech CSE, 3rd Year",
      text: "The complaint system is amazing! My network issue was resolved within 24 hours.",
      rating: 5
    },
    {
      name: "Priya Patel",
      role: "BTech IT, 2nd Year",
      text: "Very efficient system. Love how I can track my complaint status in real-time.",
      rating: 5
    },
    {
      name: "Amit Kumar",
      role: "MTech, 1st Year",
      text: "Best complaint management system I've used. Quick response and resolution.",
      rating: 5
    }
  ];

  const stats = [
    { value: "98%", label: "Resolution Rate", icon: <CheckCircle className="h-6 w-6" /> },
    { value: "24h", label: "Avg Response Time", icon: <Clock className="h-6 w-6" /> },
    { value: "5000+", label: "Complaints Resolved", icon: <Users className="h-6 w-6" /> },
    { value: "100%", label: "Student Satisfaction", icon: <Star className="h-6 w-6" /> }
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleGetStarted = () => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/userdashboard');
    } else {
      navigate('/signup');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-blue-50/50"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Navbar */}
      <nav className="relative z-10 bg-white/80 backdrop-blur-md shadow-sm sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <GraduationCap className="h-8 w-8 text-purple-600" />
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  IIIT Allahabad
                </h1>
                <p className="text-xs text-gray-500">Student Complaint System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 text-gray-700 hover:text-purple-600 transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all transform hover:scale-105"
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className={`text-center transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="inline-flex items-center gap-2 bg-purple-100 px-4 py-2 rounded-full mb-6">
              <span className="text-purple-600 text-sm font-semibold">🎓 IIIT Allahabad</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent animate-gradient">
              Campus Complaint Redressal System
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Fast, efficient, and transparent complaint management system for IIIT Allahabad students.
              Your voice matters - let's make our campus better together!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleGetStarted}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2"
              >
                Get Started
                <ArrowRight className="h-5 w-5" />
              </button>
              <button
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-3 border-2 border-purple-600 text-purple-600 rounded-lg font-semibold hover:bg-purple-50 transition-all"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-16 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center transform hover:scale-105 transition-all duration-300">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full text-purple-600 mb-4">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-gray-800">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
              Why Choose Our System?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We provide a seamless experience for students to raise and track their complaints
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2"
              >
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-lg bg-gradient-to-r ${feature.color} text-white mb-4 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Departments Section */}
      <section className="relative z-10 py-20 bg-gradient-to-r from-purple-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
              Departments We Cover
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Dedicated teams to handle all your campus-related issues
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {departments.map((dept, index) => (
              <div
                key={index}
                className={`${dept.color} p-4 rounded-lg text-center transform hover:scale-105 transition-all duration-300 cursor-pointer`}
              >
                <div className="flex justify-center mb-2">{dept.icon}</div>
                <span className="font-medium">{dept.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
              What Students Say
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Trusted by thousands of students across IIIT Allahabad
            </p>
          </div>
          <div className="relative">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="w-full flex-shrink-0 px-4">
                    <div className="bg-white rounded-xl p-8 shadow-lg text-center">
                      <div className="flex justify-center mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <p className="text-gray-600 mb-6 italic">"{testimonial.text}"</p>
                      <div className="font-semibold text-gray-800">{testimonial.name}</div>
                      <div className="text-sm text-gray-500">{testimonial.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center mt-6 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2 rounded-full transition-all ${
                    currentSlide === index ? 'w-8 bg-purple-600' : 'w-2 bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Ready to Raise a Complaint?
          </h2>
          <p className="text-purple-100 mb-8 text-lg">
            Join thousands of students who are making our campus better
          </p>
          <button
            onClick={handleGetStarted}
            className="px-8 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:shadow-lg transition-all transform hover:scale-105 inline-flex items-center gap-2"
          >
            Get Started Now
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <GraduationCap className="h-8 w-8 text-purple-400" />
                <div>
                  <h3 className="font-bold">IIIT Allahabad</h3>
                  <p className="text-xs text-gray-400">Student Complaint System</p>
                </div>
              </div>
              <p className="text-sm text-gray-400">
                Empowering students to voice their concerns and improve campus life.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button onClick={() => navigate('/login')} className="hover:text-white transition">Login</button></li>
                <li><button onClick={() => navigate('/signup')} className="hover:text-white transition">Register</button></li>
                <li><a href="#features" className="hover:text-white transition">Features</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> +91-XXX-XXX-XXXX</li>
                <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> support@iiita.ac.in</li>
                <li className="flex items-center gap-2"><MapPin className="h-4 w-4" /> IIIT Allahabad, UP, India</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition">📘</a>
                <a href="#" className="text-gray-400 hover:text-white transition">🐦</a>
                <a href="#" className="text-gray-400 hover:text-white transition">📷</a>
                <a href="#" className="text-gray-400 hover:text-white transition">💼</a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 IIIT Allahabad. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default HomePage;