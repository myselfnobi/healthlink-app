import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Star, Phone, Clock } from 'lucide-react';
import Button from '../components/Button';
import Badge from '../components/Badge';
import { hospitals } from '../utils/mockData';

const HospitalDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const hospital = hospitals.find(h => h.id === id);

    if (!hospital) return <div>Hospital not found</div>;

    return (
        <div style={{ paddingBottom: '80px' }}>
            {/* Header Image */}
            <div style={{ position: 'relative', height: '200px' }}>
                <img
                    src={hospital.image}
                    alt={hospital.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <button
                    onClick={() => navigate(-1)}
                    style={{
                        position: 'absolute', top: '16px', left: '16px',
                        backgroundColor: 'white', borderRadius: '50%', padding: '8px',
                        boxShadow: 'var(--shadow-md)'
                    }}
                >
                    <ArrowLeft size={20} color="var(--text-primary)" />
                </button>
            </div>

            <div className="p-4" style={{ backgroundColor: '#fff', borderRadius: '24px 24px 0 0', marginTop: '-24px', position: 'relative' }}>

                {/* Title Section */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{hospital.name}</h1>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: '#2ecc71', color: 'white', padding: '4px 8px', borderRadius: '6px', fontWeight: 'bold' }}>
                        {hospital.rating} <Star size={12} fill="white" />
                    </div>
                </div>

                <p style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
                    <MapPin size={16} /> {hospital.address}
                </p>

                <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                    <Badge text={hospital.isOpen ? 'OPEN NOW' : 'CLOSED'} type={hospital.isOpen ? 'success' : 'neutral'} icon={<Clock size={12} />} />
                    {hospital.hasEmergency && <Badge text="EMERGENCY AVBL" type="danger" />}
                </div>

                <div style={{ height: '1px', backgroundColor: '#f0f0f0', marginBottom: '24px' }} />

                {/* Doctors Section */}
                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '16px' }}>Available Doctors</h2>

                <div className="flex-col" style={{ gap: '12px' }}>
                    {hospital.doctors.length > 0 ? (
                        hospital.doctors.map(doctor => (
                            <div key={doctor.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', border: '1px solid #f0f0f0', borderRadius: '12px' }}>
                                <div>
                                    <h3 style={{ fontWeight: 'bold', marginBottom: '2px' }}>{doctor.name}</h3>
                                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{doctor.specialty}</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <span style={{
                                        fontSize: '10px', fontWeight: 'bold',
                                        color: doctor.status === 'Available' ? 'var(--primary-color)' : 'var(--warning-color)'
                                    }}>
                                        {doctor.status.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>No doctors listed currently.</p>
                    )}
                </div>

            </div>

            {/* Booking Action - Fixed Bottom */}
            <div style={{
                position: 'fixed', bottom: 0, left: 0, right: 0,
                padding: '16px', backgroundColor: 'white', borderTop: '1px solid #eee',
                display: 'flex', gap: '12px', zIndex: 10
            }}>
                <Button variant="outline" style={{ flex: 1 }}>
                    <Phone size={18} /> Call
                </Button>
                <Button style={{ flex: 2 }} onClick={() => navigate(`/book-appointment/${hospital.id}`)}>
                    Book Appointment
                </Button>
            </div>
        </div>
    );
};

export default HospitalDetail;
