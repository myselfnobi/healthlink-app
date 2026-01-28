import React from 'react';
import { Home, Calendar, Bot, ShoppingBag, User } from 'lucide-react';

const BottomNav = ({ activeTab, onTabChange }) => {
    const tabs = [
        { id: 'home', icon: <Home size={24} />, label: 'Home' },
        { id: 'appointments', icon: <Calendar size={24} />, label: 'Appointments' },
        { id: 'ai-doctor', icon: <Bot size={24} />, label: 'AI Doctor' },
        { id: 'store', icon: <ShoppingBag size={24} />, label: 'Store' },
        { id: 'profile', icon: <User size={24} />, label: 'Profile' },
    ];

    return (
        <div style={{
            position: 'fixed',
            bottom: 0,
            left: '50%', // Center horizontally
            transform: 'translateX(-50%)', // Center align
            width: '100%',
            maxWidth: '480px', // Match container width
            backgroundColor: 'white',
            borderTop: '1px solid #eee',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            padding: '12px 16px',
            paddingBottom: '24px',
            zIndex: 100,
            boxShadow: '0 -4px 20px rgba(0,0,0,0.05)'
        }}>
            {tabs.map(tab => {
                const isActive = activeTab === tab.id;
                return (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '4px',
                            background: 'none',
                            border: 'none',
                            color: isActive ? '#3b82f6' : '#9ca3af', // Blue if active, Gray if not
                            cursor: 'pointer',
                            transition: 'color 0.2s'
                        }}
                    >
                        {tab.icon}
                        <span style={{ fontSize: '10px', fontWeight: isActive ? '600' : '400' }}>
                            {tab.label}
                        </span>
                    </button>
                );
            })}
        </div>
    );
};

export default BottomNav;
