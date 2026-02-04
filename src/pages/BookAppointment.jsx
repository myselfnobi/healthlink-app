import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
    ArrowLeft, Stethoscope, Home, Video,
    ExternalLink, Search, Clock, CheckCircle2,
    Calendar, AlertCircle, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { useAuth } from '../context/AuthContext';

const BookAppointment = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { bookAppointment, allHospitals } = useAuth();

    const queryParams = new URLSearchParams(location.search);
    const initialDoctorId = queryParams.get('doctor');
    const initialVisitType = queryParams.get('type');

    // Use dynamic hospitals list
    const hospital = allHospitals.find(h => h.id === id);

    const [selectedDoctor, setSelectedDoctor] = useState(initialDoctorId || hospital?.doctors?.[0]?.id || null);
    const [visitType, setVisitType] = useState(initialVisitType || 'hospital');
    const [selectedSymptoms, setSelectedSymptoms] = useState([]);
    const [selectedTime, setSelectedTime] = useState(null);
    const [customSymptom, setCustomSymptom] = useState('');
    const [doctorSearch, setDoctorSearch] = useState('');

    if (!hospital) return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
            <AlertCircle size={40} className="text-danger mb-4" />
            <h2 className="text-xl font-bold mb-2">Hospital Not Found</h2>
            <button onClick={() => navigate('/')} className="btn-primary px-6 py-2 rounded-xl">Back Home</button>
        </div>
    );

    const symptoms = ['Fever', 'Cough', 'Cold', 'Headache', 'Stomach Pain', 'Etc'];

    // Safety check for doctors array
    const doctorsList = hospital.doctors || [];

    const filteredDoctors = doctorsList.filter(d =>
        d.name.toLowerCase().includes(doctorSearch.toLowerCase()) ||
        d.specialty.toLowerCase().includes(doctorSearch.toLowerCase())
    );

    const activeDoctor = doctorsList.find(d => d.id === selectedDoctor);
    const baseTimeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '04:00 PM', '05:00 PM', '06:00 PM'];

    const getSlotStatus = (time) => {
        if (activeDoctor?.availability) {
            if (activeDoctor.availability.busy.includes(time)) return 'busy';
            if (activeDoctor.availability.available.includes(time)) return 'available';
            // Default logic if no explicit availability set
            if (activeDoctor.availability.available.length > 0) return 'busy';
            return 'available';
        }
        return 'available';
    };

    const toggleSymptom = (s) => {
        if (selectedSymptoms.includes(s)) {
            setSelectedSymptoms(selectedSymptoms.filter(item => item !== s));
        } else {
            setSelectedSymptoms([...selectedSymptoms, s]);
        }
    };

    const handleConfirm = () => {
        if (!selectedTime) return;

        let finalSymptoms = [...selectedSymptoms];
        if (finalSymptoms.includes('Etc') && customSymptom.trim()) {
            finalSymptoms = finalSymptoms.filter(s => s !== 'Etc');
            finalSymptoms.push(customSymptom);
        }

        const res = bookAppointment({
            hospitalId: hospital.id,
            hospitalName: hospital.name,
            doctorId: selectedDoctor,
            doctorName: activeDoctor?.name || 'Any Doctor',
            visitType,
            symptoms: finalSymptoms,
            date: 'Today',
            time: selectedTime
        });

        if (res.success) {
            navigate('/appointment-success', { state: { appointment: res.appointment } });
        }
    };

    return (
        <div className="container min-h-screen bg-[#fcfdfe] pb-32 animate-entrance">
            <header className="flex items-center gap-4 px-6 py-8 border-b border-border/40">
                <button
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 flex items-center justify-center rounded-2xl glass-dark active:scale-90 transition-transform border-none cursor-pointer"
                >
                    <ArrowLeft size={20} className="text-main" strokeWidth={2.5} />
                </button>
                <h1 className="text-xl font-extrabold tracking-tight text-main">Book Appointment</h1>
            </header>

            <div className="p-6">
                {/* Section Header */}
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-5 bg-p-500 rounded-full" />
                    <h3 className="text-sm font-black text-muted uppercase tracking-wider">Select Doctor</h3>
                </div>

                {/* Search Bar */}
                <div className="flex items-center gap-3 glass p-4 rounded-[20px] mb-6 shadow-sm border-none">
                    <Search size={18} className="text-muted" strokeWidth={2.5} />
                    <input
                        type="text"
                        placeholder="Search doctor or specialty..."
                        value={doctorSearch}
                        onChange={(e) => setDoctorSearch(e.target.value)}
                        className="bg-transparent border-none outline-none w-full text-sm font-bold text-main placeholder:text-muted/50"
                    />
                </div>

                {/* Doctor Grid/List */}
                <div className="flex flex-col gap-4 mb-8">
                    {filteredDoctors.length === 0 ? (
                        <p className="text-center text-muted font-bold py-4">No doctors found.</p>
                    ) : (
                        filteredDoctors.map(doc => {
                            const isSelected = selectedDoctor === doc.id;
                            return (
                                <button
                                    key={doc.id}
                                    onClick={() => { setSelectedDoctor(doc.id); setSelectedTime(null); }}
                                    className={`flex items-center gap-4 p-4 rounded-[24px] transition-all duration-300 border-none cursor-pointer text-left ${isSelected ? 'bg-p-50 shadow-md ring-2 ring-p-500/20' : 'bg-white shadow-sm hover:shadow-md'
                                        }`}
                                >
                                    <div className="relative">
                                        <img src={doc.image || 'https://via.placeholder.com/150'} alt={doc.name} className="w-14 h-14 rounded-2xl object-cover" />
                                        {isSelected && (
                                            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-p-500 border-2 border-white flex items-center justify-center">
                                                <CheckCircle2 size={12} color="white" strokeWidth={3} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className={`text-[15px] font-black tracking-tight leading-tight ${isSelected ? 'text-p-700' : 'text-main'}`}>
                                            {doc.name}
                                        </h4>
                                        <p className="text-[11px] font-bold text-muted uppercase tracking-wider">{doc.specialty}</p>
                                        <div className="flex items-center gap-1 mt-1">
                                            <span className="text-[10px] font-bold text-p-600">View Profile</span>
                                            <ChevronRight size={10} className="text-p-600" />
                                        </div>
                                    </div>
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'border-p-500 bg-p-500' : 'border-border'
                                        }`}>
                                        {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                                    </div>
                                </button>
                            );
                        })
                    )}
                </div>

                {/* Time Selection */}
                <div className="flex items-center gap-2 mb-5">
                    <div className="w-1 h-5 bg-p-500 rounded-full" />
                    <h3 className="text-sm font-black text-muted uppercase tracking-wider">Select Available Time</h3>
                </div>

                <div className="grid grid-cols-4 gap-2 mb-8">
                    {baseTimeSlots.map(time => {
                        const status = getSlotStatus(time);
                        const isBusy = status === 'busy';
                        const isSelected = selectedTime === time;
                        return (
                            <button
                                key={time}
                                disabled={isBusy}
                                onClick={() => setSelectedTime(time)}
                                className={`py-3 px-1 rounded-xl text-[10px] font-black tracking-tighter transition-all duration-300 border-none cursor-pointer flex flex-col items-center gap-0.5 ${isSelected
                                    ? 'bg-p-600 text-white shadow-lg shadow-p-600/20 active:scale-95'
                                    : (isBusy ? 'bg-slate-50 text-slate-300 cursor-not-allowed grayscale' : 'bg-white text-main shadow-sm hover:ring-1 hover:ring-p-500/30')
                                    }`}
                            >
                                <Clock size={12} strokeWidth={3} className={isSelected ? 'text-white' : (isBusy ? 'text-slate-200' : 'text-p-500')} />
                                <span>{time}</span>
                                {isBusy && <span className="opacity-50 text-[8px] mt-0.5">BUSY</span>}
                            </button>
                        );
                    })}
                </div>

                {/* Visit Type */}
                <div className="flex items-center gap-2 mb-5">
                    <div className="w-1 h-5 bg-p-500 rounded-full" />
                    <h3 className="text-sm font-black text-muted uppercase tracking-wider">Visit Type</h3>
                </div>
                <div className="flex gap-3 mb-8">
                    {[
                        { id: 'hospital', label: 'Hospital', icon: <Home size={20} /> },
                        { id: 'online', label: 'Online', icon: <Video size={20} /> },
                        { id: 'home', label: 'Home', icon: <Stethoscope size={20} /> }
                    ].map(type => {
                        const isSelected = visitType === type.id;
                        return (
                            <button
                                key={type.id}
                                onClick={() => setVisitType(type.id)}
                                className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-2xl glass transition-all border-none cursor-pointer ${isSelected ? 'bg-p-500/10 ring-2 ring-p-500 shadow-lg' : 'bg-white border-border/50'
                                    }`}
                            >
                                <div className={isSelected ? 'text-p-600' : 'text-muted'}>{type.icon}</div>
                                <span className={`text-[11px] font-black uppercase tracking-wider ${isSelected ? 'text-p-700' : 'text-muted'}`}>
                                    {type.label}
                                </span>
                            </button>
                        )
                    })}
                </div>

                {/* Symptoms Selector */}
                <div className="flex items-center gap-2 mb-5">
                    <div className="w-1 h-5 bg-p-500 rounded-full" />
                    <h3 className="text-sm font-black text-muted uppercase tracking-wider">Symptoms</h3>
                </div>
                <div className="flex flex-wrap gap-2 mb-6">
                    {symptoms.map(sym => {
                        const isSelected = selectedSymptoms.includes(sym);
                        return (
                            <button
                                key={sym}
                                onClick={() => toggleSymptom(sym)}
                                className={`px-4 py-2.5 rounded-full text-[12px] font-extrabold tracking-tight transition-all border-none cursor-pointer ${isSelected ? 'bg-p-600 text-white shadow-md' : 'glass-dark text-muted font-bold hover:bg-p-50'
                                    }`}
                            >
                                {sym}
                            </button>
                        )
                    })}
                </div>

                {selectedSymptoms.includes('Etc') && (
                    <div className="animate-entrance">
                        <textarea
                            placeholder="Please describe your symptoms in detail..."
                            value={customSymptom}
                            onChange={(e) => setCustomSymptom(e.target.value)}
                            className="w-full glass p-5 rounded-3xl text-sm font-bold text-main placeholder:text-muted/40 outline-none border-none shadow-sm min-h-[120px] mb-8"
                        />
                    </div>
                )}
            </div>

            {/* Floating Confirm Island */}
            <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 w-[calc(100%-48px)] max-w-[420px] p-2 rounded-[32px] glass shadow-2xl z-[1000] border-white transition-all duration-500 ${selectedTime ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
                <button
                    onClick={handleConfirm}
                    className="w-full btn-primary h-16 rounded-[24px] flex items-center justify-center gap-3 active:scale-95 transition-all text-lg font-black tracking-tight border-none cursor-pointer"
                >
                    <Calendar size={22} strokeWidth={2.5} /> Confirm Booking
                </button>
            </div>
        </div>
    );
};

export default BookAppointment;
