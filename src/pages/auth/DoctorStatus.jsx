import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../../components/AuthLayout';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle, Clock, Lock } from 'lucide-react';

const DoctorStatus = () => {
    const navigate = useNavigate();
    const { checkDoctorStatus, setupDoctorPassword } = useAuth();

    const [phone, setPhone] = useState('');
    const [view, setView] = useState('check'); // 'check' | 'setup' | 'result'
    const [statusData, setStatusData] = useState(null);
    const [passkey, setPasskey] = useState('');

    const handleCheck = (e) => {
        e.preventDefault();
        const result = checkDoctorStatus(phone);
        if (result.found) {
            setStatusData(result);
            // If approved but no passkey, show setup
            if (result.status === 'approved_no_passkey') {
                setView('setup');
            } else {
                setView('result');
            }
        } else {
            alert('No record found for this number.');
        }
    };

    const handleSetup = (e) => {
        e.preventDefault();
        setupDoctorPassword(phone, passkey);
        alert('Passkey Set Successfully! You can now login.');
        navigate('/login/doctor');
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-card">
                <AuthLayout
                    title={view === 'setup' ? "Set Passkey" : "Check Status"}
                    subtitle={view === 'setup' ? "Secure your account" : "See if you are approved"}
                    showBack={true}
                >
                    {view === 'check' && (
                        <form onSubmit={handleCheck} className="flex-col" style={{ gap: 'var(--spacing-md)' }}>
                            <Input
                                label="Registered Phone Number"
                                placeholder="1234567890"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                            />
                            <div style={{ marginTop: 'var(--spacing-md)' }}>
                                <Button type="submit" size="block">Check Status</Button>
                            </div>
                        </form>
                    )}

                    {view === 'result' && statusData && (
                        <div style={{ textAlign: 'center' }}>
                            {statusData.status === 'pending' && (
                                <div style={{ color: '#f59e0b', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                                    <Clock size={48} />
                                    <h3 style={{ fontSize: '20px', fontWeight: 'bold' }}>Pending Approval</h3>
                                    <p style={{ color: '#666' }}>Your request is still under review.</p>
                                </div>
                            )}
                            {statusData.status === 'approved' && (
                                <div style={{ color: '#10b981', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                                    <CheckCircle size={48} />
                                    <h3 style={{ fontSize: '20px', fontWeight: 'bold' }}>All Set!</h3>
                                    <p style={{ color: '#666' }}>Your ID is <strong>{statusData.code}</strong></p>
                                    <Button size="block" onClick={() => navigate('/login/doctor')}>Go to Login</Button>
                                </div>
                            )}
                        </div>
                    )}

                    {view === 'setup' && statusData && (
                        <form onSubmit={handleSetup} style={{ textAlign: 'center' }}>
                            <div style={{ color: '#10b981', marginBottom: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <CheckCircle size={48} />
                                <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginTop: '16px' }}>Approved!</h3>
                                <p style={{ color: '#666', marginTop: '8px' }}>Your Doctor ID is:</p>
                                <div style={{ background: '#f0fdf4', padding: '12px 24px', borderRadius: '8px', fontSize: '24px', fontWeight: 'bold', border: '1px dashed #10b981', margin: '12px 0' }}>
                                    {statusData.code}
                                </div>
                                <p style={{ fontSize: '12px', color: '#666' }}>Save this ID. You will need it to login.</p>
                            </div>

                            <Input
                                label="Create Passkey"
                                type="password"
                                placeholder="****"
                                value={passkey}
                                onChange={(e) => setPasskey(e.target.value)}
                                required
                            />

                            <div style={{ marginTop: 'var(--spacing-md)' }}>
                                <Button type="submit" size="block">Set Passkey & Login</Button>
                            </div>
                        </form>
                    )}

                </AuthLayout>
            </div>
        </div>
    );
};

export default DoctorStatus;
