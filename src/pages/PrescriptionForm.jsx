import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import { ArrowLeft, Pill, Clock, FileText } from 'lucide-react';

const PrescriptionForm = () => {
    const { id } = useParams(); // Appointment ID
    const navigate = useNavigate();
    const { appointments, addPrescription } = useAuth();

    const appointment = appointments.find(a => a.id === id);

    const [medicine, setMedicine] = useState('');
    const [dosage, setDosage] = useState('1-0-1'); // Morning-Afternoon-Night
    const [duration, setDuration] = useState('3 Days');
    const [notes, setNotes] = useState('');

    if (!appointment) return <div>Appointment not found</div>;

    const handleSubmit = (e) => {
        e.preventDefault();
        addPrescription({
            appointmentId: id,
            medicine,
            dosage,
            duration,
            notes
        });
        alert('Prescription Sent!');
        navigate('/');
    };

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <header style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
                <button onClick={() => navigate(-1)} style={{ background: 'none', padding: '8px', marginRight: '8px' }}>
                    <ArrowLeft size={24} color="#333" />
                </button>
                <h1 style={{ fontSize: '20px', fontWeight: 'bold' }}>Write Prescription</h1>
            </header>

            <div style={{ backgroundColor: '#f9f9f9', padding: '16px', borderRadius: '12px', marginBottom: '24px' }}>
                <p style={{ fontSize: '14px', color: '#666' }}>PATIENT</p>
                <h2 style={{ fontSize: '18px', fontWeight: 'bold' }}>{appointment.userId}</h2>
                {/* Note: userId is generic ID here, logic would be user.name in real app */}
                <p style={{ fontSize: '14px', color: '#666', marginTop: '4px' }}>Symptoms: {appointment.symptoms.join(', ')}</p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                <div className="flex-col" style={{ gap: '8px' }}>
                    <label style={{ fontWeight: 'bold', display: 'flex', gap: '8px' }}>
                        <Pill size={18} /> Medicine Name
                    </label>
                    <input
                        required
                        placeholder="e.g., Paracetamol 500mg"
                        value={medicine}
                        onChange={e => setMedicine(e.target.value)}
                        style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '16px' }}
                    />
                </div>

                <div className="flex-col" style={{ gap: '8px' }}>
                    <label style={{ fontWeight: 'bold', display: 'flex', gap: '8px' }}>
                        <Clock size={18} /> Dosage (M-A-N)
                    </label>
                    <select
                        value={dosage}
                        onChange={e => setDosage(e.target.value)}
                        style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '16px', background: 'white' }}
                    >
                        <option value="1-0-1">1-0-1 (Morning & Night)</option>
                        <option value="1-1-1">1-1-1 (Thrice a day)</option>
                        <option value="1-0-0">1-0-0 (Morning only)</option>
                        <option value="0-0-1">0-0-1 (Night only)</option>
                        <option value="SOS">SOS (As needed)</option>
                    </select>
                </div>

                <div className="flex-col" style={{ gap: '8px' }}>
                    <label style={{ fontWeight: 'bold' }}>Duration</label>
                    <input
                        placeholder="e.g., 3 Days"
                        value={duration}
                        onChange={e => setDuration(e.target.value)}
                        style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '16px' }}
                    />
                </div>

                <div className="flex-col" style={{ gap: '8px' }}>
                    <label style={{ fontWeight: 'bold', display: 'flex', gap: '8px' }}>
                        <FileText size={18} /> Notes / Advice
                    </label>
                    <textarea
                        placeholder="Drink plenty of water..."
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                        style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '16px', minHeight: '100px' }}
                    />
                </div>

                <Button size="block" type="submit" style={{ marginTop: '16px' }}>
                    Generate Prescription
                </Button>

            </form>
        </div>
    );
};

export default PrescriptionForm;
