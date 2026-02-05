import React, { useState } from 'react';
import { UserCircle, Search, LogOut, MapPin, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from './ConfirmModal';

const Header = ({ variant = 'default', searchValue, onSearchChange, currentLocation, onLocationClick }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    if (variant === 'home') {
        return (
            <div style={{
                background: 'linear-gradient(145deg, #1d4ed8 0%, #3b82f6 40%, #06b6d4 100%)',
                padding: '30px 24px 40px',
                borderRadius: '0 0 var(--r-xl) var(--r-xl)',
                color: 'white',
                marginBottom: '20px',
                position: 'relative',
                boxShadow: '0 15px 45px -10px rgba(37, 99, 235, 0.4)'
            }}>
                {/* Decorative glow */}
                <div style={{
                    position: 'absolute',
                    top: '10%',
                    right: '10%',
                    width: '100px',
                    height: '100px',
                    background: 'rgba(255, 255, 255, 0.15)',
                    filter: 'blur(50px)',
                    borderRadius: '50%'
                }} />

                <div className="flex justify-between items-start mb-10">
                    <div className="flex flex-col gap-0.5">
                        <div
                            className="flex items-center gap-1.5 cursor-pointer active:opacity-70 transition-opacity"
                            onClick={onLocationClick}
                        >
                            <MapPin size={14} className="text-white/80" />
                            <span style={{
                                fontSize: '12px',
                                fontWeight: '700',
                                color: 'white',
                                letterSpacing: '0.2px'
                            }}>
                                {currentLocation || 'Mancherial, Telangana'}
                            </span>
                            <ChevronDown size={14} className="text-white/80" />
                        </div>
                        <h1 style={{
                            fontSize: '32px',
                            fontWeight: '900',
                            letterSpacing: '-1.5px',
                            textShadow: '0 2px 10px rgba(0,0,0,0.1)',
                            textTransform: 'capitalize',
                            marginTop: '4px'
                        }}>
                            {user?.name || 'Abhinav'}
                        </h1>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex items-center justify-center p-0.5 rounded-2xl bg-white shadow-lg active:scale-95 transition-transform overflow-hidden">
                            <UserCircle size={40} color="var(--p-600)" />
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-3 glass p-4 rounded-3xl shadow-lg border-none">
                    <Search size={20} color="white" strokeWidth={2.5} style={{ opacity: 0.9 }} />
                    <input
                        type="text"
                        placeholder="Search doctor, hospital, lab..."
                        value={searchValue}
                        onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            outline: 'none',
                            width: '100%',
                            fontSize: '15px',
                            color: 'white',
                            fontWeight: '600',
                            letterSpacing: '0.2px'
                        }}
                        className="placeholder:text-white/60"
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="flex justify-between items-center p-5 bg-white border-b border-border/50">
            <h1 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--p-700)' }}>HealthLink</h1>
            <div className="flex items-center gap-3">
                <button className="p-1 rounded-2xl bg-p-50">
                    <UserCircle size={28} color="var(--p-600)" />
                </button>
            </div>
            <ConfirmModal
                isOpen={showLogoutConfirm}
                onClose={() => setShowLogoutConfirm(false)}
                onConfirm={handleLogout}
            />
        </div>
    );
};

export default Header;
