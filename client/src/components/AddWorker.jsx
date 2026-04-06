import React, { useState } from 'react';
import { createWorker } from '../apicalls/adminapi';
import { toast } from 'react-toastify';

const AddWorker = ({ onClose, setWorkersList }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone_number: '',
        department: 'Network'
    });

    const [loading, setLoading] = useState(false);

    const departments = [
        'Network',
        'Cleaning',
        'Carpentry',
        'PC Maintenance',
        'Plumbing',
        'Electricity'
    ];

    const handleChange = (field) => (event) => {
        setFormData((prev) => ({
            ...prev,
            [field]: event.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validation
        if (!formData.name.trim()) {
            toast.error("Please enter worker's name");
            return;
        }
        
        if (!formData.email.trim()) {
            toast.error("Please enter worker's email");
            return;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            toast.error("Please enter a valid email address");
            return;
        }
        
        if (!formData.phone_number.trim()) {
            toast.error("Please enter worker's phone number");
            return;
        }
        
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(formData.phone_number)) {
            toast.error("Please enter a valid 10-digit phone number");
            return;
        }
        
        if (!formData.department) {
            toast.error("Please select a department");
            return;
        }

        setLoading(true);

        try {
            const result = await createWorker(formData);
            if (result.success) {
                toast.success('Worker created successfully! Credentials sent to email.');
                const newWorker = result.data;
                setWorkersList((prevList) => [newWorker, ...prevList]);
                onClose();
            } else {
                toast.error(result.message || 'Try again. Something went wrong.');
            }
        } catch (error) {
            console.error('Submit error:', error);
            toast.error(error.response?.data?.message || 'An error occurred while submitting the form.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
            <div className="min-h-screen py-10 px-4 flex items-center justify-center">
                <form
                    onSubmit={handleSubmit}
                    className="w-full max-w-2xl bg-white shadow-xl rounded-xl p-8 space-y-6"
                >
                    <div className="flex justify-between items-center border-b pb-4">
                        <h2 className="text-2xl font-bold text-purple-700">Add New Worker</h2>
                        <button
                            type="button"
                            onClick={onClose}
                            className="text-gray-500 hover:text-red-500 font-semibold transition-colors"
                        >
                            ✕ Close
                        </button>
                    </div>

                    <div className="space-y-6">
                        {/* Full Name */}
                        <div>
                            <label className="block font-semibold text-gray-700 mb-2">
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={handleChange('name')}
                                required
                                placeholder="Enter worker's full name"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block font-semibold text-gray-700 mb-2">
                                Email Address <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={handleChange('email')}
                                required
                                placeholder="worker@college.edu"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Credentials will be sent to this email
                            </p>
                        </div>

                        {/* Phone Number */}
                        <div>
                            <label className="block font-semibold text-gray-700 mb-2">
                                Phone Number <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="tel"
                                value={formData.phone_number}
                                onChange={handleChange('phone_number')}
                                required
                                placeholder="9876543210"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>

                        {/* Department */}
                        <div>
                            <label className="block font-semibold text-gray-700 mb-2">
                                Department <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.department}
                                onChange={handleChange('department')}
                                required
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                            >
                                {departments.map((dept) => (
                                    <option key={dept} value={dept}>
                                        {dept}
                                    </option>
                                ))}
                            </select>
                            <p className="text-xs text-gray-500 mt-1">
                                Worker will only receive complaints from this department
                            </p>
                        </div>
                    </div>

                    {/* Info Box */}
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                        <p className="text-sm text-blue-700">
                            <strong>📧 Email Credentials:</strong> A temporary password will be generated and sent to the worker's email address. They will be prompted to change it on first login.
                        </p>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex justify-end gap-4 pt-6 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-6 py-2 rounded-lg font-medium text-white transition-all duration-200 ${
                                loading
                                    ? 'bg-purple-400 cursor-not-allowed'
                                    : 'bg-purple-600 hover:bg-purple-700'
                            }`}
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating Worker...
                                </span>
                            ) : (
                                'Create Worker'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddWorker;