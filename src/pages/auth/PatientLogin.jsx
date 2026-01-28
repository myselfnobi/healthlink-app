import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import MapComponent from '../../components/MapComponent';
import { ArrowLeft, ShieldCheck, Phone, User, MapPin, Calendar, CheckCircle2, Search, Building2, Navigation, Loader2 } from 'lucide-react';
import { hospitals as mockHospitals } from '../../utils/mockData';

const PatientLogin = () => {
    const navigate = useNavigate();
    const { loginPatient } = useAuth();

    // Step 1: Details, Step 2: OTP
    const [step, setStep] = useState(1);

    // Form Data
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        age: '',
        birthDate: '',
        gender: 'Male' // Default
    });

    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const otpRefs = useRef([]);
    const [generatedOtp, setGeneratedOtp] = useState(null);
    const [showMapModal, setShowMapModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLocating, setIsLocating] = useState(false);

    // Munge mock hospitals for MapComponent
    const mapMarkers = mockHospitals.map(h => ({
        id: h.id,
        position: [17.44 + Math.random() * 0.1, 78.38 + Math.random() * 0.1], // Mock coordinates
        title: h.name,
        description: h.address
    }));

    const filteredHospitals = mapMarkers.filter(h =>
        h.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelectHospital = (h) => {
        setFormData(prev => ({ ...prev, address: h.title + ", " + h.description }));
        setShowMapModal(false);
        setSearchTerm('');
    };

    const handleUseCurrentLocation = () => {
        setIsLocating(true);
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((pos) => {
                const coords = `${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`;
                // In a real app, we'd reverse-geocode this. For now, we'll label it.
                setFormData(prev => ({ ...prev, address: `My Location (${coords})` }));
                setIsLocating(false);
                setShowMapModal(false);
            }, () => {
                setIsLocating(false);
                alert("Could not detect location automatically.");
            });
        }
    };

    // Auto-calculate age from birthDate
    useEffect(() => {
        if (formData.birthDate) {
            const birthDate = new Date(formData.birthDate);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            if (age >= 0) {
                setFormData(prev => ({ ...prev, age: age.toString() }));
            }
        }
    }, [formData.birthDate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleGetOtp = (e) => {
        e.preventDefault();
        if (formData.phone.length < 10) {
            alert('Please enter a valid phone number');
            return;
        }
        // Simulate OTP
        const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit
        setGeneratedOtp(code);
        alert(`Your OTP is: ${code}`);
        setStep(2);
    };

    const handleOtpChange = (index, value) => {
        if (value.length > 1) return; // Prevent multiple chars
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto move focus
        if (value && index < 5) {
            otpRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, e) => {
        // Move back on backspace
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs.current[index - 1].focus();
        }
    };

    const handleVerifyOtp = () => {
        const enteredOtp = otp.join('');
        if (enteredOtp === generatedOtp) {
            loginPatient(formData);
            navigate('/');
        } else {
            alert('Invalid OTP');
        }
    };

    // Render Step 1: Registration / Details
    if (step === 1) {
        return (
            <div className="auth-wrapper">
                <div className="flex-col p-4 auth-card" style={{ backgroundColor: '#fff' }}>
                    <header style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
                        <button onClick={() => navigate('/login')} style={{ background: 'none', padding: '8px', marginRight: '8px' }}>
                            <ArrowLeft size={24} color="#333" />
                        </button>
                        <h1 style={{ fontSize: '20px', fontWeight: 'bold' }}>Patient Details</h1>
                    </header>

                    <div style={{ marginBottom: '24px' }}>
                        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--primary-color)', marginBottom: '8px' }}>Welcome!</h2>
                        <p style={{ color: 'var(--text-secondary)' }}>Enter your details to register/login</p>
                    </div>

                    <form onSubmit={handleGetOtp} className="flex-col" style={{ gap: '16px' }}>
                        <InputGroup icon={<User size={18} />}>
                            <input
                                name="name"
                                placeholder="Full Name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                style={inputStyle}
                            />
                        </InputGroup>

                        <div style={{ display: 'flex', gap: '16px' }}>
                            <InputGroup icon={<Calendar size={18} />} style={{ flex: 1 }}>
                                <input
                                    name="age"
                                    placeholder="Age"
                                    type="number"
                                    value={formData.age}
                                    onChange={handleChange}
                                    required
                                    style={inputStyle}
                                />
                            </InputGroup>
                            <InputGroup style={{ flex: 1 }}>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    style={{ ...inputStyle, width: '100%', background: 'transparent' }}
                                >
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </InputGroup>
                        </div>

                        <InputGroup icon={<Calendar size={18} />}>
                            <input
                                name="birthDate"
                                placeholder="Birth Date"
                                type="date"
                                value={formData.birthDate}
                                onChange={handleChange}
                                required
                                style={inputStyle}
                            />
                        </InputGroup>

                        <div style={{ marginBottom: '8px' }}>
                            <Button
                                type="button"
                                variant="outline"
                                size="block"
                                onClick={() => setShowMapModal(true)}
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', borderStyle: 'dashed', height: '48px' }}
                            >
                                <MapPin size={18} />
                                Find Preferred Hospital on Map
                            </Button>
                        </div>

                        <AnimatePresence>
                            {showMapModal && (
                                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
                                    <motion.div
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.9, opacity: 0 }}
                                        style={{ backgroundColor: 'white', width: '100%', maxWidth: '440px', borderRadius: '24px', overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '90vh', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', position: 'relative' }}
                                    >
                                        <div style={{ padding: '20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <h3 style={{ fontWeight: 'bold', fontSize: '18px' }}>Select Location</h3>
                                            <button onClick={() => setShowMapModal(false)} style={{ background: 'none', border: 'none', padding: '4px', cursor: 'pointer', color: '#64748b' }}>
                                                <ArrowLeft size={20} />
                                            </button>
                                        </div>

                                        <div style={{ padding: '16px', overflowY: 'auto' }}>
                                            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                                                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', backgroundColor: '#f8f9fa', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                                    <Search size={18} color="#94a3b8" />
                                                    <input
                                                        placeholder="Search hospital..."
                                                        value={searchTerm}
                                                        onChange={(e) => setSearchTerm(e.target.value)}
                                                        style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', fontSize: '14px' }}
                                                    />
                                                </div>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={handleUseCurrentLocation}
                                                disabled={isLocating}
                                                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', backgroundColor: '#eff6ff', color: '#2563eb', borderRadius: '12px', border: 'none', fontWeight: 'bold', fontSize: '14px', marginBottom: '16px', cursor: 'pointer' }}
                                            >
                                                {isLocating ? <Loader2 size={16} className="animate-spin" /> : <Navigation size={16} />}
                                                Use My Current Location
                                            </button>

                                            <div style={{ height: '240px', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
                                                <MapComponent
                                                    markers={filteredHospitals.map(h => ({
                                                        ...h,
                                                        title: `${h.title} (Select)`
                                                    }))}
                                                />
                                            </div>

                                            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                                {filteredHospitals.map(h => (
                                                    <div
                                                        key={h.id}
                                                        onClick={() => handleSelectHospital(h)}
                                                        style={{ padding: '12px', borderBottom: '1px solid #f1f5f9', cursor: 'pointer', borderRadius: '8px' }}
                                                    >
                                                        <p style={{ fontWeight: 'bold', fontSize: '14px', color: '#1e293b' }}>{h.title}</p>
                                                        <p style={{ fontSize: '12px', color: '#64748b' }}>{h.description}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            )}
                        </AnimatePresence>

                        <InputGroup icon={<MapPin size={18} />}>
                            <input
                                name="address"
                                placeholder="Your Address or Selected Hospital"
                                value={formData.address}
                                onChange={handleChange}
                                required
                                style={inputStyle}
                            />
                        </InputGroup>

                        <InputGroup icon={<Phone size={18} />}>
                            <input
                                name="phone"
                                placeholder="Phone Number"
                                type="tel"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                style={inputStyle}
                            />
                        </InputGroup>

                        <Button type="submit" size="block" style={{ marginTop: '16px' }}>
                            Get OTP
                        </Button>
                    </form>
                </div>
            </div>
        );
    }

    // Render Step 2: OTP (Matching Design)
    return (
        <div className="auth-wrapper">
            <div className="auth-card" style={{ backgroundColor: '#fff', display: 'flex', flexDirection: 'column', padding: '24px' }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '40px' }}>
                    <button
                        onClick={() => setStep(1)}
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', color: '#666', fontSize: '14px' }}
                    >
                        <ArrowLeft size={20} /> Back
                    </button>
                </div>

                {/* Content */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>

                    <div style={{ background: 'var(--primary-color)', borderRadius: '12px', padding: '12px', marginBottom: '24px' }}>
                        <ShieldCheck size={32} color="white" />
                    </div>

                    <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>Verify OTP</h1>
                    <p style={{ color: '#666', marginBottom: '32px', fontSize: '14px' }}>
                        Enter the 6-digit code sent to <br />
                        <strong style={{ color: '#333' }}>+91 {formData.phone}</strong>
                    </p>

                    {/* OTP Inputs */}
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', justifyContent: 'center' }}>
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={el => otpRefs.current[index] = el}
                                type="text"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                style={{
                                    width: '45px',
                                    height: '50px',
                                    border: '1px solid #ddd',
                                    borderRadius: '12px',
                                    fontSize: '20px',
                                    textAlign: 'center',
                                    outline: 'none',
                                    background: '#f8f9fa',
                                    transition: 'border-color 0.2s'
                                }}
                                onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
                                onBlur={(e) => e.target.style.borderColor = '#ddd'}
                            />
                        ))}
                    </div>

                    <Button
                        size="block"
                        onClick={handleVerifyOtp}
                        style={{
                            height: '50px',
                            fontSize: '16px',
                            borderRadius: '12px',
                            backgroundColor: '#6c5ce7' // Using a slightly purplish blue from the screenshot, or stick to primary
                        }}
                    >
                        Verify OTP
                    </Button>

                    <button
                        onClick={() => alert(`Resent OTP: ${generatedOtp}`)}
                        style={{ marginTop: '24px', background: 'none', color: '#666', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                        <CheckCircle2 size={16} /> Resend OTP
                    </button>

                </div>

                {/* Footer */}
                <div style={{ textAlign: 'center', marginTop: 'auto', color: '#ccc', fontSize: '12px', display: 'flex', justifyContent: 'center', gap: '8px' }}>
                    <span>Secured with end-to-end encryption</span>
                </div>
            </div>
        </div>
    );
};

const InputGroup = ({ icon, children, style }) => (
    <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '14px',
        backgroundColor: '#f8f9fa',
        borderRadius: '12px',
        border: '1px solid transparent',
        transition: 'all 0.2s',
        ...style
    }}>
        {icon && <div style={{ color: '#95a5a6' }}>{icon}</div>}
        {children}
    </div>
);

const inputStyle = {
    border: 'none',
    background: 'transparent',
    outline: 'none',
    fontSize: '16px',
    width: '100%',
    color: '#2c3e50',
    fontWeight: '500'
};

export default PatientLogin;
