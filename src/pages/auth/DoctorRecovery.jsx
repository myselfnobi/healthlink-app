import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/AuthLayout';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useAuth } from '../../context/AuthContext';
import { Lock, Smartphone, CheckCircle } from 'lucide-react';

const DoctorRecovery = () => {
    const navigate = useNavigate();
    const { resetDoctorPasskey } = useAuth();

    const [step, setStep] = useState(1); // 1: Info, 2: OTP, 3: New Passkey
    const [docId, setDocId] = useState('');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [newPasskey, setNewPasskey] = useState('');
    const [error, setError] = useState('');

    const handleRequestOtp = (e) => {
        e.preventDefault();
        // Here we would check if ID/Phone match before sending OTP in real app
        // For demo, we simulate OTP sent
        if (docId && phone) {
            setStep(2);
        } else {
            setError('Please enter all details');
        }
    };

    const handleVerifyOtp = (e) => {
        e.preventDefault();
        if (otp === '123456') { // Mock OTP
            setStep(3);
            setError('');
        } else {
            setError('Invalid OTP (Enter 123456)');
        }
    };

    const handleReset = (e) => {
        e.preventDefault();
        const result = resetDoctorPasskey(docId, phone, newPasskey);
        if (result.success) {
            alert('Passkey Reset Successfully!');
            navigate('/login/doctor');
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-card">
                <AuthLayout title="Recovery" subtitle="Reset your Passkey" showBack={true}>

                    {step === 1 && (
                        <form onSubmit={handleRequestOtp} className="flex-col" style={{ gap: 'var(--spacing-md)' }}>
                            <Input
                                label="Doctor ID"
                                placeholder="DOC-XXXX"
                                value={docId}
                                onChange={(e) => setDocId(e.target.value)}
                                required
                            />
                            <Input
                                label="Registered Phone"
                                placeholder="1234567890"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                            />
                            {error && <p style={{ color: 'red', fontSize: '12px' }}>{error}</p>}
                            <div style={{ marginTop: 'var(--spacing-md)' }}>
                                <Button type="submit" size="block">Send OTP</Button>
                            </div>
                        </form>
                    )}

                    {step === 2 && (
                        <form onSubmit={handleVerifyOtp} className="flex-col" style={{ gap: 'var(--spacing-md)' }}>
                            <div style={{ textAlign: 'center', marginBottom: '16px', color: '#10b981' }}>
                                <Smartphone size={32} style={{ margin: '0 auto 8px' }} />
                                <p>OTP Sent to {phone}</p>
                                <p style={{ fontSize: '10px', color: '#666' }}>(Mock: 123456)</p>
                            </div>
                            <Input
                                label="Enter OTP"
                                placeholder="6-digit code"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                            />
                            {error && <p style={{ color: 'red', fontSize: '12px' }}>{error}</p>}
                            <div style={{ marginTop: 'var(--spacing-md)' }}>
                                <Button type="submit" size="block">Verify</Button>
                            </div>
                        </form>
                    )}

                    {step === 3 && (
                        <form onSubmit={handleReset} className="flex-col" style={{ gap: 'var(--spacing-md)' }}>
                            <div style={{ textAlign: 'center', marginBottom: '16px', color: '#3b82f6' }}>
                                <Lock size={32} style={{ margin: '0 auto 8px' }} />
                                <p>Set New Passkey</p>
                            </div>
                            <Input
                                label="New Passkey"
                                type="password"
                                placeholder="****"
                                value={newPasskey}
                                onChange={(e) => setNewPasskey(e.target.value)}
                                required
                            />
                            {error && <p style={{ color: 'red', fontSize: '12px' }}>{error}</p>}
                            <div style={{ marginTop: 'var(--spacing-md)' }}>
                                <Button type="submit" size="block">Reset & Login</Button>
                            </div>
                        </form>
                    )}

                </AuthLayout>
            </div>
        </div>
    );
};

export default DoctorRecovery;
