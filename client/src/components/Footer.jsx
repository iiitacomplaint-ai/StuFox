/**
 * Footer Component - Simplified Version
 * UPDATED: Clean and simple footer for complaint system
 * 
 * @description Simple footer with essential links for complaint system
 * @version 2.0.0
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2 } from 'lucide-react';
import PrivacyPrompt from './PrivacyPrompt';

const Footer = () => {
    const [isPromptVisible, setIsPromptVisible] = useState(false);
    const currentYear = new Date().getFullYear();

    return (
        <>
            <PrivacyPrompt
                isVisible={isPromptVisible}
                onClose={() => setIsPromptVisible(false)}
            />

            <footer className="bg-gray-900 text-gray-400 px-6 md:px-16 lg:px-24 py-8 mt-auto">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        {/* Logo */}
                        <div className="flex items-center gap-2">
                            <Building2 className="h-6 w-6 text-purple-500" />
                            <span className="font-bold text-lg text-white">College Complaint System</span>
                        </div>

                        {/* Links */}
                        <div className="flex flex-wrap justify-center gap-6 text-sm">
                            <Link to="/" className="hover:text-purple-400 transition">Home</Link>
                            <Link to="/dashboard" className="hover:text-purple-400 transition">Dashboard</Link>
                            <Link to="/about" className="hover:text-purple-400 transition">About</Link>
                            <button onClick={() => setIsPromptVisible(true)} className="hover:text-purple-400 transition">
                                Privacy Policy
                            </button>
                            <Link to="/contact" className="hover:text-purple-400 transition">Contact</Link>
                        </div>
                    </div>

                    {/* Bottom Text */}
                    <div className="text-center mt-6 pt-6 border-t border-gray-800 text-xs">
                        <p>© {currentYear} College Complaint Management System. All rights reserved.</p>
                        <p className="mt-1">Departments: Network | Cleaning | Carpentry | PC Maintenance | Plumbing | Electricity</p>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default Footer;