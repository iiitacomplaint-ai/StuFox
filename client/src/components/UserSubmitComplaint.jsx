import React, { useState } from 'react';
import { X, AlertCircle, Upload, Image, Video, FileText, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { uploadToCloudinary } from '../utils/cloudinary';

const UserSubmitComplaint = ({ setShowModal, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium',
  });

  const [errors, setErrors] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadingStatus, setUploadingStatus] = useState([]);
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const categories = [
    'Network',
    'Cleaning',
    'Carpentry',
    'PC Maintenance',
    'Plumbing',
    'Electricity',
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    } else if (formData.description.length > 1000) {
      newErrors.description = 'Description must be less than 1000 characters';
    }
    
    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = async (e) => {
    const newFiles = Array.from(e.target.files);
    
    // Check file types
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'video/mp4', 'video/mov', 'video/avi', 'application/pdf'];
    const invalidFiles = newFiles.filter(file => !allowedTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      toast.error('Only images (JPG, PNG, GIF), videos (MP4, MOV, AVI), and PDF files are allowed');
      return;
    }
    
    // Check file sizes (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    const oversizedFiles = newFiles.filter(file => file.size > maxSize);
    
    if (oversizedFiles.length > 0) {
      toast.error('Files must be less than 10MB');
      return;
    }
    
    // Check total files limit (max 3)
    if (files.length + newFiles.length > 3) {
      toast.error('You can upload a maximum of 3 files');
      return;
    }
    
    setFiles((prev) => [...prev, ...newFiles]);
    setUploadingStatus((prev) => [...prev, ...newFiles.map(() => 'uploading')]);
    setIsUploading(true);
    
    for (let i = 0; i < newFiles.length; i++) {
      const file = newFiles[i];
      const index = files.length + i;
      
      try {
        const result = await uploadToCloudinary(file);
        
        if (result.success) {
          setUploadedFiles((prev) => [
            ...prev,
            { 
              url: result.url, 
              public_id: result.public_id, 
              type: result.resource_type,
              fileType: file.type,
              fileName: file.name
            },
          ]);
          setUploadingStatus((prev) => {
            const updated = [...prev];
            updated[index] = 'success';
            return updated;
          });
          toast.success(`${file.name} uploaded successfully`);
        } else {
          setUploadingStatus((prev) => {
            const updated = [...prev];
            updated[index] = 'failed';
            return updated;
          });
          toast.error(`Failed to upload ${file.name}`);
        }
      } catch (error) {
        console.error('Upload error:', error);
        setUploadingStatus((prev) => {
          const updated = [...prev];
          updated[index] = 'failed';
          return updated;
        });
        toast.error(`Error uploading ${file.name}`);
      }
    }
    
    setIsUploading(false);
  };
  
  const handleRemoveFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
    setUploadingStatus((prev) => prev.filter((_, i) => i !== index));
  };
  
  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) return <Image className="h-5 w-5" />;
    if (fileType.startsWith('video/')) return <Video className="h-5 w-5" />;
    if (fileType === 'application/pdf') return <FileText className="h-5 w-5" />;
    return <FileText className="h-5 w-5" />;
  };
  
  const getFilePreview = (file, index) => {
    if (file.type.startsWith('image/') && uploadingStatus[index] === 'success') {
      return (
        <img 
          src={URL.createObjectURL(file)} 
          alt={file.name}
          className="h-12 w-12 object-cover rounded"
        />
      );
    }
    return getFileIcon(file.type);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isUploading) {
      toast.error('Please wait for files to finish uploading');
      return;
    }
    
    if (!validateForm()) {
      return;
    }
    
    const complaintData = {
      ...formData,
      media_urls: uploadedFiles.map(f => f.url)
    };
    
    onSubmit.mutate(complaintData);
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-800">Submit New Complaint</h2>
          <button
            onClick={() => setShowModal(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors
                ${errors.title ? 'border-red-500' : 'border-gray-200'}`}
              placeholder="Brief title of your complaint"
            />
            {errors.title && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.title}
              </p>
            )}
          </div>

          {/* Category Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors
                ${errors.category ? 'border-red-500' : 'border-gray-200'}`}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.category}
              </p>
            )}
          </div>

          {/* Priority Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <div className="grid grid-cols-3 gap-2">
              <label className={`flex items-center justify-center gap-2 p-2 border rounded-lg cursor-pointer transition-colors
                ${formData.priority === 'low' ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                <input
                  type="radio"
                  name="priority"
                  value="low"
                  checked={formData.priority === 'low'}
                  onChange={handleChange}
                  className="hidden"
                />
                <span className="text-sm font-medium text-green-600">Low</span>
              </label>
              
              <label className={`flex items-center justify-center gap-2 p-2 border rounded-lg cursor-pointer transition-colors
                ${formData.priority === 'medium' ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                <input
                  type="radio"
                  name="priority"
                  value="medium"
                  checked={formData.priority === 'medium'}
                  onChange={handleChange}
                  className="hidden"
                />
                <span className="text-sm font-medium text-yellow-600">Medium</span>
              </label>
              
              <label className={`flex items-center justify-center gap-2 p-2 border rounded-lg cursor-pointer transition-colors
                ${formData.priority === 'high' ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                <input
                  type="radio"
                  name="priority"
                  value="high"
                  checked={formData.priority === 'high'}
                  onChange={handleChange}
                  className="hidden"
                />
                <span className="text-sm font-medium text-red-600">High</span>
              </label>
            </div>
          </div>

          {/* Description Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none transition-colors
                ${errors.description ? 'border-red-500' : 'border-gray-200'}`}
              placeholder="Detailed description of your complaint (minimum 20 characters)"
            />
            {errors.description && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.description}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-400">
              {formData.description.length}/1000 characters
            </p>
          </div>

          {/* Media Upload Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Media (Images, Videos, PDF) - Max 3 files
            </label>
            
            <label className="flex flex-col items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 transition-colors cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center">
                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-500 mt-1">JPG, PNG, GIF, MP4, MOV, AVI, PDF (Max 10MB)</p>
              </div>
              <input
                type="file"
                onChange={handleFileChange}
                multiple
                accept="image/jpeg,image/jpg,image/png,image/gif,video/mp4,video/mov,video/avi,application/pdf"
                className="hidden"
                disabled={isUploading}
              />
            </label>
            
            {/* File previews */}
            {files.length > 0 && (
              <div className="mt-3 space-y-2">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center space-x-3 flex-1">
                      <div className={`p-2 rounded-md ${
                        uploadingStatus[index] === 'success' ? 'bg-green-100 text-green-600' :
                        uploadingStatus[index] === 'failed' ? 'bg-red-100 text-red-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                        {uploadingStatus[index] === 'uploading' ? (
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                        ) : (
                          getFilePreview(file, index)
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-700 truncate">{file.name}</p>
                        <p className={`text-xs ${
                          uploadingStatus[index] === 'success' ? 'text-green-600' :
                          uploadingStatus[index] === 'failed' ? 'text-red-600' :
                          'text-blue-600'
                        }`}>
                          {uploadingStatus[index] === 'uploading' ? 'Uploading...' :
                           uploadingStatus[index] === 'success' ? 'Uploaded successfully' :
                           uploadingStatus[index] === 'failed' ? 'Upload failed' : 'Pending'}
                        </p>
                      </div>
                    </div>
                    {uploadingStatus[index] !== 'uploading' && (
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(index)}
                        className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-gray-100 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || isUploading || files.some((_, i) => uploadingStatus[i] === 'uploading')}
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {(isLoading || isUploading) ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {isUploading ? 'Uploading...' : 'Submitting...'}
                </span>
              ) : (
                'Submit Complaint'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserSubmitComplaint;