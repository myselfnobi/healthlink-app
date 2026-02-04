import React from 'react';
import { Star, MapPin, Phone, Calendar, ArrowRight } from 'lucide-react';
import Badge from './Badge';

const HospitalCard = ({ hospital, onClick }) => {
    const handleCall = (e) => {
        e.stopPropagation();
        window.location.href = `tel:9999999999`; // Placeholder
    };

    return (
        <div
            onClick={onClick}
            className="flex flex-col gap-0 mb-6 group active:scale-[0.98] transition-all duration-300"
        >
            {/* Image Section - Detached/Floating look */}
            <div style={{ position: 'relative', height: '180px', borderRadius: 'var(--r-lg)', overflow: 'hidden', marginBottom: '-40px', zIndex: 1, boxShadow: '0 10px 30px -5px rgba(0,0,0,0.15)' }}>
                <img
                    src={hospital.image}
                    alt={hospital.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />

                {/* Distance Overlay */}
                <div style={{ position: 'absolute', top: '20px', right: '20px' }} className="glass px-3 py-1.5 rounded-2xl shadow-sm">
                    <span style={{ fontSize: '11px', fontWeight: '800', color: 'white' }}>{hospital.distance}</span>
                </div>

                {/* Status Overlay */}
                <div style={{ position: 'absolute', bottom: '50px', left: '20px' }}>
                    <div className={`${hospital.isOpen ? 'bg-success' : 'bg-slate-500'} px-3 py-1 rounded-full shadow-lg border border-white/20`}>
                        <span className="text-white font-bold text-[10px] tracking-wider">{hospital.isOpen ? 'OPEN' : 'CLOSED'}</span>
                    </div>
                </div>
            </div>

            {/* Info Section - Glass Card */}
            <div className="glass p-6 pt-14 rounded-[32px] shadow-lg border-none" style={{ background: 'rgba(255,255,255,0.85)' }}>
                <div className="flex justify-between items-start mb-4">
                    <div className="flex flex-col gap-1 max-w-[75%]">
                        <h3 style={{ fontSize: '19px', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.5px' }}>{hospital.name}</h3>
                        <div className="flex items-center gap-1.5">
                            <MapPin size={12} className="text-p-500" />
                            <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-muted)' }}>{hospital.address}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 px-3 py-1.5 rounded-2xl bg-white shadow-sm border border-border/50">
                        <Star size={12} className="text-accent" fill="var(--accent)" />
                        <span style={{ fontSize: '13px', fontWeight: '800' }}>{hospital.rating}</span>
                    </div>
                </div>

                {/* Primary Action Button */}
                <div className="flex gap-2">
                    <button
                        onClick={(e) => { e.stopPropagation(); onClick(); }}
                        className="flex-1 btn-primary py-4 rounded-[20px] font-bold text-[13px] flex items-center justify-center gap-2 border-none cursor-pointer"
                    >
                        <Calendar size={16} strokeWidth={2.5} /> Book Appointment
                    </button>
                    <button
                        onClick={handleCall}
                        className="glass-dark p-4 rounded-[20px] active:scale-90 transition-transform cursor-pointer border-none"
                    >
                        <Phone size={20} className="text-p-600" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HospitalCard;
