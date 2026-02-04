import React from 'react';
import { Home, Calendar, Bot, ShoppingBag, User } from 'lucide-react';

const BottomNav = ({ activeTab, onTabChange }) => {
    const tabs = [
        { id: 'home', icon: <Home size={22} />, label: 'Home' },
        { id: 'appointments', icon: <Calendar size={22} />, label: 'Calendar' },
        { id: 'ai-doctor', icon: <Bot size={22} />, label: 'AI Bot' },
        { id: 'store', icon: <ShoppingBag size={22} />, label: 'Store' },
        { id: 'profile', icon: <User size={22} />, label: 'Profile' },
    ];

    return (
        <div
            className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[calc(100%-48px)] max-w-[420px] glass p-3 rounded-[32px] shadow-2xl z-[1000] flex justify-around items-center border-white/40"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
        >
            {tabs.map(tab => {
                const isActive = activeTab === tab.id;
                return (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className="flex flex-col items-center gap-1 transition-all duration-300 relative border-none bg-transparent cursor-pointer"
                        style={{ color: isActive ? 'var(--p-600)' : 'var(--text-muted)' }}
                    >
                        <div className={`p-2.5 rounded-2xl transition-all duration-300 ${isActive ? 'bg-white shadow-md -translate-y-1' : ''}`}>
                            {React.cloneElement(tab.icon, {
                                size: isActive ? 22 : 24,
                                strokeWidth: isActive ? 2.5 : 2,
                                color: isActive ? 'var(--p-600)' : 'var(--text-muted)'
                            })}
                        </div>
                        {isActive && (
                            <span className="text-[9px] font-black uppercase tracking-wider animate-entrance">
                                {tab.label}
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
};

export default BottomNav;
