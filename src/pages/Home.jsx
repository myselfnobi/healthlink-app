import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import LoginSelection from './auth/LoginSelection';
import PatientDashboard from './PatientDashboard';
import HospitalDashboard from './HospitalDashboard';
import MedicalStoreDashboard from './MedicalStoreDashboard';


const Home = () => {
    const { user } = useAuth();

    try {
        // Not logged in -> Show Login Selection directly
        if (!user) {
            return <LoginSelection />;
        }

        // Hospital/Doctor Logged In
        if (user.role === 'hospital' || user.role === 'doctor') {
            return <HospitalDashboard />;
        }

        // Medical Store Logged In
        if (user.role === 'medical_store') {
            return <MedicalStoreDashboard />;
        }

        // Patient Logged In -> NEW DASHBOARD
        return <PatientDashboard />;
    } catch (error) {
        console.error("Home Component Crash:", error);
        return (
            <div style={{ padding: '20px', color: 'red', backgroundColor: 'white', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                <h1 style={{ marginBottom: '16px' }}>Dashboard Load Error</h1>
                <p style={{ marginBottom: '24px' }}>{error.message}</p>
                <button
                    onClick={() => { localStorage.clear(); window.location.reload(); }}
                    style={{ padding: '12px 24px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    Clear Data & Reset
                </button>
            </div>
        );
    }
};

export default Home;
