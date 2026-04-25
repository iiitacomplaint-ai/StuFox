/**
 * AdminNavbar Component
 * UPDATED: Converted from Nyay Setu (crime reporting) to College Complaint Management System
 * UPDATED: Changed brand name to StuFix
 * UPDATED: Updated navigation links for complaint management
 * UPDATED: Changed color scheme to purple/indigo theme
 * UPDATED: Updated dashboard route from citizen to admin
 * UPDATED: Removed police/personnel references
 * UPDATED: Added complaint management specific links
 * UPDATED: Added Home and Contact links
 * UPDATED: Updated to StuFix branding with admin portal subtitle
 * 
 * @description Navigation bar for admin users of the College Complaint Management System
 * @version 3.0.0 (StuFix branding)
 */

import { useNavigate, Link, useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { LogOut, User, LayoutDashboard, Info, Phone, Home, Menu, X } from 'lucide-react';
import { toast } from 'react-toastify';

const AdminNavbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navLinks = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Home', path: '/', icon: Home },
        { name: 'About', path: '/about', icon: Info },
        { name: 'Contact', path: '/contact', icon: Phone }
    ];

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => setIsMenuOpen(false), [location.pathname]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        toast.success('Logged out successfully');
        navigate('/login');
    };

    const navClasses = `
        fixed top-0 left-0 w-full flex items-center justify-between
        px-4 sm:px-6 lg:px-8 transition-all duration-300 ease-in-out z-50
        ${isScrolled ? "bg-white/90 shadow-md backdrop-blur-lg py-3" : "bg-gradient-to-r from-purple-50 to-indigo-50 py-5"}
    `;

    return (
        <nav className={navClasses}>
            <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
                {/* Logo */}
                <Link to='/admin/dashboard' className="flex items-center gap-2 font-bold text-2xl group cursor-pointer">
                    <img 
                        src="/favico.png" 
                        alt="StuFix Logo" 
                        className="h-8 w-8 object-contain group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="flex flex-col">
                        <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                            StuFix
                        </span>
                        <span className="text-xs text-gray-500 font-normal">Admin Portal</span>
                    </div>
                </Link>

                {/* Desktop Navigation Links */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link, i) => (
                        <Link
                            key={i}
                            to={link.path}
                            className="text-gray-700 hover:text-purple-600 transition-colors duration-300 font-medium flex items-center gap-2"
                        >
                            <link.icon className="h-4 w-4" />
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* Desktop Right - Admin Info & Logout */}
                <div className="hidden md:flex items-center gap-6">
                    <div className={`flex items-center gap-3 px-4 py-2 rounded-full transition-all duration-300 ${
                        isScrolled ? "bg-gray-100" : "bg-white/50 backdrop-blur-sm"
                    }`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-purple-100`}>
                            <User className={`h-4 w-4 text-purple-600`} />
                        </div>
                        <div className="hidden lg:block">
                            <p className="text-sm font-medium text-gray-800">
                                Admin
                            </p>
                            <p className="text-xs text-purple-600 font-medium">
                                Administrator
                            </p>
                        </div>
                    </div>
                    
                    <button
                        onClick={handleLogout}
                        className={`flex items-center gap-2 px-5 py-2 rounded-full font-medium transition-all duration-300 ${
                            isScrolled 
                                ? "bg-red-500 hover:bg-red-600 text-white shadow-md" 
                                : "bg-red-500 hover:bg-red-600 text-white shadow-md"
                        }`}
                    >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                    </button>
                </div>

                {/* Mobile Menu Button */}
                <div className="flex items-center md:hidden">
                    <button 
                        onClick={() => setIsMenuOpen(!isMenuOpen)} 
                        className="text-gray-800 p-2 hover:bg-purple-100 rounded-lg transition-colors"
                        aria-label="Menu"
                    >
                        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Panel */}
            <div className={`
                fixed top-0 left-0 w-full h-screen bg-gradient-to-br from-purple-50 to-indigo-100
                flex flex-col items-center justify-center gap-8
                transition-transform duration-500 ease-in-out z-40
                ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}
            `}>
                <button 
                    className="absolute top-6 right-6 p-2 hover:bg-purple-200 rounded-full transition-colors" 
                    onClick={() => setIsMenuOpen(false)}
                    aria-label="Close menu"
                >
                    <X className="h-7 w-7 text-gray-700" />
                </button>

                {/* Mobile Logo */}
                <div className="flex flex-col items-center gap-2 mb-4">
                    <img 
                        src="/favico.png" 
                        alt="StuFix Logo" 
                        className="h-12 w-12 object-contain"
                    />
                    <div className="text-center">
                        <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                            StuFix
                        </span>
                        <p className="text-sm text-purple-600 font-medium">Admin Portal</p>
                    </div>
                </div>

                {/* Mobile Admin Info */}
                <div className="flex items-center gap-3 p-4 bg-white rounded-xl mb-4 w-64">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="text-left">
                        <p className="font-semibold text-gray-800">Admin User</p>
                        <p className="text-sm text-gray-500">Administrator</p>
                        <p className="text-xs text-purple-600 font-medium">System Admin</p>
                    </div>
                </div>

                {/* Mobile Navigation Links */}
                <div className="flex flex-col gap-6 text-center">
                    {navLinks.map((link, i) => (
                        <Link
                            key={i}
                            to={link.path}
                            onClick={() => setIsMenuOpen(false)}
                            className="text-2xl font-semibold text-gray-800 hover:text-purple-600 transition-colors flex items-center justify-center gap-3"
                        >
                            <link.icon className="h-6 w-6" />
                            {link.name}
                        </Link>
                    ))}

                    <div className="h-px bg-gray-300 w-48 mx-auto my-4"></div>

                    {/* Mobile Logout */}
                    <button
                        onClick={() => {
                            handleLogout();
                            setIsMenuOpen(false);
                        }}
                        className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-full text-xl font-semibold transition-all shadow-lg flex items-center justify-center gap-2"
                    >
                        <LogOut className="h-5 w-5" />
                        Logout
                    </button>
                </div>

                {/* Mobile Footer Info */}
                <div className="absolute bottom-8 text-center text-sm text-gray-500">
                    <p className="text-purple-600 font-semibold">StuFix - Admin Management System</p>
                    <p className="text-xs mt-1">Manage complaints, users, and workers</p>
                    <p className="text-xs mt-1">Network | Cleaning | Carpentry | PC Maintenance | Plumbing | Electricity</p>
                </div>
            </div>
        </nav>
    );
};

export default AdminNavbar;