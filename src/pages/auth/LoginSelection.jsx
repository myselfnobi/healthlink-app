import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Hospital, Stethoscope, Store, Lock, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const LoginSelection = () => {
    const navigate = useNavigate();
    const [selectedRole, setSelectedRole] = useState('patient');

    const handleLogin = () => {
        if (selectedRole === 'patient') navigate('/login/patient');
        if (selectedRole === 'hospital') navigate('/login/hospital');
    };

    return (
        <div className="min-h-screen bg-[#F8F9FB] flex flex-col font-main relative overflow-hidden font-sans">

            {/* A. Header Section */}
            <div className="w-full h-[180px] bg-gradient-to-r from-[#0052D4] to-[#20BD9D] flex flex-col items-center justify-center relative z-0">
                <div className="flex items-center justify-center gap-1.5 mb-2">
                    {/* Custom 'Sparkle' Medical Cross */}
                    <svg width="36" height="36" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white drop-shadow-md">
                        <path d="M16 2C16 9.73199 9.73199 16 2 16C9.73199 16 16 22.268 16 30C16 22.268 22.268 16 30 16C22.268 16 16 9.73199 16 2Z" fill="currentColor" />
                    </svg>
                    <h1 className="text-[30px] text-white tracking-tight leading-none">
                        <span className="font-bold">health</span><span className="font-normal">Link</span>
                    </h1>
                </div>
                <p className="text-white/90 text-[14px] font-medium tracking-wide">
                    Your unified digital healthcare platform
                </p>
            </div>

            {/* B. Main Container */}
            <div className="w-full px-5 flex flex-col items-center -mt-2">

                {/* C. Section Label */}
                <h2 className="text-[12px] font-bold text-[#888888] uppercase tracking-[1px] mt-6 mb-4 text-center">
                    SELECT YOUR ROLE
                </h2>

                {/* D. Role Selection Cards (Row) */}
                <div className="flex gap-[15px] w-full">

                    {/* Card 1: Patient */}
                    <button
                        onClick={() => setSelectedRole('patient')}
                        className={`flex-1 rounded-[16px] py-5 px-3 flex flex-col items-center text-center relative transition-all duration-300 ${selectedRole === 'patient'
                            ? 'bg-white shadow-[0_4px_20px_rgba(0,0,0,0.12)] border border-[#2D8EFF] transform scale-[1.02]'
                            : 'bg-white shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-transparent hover:transform hover:scale-[1.02]'
                            }`}
                    >
                        {/* Icon */}
                        <div className="w-[50px] h-[50px] rounded-full bg-[#2D8EFF] flex items-center justify-center mb-3 shadow-md">
                            <User size={24} className="text-white" fill="currentColor" />
                        </div>

                        {/* Title */}
                        <h3 className="text-[18px] font-bold text-[#1A2B3C] mb-1">Patient</h3>

                        {/* Description */}
                        <p className="text-[13px] text-[#6B7280] font-normal leading-tight mb-4 px-1">
                            Access your records and appointments
                        </p>

                        {/* Badge */}
                        <span className="px-3 py-1 bg-[#E3F2FD] text-[#1565C0] text-[11px] font-bold rounded-full">
                            Email + Password
                        </span>
                    </button>

                    {/* Card 2: Hospital Admin */}
                    <button
                        onClick={() => setSelectedRole('hospital')}
                        className={`flex-1 rounded-[16px] py-5 px-3 flex flex-col items-center text-center relative transition-all duration-300 ${selectedRole === 'hospital'
                            ? 'bg-white shadow-[0_4px_20px_rgba(0,0,0,0.12)] border border-[#00C896] transform scale-[1.02]'
                            : 'bg-white shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-transparent hover:transform hover:scale-[1.02]'
                            }`}
                    >
                        {/* Icon */}
                        <div className="w-[50px] h-[50px] rounded-full bg-[#00C896] flex items-center justify-center mb-3 shadow-md">
                            <Hospital size={24} className="text-white" strokeWidth={2.5} />
                        </div>

                        {/* Title */}
                        <h3 className="text-[18px] font-bold text-[#1A2B3C] mb-1">Hospital Admin</h3>

                        {/* Description */}
                        <p className="text-[13px] text-[#6B7280] font-normal leading-tight mb-4 px-1">
                            Manage hospital operations and staff
                        </p>

                        {/* Badge */}
                        <span className="px-3 py-1 bg-[#E0F2F1] text-[#00695C] text-[11px] font-bold rounded-full">
                            Code + PIN
                        </span>
                    </button>

                </div>

                {/* E. Login Button */}
                <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={handleLogin}
                    className="w-full h-[54px] rounded-[27px] bg-gradient-to-r from-[#0061FF] to-[#00C896] text-white text-[18px] font-bold shadow-[0_4px_10px_rgba(32,189,157,0.3)] mt-[30px] mb-[30px] flex items-center justify-center border-none cursor-pointer"
                >
                    Login
                </motion.button>

                {/* F. Staff Section */}
                <div className="w-full flex items-center gap-3 mb-4">
                    <div className="h-[1px] bg-[#E5E7EB] flex-1" />
                    <span className="text-[12px] font-medium text-[#6B7280] uppercase tracking-wide">FOR HEALTHCARE STAFF</span>
                    <div className="h-[1px] bg-[#E5E7EB] flex-1" />
                </div>

                <div className="flex gap-[15px] w-full mb-8">
                    {/* Doctor Login Button */}
                    <button
                        onClick={() => navigate('/login/doctor')}
                        className="flex-1 p-[12px] rounded-[12px] bg-transparent border border-[#2D8EFF] text-[#0d4e5c] font-semibold text-[13px] flex items-center justify-center gap-2 active:bg-blue-50 transition-colors"
                    >
                        <Stethoscope size={18} className="text-[#2D8EFF]" />
                        Doctor Login
                    </button>

                    {/* Medical Store Button */}
                    <button
                        onClick={() => navigate('/login/medical-store')}
                        className="flex-1 p-[12px] rounded-[12px] bg-transparent border border-[#00C896] text-[#0d4e5c] font-semibold text-[13px] flex items-center justify-center gap-2 active:bg-teal-50 transition-colors"
                    >
                        <Store size={18} className="text-[#00C896]" />
                        Medical Store
                    </button>
                </div>

                {/* G. Footer */}
                <div className="mt-auto pb-8 flex items-center gap-2 text-[#6B7280] opacity-80">
                    <Lock size={12} />
                    <span className="text-[11px] font-normal">Secured with end-to-end encryption</span>
                </div>

            </div>
        </div>
    );
};

export default LoginSelection;
