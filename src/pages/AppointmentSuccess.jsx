import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Calendar, Clock, MapPin } from 'lucide-react';
import Button from '../components/Button';

const AppointmentSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { appointment } = location.state || {}; // { id, doctorName, date, ... }

    if (!appointment) return <div>No appointment data</div>;

    return (
        <div className="flex-col items-center p-4" style={{ minHeight: '100vh', justifyContent: 'center', textAlign: 'center', backgroundColor: '#fff' }}>

            <div style={{ marginBottom: '24px' }}>
                <CheckCircle size={80} color="var(--primary-color)" style={{ marginBottom: '16px' }} />
                <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--primary-color)' }}>Booking Confirmed!</h1>
                <p style={{ color: '#666' }}>Your appointment has been successfully booked.</p>
            </div>

            <div style={{
                width: '100%', backgroundColor: '#f9f9f9', borderRadius: '16px', padding: '24px',
                marginBottom: '32px', textAlign: 'left'
            }}>
                <div style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #eee' }}>
                    <p style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>HOSPITAL</p>
                    <p style={{ fontWeight: 'bold', fontSize: '18px' }}>{appointment.hospitalName}</p>
                </div>

                <div style={{ display: 'flex', gap: '24px', marginBottom: '16px' }}>
                    <div>
                        <p style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>DOCTOR</p>
                        <p style={{ fontWeight: 'bold' }}>{appointment.doctorName}</p>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '24px' }}>
                    <div>
                        <p style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>DATE</p>
                        <p style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold' }}>
                            <Calendar size={14} /> Today
                        </p>
                    </div>
                    <div>
                        <p style={{ fontSize: '12px', color: '#999', marginBottom: '4px' }}>TOKEN</p>
                        <p style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                            #{appointment.id.split('-')[1]}
                        </p>
                    </div>
                </div>
            </div>

            <Button size="block" onClick={() => navigate('/?tab=appointments')}>
                Go to My Appointments
            </Button>
        </div>
    );
};

export default AppointmentSuccess;
