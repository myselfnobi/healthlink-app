import React from 'react';
import { MapPin, UserCircle, Search, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Header = ({ variant = 'default', title, subtitle, searchValue, onSearchChange }) => {
    const { user } = useAuth();

    // VARIANT: HOME (Blue Header)
    if (variant === 'home') {
        return (
            <div style={{
                backgroundColor: '#3b82f6', // Bright Blue
                padding: '24px 20px',
                paddingBottom: '32px',
                borderRadius: '0 0 24px 24px', // Rounded bottom
                color: 'white',
                marginBottom: '24px'
            }}>
                {/* Top Row: Greeting + Avatar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <div className="flex-col">
                        <span style={{ fontSize: '14px', opacity: 0.9 }}>Good Morning</span>
                        <h1 style={{ fontSize: '22px', fontWeight: 'bold' }}>{user?.name || 'Sarah Johnson'}</h1>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        {/* Notification Icon */}
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Bell size={20} color="white" />
                        </div>
                        {/* Profile Icon */}
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <UserCircle size={28} color="#3b82f6" />
                        </div>
                    </div>
                </div>

                {/* Emergency SOS Button (Now inside header or just below? Desgin showed inside cyan area?? No, usually separate. Let's put Search here) */}

                {/* Search Bar Embedded in Blue */}
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                }}>
                    <Search size={20} color="#9ca3af" />
                    <input
                        type="text"
                        placeholder="Search doctor, hospital..."
                        value={searchValue}
                        onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
                        style={{ border: 'none', outline: 'none', width: '100%', fontSize: '14px', color: '#1f2937' }}
                    />
                </div>
            </div>
        );
    }


    // VARIANT: DEFAULT (Standard Header) - Kept for compatibility or detailed pages
    return (
        <div className="flex justify-between items-center" style={{ padding: '12px 16px', backgroundColor: 'white' }}>
            <div className="flex-col">
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--primary-color)', fontSize: '12px', fontWeight: 'bold' }}>
                    <MapPin size={14} />
                    <span>Current Location</span>
                </div>
                <div style={{ fontSize: '14px', fontWeight: 'bold' }}>
                    {user?.address ? user.address.split(',')[0] : 'Hyderabad, India'} <span style={{ fontSize: '10px' }}>▼</span>
                </div>
            </div>

            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <UserCircle size={24} color="#6b7280" />
            </div>
        </div>
    );
};

export default Header;
