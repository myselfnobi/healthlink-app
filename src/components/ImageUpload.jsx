import React, { useRef, useState } from 'react';
import { Image as ImageIcon, Camera, X, UploadCloud } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ImageUpload = ({ label, image, onImageChange, className }) => {
    const fileInputRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            processFile(file);
        }
    };

    const processFile = (file) => {
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file');
            return;
        }

        // Limit size to ~4MB to stay within safe localStorage limits per image (roughly)
        if (file.size > 4 * 1024 * 1024) {
            alert('Image size should be less than 4MB');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            onImageChange(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) {
            processFile(file);
        }
    };

    const clearImage = (e) => {
        e.stopPropagation();
        onImageChange(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className={`w-full ${className}`}>
            {label && <label className="text-sm font-bold text-slate-500 ml-1 mb-2 block">{label}</label>}

            <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`
                    relative w-full h-48 rounded-2xl border-2 border-dashed transition-all cursor-pointer overflow-hidden group
                    ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-slate-400'}
                `}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept="image/*"
                    className="hidden"
                />

                <AnimatePresence mode="wait">
                    {image ? (
                        <motion.div
                            key="preview"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 w-full h-full"
                        >
                            <img
                                src={image}
                                alt="Uploaded preview"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <div className="bg-white/90 px-4 py-2 rounded-full font-bold text-sm text-slate-800 shadow-lg">
                                    Click to Change
                                </div>
                            </div>
                            <button
                                onClick={clearImage}
                                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 active:scale-90 transition-transform z-10"
                            >
                                <X size={16} />
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="placeholder"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 gap-3"
                        >
                            <div className={`
                                w-16 h-16 rounded-full flex items-center justify-center transition-colors
                                ${isDragging ? 'bg-blue-100 text-blue-500' : 'bg-slate-200 text-slate-400 group-hover:bg-white group-hover:shadow-md'}
                            `}>
                                <Camera size={32} />
                            </div>
                            <div className="text-center px-4">
                                <p className="font-bold text-sm text-slate-600 group-hover:text-slate-800">
                                    Upload Photo
                                </p>
                                <p className="text-xs mt-1">
                                    Click or drag image here
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ImageUpload;
