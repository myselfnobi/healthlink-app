import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Building2, Stethoscope, Store } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/Button';
import { Heart } from 'lucide-react';

const LoginSelection = () => {
    const navigate = useNavigate();
    const [selectedRole, setSelectedRole] = useState(null); // 'patient' | 'hospital'

    const { loginMedicalStore } = useAuth();

    const handleContinue = () => {
        if (selectedRole === 'patient') navigate('/login/patient');
        if (selectedRole === 'hospital') navigate('/login/hospital');
    };

    const handleMedicalStore = () => {
        navigate('/login/medical-store');
    };

    return (
        <div className="auth-wrapper">
            <div className="flex-col items-center p-4 auth-card" style={{ backgroundColor: '#fff' }}>

                {/* Header */}
                <div style={{ marginTop: 'var(--spacing-xl)', marginBottom: 'var(--spacing-xl)', textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--primary-color)', marginBottom: '16px' }}>
                        <div style={{ background: 'var(--primary-color)', padding: '8px', borderRadius: '12px', color: 'white' }}>
                            <Heart fill="white" size={24} />
                        </div>
                        <span style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--text-primary)' }}>HealthLink</span>
                    </div>
                    <h1 style={{ fontSize: '1.75rem', marginBottom: '8px' }}>Welcome to HealthLink</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Choose your role to get started</p>
                </div>

                {/* Main Selection Cards */}
                <div style={{ display: 'flex', gap: 'var(--spacing-md)', width: '100%', marginBottom: 'var(--spacing-xl)' }}>

                    <RoleCard
                        icon={<User size={32} />}
                        title="Patient"
                        description="Access healthcare services"
                        subtext="Phone OTP"
                        selected={selectedRole === 'patient'}
                        onClick={() => setSelectedRole('patient')}
                    />

                    <RoleCard
                        icon={<Building2 size={32} />}
                        title="Hospital Admin"
                        description="Manage hospital operations"
                        subtext="Code + PIN"
                        selected={selectedRole === 'hospital'}
                        onClick={() => setSelectedRole('hospital')}
                    />

                </div>

                {/* Continue Button */}
                <div style={{ width: '100%', marginBottom: 'var(--spacing-xl)' }}>
                    <Button
                        size="block"
                        disabled={!selectedRole}
                        onClick={handleContinue}
                        style={{ height: '56px', fontSize: '18px' }}
                    >
                        Continue
                    </Button>
                </div>

                {/* Footer Divider */}
                <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: 'var(--spacing-lg)' }}>
                    <div style={{ height: '1px', flex: 1, background: '#e0e0e0' }} />
                    <span style={{ fontSize: '12px', color: '#9e9e9e', fontWeight: '600' }}>FOR HEALTHCARE STAFF</span>
                    <div style={{ height: '1px', flex: 1, background: '#e0e0e0' }} />
                </div>

                {/* Secondary Actions */}
                <div style={{ display: 'flex', gap: 'var(--spacing-md)', width: '100%' }}>
                    <SecondaryCard
                        icon={<Stethoscope size={20} />}
                        title="Doctor Login"
                        onClick={() => navigate('/login/doctor')}
                    />
                    <SecondaryCard
                        icon={<Store size={20} />}
                        title="Medical Store"
                        onClick={handleMedicalStore}
                    />
                </div>

                <div style={{ marginTop: 'auto', padding: '20px', color: '#bdc3c7', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>Security</span>
                    <span>Secured with end-to-end encryption</span>
                </div>

            </div>
        </div>
    );
};

const RoleCard = ({ icon, title, description, subtext, selected, onClick }) => (
    <button
        onClick={onClick}
        style={{
            flex: 1,
            backgroundColor: 'white',
            border: `2px solid ${selected ? 'var(--primary-color)' : 'transparent'}`,
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--spacing-lg) var(--spacing-sm)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: '12px',
            cursor: 'pointer',
            boxShadow: selected ? '0 4px 12px rgba(46, 204, 113, 0.2)' : 'var(--shadow-sm)',
            transition: 'all 0.2s ease',
            height: '180px',
            justifyContent: 'center'
        }}
    >
        <div style={{
            color: selected ? 'var(--primary-color)' : '#95a5a6',
            backgroundColor: selected ? '#e8f8f0' : '#f8f9fa',
            padding: '12px',
            borderRadius: '50%'
        }}>
            {icon}
        </div>
        <div>
            <h3 style={{ fontSize: '1rem', marginBottom: '4px', color: 'var(--text-primary)' }}>{title}</h3>
            <p style={{ fontSize: '0.75rem', color: '#95a5a6', lineHeight: '1.2' }}>{description}</p>
        </div>
        {subtext && (
            <span style={{ fontSize: '0.7rem', color: '#bdc3c7', display: 'flex', alignItems: 'center', gap: '4px' }}>
                {subtext}
            </span>
        )}
    </button>
);

const SecondaryCard = ({ icon, title, onClick }) => (
    <button
        onClick={onClick}
        style={{
            flex: 1,
            backgroundColor: 'white',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            border: '1px solid #ecf0f1',
            color: 'var(--text-primary)',
            fontWeight: '500',
            boxShadow: 'var(--shadow-sm)'
        }}
    >
        <span style={{ color: 'var(--primary-color)' }}>{icon}</span>
        <span>{title}</span>
    </button>
);

export default LoginSelection;
