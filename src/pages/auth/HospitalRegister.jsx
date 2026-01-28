import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/AuthLayout';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useAuth } from '../../context/AuthContext';
import { Copy, MapPin, Image as ImageIcon, User, Phone, CheckCircle, ShieldCheck, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MapComponent from '../../components/MapComponent';

const HospitalRegister = () => {
    const navigate = useNavigate();
    const { registerHospital } = useAuth();

    const [formData, setFormData] = useState({
        name: '',
        address: '',
        selectedAddress: '', // From map
        location: '', // Coordinates
        email: '',
        inChargeName: '',
        primaryPhone: '',
        secondaryPhone: '',
        pin: '',
        image: null
    });

    const [error, setError] = useState('');
    const [generatedCode, setGeneratedCode] = useState(null);
    const [isLocating, setIsLocating] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!formData.location) {
            setError('Please locate your hospital on the map first.');
            return;
        }

        const res = registerHospital({
            ...formData,
            address: formData.selectedAddress || formData.address
        });

        if (typeof res === 'object' && res.success === false) {
            setError(res.message);
        } else {
            setGeneratedCode(res);
        }
    };

    const handleMapClick = (latlng) => {
        const coords = `${latlng.lat.toFixed(4)}° N, ${latlng.lng.toFixed(4)}° E`;
        setFormData(prev => ({
            ...prev,
            location: coords
        }));
        // Optional: In a real app, you'd reverse-geocode this to get an address
        if (!formData.selectedAddress) {
            setFormData(prev => ({ ...prev, selectedAddress: "Location selected on map" }));
        }
    };

    const simulateMapPicker = () => {
        setIsLocating(true);
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((pos) => {
                const coords = `${pos.coords.latitude.toFixed(4)}° N, ${pos.coords.longitude.toFixed(4)}° E`;
                setFormData(prev => ({
                    ...prev,
                    location: coords,
                    selectedAddress: "Current Browser Location"
                }));
                setIsLocating(false);
            }, () => {
                setIsLocating(false);
                alert("Could not detect location automatically.");
            });
        }
    };

    const handleImageUpload = () => {
        // Simulated image upload
        const mockImg = 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=600';
        setFormData(prev => ({ ...prev, image: mockImg }));
        alert('Hospital storefront image uploaded successfully!');
    };

    if (generatedCode) {
        return (
            <div className="auth-wrapper">
                <div className="auth-card">
                    <AuthLayout title="Registration Success!" showBack={false}>
                        <div className="flex-col items-center justify-center p-4" style={{ textAlign: 'center', gap: 'var(--spacing-lg)' }}>
                            <div style={{ backgroundColor: '#e8f5e9', padding: '20px', borderRadius: 'var(--radius-lg)', width: '100%' }}>
                                <p style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>Your Hospital Code</p>
                                <h2 style={{ fontSize: '2.5rem', color: 'var(--primary-color)', letterSpacing: '2px' }}>{generatedCode}</h2>
                                <button
                                    onClick={() => navigator.clipboard.writeText(generatedCode)}
                                    style={{
                                        marginTop: '10px',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        color: 'var(--primary-dark)',
                                        background: 'none',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    <Copy size={18} /> Copy Code
                                </button>
                            </div>

                            <p style={{ color: 'var(--text-secondary)' }}>
                                Please save this code safely. You will need it to login along with your Master PIN and OTP.
                            </p>

                            <Button size="block" onClick={() => navigate('/login/hospital')}>
                                Proceed to Login
                            </Button>
                        </div>
                    </AuthLayout>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-wrapper">
            <div className="auth-card" style={{ maxWidth: '500px' }}>
                <AuthLayout title="Hospital Registration" subtitle="Join the HealthLink network">
                    <form onSubmit={handleSubmit} className="flex-col" style={{ gap: '20px' }}>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{ color: 'var(--danger-color)', backgroundColor: '#fef2f2', padding: '12px', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', border: '1px solid #fee2e2' }}
                            >
                                {error}
                            </motion.div>
                        )}

                        {/* Image Upload Block */}
                        <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                            <div
                                onClick={handleImageUpload}
                                style={{
                                    width: '100%',
                                    height: '160px',
                                    borderRadius: '16px',
                                    border: '2px dashed #cbd5e1',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    overflow: 'hidden',
                                    backgroundColor: '#f8fafc',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {formData.image ? (
                                    <img src={formData.image} alt="Hospital" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <>
                                        <ImageIcon size={32} color="#94a3b8" />
                                        <p style={{ fontSize: '13px', color: '#64748b', marginTop: '8px' }}>Upload Hospital Front View</p>
                                    </>
                                )}
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                            <Input
                                label="Hospital Name"
                                placeholder="e.g. City Care Hospital"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />

                            <div style={{ position: 'relative' }}>
                                <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#64748b', display: 'block', marginBottom: '12px' }}>Hospital Location</label>

                                <div style={{ height: '240px', marginBottom: '16px', borderRadius: '16px', overflow: 'hidden', border: '2px solid #e2e8f0' }}>
                                    <MapComponent onMapClick={handleMapClick} />
                                </div>

                                <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '12px', fontStyle: 'italic' }}>
                                    Click on the map to mark your hospital location accurately.
                                </p>

                                <Button
                                    type="button"
                                    variant="outline"
                                    size="block"
                                    onClick={simulateMapPicker}
                                    disabled={isLocating}
                                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', height: '48px', borderStyle: 'solid' }}
                                >
                                    {isLocating ? <Loader2 className="animate-spin" size={18} /> : <MapPin size={18} />}
                                    {formData.location ? 'Location Updated' : 'Use Current Device Location'}
                                </Button>

                                {formData.location && (
                                    <div style={{
                                        marginTop: '10px',
                                        padding: '12px',
                                        backgroundColor: '#eff6ff',
                                        borderRadius: '8px',
                                        fontSize: '13px',
                                        color: '#1e40af',
                                        border: '1px solid #bfdbfe',
                                        display: 'flex',
                                        gap: '8px'
                                    }}>
                                        <CheckCircle size={16} />
                                        <span><strong>Coordinates Locked:</strong> {formData.location}</span>
                                    </div>
                                )}
                            </div>

                            <Input
                                label="Hospital In-charge Name"
                                placeholder="Dr. Administrator Name"
                                value={formData.inChargeName}
                                onChange={(e) => setFormData({ ...formData, inChargeName: e.target.value })}
                                required
                            />

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <Input
                                    label="Primary Phone"
                                    placeholder="+91 98765..."
                                    value={formData.primaryPhone}
                                    onChange={(e) => setFormData({ ...formData, primaryPhone: e.target.value })}
                                    required
                                />
                                <Input
                                    label="Secondary Phone"
                                    placeholder="+91 88888..."
                                    value={formData.secondaryPhone}
                                    onChange={(e) => setFormData({ ...formData, secondaryPhone: e.target.value })}
                                    required
                                />
                            </div>

                            <Input
                                label="Official Email"
                                type="email"
                                placeholder="admin@hospital.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />

                            <Input
                                label="Master PIN (For Login)"
                                type="password"
                                placeholder="Choose 4 digit PIN"
                                maxLength={4}
                                value={formData.pin}
                                onChange={(e) => setFormData({ ...formData, pin: e.target.value })}
                                required
                            />
                        </div>

                        <div style={{ marginTop: '10px' }}>
                            <Button type="submit" size="block" disabled={isLocating}>Complete Registration</Button>
                        </div>
                    </form>
                </AuthLayout>
            </div>
        </div>
    );
};

const Loader2 = ({ className, size }) => (
    <svg
        className={className}
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ animation: 'spin 1s linear infinite' }}
    >
        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
);

export default HospitalRegister;
