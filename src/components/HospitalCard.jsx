import React from 'react';
import { Star, MapPin } from 'lucide-react';
import Badge from './Badge';

const HospitalCard = ({ hospital, onClick }) => {
    return (
        <div
            onClick={onClick}
            style={{
                backgroundColor: 'white',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-sm)',
                marginBottom: 'var(--spacing-md)',
                cursor: 'pointer',
                transition: 'transform 0.2s'
            }}
        >
            {/* Image Section */}
            <div style={{ position: 'relative', height: '140px' }}>
                <img
                    src={hospital.image}
                    alt={hospital.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
                    {hospital.hasEmergency && <Badge text="EMERGENCY" type="danger" />}
                </div>
                <div style={{ position: 'absolute', bottom: '10px', right: '10px', backgroundColor: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                    {hospital.distance}
                </div>
            </div>

            {/* Content Section */}
            <div style={{ padding: 'var(--spacing-md)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 'bold' }}>{hospital.name}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2px', backgroundColor: '#2ecc71', color: 'white', padding: '2px 6px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                        {hospital.rating} <Star size={10} fill="white" />
                    </div>
                </div>

                <p style={{ color: 'var(--text-secondary)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '12px' }}>
                    <MapPin size={12} /> {hospital.address}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f1f1f1', paddingTop: '12px' }}>
                    <Badge text={hospital.isOpen ? 'OPEN NOW' : 'CLOSED'} type={hospital.isOpen ? 'success' : 'neutral'} />
                </div>
            </div>
        </div>
    );
};

export default HospitalCard;
