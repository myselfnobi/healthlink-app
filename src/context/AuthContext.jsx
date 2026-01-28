import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [appointments, setAppointments] = useState([]);
    const [orders, setOrders] = useState([]);
    const [doctorStatus, setDoctorStatus] = useState('Available'); // For doctors: Available, Busy, Offline
    const [doctorSchedule, setDoctorSchedule] = useState({}); // { docId: { busyTimes: [] } }
    const [autoApprove, setAutoApprove] = useState(true);
    const [notifications, setNotifications] = useState([]);


    useEffect(() => {
        // Check local storage on load
        const storedUser = localStorage.getItem('healthlink_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        const storedAppts = localStorage.getItem('healthlink_appointments');
        if (storedAppts) {
            setAppointments(JSON.parse(storedAppts));
        }
        const storedOrders = localStorage.getItem('healthlink_orders');
        if (storedOrders) {
            setOrders(JSON.parse(storedOrders));
        }

        setLoading(false);
    }, []);

    const loginPatient = (userData) => {
        // userData: { phone, name, address, birthDate }
        const userObj = { ...userData, role: 'patient', id: Date.now().toString() };
        setUser(userObj);
        localStorage.setItem('healthlink_user', JSON.stringify(userObj));
        return true;
    };

    const bookAppointment = (appointmentData) => {
        // appointmentData: { hospitalId, doctorId, type, symptoms, date, time }

        // Check if doctor is busy
        const isBusy = doctorSchedule[appointmentData.doctorId]?.busyTimes?.includes(appointmentData.time);
        if (isBusy) {
            return { success: false, message: 'Doctor is already booked at this time.' };
        }

        const newAppt = {
            id: 'APT-' + Math.floor(1000 + Math.random() * 9000),
            userId: user.id,
            userName: user.name,
            status: autoApprove ? 'Accepted' : 'Confirmed',
            timestamp: new Date().toISOString(),
            ...appointmentData
        };

        const updatedAppts = [...appointments, newAppt];
        setAppointments(updatedAppts);
        localStorage.setItem('healthlink_appointments', JSON.stringify(updatedAppts));

        // Add to schedule
        const newSchedule = { ...doctorSchedule };
        if (!newSchedule[appointmentData.doctorId]) newSchedule[appointmentData.doctorId] = { busyTimes: [] };
        newSchedule[appointmentData.doctorId].busyTimes.push(appointmentData.time);
        setDoctorSchedule(newSchedule);

        return { success: true, appointment: newAppt };
    };

    const registerHospital = (hospitalData) => {
        // hospitalData: { name, address, email, location, inChargeName, primaryPhone, secondaryPhone, image }

        // Phase 12: Address Deduplication
        if (checkDuplicateAddress(hospitalData.address, 'hospital')) {
            return { success: false, message: 'A hospital is already registered at this address. Registration cancelled.' };
        }

        const code = 'HOSP-' + Math.random().toString(36).substring(2, 6).toUpperCase();

        const newHospital = {
            ...hospitalData,
            id: Date.now().toString(),
            code,
            status: 'active',
            createdAt: new Date().toISOString()
        };

        const hospitals = JSON.parse(localStorage.getItem('healthlink_hospitals') || '[]');
        hospitals.push(newHospital);
        localStorage.setItem('healthlink_hospitals', JSON.stringify(hospitals));

        return code;
    };

    const registerMedicalStore = (storeData) => {
        // storeData: { name, address, email, location, inChargeName, primaryPhone, secondaryPhone, image }

        // Phase 12: Address Deduplication
        if (checkDuplicateAddress(storeData.address, 'medical_store')) {
            return { success: false, message: 'A medical store is already registered at this address. Registration cancelled.' };
        }

        const code = 'MSTR-' + Math.random().toString(36).substring(2, 6).toUpperCase();

        const newStore = {
            ...storeData,
            id: Date.now().toString(),
            code,
            status: 'active',
            role: 'medical_store',
            createdAt: new Date().toISOString()
        };

        const stores = JSON.parse(localStorage.getItem('healthlink_medical_stores') || '[]');
        stores.push(newStore);
        localStorage.setItem('healthlink_medical_stores', JSON.stringify(stores));

        return code;
    };

    const loginHospital = (code, pin) => {
        const hospitals = JSON.parse(localStorage.getItem('healthlink_hospitals') || '[]');
        const hospital = hospitals.find(h => h.code === code);

        if (hospital) {
            // In demo, check if PIN matches (if any saved) or just proceed to OTP step
            return { success: true, hospital };
        }

        if (code.startsWith('HOSP')) {
            const demoHospital = { name: 'Demo Hospital', code, role: 'hospital', id: 'demo-hosp', phone: '+91 99999 88888', address: 'Madhapur, Hyderabad' };
            return { success: true, hospital: demoHospital };
        }

        return { success: false, message: 'Invalid Hospital Code' };
    };

    const checkDuplicateAddress = (address, type) => {
        const key = type === 'hospital' ? 'healthlink_hospitals' : 'healthlink_medical_stores';
        const facilities = JSON.parse(localStorage.getItem(key) || '[]');
        return facilities.some(f => f.address.toLowerCase().trim() === address.toLowerCase().trim());
    };


    const updateAppointmentStatus = (apptId, newStatus) => {
        const updatedAppts = appointments.map(appt => {
            if (appt.id === apptId) {
                let updates = { status: newStatus };

                // Auto-generate video link for accepted online visits
                if (newStatus === 'Accepted' && appt.visitType === 'online' && !appt.meetingLink) {
                    // Internal Route Link
                    updates.meetingLink = `/call/${appt.id}`;
                }

                return { ...appt, ...updates };
            }
            return appt;
        });
        setAppointments(updatedAppts);
        localStorage.setItem('healthlink_appointments', JSON.stringify(updatedAppts));
    };

    const addPrescription = (prescriptionData) => {
        // prescriptionData: { appointmentId, medicine, dosage, duration, notes }
        const newRx = {
            id: 'RX-' + Math.floor(1000 + Math.random() * 9000),
            timestamp: new Date().toISOString(),
            ...prescriptionData
        };
        // In a real app we'd save this to a prescriptions array or db.
        // For this demo, let's append it to the appointment object directly or a separate list.
        // Let's modify the appointment to include "prescriptionId" or stores RX details.

        // Simpler: Just update the appointment with rx details
        const updatedAppts = appointments.map(appt =>
            appt.id === prescriptionData.appointmentId
                ? { ...appt, status: 'Prescribed', prescription: newRx }
                : appt
        );

        setAppointments(updatedAppts);
        localStorage.setItem('healthlink_appointments', JSON.stringify(updatedAppts));
        return newRx;
    };

    const [doctors, setDoctors] = useState([]); // Mock DB for doctors

    const registerDoctor = (docData) => {
        // docData: { name, specialty, phone, hospitalCode, hospitalName, doctorType }

        // 1. Validate Hospital Code & Name Match
        const hospitals = JSON.parse(localStorage.getItem('healthlink_hospitals') || '[]');
        // Add Demo Hospital for validation if not in local storage (since we used mock data initially)
        if (!hospitals.some(h => h.code === 'HOSP-DEMO')) {
            hospitals.push({ id: 'h1', name: 'City Care Hospital', code: 'HOSP-DEMO', address: '123 Main St' });
        }

        const targetHospital = hospitals.find(h => h.code === docData.hospitalCode);

        if (!targetHospital) {
            return { success: false, message: 'Invalid Hospital Code' };
        }

        // Case-insensitive name check
        if (targetHospital.name.toLowerCase().trim() !== docData.hospitalName.toLowerCase().trim()) {
            return { success: false, message: 'Hospital Name does not match the Code provided.' };
        }

        const newDoc = {
            id: 'doc-' + Math.floor(Math.random() * 10000),
            role: 'doctor',
            status: 'pending', // Waiting for admin approval
            hospitalId: targetHospital.id,
            ...docData
        };
        const updatedDocs = [...doctors, newDoc];
        setDoctors(updatedDocs);
        localStorage.setItem('healthlink_doctors', JSON.stringify(updatedDocs));
        return { success: true };
    };

    const resetDoctorPasskey = (docId, phone, newPasskey) => {
        const docIndex = doctors.findIndex(d => (d.code === docId || d.id === docId) && d.phone === phone);

        if (docIndex === -1) {
            return { success: false, message: 'Invalid Doctor ID or Phone Number' };
        }

        const updatedDocs = [...doctors];
        updatedDocs[docIndex] = { ...updatedDocs[docIndex], password: newPasskey };

        setDoctors(updatedDocs);
        localStorage.setItem('healthlink_doctors', JSON.stringify(updatedDocs));
        return { success: true };
    };

    const approveDoctor = (docId) => {
        const doctor = doctors.find(d => d.id === docId);
        const prefix = doctor?.doctorType === 'rmp' ? 'RMP-' : 'DOC-';
        const docCode = prefix + Math.floor(1000 + Math.random() * 9000);

        const updatedDocs = doctors.map(d =>
            d.id === docId ? { ...d, status: 'approved_no_passkey', code: docCode } : d
        );
        setDoctors(updatedDocs);
        localStorage.setItem('healthlink_doctors', JSON.stringify(updatedDocs));
    };

    const checkDoctorStatus = (phone) => {
        const doc = doctors.find(d => d.phone === phone);
        if (!doc) return { found: false };
        return { found: true, status: doc.status, name: doc.name, code: doc.code };
    };

    const setupDoctorPassword = (phone, password) => {
        const updatedDocs = doctors.map(d =>
            d.phone === phone ? { ...d, status: 'approved', password: password } : d
        );
        setDoctors(updatedDocs);
        localStorage.setItem('healthlink_doctors', JSON.stringify(updatedDocs));
        return { success: true };
    };

    const loginDoctor = (code, password) => {
        // Check registered doctors first
        const registeredDoc = doctors.find(d => d.code === code && d.password === password);
        if (registeredDoc) {
            return { success: true, doctor: registeredDoc };
        }

        // Demo Fallback (Pre-approved Dr Sarah)
        // Passkey for demo: "1234"
        if ((code === 'DOC-DEMO' || code === 'HOSP-DEMO') && (password === '1234')) {
            const userObj = {
                name: 'Dr. Sarah Smith',
                code,
                role: 'doctor',
                id: 'd1',
                hospitalId: 'h1',
                status: 'approved'
            };
            return { success: true, doctor: userObj };
        }

        return { success: false, message: 'Invalid ID or Passkey' };
    };

    const loginMedicalStore = (code, pin, storeData = {}) => {
        // Medical Store Login Implementation
        // For demo, accept MSRP-**** codes
        if (code.startsWith('MSRP')) {
            const userObj = {
                name: storeData.name || 'City Wellness Pharmacy',
                phone: storeData.phone || '+91 98765 43210',
                code,
                role: 'medical_store',
                id: 'ms1',
                address: 'Madhapur, Hyderabad',
                status: 'active'
            };
            return { success: true, store: userObj };
        }
        return { success: false, message: 'Invalid Store Code' };
    };

    const placeOrder = (orderData) => {
        const newOrder = {
            id: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
            userId: user.id,
            userName: user.name,
            status: 'Confirmed',
            timestamp: new Date().toISOString(),
            ...orderData
        };
        const updatedOrders = [...orders, newOrder];
        setOrders(updatedOrders);
        localStorage.setItem('healthlink_orders', JSON.stringify(updatedOrders));
        return newOrder;
    };

    const updateOrderStatus = (orderId, newStatus) => {
        const updatedOrders = orders.map(order =>
            order.id === orderId ? { ...order, status: newStatus } : order
        );
        setOrders(updatedOrders);
        localStorage.setItem('healthlink_orders', JSON.stringify(updatedOrders));
    };


    const updateProfile = (profileData) => {
        // profileData: { name, address, phone, images, location, ... }

        // Check for duplicates if address is changing
        if (profileData.address && profileData.address !== user.address) {
            const isDuplicate = checkDuplicateAddress(profileData.address, user.role);
            if (isDuplicate) {
                return { success: false, message: 'Another facility is already registered at this address.' };
            }
        }

        const updatedUser = { ...user, ...profileData };
        setUser(updatedUser);
        localStorage.setItem('healthlink_user', JSON.stringify(updatedUser));

        // Update in the "database" as well
        const dbKey = user.role === 'hospital' ? 'healthlink_hospitals' : 'healthlink_medical_stores';
        const facilities = JSON.parse(localStorage.getItem(dbKey) || '[]');
        const updatedFacilities = facilities.map(f => f.id === user.id ? updatedUser : f);
        localStorage.setItem(dbKey, JSON.stringify(updatedFacilities));

        return { success: true };
    };

    const completeLogin = (userObj) => {
        setUser(userObj);
        localStorage.setItem('healthlink_user', JSON.stringify(userObj));
        return true;
    };


    const logout = () => {
        setUser(null);
        localStorage.removeItem('healthlink_user');
    };

    return (
        <AuthContext.Provider value={{
            user, loading, appointments, orders, doctors, doctorStatus, doctorSchedule, autoApprove, notifications,
            setUser, completeLogin, setDoctorStatus, setDoctorSchedule, setAutoApprove,
            loginPatient, registerHospital, loginHospital, registerMedicalStore, loginDoctor, loginMedicalStore,
            registerDoctor, approveDoctor, checkDoctorStatus, setupDoctorPassword, resetDoctorPasskey,
            bookAppointment, updateAppointmentStatus, addPrescription, placeOrder, updateOrderStatus,
            checkDuplicateAddress, updateProfile, logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};
