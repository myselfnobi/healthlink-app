import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import LoginSelection from './auth/LoginSelection';
import PatientDashboard from './PatientDashboard';
import HospitalDashboard from './HospitalDashboard';
import MedicalStoreDashboard from './MedicalStoreDashboard';


const Home = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

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
};

export default Home;
