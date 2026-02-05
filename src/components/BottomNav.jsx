import React from 'react';
import { Home, Calendar, Bot, ShoppingBag, User, AlertCircle } from 'lucide-react';

const BottomNav = ({ activeTab, onTabChange, onSOS }) => {
    const tabs = [
        { id: 'home', icon: <Home size={22} />, label: 'Home' },
        { id: 'appointments', icon: <Calendar size={22} />, label: 'Calendar' },
        { id: 'sos', icon: <AlertCircle size={24} />, label: 'SOS', isSOS: true },
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

                if (tab.isSOS) {
                    return (
                        <div key={tab.id} className="relative flex flex-col items-center">
                            <button
                                onClick={onSOS}
                                className="flex flex-col items-center justify-center w-16 h-16 rounded-full bg-red-600 shadow-xl shadow-red-600/40 text-white border-4 border-white cursor-pointer active:scale-90 transition-all -translate-y-6 animate-pulse z-50"
                            >
                                <AlertCircle size={28} color="white" strokeWidth={3} />
                            </button>
                            <span className="text-[10px] font-black text-red-600 uppercase tracking-tighter -mt-4">SOS</span>
                        </div>
                    );
                }

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
