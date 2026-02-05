import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Calendar, Clock, MapPin, User, LogOut, Package, Video,
    AlertCircle, Send, Bot, User as UserIcon, Loader2, ShoppingBag,
    Search, Upload, Star, Navigation, Plus, FileText, Zap, DollarSign, ChevronRight,
    Bike, CheckCircle, Map, ArrowLeft, Phone, PhoneOff, MicOff, ShieldCheck,
    Stethoscope, Heart, Baby, Eye, FlaskConical, Grid, Ear
} from 'lucide-react';

import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import ConfirmModal from '../components/ConfirmModal';
import { getAIResponse } from '../utils/GeminiService';
import BottomNav from '../components/BottomNav';
import Header from '../components/Header';
import CategoryGrid from '../components/CategoryGrid';
import HospitalCard from '../components/HospitalCard';
import { hospitals, medicalStores } from '../utils/mockData';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import LocationPicker from '../components/LocationPicker';

// Carousel Component for Today's Reminders
const ReminderCarousel = ({ onNavigate }) => {
    const { appointments, bloodRequests, orders } = useAuth();
    const [currentIndex, setCurrentIndex] = useState(0);

    const activeAppt = appointments
        .filter(a => a.status === 'Accepted' || a.status === 'Confirmed')
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];

    const urgentBlood = bloodRequests[0];
    const activeOrder = orders.filter(o => o.status !== 'Delivered')[0];

    const slides = [
        activeAppt && {
            type: 'appointments',
            icon: <Clock size={24} className="text-white animate-pulse" />,
            color: 'bg-p-600',
            glow: 'shadow-p-600/20',
            tag: 'Upcoming Appointment',
            tagColor: 'text-p-600',
            bg: 'bg-white',
            borderColor: 'border-slate-100',
            title: `Dr. ${activeAppt.doctorName}`,
            desc: `${activeAppt.time} • ${activeAppt.hospitalName}`
        },
        urgentBlood && {
            type: 'blood',
            icon: <Plus size={24} className="text-white" />,
            color: 'bg-red-500',
            glow: 'shadow-red-500/20',
            tag: 'Blood Requested',
            tagColor: 'text-red-600',
            bg: 'bg-red-50',
            borderColor: 'border-red-100',
            title: `${urgentBlood.bloodType} Needed`,
            desc: urgentBlood.hospitalName,
            isUrgent: true
        },
        activeOrder && {
            type: 'store',
            icon: <Bike size={24} className="text-white" />,
            color: 'bg-emerald-500',
            glow: 'shadow-emerald-500/20',
            tag: 'Medicine Delivery',
            tagColor: 'text-emerald-600',
            bg: 'bg-emerald-50',
            borderColor: 'border-emerald-100',
            title: activeOrder.storeName,
            desc: `${activeOrder.status} • 12 mins away`
        }
    ].filter(Boolean);

    useEffect(() => {
        if (slides.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % slides.length);
        }, 4000);
        return () => clearInterval(timer);
    }, [slides.length]);

    if (slides.length === 0) return (
        <div className="p-8 text-center glass rounded-[32px] border-dashed border-slate-200">
            <p className="text-sm font-bold text-muted">No urgent reminders for today</p>
        </div>
    );

    return (
        <div className="relative">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 50, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -50, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    onClick={() => onNavigate(slides[currentIndex].type === 'blood' ? 'home' : slides[currentIndex].type)}
                    className={`relative overflow-hidden p-6 ${slides[currentIndex].bg} rounded-[36px] shadow-sm border ${slides[currentIndex].borderColor} cursor-pointer active:scale-[0.98] transition-all`}
                >
                    <div className="flex items-center gap-5">
                        <div className={`w-16 h-16 rounded-2xl ${slides[currentIndex].color} flex items-center justify-center shadow-lg ${slides[currentIndex].glow}`}>
                            {slides[currentIndex].icon}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <span className={`text-[11px] font-black uppercase tracking-widest ${slides[currentIndex].tagColor}`}>
                                    {slides[currentIndex].tag}
                                </span>
                                {slides[currentIndex].isUrgent && (
                                    <span className="px-2 py-0.5 bg-red-600 text-white rounded-full text-[8px] font-black animate-pulse">
                                        URGENT
                                    </span>
                                )}
                            </div>
                            <h4 className="text-[17px] font-black text-main mt-1 uppercase tracking-tight">{slides[currentIndex].title}</h4>
                            <p className="text-[12px] text-muted font-bold mt-0.5">{slides[currentIndex].desc}</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center">
                            <ChevronRight size={20} className="text-slate-400" />
                        </div>
                    </div>

                    {/* Dynamic Dots */}
                    {slides.length > 1 && (
                        <div className="absolute bottom-3 right-8 flex gap-1.5">
                            {slides.map((_, idx) => (
                                <div
                                    key={idx}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-4 bg-p-600' : 'w-1.5 bg-slate-200'}`}
                                />
                            ))}
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};
// TABS CONTENT
const HomeTab = ({ navigate, onNavigate, currentLocation, onLocationClick }) => {
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [sortBy, setSortBy] = useState('distance'); // 'distance', 'cost', 'rating'
    const [isLoading, setIsLoading] = useState(false);

    const handleCategorySelect = (catId) => {
        if (selectedCategory === catId) setSelectedCategory(null);
        else setSelectedCategory(catId);
    };

    // Filter logic
    const filteredHospitals = hospitals.filter(h => {
        const textToSearch = searchTerm.toLowerCase();

        // 1. Match Search Term (Name or Specialty)
        const nameMatch = h.name.toLowerCase().includes(textToSearch);
        const hospitalSpecialties = h.doctors ? h.doctors.map(d => d.specialty || '') : [];
        const specialtyMatch = hospitalSpecialties.some(s => s.toLowerCase().includes(textToSearch));

        // 2. Match Category
        let categoryMatch = true;
        if (selectedCategory) {
            const categoryMap = {
                'general': ['rmp doctor', 'general physician'],
                'heart': ['cardiologist'],
                'child': ['pediatrician'],
                'ent': ['ent specialist', 'ophthalmologist', 'eye specialist'],
                'lab': ['pathology', 'diagnostic', 'lab'],
                'more': ['dermatologist', 'orthopedic', 'dentist']
            };

            const targetSpecialties = categoryMap[selectedCategory] || [];
            categoryMatch = hospitalSpecialties.some(s =>
                targetSpecialties.some(t => s.toLowerCase().includes(t))
            ) || (selectedCategory === 'lab' && h.facilities?.some(f => f.toLowerCase().includes('lab')));
        }

        return (nameMatch || specialtyMatch) && categoryMatch;
    });

    const isBirthday = () => {
        if (!user?.birthDate) return false;
        const today = new Date();
        const birth = new Date(user.birthDate);
        return today.getMonth() === birth.getMonth() && today.getDate() === birth.getDate();
    };

    const categories = [
        { id: 'general', name: 'General', icon: <Stethoscope size={22} />, color: 'from-blue-400 to-blue-600' },
        { id: 'heart', name: 'Heart', icon: <Heart size={22} />, color: 'from-rose-400 to-rose-600' },
        { id: 'child', name: 'Child', icon: <Baby size={22} />, color: 'from-emerald-400 to-emerald-600' },
        { id: 'ent', name: 'ENT', icon: <Ear size={22} />, color: 'from-amber-400 to-amber-600' },
        { id: 'lab', name: 'Lab Tests', icon: <FlaskConical size={22} />, color: 'from-purple-400 to-purple-600' },
        { id: 'more', name: 'More', icon: <Grid size={22} />, color: 'from-slate-400 to-slate-600' }
    ];

    return (
        <div className="pb-24 animate-fade-in transition-all">
            <Header
                variant="home"
                searchValue={searchTerm}
                onSearchChange={setSearchTerm}
                currentLocation={currentLocation}
                onLocationClick={onLocationClick}
            />

            <div className="px-5">
                {/* Unified Reminders Section - Today's Priority */}
                <div className="mb-10">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.5px' }}>
                                Today's Reminders
                            </h3>
                            <div style={{ height: '3px', width: '24px', backgroundColor: 'var(--p-500)', borderRadius: '2px', marginTop: '3px' }} />
                        </div>
                    </div>

                    <div className="relative overflow-hidden px-1">
                        <ReminderCarousel onNavigate={onNavigate} />
                    </div>
                </div>

                {searchTerm.length === 0 && (
                    <div className="mb-10">
                        <div className="flex justify-between items-end mb-6">
                            <div>
                                <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.5px' }}>
                                    Find Specialist
                                </h3>
                                <div style={{ height: '3px', width: '24px', backgroundColor: 'var(--p-500)', borderRadius: '2px', marginTop: '3px' }} />
                            </div>
                            <button style={{ color: 'var(--p-600)', fontSize: '13px', fontWeight: '700', padding: '0 4px' }}>See All</button>
                        </div>

                        {/* macOS Style Dock */}
                        <div className="flex overflow-x-auto no-scrollbar py-2 px-4 -mx-4">
                            <motion.div
                                className="flex items-end gap-1.5 p-2 px-3 glass rounded-[24px] shadow-xl border border-white/40 mx-auto min-w-max"
                                layout
                            >
                                {categories.map((cat) => {
                                    const isActive = selectedCategory === cat.id;
                                    return (
                                        <div key={cat.id} className="flex flex-col items-center gap-1.5 relative group shrink-0">
                                            <motion.button
                                                onClick={() => handleCategorySelect(cat.id)}
                                                whileHover={{ scale: 1.1, y: -4 }}
                                                whileTap={{ scale: 0.95 }}
                                                className={`w-14 h-14 rounded-[20px] flex items-center justify-center relative overflow-hidden transition-all border-none cursor-pointer ${isActive ? 'shadow-lg ring-2 ring-p-500' : 'shadow-sm'
                                                    }`}
                                                style={{
                                                    background: isActive
                                                        ? 'linear-gradient(135deg, var(--p-500), var(--p-700))'
                                                        : 'white',
                                                }}
                                            >
                                                <div className={isActive ? 'text-white' : 'text-slate-600'} style={{ transform: 'scale(1.2)' }}>
                                                    {cat.icon}
                                                </div>
                                                <div className="absolute inset-x-0 top-0 h-[40%] bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
                                            </motion.button>

                                            <span style={{
                                                fontSize: '10px',
                                                fontWeight: '700',
                                                color: isActive ? 'var(--p-600)' : 'var(--text-secondary)',
                                                letterSpacing: '-0.2px'
                                            }}>
                                                {cat.name}
                                            </span>

                                            {isActive && (
                                                <motion.div
                                                    layoutId="activeDot"
                                                    className="w-1 h-1 rounded-full bg-p-600 mt-0.5"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                />
                                            )}
                                        </div>
                                    );
                                })}
                            </motion.div>
                        </div>
                    </div>
                )}

                {/* Floating Glass Filter Bar */}
                <AnimatePresence>
                    {selectedCategory && (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="sticky top-6 z-50 mb-10 flex gap-2 p-1.5 glass rounded-full shadow-lg"
                        >
                            {['distance', 'cost', 'rating'].map((option) => (
                                <button
                                    key={option}
                                    onClick={() => setSortBy(option)}
                                    className={`flex-1 py-3 px-3 rounded-full text-[12px] font-bold capitalize transition-all border-none ${sortBy === option
                                        ? 'bg-p-600 text-white shadow-md'
                                        : 'text-muted'
                                        }`}
                                >
                                    {option}
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="mt-4">
                    <div className="flex justify-between items-center mb-6">
                        <h3 style={{ fontSize: '18px', fontWeight: '800' }}>
                            {searchTerm ? 'Search Results' : (selectedCategory ? 'Best Specialists' : 'Hospitals Nearby')}
                        </h3>
                        <span style={{
                            fontSize: '11px',
                            fontWeight: '700',
                            background: 'var(--p-100)',
                            color: 'var(--p-700)',
                            padding: '4px 10px',
                            borderRadius: '10px'
                        }}>
                            {filteredHospitals.length} FOUND
                        </span>
                    </div>

                    <div className="flex flex-col gap-4">
                        {isLoading ? (
                            Array(3).fill(0).map((_, i) => (
                                <div key={i} className="card-premium h-48 skeleton" />
                            ))
                        ) : filteredHospitals.length > 0 ? (
                            filteredHospitals
                                .sort((a, b) => {
                                    if (sortBy === 'distance') return parseFloat(a.distance) - parseFloat(b.distance);
                                    if (sortBy === 'rating') return b.rating - a.rating;
                                    return 0;
                                })
                                .map(hospital => (
                                    <HospitalCard
                                        key={hospital.id}
                                        hospital={hospital}
                                        onClick={() => navigate(`/hospital/${hospital.id}`)}
                                    />
                                ))
                        ) : (
                            <div className="text-center py-16 px-6 card-premium glass border-dashed">
                                <div className="bg-p-100 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                                    <Search size={32} className="text-p-600" strokeWidth={2.5} />
                                </div>
                                <h4 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '4px' }}>Found No Hospitals</h4>
                                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '24px' }}>Try a different category or refining search.</p>
                                <button
                                    onClick={() => { setSelectedCategory(null); setSearchTerm(''); }}
                                    className="px-8 py-3.5 btn-primary rounded-2xl text-sm border-none cursor-pointer"
                                >
                                    Reset Discovery
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const AppointmentCountdown = ({ targetTime }) => {
    const calculateSeconds = (t) => {
        if (!t) return 0;
        const now = new Date();
        const [time, modifier] = t.split(' ');
        let [hours, minutes] = time.split(':');

        if (hours === '12') {
            hours = modifier === 'AM' ? '00' : '12';
        } else if (modifier === 'PM') {
            hours = parseInt(hours, 10) + 12;
        }

        const target = new Date();
        target.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);

        const diff = Math.floor((target.getTime() - now.getTime()) / 1000);
        return diff > 0 ? diff : 0;
    };

    const [timeLeft, setTimeLeft] = useState(calculateSeconds(targetTime));

    useEffect(() => {
        // Initial sync
        setTimeLeft(calculateSeconds(targetTime));

        const interval = setInterval(() => {
            setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, [targetTime]);

    const formatDuration = (s) => {
        if (s <= 0) return "Starting Now";
        const h = Math.floor(s / 3600);
        const m = Math.floor((s % 3600) / 60);
        const sec = s % 60;

        if (h > 0) return `${h}h ${m}m ${sec}s`;
        return `${m}:${sec.toString().padStart(2, '0')}`;
    };

    return (
        <div style={{ marginTop: '12px', padding: '12px', backgroundColor: '#fff7ed', borderRadius: '12px', border: '1px solid #ffedd5', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Clock size={16} color="#f97316" className={timeLeft > 0 ? "animate-pulse" : ""} />
            <div>
                <p style={{ fontSize: '11px', fontWeight: 'bold', color: '#9a3412', textTransform: 'uppercase' }}>
                    {timeLeft > 0 ? 'Starts in' : 'Session Status'}
                </p>
                <p style={{ fontSize: timeLeft > 3600 ? '16px' : '18px', fontWeight: '900', color: '#f97316', fontFamily: 'monospace' }}>
                    {formatDuration(timeLeft)}
                </p>
            </div>
        </div>
    );
};

const AppointmentsTab = () => {
    const { appointments } = useAuth();
    const navigate = useNavigate();

    return (
        <div style={{ padding: '20px', paddingTop: '40px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>My Appointments</h1>

            {appointments && appointments.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {appointments.map(appt => (
                        <div key={appt.id} style={{ backgroundColor: 'white', padding: '16px', borderRadius: '16px', boxShadow: 'var(--shadow-sm)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                <span style={{ backgroundColor: '#e0f2fe', color: '#0369a1', padding: '4px 8px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold' }}>
                                    {appt.status}
                                </span>
                                <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#666' }}>{appt.id}</span>
                            </div>
                            {appt.status === 'Accepted' && (
                                <div style={{ marginTop: '12px' }}>
                                    {appt.visitType === 'online' && appt.meetingLink ? (
                                        <Button size="sm" onClick={() => navigate(appt.meetingLink)} style={{ display: 'flex', alignItems: 'center', gap: '6px', width: '100%', justifyContent: 'center' }}>
                                            <Video size={16} /> Join Video Call
                                        </Button>
                                    ) : (
                                        <div style={{ fontSize: '12px', color: '#15803d', backgroundColor: '#dcfce7', padding: '8px', borderRadius: '8px', textAlign: 'center' }}>
                                            Expected Wait: 15 mins
                                        </div>
                                    )}
                                </div>
                            )}
                            {appt.status === 'Accepted' && (
                                <AppointmentCountdown targetTime={appt.time} />
                            )}
                            <div style={{ marginTop: '12px' }}>
                                <h3
                                    style={{ fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', color: 'var(--primary-color)' }}
                                    onClick={() => navigate(`/doctor/${appt.doctorId}`)}
                                >
                                    {appt.doctorName}
                                </h3>
                                <p style={{ color: '#666', fontSize: '14px', marginBottom: '8px' }}>{appt.hospitalName}</p>
                            </div>


                            <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '12px', display: 'flex', gap: '16px', fontSize: '12px' }}>
                                <span>📅 Today</span>
                                <span>🏥 {(appt.visitType || 'Visit').toUpperCase()}</span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div style={{ textAlign: 'center', marginTop: '40px', color: '#666' }}>
                    <p>No upcoming appointments.</p>
                    <p style={{ fontSize: '12px' }}>Book one from the Home screen!</p>
                </div>
            )}
        </div>
    );
};

const CheckoutView = ({ store, onConfirm, onCancel }) => {
    const itemTotal = 450;
    const deliveryFee = store.deliveryFee || 25;
    const taxes = 18.50;
    const grandTotal = itemTotal + deliveryFee + taxes;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ padding: '20px', paddingBottom: '100px', backgroundColor: '#fff', minHeight: '100vh' }}
        >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px', paddingTop: '20px' }}>
                <button onClick={onCancel} style={{ background: 'none', border: 'none', padding: '8px', cursor: 'pointer' }}>
                    <ArrowLeft size={24} />
                </button>
                <h1 style={{ fontSize: '20px', fontWeight: 'bold', marginLeft: '8px' }}>Review Order</h1>
            </div>

            <div style={{ backgroundColor: '#f9fafb', borderRadius: '24px', padding: '20px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                    <img src={store.image} alt={store.name} style={{ width: '60px', height: '60px', borderRadius: '12px', objectFit: 'cover' }} />
                    <div>
                        <h3 style={{ fontWeight: 'bold', fontSize: '18px' }}>{store.name}</h3>
                        <p style={{ fontSize: '12px', color: '#666' }}>{store.address}</p>
                    </div>
                </div>

                <div style={{ borderTop: '1px dashed #ddd', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                        <span style={{ color: '#666' }}>Medicine Item Total</span>
                        <span>₹{itemTotal.toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                        <span style={{ color: '#666' }}>Delivery Fee</span>
                        <span>₹{deliveryFee.toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                        <span style={{ color: '#666' }}>Taxes & GST</span>
                        <span>₹{taxes.toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 'bold', borderTop: '1px solid #eee', paddingTop: '12px', marginTop: '4px' }}>
                        <span>Grand Total</span>
                        <span style={{ color: 'var(--primary-color)' }}>₹{grandTotal.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            <div style={{ backgroundColor: '#fff7ed', padding: '16px', borderRadius: '16px', border: '1px solid #ffedd5', marginBottom: '32px', display: 'flex', gap: '12px' }}>
                <div style={{ color: '#f97316' }}><Zap size={20} fill="#f97316" /></div>
                <p style={{ fontSize: '12px', color: '#9a3412', fontWeight: '500' }}>Orders over ₹500 get FREE delivery! Add more items to save.</p>
            </div>

            <Button size="block" onClick={() => onConfirm(store.name)}>Place Order & Pay</Button>
            <p style={{ textAlign: 'center', fontSize: '11px', color: '#9ca3af', marginTop: '16px' }}>
                By placing the order, you agree to our Terms of Service.
            </p>
        </motion.div>
    );
};

const DeliveryTrackingView = ({ order, onComplete }) => {
    const { orders } = useAuth();
    const [isCalling, setIsCalling] = useState(false);
    const [callTime, setCallTime] = useState(0);

    // Get live status from global state
    const liveOrder = orders.find(o => o.id === order.id) || order;

    const statuses = ['Confirmed', 'Preparing', 'Out for delivery', 'Delivered'];

    // Map string status to index
    const statusIndex = Math.max(0, statuses.indexOf(liveOrder.status));

    const displayStatuses = [
        'Order Confirmed',
        'Preparing your medicines',
        'Out for delivery',
        'Items Delivered'
    ];


    // Simulated Call Timer
    React.useEffect(() => {
        let interval;
        if (isCalling) {
            interval = setInterval(() => {
                setCallTime(prev => prev + 1);
            }, 1000);
        } else {
            setCallTime(0);
        }
        return () => clearInterval(interval);
    }, [isCalling]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleCall = () => {
        setIsCalling(true);
    };

    const endCall = () => {
        setIsCalling(false);
    };

    // Simulated Map Logic
    const progress = (statusIndex / (statuses.length - 1)) * 100;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', paddingBottom: '100px', position: 'relative' }}
        >
            {/* Calling Overlay */}
            <AnimatePresence>
                {isCalling && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            backgroundColor: '#1e293b',
                            zIndex: 1000,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white'
                        }}
                    >
                        <div style={{ width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden', border: '4px solid rgba(255,255,255,0.2)', marginBottom: '24px', boxShadow: '0 0 40px rgba(16, 185, 129, 0.2)' }}>
                            <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200" alt="Partner" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <h2 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>Ramesh Kumar</h2>
                        <p style={{ color: '#94a3b8', fontSize: '18px', marginBottom: '40px' }}>{callTime > 0 ? formatTime(callTime) : 'Calling...'}</p>

                        <div style={{ display: 'flex', gap: '40px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                <button style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <MicOff size={28} />
                                </button>
                                <span style={{ fontSize: '12px', color: '#94a3b8' }}>Mute</span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                <button
                                    onClick={endCall}
                                    style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#ef4444', border: 'none', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 16px rgba(239, 68, 68, 0.4)', cursor: 'pointer' }}
                                >
                                    <PhoneOff size={28} />
                                </button>
                                <span style={{ fontSize: '12px', color: '#94a3b8' }}>End</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Live Map Box */}
            <div style={{
                height: '350px',
                backgroundColor: '#e2e8f0',
                position: 'relative',
                overflow: 'hidden',
                background: 'linear-gradient(rgba(100, 116, 139, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(100, 116, 139, 0.05) 1px, transparent 1px)',
                backgroundSize: '30px 30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                {/* Simulated Path */}
                <svg style={{ position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none' }}>
                    <path d="M 50 175 Q 240 100 430 175" fill="none" stroke="#cbd5e1" strokeWidth="4" strokeDasharray="8 8" />
                </svg>

                {/* Store Point */}
                <div style={{ position: 'absolute', left: '40px', top: '175px', transform: 'translateY(-50%)', textAlign: 'center' }}>
                    <div style={{ backgroundColor: 'white', padding: '4px 8px', borderRadius: '8px', fontSize: '10px', fontWeight: 'bold', marginBottom: '8px', boxShadow: 'var(--shadow-sm)', whiteSpace: 'nowrap' }}>
                        {order.storeName}
                    </div>
                    <div style={{ width: '16px', height: '16px', backgroundColor: '#3b82f6', border: '3px solid white', borderRadius: '50%', boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)' }} />
                </div>

                {/* Home Point */}
                <div style={{ position: 'absolute', right: '40px', top: '175px', transform: 'translateY(-50%)', textAlign: 'center' }}>
                    <div style={{ backgroundColor: 'white', padding: '4px 8px', borderRadius: '8px', fontSize: '10px', fontWeight: 'bold', marginBottom: '8px', boxShadow: 'var(--shadow-sm)', whiteSpace: 'nowrap' }}>
                        Your Location
                    </div>
                    <div style={{ width: '16px', height: '16px', backgroundColor: '#ef4444', border: '3px solid white', borderRadius: '50%', boxShadow: '0 0 10px rgba(239, 68, 68, 0.5)' }} />
                </div>

                {/* Delivery Driver Icon */}
                <motion.div
                    animate={{
                        left: `${40 + (progress * 3.5)}px`,
                        top: `${175 - Math.sin((progress / 100) * Math.PI) * 50}px`
                    }}
                    transition={{ duration: 1, ease: "linear" }}
                    style={{
                        position: 'absolute',
                        transform: 'translate(-50%, -100%)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}
                >
                    <div style={{
                        backgroundColor: '#10b981',
                        color: 'white',
                        padding: '8px',
                        borderRadius: '50%',
                        marginBottom: '4px',
                        boxShadow: '0 4px 15px rgba(16, 185, 129, 0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Bike size={24} />
                    </div>
                    <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#059669', backgroundColor: 'rgba(255,255,255,0.9)', padding: '2px 6px', borderRadius: '6px' }}>
                        {statusIndex >= 2 ? 'Driving' : 'Waiting'}
                    </div>
                </motion.div>

                {/* Top Controls Overlay */}
                <button
                    onClick={onComplete}
                    style={{ position: 'absolute', top: '24px', left: '20px', backgroundColor: 'white', border: 'none', padding: '12px', borderRadius: '50%', boxShadow: 'var(--shadow-md)', cursor: 'pointer' }}
                >
                    <ArrowLeft size={20} />
                </button>
            </div>

            {/* Tracking Card */}
            <div style={{ marginTop: '-40px', position: 'relative', zIndex: 10, padding: '0 20px' }}>
                <div style={{ backgroundColor: 'white', borderRadius: '32px', padding: '24px', boxShadow: '0 -10px 40px rgba(0,0,0,0.06)' }}>
                    <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                        <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1f2937' }}>{displayStatuses[statusIndex]}</h2>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '4px' }}>
                            <div style={{ width: '8px', height: '8px', backgroundColor: '#10b981', borderRadius: '50%', animation: 'pulse 1.5s infinite' }} />
                            <p style={{ color: '#059669', fontSize: '14px', fontWeight: '600' }}>
                                {statusIndex === 3 ? 'Delivered successfully' : `Estimated delivery in ${20 - statusIndex * 5} mins`}
                            </p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
                        {displayStatuses.map((_, i) => (
                            <div key={i} style={{
                                flex: 1,
                                height: '6px',
                                borderRadius: '3px',
                                backgroundColor: i <= statusIndex ? '#10b981' : '#f1f5f9'
                            }} />
                        ))}
                    </div>


                    <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '24px', display: 'flex', gap: '16px', alignItems: 'center', border: '1px solid #f1f5f9' }}>
                        <div style={{ width: '56px', height: '56px', borderRadius: '50%', overflow: 'hidden', border: '2px solid white', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                            <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100" alt="Partner" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#1e293b' }}>Ramesh Kumar</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Star size={12} fill="#f59e0b" color="#f59e0b" />
                                <p style={{ fontSize: '12px', color: '#64748b' }}>4.9 • 2.5k deliveries</p>
                            </div>
                        </div>
                        <button
                            onClick={handleCall}
                            style={{ backgroundColor: '#10b981', color: 'white', border: 'none', width: '44px', height: '44px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(16, 185, 129, 0.3)', cursor: 'pointer' }}
                        >
                            <Phone size={20} fill="white" />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const AIDoctorTab = () => {
    const [messages, setMessages] = useState([
        { role: 'model', text: 'Hello! I am HealthLink AI. How can I help you today?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = React.useRef(null);

    React.useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg = { role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            const aiResponse = await getAIResponse([...messages, userMsg]);
            setMessages(prev => [...prev, { role: 'model', text: aiResponse }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'model', text: "I'm sorry, I encountered an error. Please try again." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 80px)', backgroundColor: '#f8f9fa' }}>
            <div style={{ padding: '20px', backgroundColor: '#fff', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ padding: '8px', backgroundColor: '#e0f2fe', borderRadius: '12px' }}>
                    <Bot size={24} color="#3b82f6" />
                </div>
                <div>
                    <h1 style={{ fontSize: '18px', fontWeight: 'bold' }}>AI Doctor</h1>
                    <span style={{ fontSize: '12px', color: '#10b981' }}>● Online</span>
                </div>
            </div>

            <div
                ref={scrollRef}
                style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
                <AnimatePresence>
                    {messages.map((msg, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{
                                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                maxWidth: '85%',
                                backgroundColor: msg.role === 'user' ? '#3b82f6' : '#fff',
                                color: msg.role === 'user' ? '#fff' : '#1f2937',
                                padding: '12px 16px',
                                borderRadius: msg.role === 'user' ? '16px 16px 0 16px' : '16px 16px 16px 0',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                fontSize: '14px',
                                lineHeight: '1.5'
                            }}
                        >
                            {msg.text}
                        </motion.div>
                    ))}
                    {isLoading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            style={{ alignSelf: 'flex-start', backgroundColor: '#fff', padding: '12px 16px', borderRadius: '16px 16px 16px 0', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}
                        >
                            <Loader2 size={16} className="animate-spin" color="#3b82f6" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div style={{ padding: '20px', backgroundColor: '#fff', borderTop: '1px solid #eee', paddingBottom: '100px' }}>
                <div style={{ display: 'flex', gap: '8px', backgroundColor: '#f3f4f6', padding: '8px 12px', borderRadius: '12px' }}>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Type your symptoms here..."
                        style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: '14px' }}
                    />
                    <button
                        onClick={handleSend}
                        style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}
                    >
                        <Send size={18} />
                    </button>
                </div>
                <p style={{ fontSize: '10px', color: '#9ca3af', textAlign: 'center', marginTop: '8px' }}>
                    HealthLink AI can make mistakes. Check important info.
                </p>
            </div>
        </div>
    );
};

const StoreTab = () => {
    const { appointments, placeOrder } = useAuth();
    const [showSuccess, setShowSuccess] = useState(false);
    const [storeSearch, setStoreSearch] = useState('');
    const [uploading, setUploading] = useState(false);
    const [selectionMode, setSelectionMode] = useState(null); // 'manual' | 'auto'
    const [checkoutStore, setCheckoutStore] = useState(null);
    const [activeOrder, setActiveOrder] = useState(null);

    const prescriptions = appointments.filter(a => a.status === 'Prescribed' && a.prescription);

    const filteredStores = medicalStores.filter(s =>
        s.name.toLowerCase().includes(storeSearch.toLowerCase()) ||
        s.address.toLowerCase().includes(storeSearch.toLowerCase())
    );

    const initiateCheckout = (store) => {
        setCheckoutStore(store);
    };

    const handleOrder = (storeName = 'the selected store') => {
        setCheckoutStore(null);
        setShowSuccess(true);

        // Save order to global state for Merchant Dashboard
        const newOrder = placeOrder({
            storeName,
            storeId: checkoutStore?.id || 'ms1',
            total: 493.50, // Simulated total from checkout
            items: ['Amoxicillin', 'Paracetamol'] // Simulated items
        });

        setTimeout(() => {
            setShowSuccess(false);
            setSelectionMode(null);
            setActiveOrder(newOrder); // Use the global order object
        }, 2000);
    };


    const handleAutoSelect = () => {
        setUploading(true);
        setSelectionMode('auto');
        setTimeout(() => {
            // Find store with highest priceScore (best for customer)
            const cheapestStore = [...medicalStores].sort((a, b) => b.priceScore - a.priceScore)[0];
            setUploading(false);
            initiateCheckout(cheapestStore);
        }, 2000);
    };

    const handleUploadPrescription = () => {
        setUploading(true);
        setTimeout(() => {
            setUploading(false);
            setSelectionMode('manual');
        }, 1500);
    };

    if (activeOrder) {
        return <DeliveryTrackingView order={activeOrder} onComplete={() => setActiveOrder(null)} />;
    }

    if (checkoutStore) {
        return <CheckoutView store={checkoutStore} onConfirm={handleOrder} onCancel={() => setCheckoutStore(null)} />;
    }

    return (
        <div style={{ paddingBottom: '100px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            {/* Header / Search */}
            <div style={{ backgroundColor: '#fff', padding: '40px 20px 20px', borderBottom: '1px solid #eee' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>Pharmacy & Store</h1>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    backgroundColor: '#f3f4f6',
                    padding: '12px 16px',
                    borderRadius: '12px'
                }}>
                    <Search size={20} color="#9ca3af" />
                    <input
                        type="text"
                        placeholder="Search for medicines or stores..."
                        value={storeSearch}
                        onChange={(e) => setStoreSearch(e.target.value)}
                        style={{ background: 'none', border: 'none', outline: 'none', width: '100%', fontSize: '14px' }}
                    />
                </div>
            </div>

            <div style={{ padding: '20px' }}>
                {/* Selection Logic Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
                    <div
                        onClick={handleAutoSelect}
                        style={{
                            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                            borderRadius: '20px',
                            padding: '16px',
                            color: '#fff',
                            boxShadow: '0 4px 12px rgba(79, 70, 229, 0.2)',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px'
                        }}
                    >
                        <Zap size={24} fill="white" />
                        <div>
                            <p style={{ fontWeight: 'bold', fontSize: '14px' }}>Smart Select</p>
                            <p style={{ fontSize: '10px', opacity: 0.8 }}>Choose best price automatically</p>
                        </div>
                    </div>

                    <div
                        onClick={handleUploadPrescription}
                        style={{
                            background: '#fff',
                            borderRadius: '20px',
                            padding: '16px',
                            border: '1px solid #eee',
                            boxShadow: 'var(--shadow-sm)',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px'
                        }}
                    >
                        <Plus size={24} color="#3b82f6" />
                        <div>
                            <p style={{ fontWeight: 'bold', fontSize: '14px', color: '#1f2937' }}>Compare Stores</p>
                            <p style={{ fontSize: '10px', color: '#9ca3af' }}>Select store manually</p>
                        </div>
                    </div>
                </div>

                {uploading && (
                    <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#e0f2fe', borderRadius: '16px', marginBottom: '24px' }}>
                        <Loader2 className="animate-spin" style={{ margin: '0 auto', marginBottom: '8px' }} color="#3b82f6" />
                        <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#0369a1' }}>Searching for best prices...</p>
                    </div>
                )}

                {/* Nearby Stores Section */}
                <div style={{ marginBottom: '32px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>{selectionMode === 'manual' ? 'Choose a store' : 'Nearby Medical Stores'}</h3>
                        <span style={{ color: '#3b82f6', fontSize: '14px', fontWeight: '600' }}>{selectionMode === 'manual' ? 'Select One' : 'See All'}</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {filteredStores.map(store => (
                            <div key={store.id} style={{
                                backgroundColor: '#fff',
                                borderRadius: '20px',
                                overflow: 'hidden',
                                boxShadow: 'var(--shadow-sm)',
                                border: selectionMode === 'manual' ? '2px solid #3b82f6' : '1px solid #eee',
                                display: 'flex',
                                position: 'relative',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                                onClick={() => selectionMode === 'manual' && initiateCheckout(store)}
                            >
                                <img src={store.image} alt={store.name} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                                <div style={{ padding: '12px', flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <h4 style={{ fontWeight: 'bold', fontSize: '16px' }}>{store.name}</h4>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: '#fef3c7', padding: '2px 6px', borderRadius: '6px' }}>
                                            <Star size={12} fill="#f59e0b" color="#f59e0b" />
                                            <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#92400e' }}>{store.rating}</span>
                                        </div>
                                    </div>
                                    <p style={{ color: '#666', fontSize: '12px', marginBottom: '8px' }}>{store.address}</p>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#10b981' }}>{store.deliveryTime}</span>
                                            <span style={{ fontSize: '11px', color: '#9ca3af' }}>• {store.distance}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: '#dcfce7', padding: '4px 8px', borderRadius: '8px' }}>
                                            <DollarSign size={12} color="#15803d" />
                                            <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#15803d' }}>Price Match {store.priceScore}%</span>
                                        </div>
                                    </div>
                                </div>
                                {!store.isOpen && (
                                    <div style={{
                                        position: 'absolute',
                                        inset: 0,
                                        backgroundColor: 'rgba(255,255,255,0.7)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        zIndex: 5
                                    }}>
                                        <span style={{ backgroundColor: '#ef4444', color: '#fff', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>Closed</span>
                                    </div>
                                )}
                                {selectionMode === 'manual' && (
                                    <div style={{ padding: '0 12px', display: 'flex', alignItems: 'center' }}>
                                        <ChevronRight size={24} color="#3b82f6" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* My Active Prescriptions */}
                <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px' }}>Digital Prescriptions</h3>
                    {prescriptions.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {prescriptions.map(appt => (
                                <div key={appt.prescription.id} style={{ backgroundColor: 'white', padding: '16px', borderRadius: '16px', border: '1px solid #eee' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                        <span style={{ fontWeight: 'bold', fontSize: '14px' }}>{appt.prescription.medicine}</span>
                                        <span style={{ fontSize: '12px', color: '#10b981' }}>Order Now</span>
                                    </div>
                                    <p style={{ fontSize: '12px', color: '#666' }}>By Dr. {appt.doctorName}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '16px', textAlign: 'center', border: '1px dashed #ccc' }}>
                            <p style={{ fontSize: '13px', color: '#9ca3af' }}>No digital prescriptions found.</p>
                        </div>
                    )}
                </div>
            </div>

            <AnimatePresence>
                {showSuccess && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        style={{
                            position: 'fixed',
                            top: '20px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            backgroundColor: '#10b981',
                            color: 'white',
                            padding: '12px 24px',
                            borderRadius: '12px',
                            zIndex: 1000,
                            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                            fontWeight: 'bold'
                        }}
                    >
                        🚀 Order Placed Successfully!
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const ProfileTab = ({ user, logout }) => (
    <div className="pb-32 animate-entrance">
        {/* Profile Header */}
        <div className="relative mb-8">
            <div className="h-40 bg-gradient-to-r from-p-600 to-p-500 rounded-b-[40px] shadow-lg shadow-p-600/20" />
            <div className="px-6 -mt-12 flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-white p-1 shadow-xl mb-4">
                    <div className="w-full h-full rounded-full bg-slate-100 flex items-center justify-center overflow-hidden">
                        <UserIcon size={40} className="text-slate-400" />
                    </div>
                </div>
                <h2 className="text-2xl font-black text-main">{user?.name}</h2>
                <p className="text-sm font-bold text-muted opacity-80">{user?.phone || '+91 98765 43210'}</p>
            </div>
        </div>

        {/* Menu Items */}
        <div className="px-6 flex flex-col gap-4">
            {[
                { icon: User, label: 'Edit Profile' },
                { icon: FileText, label: 'Medical Records' },
                { icon: ShieldCheck, label: 'Privacy & Security' },
                { icon: Bot, label: 'Help & Support' },
            ].map((item, i) => (
                <button key={i} className="flex items-center gap-4 p-4 rounded-[24px] bg-white border border-slate-100 shadow-sm hover:bg-slate-50 transition-colors active:scale-95 group">
                    <div className="w-10 h-10 rounded-2xl bg-p-50 flex items-center justify-center group-hover:bg-p-100 transition-colors">
                        <item.icon size={20} className="text-p-600" />
                    </div>
                    <span className="flex-1 text-left text-sm font-bold text-main">{item.label}</span>
                    <ChevronRight size={18} className="text-slate-300" />
                </button>
            ))}

            {/* Logout Button */}
            <button
                onClick={logout}
                className="mt-4 flex items-center gap-4 p-4 rounded-[24px] bg-red-50 border border-red-100 shadow-sm active:scale-95 transition-transform group"
            >
                <div className="w-10 h-10 rounded-2xl bg-red-100 flex items-center justify-center">
                    <LogOut size={20} className="text-red-500" />
                </div>
                <span className="flex-1 text-left text-sm font-bold text-red-600">Logout</span>
            </button>

            <p className="text-center text-[10px] font-bold text-muted opacity-40 mt-4">
                Version 2.4.0 • Build 2026.02
            </p>
        </div>
    </div>
);


const PatientDashboard = () => {
    const navigate = useNavigate();
    const { user, logout, loading } = useAuth();
    const [activeTab, setActiveTab] = useState('home');
    const [notif, setNotif] = useState(null);
    const [isCallingSOS, setIsCallingSOS] = useState(false);
    const [isLocationOpen, setIsLocationOpen] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState('Mancherial, Telangana');
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    const handleSOS = () => {
        setIsCallingSOS(true);
        setTimeout(() => {
            setIsCallingSOS(false);
            window.location.href = "tel:108";
        }, 1500);
    };

    // Tab Sync Logic
    const location = useLocation();
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tab = params.get('tab');
        if (tab && ['home', 'appointments', 'doctor', 'store', 'profile'].includes(tab)) {
            setActiveTab(tab);
        }
    }, [location.search]);

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!loading && !user) {
            navigate('/login/patient');
        }
    }, [user, loading, navigate]);

    const handleLogout = () => {
        logout();
        navigate('/login/patient');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <Loader2 className="animate-spin text-p-600" size={32} />
            </div>
        );
    }

    if (!user) return null; // Should be handled by useEffect redirect

    return (
        <div className="container overflow-x-hidden">
            <AnimatePresence>
                {notif && (
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 10 }}
                        exit={{ opacity: 0, y: -50 }}
                        className="fixed top-5 left-1/2 -translate-x-1/2 w-[calc(100%-40px)] z-[2000] p-4 rounded-2xl bg-slate-900 text-white shadow-2xl flex items-center gap-3 border border-white/10 glass"
                    >
                        <div className="w-10 h-10 rounded-xl bg-p-500/20 flex items-center justify-center">
                            <Bot size={20} className="text-p-400" />
                        </div>
                        <p className="text-xs font-bold">{notif}</p>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.3 }}
                >
                    {activeTab === 'home' && (
                        <HomeTab
                            navigate={navigate}
                            onNavigate={setActiveTab}
                            currentLocation={selectedLocation}
                            onLocationClick={() => setIsLocationOpen(true)}
                        />
                    )}
                    {activeTab === 'appointments' && <AppointmentsTab />}
                    {activeTab === 'ai-doctor' && <AIDoctorTab />}
                    {activeTab === 'store' && <StoreTab />}
                    {activeTab === 'profile' && <ProfileTab user={user} logout={() => setShowLogoutConfirm(true)} />}
                </motion.div>
            </AnimatePresence>

            <BottomNav activeTab={activeTab} onTabChange={setActiveTab} onSOS={handleSOS} />

            <LocationPicker
                isOpen={isLocationOpen}
                onClose={() => setIsLocationOpen(false)}
                onSelect={setSelectedLocation}
                currentCity={selectedLocation}
            />

            <ConfirmModal
                isOpen={showLogoutConfirm}
                onClose={() => setShowLogoutConfirm(false)}
                onConfirm={handleLogout}
            />
        </div>
    );
};

export default PatientDashboard;
