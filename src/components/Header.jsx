import React from 'react';
import { UserCircle, Search, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header = ({ variant = 'default', searchValue, onSearchChange }) => {
    const { user } = useAuth();

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

                <div className="flex justify-between items-center mb-10">
                    <div className="flex flex-col gap-1">
                        <span style={{
                            fontSize: '11px',
                            fontWeight: '600',
                            opacity: 0.7,
                            textTransform: 'uppercase',
                            letterSpacing: '1.2px'
                        }}>
                            {getGreeting()}
                        </span>
                        <h1 style={{
                            fontSize: '28px',
                            fontWeight: '800',
                            letterSpacing: '-1px',
                            textShadow: '0 2px 10px rgba(0,0,0,0.1)',
                            textTransform: 'capitalize'
                        }}>
                            {user?.name || 'Abhinav'}
                        </h1>
                    </div>
                    <div className="flex gap-4">
                        <button className="flex items-center justify-center w-12 h-12 rounded-2xl glass border-none shadow-sm active:scale-90 transition-transform">
                            <Bell size={20} color="white" strokeWidth={2.5} />
                        </button>
                        <button className="flex items-center justify-center p-0.5 rounded-2xl bg-white shadow-lg active:scale-95 transition-transform overflow-hidden">
                            <UserCircle size={44} color="var(--p-600)" />
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
            <button className="p-1 rounded-2xl bg-p-50">
                <UserCircle size={28} color="var(--p-600)" />
            </button>
        </div>
    );
};

export default Header;
