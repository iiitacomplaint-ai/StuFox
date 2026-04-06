/**
 * AdminNavbar Component
 * UPDATED: Converted from Nyay Setu (crime reporting) to College Complaint Management System
 * UPDATED: Changed brand name and logo
 * UPDATED: Updated navigation links for complaint management
 * UPDATED: Changed color scheme to purple/indigo theme
 * UPDATED: Updated dashboard route from citizen to admin
 * UPDATED: Removed police/personnel references
 * UPDATED: Added complaint management specific links
 * 
 * @description Navigation bar for admin users of the College Complaint Management System
 * @version 2.0.0 (Complete rewrite for complaint management)
 */

import { useNavigate, Link } from 'react-router-dom';
import React from 'react';
import { Building2, LogOut, User, LayoutDashboard, ClipboardList, Users, BarChart3, Settings } from 'lucide-react';

const AdminNavbar = () => {
    const navLinks = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Complaints', path: '/admin/complaints', icon: ClipboardList },
        { name: 'Workers', path: '/admin/workers', icon: Users },
        { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
        { name: 'Settings', path: '/admin/settings', icon: Settings }
    ];

    const navigate = useNavigate();
    const [isScrolled, setIsScrolled] = React.useState(false);
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    React.useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 left-0 w-full flex items-center justify-between px-4 md:px-8 lg:px-16 xl:px-24 transition-all duration-300 z-50 ${
            isScrolled 
                ? "bg-white/90 shadow-lg backdrop-blur-lg py-3" 
                : "bg-gradient-to-r from-purple-700 to-indigo-700 py-5"
        }`}>
            
            {/* Logo */}
            <Link to='/admin/dashboard' className="flex items-center gap-2 font-bold text-xl md:text-2xl group">
                <Building2 className={`h-7 w-7 md:h-8 md:w-8 transition-all duration-300 ${
                    isScrolled ? "text-purple-600" : "text-white"
                } group-hover:scale-110`} />
                <span className={`transition-colors duration-300 ${
                    isScrolled ? "bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent" : "text-white"
                }`}>
                    College Complaint System
                </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4 lg:gap-8">
                {navLinks.map((link, i) => (
                    <button
                        key={i}
                        onClick={() => navigate(link.path)}
                        className={`group flex flex-col gap-0.5 focus:outline-none transition-colors duration-300 ${
                            isScrolled ? "text-gray-700 hover:text-purple-600" : "text-white/90 hover:text-white"
                        }`}
                    >
                        <div className="flex items-center gap-2">
                            <link.icon className="h-4 w-4" />
                            <span>{link.name}</span>
                        </div>
                        <div className={`h-0.5 w-0 group-hover:w-full transition-all duration-300 ${
                            isScrolled ? "bg-purple-600" : "bg-white"
                        }`} />
                    </button>
                ))}
            </div>

            {/* Desktop Right - Admin Info & Logout */}
            <div className="hidden md:flex items-center gap-4">
                <div className={`flex items-center gap-3 px-4 py-2 rounded-full transition-all duration-300 ${
                    isScrolled ? "bg-gray-100" : "bg-white/10 backdrop-blur-sm"
                }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isScrolled ? "bg-purple-100" : "bg-white/20"
                    }`}>
                        <User className={`h-4 w-4 ${isScrolled ? "text-purple-600" : "text-white"}`} />
                    </div>
                    <div className="hidden lg:block">
                        <p className={`text-sm font-medium ${isScrolled ? "text-gray-800" : "text-white"}`}>
                            Admin
                        </p>
                        <p className={`text-xs ${isScrolled ? "text-gray-500" : "text-white/70"}`}>
                            Administrator
                        </p>
                    </div>
                </div>
                
                <button
                    onClick={handleLogout}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-medium transition-all duration-300 ${
                        isScrolled 
                            ? "bg-red-500 hover:bg-red-600 text-white shadow-md" 
                            : "bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
                    }`}
                >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-3 md:hidden">
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className={`p-2 rounded-lg transition-colors ${
                        isScrolled ? "hover:bg-gray-100" : "hover:bg-white/10"
                    }`}
                    aria-label="Menu"
                >
                    <svg className={`h-6 w-6 ${isScrolled ? "text-gray-700" : "text-white"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>

            {/* Mobile Menu Panel */}
            <div className={`fixed top-0 left-0 w-full h-screen bg-white flex flex-col md:hidden items-center justify-center gap-6 font-medium text-gray-800 transition-transform duration-500 ease-in-out z-50 ${
                isMenuOpen ? "translate-x-0" : "-translate-x-full"
            }`}>
                <button 
                    className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors" 
                    onClick={() => setIsMenuOpen(false)}
                    aria-label="Close menu"
                >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Mobile Logo */}
                <div className="absolute top-6 left-6">
                    <div className="flex items-center gap-2">
                        <Building2 className="h-7 w-7 text-purple-600" />
                        <span className="font-bold text-lg bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                            College Complaint System
                        </span>
                    </div>
                </div>

                {/* Mobile Navigation Links */}
                <div className="flex flex-col gap-6 text-center">
                    {navLinks.map((link, i) => (
                        <button
                            key={i}
                            onClick={() => {
                                navigate(link.path);
                                setIsMenuOpen(false);
                            }}
                            className="flex items-center gap-3 text-xl hover:text-purple-600 transition-colors"
                        >
                            <link.icon className="h-5 w-5" />
                            {link.name}
                        </button>
                    ))}
                </div>

                <div className="h-px w-48 bg-gray-200 my-4"></div>

                {/* Mobile Profile & Logout */}
                <div className="flex flex-col gap-4 w-full max-w-xs">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-purple-600" />
                        </div>
                        <div className="text-left">
                            <p className="font-semibold text-gray-800">Admin User</p>
                            <p className="text-sm text-gray-500">Administrator</p>
                        </div>
                    </div>
                    
                    <button
                        onClick={() => {
                            handleLogout();
                            setIsMenuOpen(false);
                        }}
                        className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full font-medium transition-all duration-300 w-full"
                    >
                        <LogOut className="h-4 w-4" />
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default AdminNavbar;