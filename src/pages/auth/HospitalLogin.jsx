import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Building2, Key, ShieldCheck, ArrowLeft, Loader2 } from 'lucide-react';
import Button from '../../components/Button';
import { motion, AnimatePresence } from 'framer-motion';

const HospitalLogin = () => {
    const navigate = useNavigate();
    const { loginHospital, completeLogin } = useAuth();

    const [step, setStep] = useState(1); // 1: Credentials, 2: OTP
    const [code, setCode] = useState('');
    const [pin, setPin] = useState('');
    const [otp, setOtp] = useState(['', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [hospitalData, setHospitalData] = useState(null);

    const handleInitialLogin = (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Simulate initial check
        setTimeout(() => {
            const res = loginHospital(code.toUpperCase(), pin);
            setLoading(false);
            if (res.success) {
                setHospitalData(res.hospital);
                setStep(2);
                alert(`Hospital Login OTP: 1234`); // Simulation
            } else {
                setError(res.message);
            }
        }, 1000);
    };

    const handleOtpChange = (index, value) => {
        if (value.length > 1) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value !== '' && index < 3) {
            document.getElementById(`hosp-otp-${index + 1}`).focus();
        }
    };

    const handleVerifyOtp = (e) => {
        e.preventDefault();
        setLoading(true);

        setTimeout(() => {
            if (otp.join('') === '1234') {
                const userObj = { ...hospitalData, role: 'hospital' };
                completeLogin(userObj);
                navigate('/');
            } else {
                setLoading(false);
                setError('Invalid OTP. Please try again.');
            }
        }, 1200);
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-card p-4">
                <button
                    onClick={() => step === 1 ? navigate('/login') : setStep(1)}
                    style={{ background: 'none', border: 'none', padding: '12px 0', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b' }}
                >
                    <ArrowLeft size={20} />
                    <span>Back</span>
                </button>

                <div style={{ textAlign: 'center', marginBottom: '32px', marginTop: '16px' }}>
                    <div style={{ display: 'inline-flex', padding: '16px', backgroundColor: '#eff6ff', borderRadius: '20px', color: '#3b82f6', marginBottom: '16px' }}>
                        <Building2 size={32} />
                    </div>
                    <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b' }}>Hospital Access</h1>
                    <p style={{ color: '#64748b', fontSize: '14px' }}>Administrative & Medical Portal</p>
                </div>

                <AnimatePresence mode="wait">
                    {step === 1 ? (
                        <motion.form
                            key="h-step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            onSubmit={handleInitialLogin}
                            style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
                        >
                            {error && <div style={{ color: '#ef4444', backgroundColor: '#fef2f2', padding: '10px', borderRadius: '8px', fontSize: '14px', textAlign: 'center' }}>{error}</div>}

                            <div className="input-field">
                                <label style={{ fontSize: '14px', fontWeight: '600', color: '#475569', marginBottom: '8px', display: 'block' }}>Hospital Code</label>
                                <div style={{ position: 'relative' }}>
                                    <Building2 size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                    <input
                                        type="text"
                                        placeholder="HOSP-XXXX"
                                        required
                                        value={code}
                                        onChange={(e) => setCode(e.target.value.toUpperCase())}
                                        style={{ width: '100%', padding: '14px 16px 14px 48px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '16px' }}
                                    />
                                </div>
                            </div>

                            <div className="input-field">
                                <label style={{ fontSize: '14px', fontWeight: '600', color: '#475569', marginBottom: '8px', display: 'block' }}>Passkey / PIN</label>
                                <div style={{ position: 'relative' }}>
                                    <Key size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                    <input
                                        type="password"
                                        placeholder="••••"
                                        required
                                        value={pin}
                                        onChange={(e) => setPin(e.target.value)}
                                        style={{ width: '100%', padding: '14px 16px 14px 48px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '16px' }}
                                    />
                                </div>
                            </div>


                            <Button type="submit" size="block" disabled={loading}>
                                {loading ? <Loader2 className="animate-spin" /> : 'Continue to OTP'}
                            </Button>

                            <div style={{ textAlign: 'center', marginTop: '16px' }}>
                                <span style={{ color: '#64748b', fontSize: '14px' }}>New facility? </span>
                                <button
                                    type="button"
                                    onClick={() => navigate('/register/hospital')}
                                    style={{ color: '#3b82f6', fontWeight: 'bold', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px' }}
                                >
                                    Register Hospital
                                </button>
                            </div>
                        </motion.form>
                    ) : (
                        <motion.form
                            key="h-step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            onSubmit={handleVerifyOtp}
                            style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
                        >
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ color: '#10b981', marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
                                    <ShieldCheck size={48} />
                                </div>
                                <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>Two-Factor Auth</h2>
                                <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '24px' }}>
                                    Please enter the security code sent to your registered admin device.
                                </p>
                                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                                    {otp.map((digit, i) => (
                                        <input
                                            key={i}
                                            id={`hosp-otp-${i}`}
                                            type="number"
                                            value={digit}
                                            onChange={(e) => handleOtpChange(i, e.target.value)}
                                            style={{ width: '56px', height: '64px', borderRadius: '12px', border: '2px solid #e2e8f0', textAlign: 'center', fontSize: '24px', fontWeight: 'bold', color: '#1e293b' }}
                                        />
                                    ))}
                                </div>
                                {error && <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '12px' }}>{error}</p>}
                            </div>

                            <Button type="submit" size="block" disabled={loading || otp.some(v => v === '')}>
                                {loading ? <Loader2 className="animate-spin" /> : 'Verify & Access Dashboard'}
                            </Button>

                            <p style={{ textAlign: 'center', fontSize: '14px', color: '#64748b' }}>
                                Resend code in <span style={{ color: '#3b82f6', fontWeight: 'bold' }}>0:59</span>
                            </p>
                        </motion.form>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default HospitalLogin;
