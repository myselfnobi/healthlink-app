import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';

import { AuthProvider } from './context/AuthContext';
import LoginSelection from './pages/auth/LoginSelection';
import PatientLogin from './pages/auth/PatientLogin';
import HospitalLogin from './pages/auth/HospitalLogin';
import DoctorLogin from './pages/auth/DoctorLogin';
import HospitalRegister from './pages/auth/HospitalRegister';
import DoctorRegister from './pages/auth/DoctorRegister';
import DoctorStatus from './pages/auth/DoctorStatus';
import DoctorRecovery from './pages/auth/DoctorRecovery';
import HospitalDetail from './pages/HospitalDetail';
import BookAppointment from './pages/BookAppointment';
import AppointmentSuccess from './pages/AppointmentSuccess';
import PrescriptionForm from './pages/PrescriptionForm';
import VideoCall from './pages/VideoCall';
import MedicalStoreDashboard from './pages/MedicalStoreDashboard';
import MedicalStoreLogin from './pages/auth/MedicalStoreLogin';
import MedicalStoreRegister from './pages/auth/MedicalStoreRegister';
import PatientDashboard from './pages/PatientDashboard';



function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />

          {/* Auth Routes */}
          <Route path="login" element={<LoginSelection />} />
          <Route path="login/patient" element={<PatientLogin />} />
          <Route path="login/hospital" element={<HospitalLogin />} />
          <Route path="login/doctor" element={<DoctorLogin />} />
          <Route path="login/medical-store" element={<MedicalStoreLogin />} />
          <Route path="register/hospital" element={<HospitalRegister />} />
          <Route path="register/medical-store" element={<MedicalStoreRegister />} />

          <Route path="register/doctor" element={<DoctorRegister />} />
          <Route path="status/doctor" element={<DoctorStatus />} />
          <Route path="recovery/doctor" element={<DoctorRecovery />} />
          <Route path="call/:id" element={<VideoCall />} />

          {/* Phase 2 Routes */}
          <Route path="hospital/:id" element={<HospitalDetail />} />

          {/* Phase 3 Routes */}
          <Route path="book-appointment/:id" element={<BookAppointment />} />
          <Route path="appointment-success" element={<AppointmentSuccess />} />

          {/* Phase 5 Routes */}
          <Route path="prescribe/:id" element={<PrescriptionForm />} />

          {/* Phase 10 Routes */}
          <Route path="medical-store/dashboard" element={<MedicalStoreDashboard />} />
          <Route path="dashboard/patient" element={<PatientDashboard />} />

        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
