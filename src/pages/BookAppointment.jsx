import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Stethoscope, Home, Video } from 'lucide-react';
import Button from '../components/Button';
import { hospitals } from '../utils/mockData';
import { useAuth } from '../context/AuthContext';

const BookAppointment = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { bookAppointment } = useAuth();

    const hospital = hospitals.find(h => h.id === id);

    const [selectedDoctor, setSelectedDoctor] = useState(hospital?.doctors[0]?.id || null);
    const [visitType, setVisitType] = useState('hospital');
    const [selectedSymptoms, setSelectedSymptoms] = useState([]);
    const [selectedTime, setSelectedTime] = useState(null);
    const [customSymptom, setCustomSymptom] = useState('');
    const [doctorSearch, setDoctorSearch] = useState('');

    if (!hospital) return <div>Hospital not found</div>;

    const symptoms = ['Fever', 'Cough', 'Cold', 'Headache', 'Stomach Pain', 'Etc'];

    // Filter Doctors
    const filteredDoctors = hospital.doctors.filter(d =>
        d.name.toLowerCase().includes(doctorSearch.toLowerCase()) ||
        d.specialty.toLowerCase().includes(doctorSearch.toLowerCase())
    );

    // Get Active Doctor Object
    const activeDoctor = hospital.doctors.find(d => d.id === selectedDoctor);

    // Dynamic Time Slots (Default or Doctor Specific)
    const baseTimeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '04:00 PM', '05:00 PM', '06:00 PM'];

    // Logic: If doctor has availability data, use it. Otherwise assume all open (except hardcoded busy for fallback demo)
    const getSlotStatus = (time) => {
        if (activeDoctor?.availability) {
            if (activeDoctor.availability.busy.includes(time)) return 'busy';
            if (activeDoctor.availability.available.includes(time)) return 'available';
            return 'busy'; // Default to busy if not in available list (strict mode) or 'available' if lenient. Let's strict.
        }
        return 'available'; // Fallback
    };

    const toggleSymptom = (s) => {
        if (selectedSymptoms.includes(s)) {
            setSelectedSymptoms(selectedSymptoms.filter(item => item !== s));
        } else {
            setSelectedSymptoms([...selectedSymptoms, s]);
        }
    };

    const handleConfirm = () => {
        // Validation: Busy Time
        const status = getSlotStatus(selectedTime);
        if (status === 'busy') {
            alert('Doctor is not available at this time. Please select another slot.');
            return;
        }

        if (!selectedTime) {
            alert('Please select a time slot.');
            return;
        }

        // Prepare Symptoms list (replace Etc with custom text if present)
        let finalSymptoms = [...selectedSymptoms];
        if (finalSymptoms.includes('Etc') && customSymptom.trim()) {
            finalSymptoms = finalSymptoms.filter(s => s !== 'Etc');
            finalSymptoms.push(customSymptom);
        }

        const res = bookAppointment({
            hospitalId: hospital.id,
            hospitalName: hospital.name,
            doctorId: selectedDoctor,
            doctorName: activeDoctor?.name || 'Any Doctor',
            visitType,
            symptoms: finalSymptoms,
            date: 'Today',
            time: selectedTime
        });

        if (res.success) {
            navigate('/appointment-success', { state: { appointment: res.appointment } });
        } else {
            alert(res.message || 'Failed to book appointment.');
        }
    };

    return (
        <div style={{ padding: '20px', paddingBottom: '100px', backgroundColor: '#fff', minHeight: '100vh' }}>
            <header style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
                <button onClick={() => navigate(-1)} style={{ background: 'none', padding: '8px', marginRight: '8px' }}>
                    <ArrowLeft size={24} color="#333" />
                </button>
                <h1 style={{ fontSize: '20px', fontWeight: 'bold' }}>Book Appointment</h1>
            </header>

            {/* Doctor Selection with Search */}
            <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontWeight: 'bold', marginBottom: '12px' }}>Select Doctor</h3>

                {/* Search Bar */}
                <div style={{ marginBottom: '12px', padding: '12px', backgroundColor: '#f9f9f9', borderRadius: '12px', display: 'flex', alignItems: 'center' }}>
                    <input
                        type="text"
                        placeholder="Search by name or specialty..."
                        value={doctorSearch}
                        onChange={(e) => setDoctorSearch(e.target.value)}
                        style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '14px' }}
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {filteredDoctors.length > 0 ? (
                        filteredDoctors.map(doc => (
                            <button
                                key={doc.id}
                                onClick={() => { setSelectedDoctor(doc.id); setSelectedTime(null); }}
                                style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    padding: '16px',
                                    border: `2px solid ${selectedDoctor === doc.id ? 'var(--primary-color)' : '#f0f0f0'}`,
                                    borderRadius: '12px',
                                    background: selectedDoctor === doc.id ? '#f0fff4' : 'fff',
                                    cursor: 'pointer'
                                }}
                            >
                                <div>
                                    <div style={{ fontWeight: 'bold' }}>{doc.name}</div>
                                    <div style={{ fontSize: '12px', color: '#666' }}>{doc.specialty}</div>
                                </div>
                                <div style={{
                                    width: '20px', height: '20px', borderRadius: '50%',
                                    border: '2px solid #ccc',
                                    backgroundColor: selectedDoctor === doc.id ? 'var(--primary-color)' : 'transparent'
                                }} />
                            </button>
                        ))
                    ) : (
                        <p style={{ color: '#999', fontSize: '14px', textAlign: 'center' }}>No doctors found matching "{doctorSearch}"</p>
                    )}
                </div>
            </div>

            {/* Dynamic Time Slot Selection */}
            <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontWeight: 'bold', marginBottom: '12px' }}>Select Time</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {baseTimeSlots.map(time => {
                        const status = getSlotStatus(time); // 'available' | 'busy'
                        const isBusy = status === 'busy';
                        const isSelected = selectedTime === time;
                        return (
                            <button
                                key={time}
                                onClick={() => !isBusy && setSelectedTime(time)}
                                style={{
                                    padding: '10px 16px',
                                    borderRadius: '12px',
                                    border: `1px solid ${isSelected ? 'var(--primary-color)' : '#e0e0e0'}`,
                                    backgroundColor: isSelected ? 'var(--primary-color)' : (isBusy ? '#ffebee' : 'white'),
                                    color: isSelected ? 'white' : (isBusy ? '#c62828' : '#333'),
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    cursor: isBusy ? 'not-allowed' : 'pointer',
                                    opacity: isBusy ? 0.6 : 1
                                }}
                            >
                                {time} {isBusy && <span style={{ fontSize: '10px' }}>(Busy)</span>}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Visit Type */}
            <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontWeight: 'bold', marginBottom: '12px' }}>Visit Type</h3>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <TypeCard
                        icon={<Home size={20} />} label="Hospital"
                        selected={visitType === 'hospital'}
                        onClick={() => setVisitType('hospital')}
                    />
                    <TypeCard
                        icon={<Video size={20} />} label="Online"
                        selected={visitType === 'online'}
                        onClick={() => setVisitType('online')}
                    />
                    <TypeCard
                        icon={<Stethoscope size={20} />} label="Home"
                        selected={visitType === 'home'}
                        onClick={() => setVisitType('home')}
                    />
                </div>
            </div>

            {/* Symptom Selector */}
            <div style={{ marginBottom: '32px' }}>
                <h3 style={{ fontWeight: 'bold', marginBottom: '12px' }}>What's the problem?</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
                    {symptoms.map(sym => (
                        <button
                            key={sym}
                            onClick={() => toggleSymptom(sym)}
                            style={{
                                padding: '8px 16px',
                                borderRadius: '20px',
                                border: '1px solid #e0e0e0',
                                backgroundColor: selectedSymptoms.includes(sym) ? 'var(--primary-color)' : 'white',
                                color: selectedSymptoms.includes(sym) ? 'white' : '#666',
                                fontSize: '14px',
                                fontWeight: '500',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            {sym}
                        </button>
                    ))}
                </div>

                {/* Custom Symptom Textarea */}
                {selectedSymptoms.includes('Etc') && (
                    <textarea
                        type="text"
                        placeholder="Please describe your problem here..."
                        value={customSymptom}
                        onChange={(e) => setCustomSymptom(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '12px',
                            borderRadius: '12px',
                            border: '1px solid #e0e0e0',
                            fontSize: '14px',
                            outline: 'none',
                            fontFamily: 'inherit',
                            minHeight: '80px'
                        }}
                    />
                )}
            </div>

            {/* Footer Action */}
            <div style={{
                position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
                width: '100%', maxWidth: '480px',
                padding: '16px', backgroundColor: 'white', borderTop: '1px solid #eee'
            }}>
                <Button size="block" onClick={handleConfirm} disabled={!selectedDoctor || !selectedTime}>
                    Confirm Appointment
                </Button>
            </div>
        </div>
    );
};

const TypeCard = ({ icon, label, selected, onClick }) => (
    <button
        onClick={onClick}
        style={{
            flex: 1,
            padding: '12px',
            borderRadius: '12px',
            border: `1px solid ${selected ? 'var(--primary-color)' : '#f0f0f0'}`,
            backgroundColor: selected ? '#f0fff4' : '#fff',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
            color: selected ? 'var(--primary-color)' : '#666',
            cursor: 'pointer'
        }}
    >
        {icon}
        <span style={{ fontSize: '12px', fontWeight: 'bold' }}>{label}</span>
    </button>
);

export default BookAppointment;
