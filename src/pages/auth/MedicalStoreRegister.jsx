import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Store, Key, ShieldCheck, ArrowLeft, Loader2, MapPin, Image as ImageIcon, Phone, User, CheckCircle } from 'lucide-react';
import Button from '../../components/Button';
import Input from '../../components/Input';
import AuthLayout from '../../components/AuthLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy } from 'lucide-react';

const MedicalStoreRegister = () => {
    const navigate = useNavigate();
    const { registerMedicalStore } = useAuth();

    const [formData, setFormData] = useState({
        name: '',
        address: '',
        selectedAddress: '',
        location: '',
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
            setError('Please locate your medical store on the map first.');
            return;
        }

        const res = registerMedicalStore({
            ...formData,
            address: formData.selectedAddress || formData.address
        });

        if (typeof res === 'object' && res.success === false) {
            setError(res.message);
        } else {
            setGeneratedCode(res);
        }
    };

    const simulateMapPicker = () => {
        setIsLocating(true);
        setTimeout(() => {
            const mockLocation = {
                coords: '17.4400° N, 78.3489° E',
                address: 'Shop 12, Jubilee Hills, Hyderabad, Telangana 500033'
            };
            setFormData(prev => ({
                ...prev,
                location: mockLocation.coords,
                selectedAddress: mockLocation.address
            }));
            setIsLocating(false);
            alert('Location successfully identified via Google Maps!');
        }, 2000);
    };

    const handleImageUpload = () => {
        const mockImg = 'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?auto=format&fit=crop&q=80&w=600';
        setFormData(prev => ({ ...prev, image: mockImg }));
        alert('Medical store storefront image uploaded successfully!');
    };

    if (generatedCode) {
        return (
            <div className="auth-wrapper">
                <div className="auth-card">
                    <AuthLayout title="Registration Success!" showBack={false}>
                        <div className="flex-col items-center justify-center p-4" style={{ textAlign: 'center', gap: 'var(--spacing-lg)' }}>
                            <div style={{ backgroundColor: '#ecfdf5', padding: '20px', borderRadius: 'var(--radius-lg)', width: '100%' }}>
                                <p style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>Your Medical Store Code</p>
                                <h2 style={{ fontSize: '2.5rem', color: '#10b981', letterSpacing: '2px' }}>{generatedCode}</h2>
                                <button
                                    onClick={() => navigator.clipboard.writeText(generatedCode)}
                                    style={{
                                        marginTop: '10px',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        color: '#059669',
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

                            <Button size="block" onClick={() => navigate('/login/medical-store')}>
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
                <AuthLayout title="Medical Store Registration" subtitle="Join the HealthLink pharmacy network">
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

                        {/* Image Upload */}
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
                                    <img src={formData.image} alt="Store" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <>
                                        <ImageIcon size={32} color="#94a3b8" />
                                        <p style={{ fontSize: '13px', color: '#64748b', marginTop: '8px' }}>Upload Store Storefront</p>
                                    </>
                                )}
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                            <Input
                                label="Medical Store Name"
                                placeholder="e.g. Apollo Pharmacy"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />

                            <div style={{ position: 'relative' }}>
                                <label style={{ fontSize: '14px', fontWeight: 'bold', color: '#64748b', display: 'block', marginBottom: '8px' }}>Store Location</label>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="block"
                                    onClick={simulateMapPicker}
                                    disabled={isLocating}
                                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', height: '48px', borderStyle: 'solid' }}
                                >
                                    {isLocating ? <Loader2 className="animate-spin" size={18} /> : <MapPin size={18} />}
                                    {formData.location ? 'Location Updated' : 'Locate on Google Maps'}
                                </Button>
                                {formData.selectedAddress && (
                                    <div style={{
                                        marginTop: '10px',
                                        padding: '12px',
                                        backgroundColor: '#f0fdf4',
                                        borderRadius: '8px',
                                        fontSize: '13px',
                                        color: '#166534',
                                        border: '1px solid #bbf7d0',
                                        display: 'flex',
                                        gap: '8px'
                                    }}>
                                        <CheckCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                                        <span><strong>Detected Address:</strong><br />{formData.selectedAddress}</span>
                                    </div>
                                )}
                            </div>

                            <Input
                                label="Pharmacist In-charge Name"
                                placeholder="Pharmacist Name"
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
                                placeholder="store@pharmacy.com"
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

export default MedicalStoreRegister;
