import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import {
    Calendar, CheckCircle, XCircle, Clock, Users, Activity,
    Settings, MapPin, Image as ImageIcon, Loader2, LogOut,
    Hospital, Heart, TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '../components/ConfirmModal';

const HospitalDashboard = () => {
    const navigate = useNavigate();
    const {
        user, appointments, updateAppointmentStatus, allDoctors, approveDoctor, updateProfile, logout,
        doctorStatus, setDoctorStatus, autoApprove, setAutoApprove
    } = useAuth();
    const [activeTab, setActiveTab] = useState('appointments'); // 'appointments' | 'doctors' | 'settings'

    // Safety check - if user is not loaded yet, show loader
    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#f8f9fa]">
                <Loader2 className="animate-spin text-blue-600" size={48} />
            </div>
        );
    }

    const [profileForm, setProfileForm] = useState({
        name: user?.name || '',
        address: user?.address || '',
        phone: user?.phone || user?.primaryPhone || '',
        secondaryPhone: user?.secondaryPhone || '',
        inChargeName: user?.inChargeName || ''
    });
    const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    // 1. PENDING DOCTOR VIEW
    if (user.role === 'doctor' && user.status === 'pending') {
        return (
            <div className="flex-col items-center justify-center p-4" style={{ height: '100vh', textAlign: 'center' }}>
                <div style={{ padding: '32px', backgroundColor: 'white', borderRadius: '16px', boxShadow: 'var(--shadow-md)', maxWidth: '400px' }}>
                    <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>Approval Pending</h1>
                    <p style={{ marginTop: '16px', color: '#666' }}>
                        Your request to join <strong>{user.hospitalCode}</strong> is awaiting approval from the Hospital Admin.
                    </p>
                    <p style={{ marginTop: '8px', color: '#666' }}>Please contact the administration.</p>
                    <Button size="block" variant="outline" style={{ marginTop: '24px' }} onClick={() => setShowLogoutConfirm(true)}>Logout</Button>
                </div>
                <ConfirmModal
                    isOpen={showLogoutConfirm}
                    onClose={() => setShowLogoutConfirm(false)}
                    onConfirm={logout}
                />
            </div>
        );
    }

    // Filter appointments
    const myAppointments = appointments.filter(a => {
        if (user.role === 'doctor') return a.doctorId === user.id;
        return a.hospitalName === user.name || a.hospitalId === user.id || a.hospitalId === user.hospitalId;
    });

    // Filter pending doctors (Only for Admin/Hospital role)
    const pendingDoctors = allDoctors ? allDoctors.filter(d => d.hospitalCode === user?.code && d.status === 'pending') : [];

    const pending = (myAppointments || []).filter(a => a.status === 'Confirmed');
    const completed = (myAppointments || []).filter(a => a.status === 'Completed');

    const handleUpdateProfile = (e) => {
        e.preventDefault();
        setProfileMsg({ type: '', text: '' });
        const res = updateProfile(profileForm);
        if (res.success) {
            setProfileMsg({ type: 'success', text: 'Profile updated successfully!' });
        } else {
            setProfileMsg({ type: 'error', text: res.message });
        }
    };

    const simulateMapPicker = () => {
        const locations = [
            '17.4483° N, 78.3915° E (Hitech City)',
            '17.4375° N, 78.4482° E (Punjagutta)',
            '17.4933° N, 78.3991° E (Kukatpally)'
        ];
        const randomLoc = locations[Math.floor(Math.random() * locations.length)];
        alert(`Identifying coordinates via Google Maps...\n\nFound: ${randomLoc}`);
        updateProfile({ location: randomLoc });
    };

    const simulateImgUpload = () => {
        const imgs = [
            'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=600',
            'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=80&w=600'
        ];
        updateProfile({ image: imgs[Math.floor(Math.random() * imgs.length)] });
        alert('Image uploaded and synced to profile!');
    };

    return (
        <div style={{ padding: '24px', backgroundColor: '#f8f9fa', minHeight: '100vh', maxWidth: '1200px', margin: '0 auto' }}>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937' }}>{user.name}</h1>
                    <p style={{ color: '#64748b' }}>{user.role === 'doctor' ? `Dr. ${user.name}'s Portal` : 'Hospital Management System'}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#3b82f6' }}>ID: {user.code || user.hospitalCode}</p>
                        <p style={{ fontSize: '12px', color: '#64748b' }}>{(user?.role || '').toUpperCase()}</p>
                    </div>
                    <Button variant="danger" onClick={() => setShowLogoutConfirm(true)} size="md" className="shadow-lg">
                        <LogOut size={18} />
                        <span>Logout</span>
                    </Button>
                </div>
            </div>

            {/* Admin Tabs */}
            {user.role === 'hospital' && (
                <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', borderBottom: '1px solid #e2e8f0' }}>
                    {[
                        { id: 'appointments', label: 'Appointments', icon: <Calendar size={18} /> },
                        { id: 'doctors', label: 'Doctor Management', icon: <Users size={18} />, badge: pendingDoctors.length },
                        { id: 'ai-assistant', label: 'AI Assistant', icon: <Activity size={18} /> },
                        { id: 'settings', label: 'Facility Settings', icon: <Settings size={18} /> }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                padding: '12px 24px',
                                borderBottom: activeTab === tab.id ? '2px solid #3b82f6' : 'none',
                                fontWeight: 'bold',
                                color: activeTab === tab.id ? '#3b82f6' : '#64748b',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                        >
                            {tab.icon}
                            {tab.label}
                            {tab.badge > 0 && <span style={{ background: '#ef4444', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '11px' }}>{tab.badge}</span>}
                        </button>
                    ))}
                </div>
            )}

            {/* Doctor Tabs */}
            {user.role === 'doctor' && (
                <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', borderBottom: '1px solid #e2e8f0' }}>
                    {[
                        { id: 'appointments', label: 'Queue', icon: <Users size={18} /> },
                        { id: 'ai-assistant', label: 'AI Reminder Bot', icon: <Activity size={18} /> },
                        { id: 'settings', label: 'Profile Settings', icon: <Settings size={18} /> }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                padding: '12px 24px',
                                borderBottom: activeTab === tab.id ? '2px solid #3b82f6' : 'none',
                                fontWeight: 'bold',
                                color: activeTab === tab.id ? '#3b82f6' : '#64748b',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer'
                            }}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>
            )}

            {/* Doctor Status Bar */}
            {user.role === 'doctor' && (
                <div style={{ backgroundColor: 'white', padding: '16px 24px', borderRadius: '16px', marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                        <div>
                            <p style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', marginBottom: '4px' }}>Session Status</p>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                {['Available', 'In Appointment', 'Offline'].map(s => (
                                    <button
                                        key={s}
                                        onClick={() => setDoctorStatus(s)}
                                        style={{
                                            padding: '4px 12px',
                                            borderRadius: '20px',
                                            fontSize: '12px',
                                            fontWeight: 'bold',
                                            backgroundColor: doctorStatus === s ? (s === 'Available' ? '#dcfce7' : s === 'In Appointment' ? '#fee2e2' : '#f1f5f9') : 'transparent',
                                            color: doctorStatus === s ? (s === 'Available' ? '#166534' : s === 'In Appointment' ? '#991b1b' : '#475569') : '#94a3b8',
                                            border: `1px solid ${doctorStatus === s ? 'transparent' : '#e2e8f0'}`,
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div style={{ width: '1px', height: '40px', backgroundColor: '#e2e8f0' }} />
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <label style={{ fontSize: '13px', fontWeight: '600', color: '#475569' }}>Auto-Approve Appointments</label>
                            <button
                                onClick={() => setAutoApprove(!autoApprove)}
                                style={{
                                    width: '44px',
                                    height: '24px',
                                    borderRadius: '12px',
                                    backgroundColor: autoApprove ? '#3b82f6' : '#cbd5e1',
                                    border: 'none',
                                    position: 'relative',
                                    cursor: 'pointer',
                                    transition: 'background 0.2s'
                                }}
                            >
                                <div style={{
                                    width: '18px',
                                    height: '18px',
                                    borderRadius: '50%',
                                    backgroundColor: 'white',
                                    position: 'absolute',
                                    top: '3px',
                                    left: autoApprove ? '23px' : '3px',
                                    transition: 'left 0.2s'
                                }} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <AnimatePresence mode="wait">
                {/* TAB: SETTINGS */}
                {activeTab === 'settings' && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        style={{ backgroundColor: 'white', borderRadius: '24px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}
                    >
                        <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Hospital color="#3b82f6" /> Facility Configuration
                        </h2>

                        <div style={{ display: 'flex', gap: '48px', flexWrap: 'wrap' }}>
                            {/* Profile Image Column */}
                            <div style={{ flex: '0 0 240px', textAlign: 'center' }}>
                                <div style={{ width: '240px', height: '240px', borderRadius: '24px', backgroundColor: '#f8fafc', overflow: 'hidden', marginBottom: '20px', border: '2px dashed #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {user.image ? (
                                        <img src={user.image} alt="Facility" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <div style={{ color: '#94a3b8', textAlign: 'center' }}>
                                            <ImageIcon size={48} style={{ marginBottom: '12px' }} />
                                            <p style={{ fontSize: '12px' }}>No Image Uploaded</p>
                                        </div>
                                    )}
                                </div>
                                <Button size="sm" variant="outline" onClick={simulateImgUpload}>
                                    <ImageIcon size={16} style={{ marginRight: '8px' }} /> Update Media
                                </Button>
                            </div>

                            {/* Details Form Column */}
                            <form onSubmit={handleUpdateProfile} style={{ flex: 1, minWidth: '320px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                {profileMsg.text && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        style={{
                                            padding: '16px',
                                            borderRadius: '12px',
                                            backgroundColor: profileMsg.type === 'success' ? '#ecfdf5' : '#fef2f2',
                                            color: profileMsg.type === 'success' ? '#065f46' : '#991b1b',
                                            fontSize: '14px',
                                            fontWeight: '600',
                                            border: `1px solid ${profileMsg.type === 'success' ? '#10b981' : '#f87171'}`
                                        }}
                                    >
                                        {profileMsg.text}
                                    </motion.div>
                                )}

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <div>
                                        <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#64748b', display: 'block', marginBottom: '8px' }}>Official Name</label>
                                        <input
                                            value={profileForm.name}
                                            onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                                            style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '15px' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#64748b', display: 'block', marginBottom: '8px' }}>Hospital In-charge</label>
                                        <input
                                            value={profileForm.inChargeName}
                                            onChange={e => setProfileForm({ ...profileForm, inChargeName: e.target.value })}
                                            style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '15px' }}
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                    <div>
                                        <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#64748b', display: 'block', marginBottom: '8px' }}>Primary Phone</label>
                                        <input
                                            value={profileForm.phone}
                                            onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })}
                                            style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '15px' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#64748b', display: 'block', marginBottom: '8px' }}>Secondary Phone</label>
                                        <input
                                            value={profileForm.secondaryPhone}
                                            onChange={e => setProfileForm({ ...profileForm, secondaryPhone: e.target.value })}
                                            style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '15px' }}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#64748b', display: 'block', marginBottom: '8px' }}>Global Registry Address</label>
                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        <input
                                            value={profileForm.address}
                                            onChange={e => setProfileForm({ ...profileForm, address: e.target.value })}
                                            style={{ flex: 1, padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '15px' }}
                                        />
                                        <Button type="button" variant="outline" onClick={simulateMapPicker} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <MapPin size={18} /> Locate
                                        </Button>
                                    </div>
                                    {user.location && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '10px', color: '#10b981', fontSize: '13px', fontWeight: '600' }}>
                                            <CheckCircle size={14} /> Maps Verification Complete: {user.location}
                                        </div>
                                    )}
                                </div>

                                <div style={{ marginTop: '12px', display: 'flex', gap: '12px' }}>
                                    <Button type="submit" style={{ padding: '14px 32px' }}>Review & Save Profile</Button>
                                    <Button type="button" variant="outline" onClick={() => navigate('/')}>View Public Profile</Button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                )}

                {/* TAB: DOCTORS */}
                {activeTab === 'doctors' && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ backgroundColor: 'white', borderRadius: '24px', padding: '32px', boxShadow: 'var(--shadow-sm)', border: '1px solid #f1f5f9' }}
                    >
                        <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '24px' }}>Onboarding Requests</h2>
                        {pendingDoctors.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {pendingDoctors.map(doc => (
                                    <div key={doc.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', border: '1px solid #e2e8f0', borderRadius: '16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                            <div style={{ width: '48px', height: '48px', borderRadius: '24px', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}>
                                                <Users size={24} />
                                            </div>
                                            <div>
                                                <h3 style={{ fontWeight: 'bold', color: '#1e293b' }}>{doc.name}</h3>
                                                <p style={{ color: '#64748b', fontSize: '14px' }}>{doc.specialty} • {doc.phone}</p>
                                            </div>
                                        </div>
                                        <Button size="sm" onClick={() => approveDoctor(doc.id)}>Grant Access</Button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '48px' }}>
                                <CheckCircle size={48} color="#10b981" style={{ margin: '0 auto 16px', opacity: 0.3 }} />
                                <p style={{ color: '#64748b' }}>All doctor requests handled.</p>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* TAB: APPOINTMENTS */}
                {activeTab === 'appointments' && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {/* Summary Stats */}
                        <div style={{ display: 'flex', gap: '20px', marginBottom: '32px', flexWrap: 'wrap' }}>
                            <StatCard
                                icon={<Users size={24} color="#3b82f6" />}
                                title="Patient Queue"
                                value={myAppointments.length}
                                color="#eff6ff"
                            />
                            <StatCard
                                icon={<Activity size={24} color="#f59e0b" />}
                                title="Active Visits"
                                value={pending.length}
                                color="#fffbeb"
                            />
                            <StatCard
                                icon={<TrendingUp size={24} color="#10b981" />}
                                title="Completed"
                                value={completed.length}
                                color="#f0fdf4"
                            />
                        </div>

                        {/* List */}
                        <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '32px', boxShadow: 'var(--shadow-sm)', border: '1px solid #f1f5f9' }}>
                            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '24px' }}>Queue Management</h2>
                            {myAppointments.length > 0 ? (
                                <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                                        <thead>
                                            <tr style={{ borderBottom: '1px solid #e2e8f0', textAlign: 'left', color: '#64748b', fontSize: '14px' }}>
                                                <th style={{ padding: '16px' }}>Medical Case</th>
                                                <th style={{ padding: '16px' }}>Assigned Specialist</th>
                                                <th style={{ padding: '16px' }}>Timeline</th>
                                                <th style={{ padding: '16px' }}>Status</th>
                                                <th style={{ padding: '16px' }}>Operations</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {myAppointments.map(appt => (
                                                <tr key={appt.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                                                    <td style={{ padding: '20px 16px' }}>
                                                        <p style={{ fontWeight: 'bold', color: '#1e293b' }}>#{appt.id}</p>
                                                        <span style={{ fontSize: '12px', color: '#64748b' }}>{(appt.visitType || 'general').toUpperCase()} Consultation</span>
                                                    </td>
                                                    <td style={{ padding: '16px' }}>{appt.doctorName}</td>
                                                    <td style={{ padding: '16px' }}>{appt.time || '10:00 AM'}</td>
                                                    <td style={{ padding: '16px' }}>
                                                        <StatusBadge status={appt.status} />
                                                    </td>
                                                    <td style={{ padding: '16px' }}>
                                                        {appt.status === 'Confirmed' && (
                                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                                <Button size="sm" onClick={() => updateAppointmentStatus(appt.id, 'Accepted')}>Accept</Button>
                                                            </div>
                                                        )}
                                                        {appt.status === 'Accepted' && (
                                                            <Button size="sm" variant="outline" onClick={() => navigate(`/prescribe/${appt.id}`)}>Open Case</Button>
                                                        )}
                                                        {appt.status === 'Prescribed' && (
                                                            <div style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold', fontSize: '14px' }}>
                                                                <CheckCircle size={18} /> Finalized
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div style={{ textAlign: 'center', padding: '40px' }}>
                                    <Clock size={48} color="#94a3b8" style={{ margin: '0 auto 16px', opacity: 0.2 }} />
                                    <p style={{ color: '#94a3b8' }}>No appointments scheduled for today.</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
                {/* TAB: AI ASSISTANT */}
                {activeTab === 'ai-assistant' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{ backgroundColor: '#1e293b', borderRadius: '24px', padding: '32px', color: 'white', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)' }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                            <div style={{ background: '#3b82f6', padding: '12px', borderRadius: '16px' }}>
                                <Activity size={32} />
                            </div>
                            <div>
                                <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>MedFlow AI Assistant</h2>
                                <p style={{ color: '#94a3b8' }}>Real-time appointment reminders and schedule optimizer</p>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                            <div style={{ backgroundColor: '#334155', borderRadius: '20px', padding: '24px' }}>
                                <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <Clock size={20} color="#3b82f6" /> Daily Reminders
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {pending.length > 0 ? (
                                        pending.map(a => (
                                            <div key={a.id} style={{ borderLeft: '3px solid #3b82f6', paddingLeft: '16px' }}>
                                                <p style={{ fontWeight: 'bold', fontSize: '14px' }}>Upcoming: Patient {a.userName || 'Unknown'}</p>
                                                <p style={{ fontSize: '12px', color: '#94a3b8' }}>Scheduled for {a.time || '10:00 AM'} • {(a.visitType || 'general').toUpperCase()}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p style={{ color: '#94a3b8', fontSize: '14px' }}>No upcoming reminders for today.</p>
                                    )}
                                </div>
                            </div>

                            <div style={{ backgroundColor: '#334155', borderRadius: '20px', padding: '24px' }}>
                                <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <Heart size={20} color="#ec4899" /> System Optimization
                                </h3>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <li style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <CheckCircle size={14} color="#10b981" /> Auto-approve is currently {autoApprove ? 'ON' : 'OFF'}
                                    </li>
                                    <li style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <CheckCircle size={14} color="#10b981" /> Current Status: {doctorStatus}
                                    </li>
                                    <li style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8' }}>
                                        • AI Tip: You have a gap at 12:30 PM, plenty of time for lunch.
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            <ConfirmModal
                isOpen={showLogoutConfirm}
                onClose={() => setShowLogoutConfirm(false)}
                onConfirm={logout}
            />
        </div>
    );
};

const StatCard = ({ icon, title, value, color }) => (
    <div style={{ flex: 1, minWidth: '240px', backgroundColor: 'white', padding: '24px', borderRadius: '24px', boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'center', gap: '20px', border: '1px solid #f1f5f9' }}>
        <div style={{ width: '56px', height: '56px', borderRadius: '16px', backgroundColor: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
        <div>
            <p style={{ color: '#64748b', fontSize: '14px', fontWeight: '600' }}>{title}</p>
            <h3 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1e293b' }}>{value}</h3>
        </div>
    </div>
);

const StatusBadge = ({ status }) => {
    const config = {
        'Confirmed': { bg: '#eff6ff', color: '#3b82f6' },
        'Accepted': { bg: '#f0fdf4', color: '#10b981' },
        'Rejected': { bg: '#fef2f2', color: '#ef4444' },
        'Prescribed': { bg: '#f8fafc', color: '#64748b' }
    };
    const s = config[status] || config['Confirmed'];
    return (
        <span style={{ backgroundColor: s.bg, color: s.color, padding: '6px 14px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>
            {status}
        </span>
    );
};

export default HospitalDashboard;
