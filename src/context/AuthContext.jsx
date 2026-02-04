import React, { createContext, useContext, useState, useEffect } from 'react';
import { hospitals as mockHospitals } from '../utils/mockData';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Dynamic Data States
    const [allHospitals, setAllHospitals] = useState([]);
    const [allDoctors, setAllDoctors] = useState([]);
    const [allMedicalStores, setAllMedicalStores] = useState([]);

    const [appointments, setAppointments] = useState([]);
    const [orders, setOrders] = useState([]);

    // Doctor Specific
    const [doctorStatus, setDoctorStatus] = useState('Available');
    const [doctorSchedule, setDoctorSchedule] = useState({});
    const [autoApprove, setAutoApprove] = useState(true);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        // Load Data from LocalStorage
        const storedUser = localStorage.getItem('healthlink_user');
        if (storedUser) setUser(JSON.parse(storedUser));

        const storedAppts = localStorage.getItem('healthlink_appointments');
        if (storedAppts) setAppointments(JSON.parse(storedAppts));

        const storedOrders = localStorage.getItem('healthlink_orders');
        if (storedOrders) setOrders(JSON.parse(storedOrders));

        // Initialize Dynamic Data (Fallback to Mocks if empty)
        const storedHospitals = localStorage.getItem('healthlink_hospitals');
        if (storedHospitals) {
            setAllHospitals(JSON.parse(storedHospitals));
        } else {
            // Seed with Mock Data for first run
            setAllHospitals(mockHospitals);
            localStorage.setItem('healthlink_hospitals', JSON.stringify(mockHospitals));
        }

        const storedDoctors = localStorage.getItem('healthlink_doctors');
        if (storedDoctors) {
            setAllDoctors(JSON.parse(storedDoctors));
        } else {
            // Extract doctors from mockHospitals to seed
            const initialDocs = mockHospitals.flatMap(h => h.doctors.map(d => ({ ...d, hospitalId: h.id, hospitalName: h.name })));
            setAllDoctors(initialDocs);
            localStorage.setItem('healthlink_doctors', JSON.stringify(initialDocs));
        }

        const storedStores = localStorage.getItem('healthlink_medical_stores');
        if (storedStores) setAllMedicalStores(JSON.parse(storedStores));

        setLoading(false);
    }, []);

    const loginPatient = (userData) => {
        const userObj = { ...userData, role: 'patient', id: Date.now().toString() };
        setUser(userObj);
        localStorage.setItem('healthlink_user', JSON.stringify(userObj));
        return true;
    };

    const registerHospital = (hospitalData) => {
        if (checkDuplicateAddress(hospitalData.address, 'hospital')) {
            return { success: false, message: 'A hospital is already registered at this address.' };
        }

        const code = 'HOSP-' + Math.random().toString(36).substring(2, 6).toUpperCase();
        const newHospital = {
            ...hospitalData,
            id: 'hosp-' + Date.now(),
            code,
            doctors: [], // Initialize empty doctor list
            rating: 5.0,
            reviewCount: 0,
            distance: '2.5 km', // Mock distance
            time: '15 min',
            status: 'active',
            createdAt: new Date().toISOString()
        };

        const updatedHospitals = [...allHospitals, newHospital];
        setAllHospitals(updatedHospitals);
        localStorage.setItem('healthlink_hospitals', JSON.stringify(updatedHospitals));

        return code;
    };

    const registerMedicalStore = (storeData) => {
        if (checkDuplicateAddress(storeData.address, 'medical_store')) {
            return { success: false, message: 'A medical store is already registered at this address.' };
        }

        const code = 'MSTR-' + Math.random().toString(36).substring(2, 6).toUpperCase();
        const newStore = {
            ...storeData,
            id: 'store-' + Date.now(),
            code,
            rating: 4.8,
            distance: '1.2 km',
            status: 'active',
            role: 'medical_store',
            createdAt: new Date().toISOString()
        };

        const updatedStores = [...allMedicalStores, newStore];
        setAllMedicalStores(updatedStores);
        localStorage.setItem('healthlink_medical_stores', JSON.stringify(updatedStores));

        return code;
    };

    const registerDoctor = (docData) => {
        // Validate Hospital Code
        const targetHospital = allHospitals.find(h => h.code === docData.hospitalCode);
        if (!targetHospital) {
            return { success: false, message: 'Invalid Hospital Code' };
        }
        if (targetHospital.name.toLowerCase().trim() !== docData.hospitalName.toLowerCase().trim()) {
            return { success: false, message: 'Hospital Name does not match the Code provided.' };
        }

        const newDoc = {
            id: 'doc-' + Math.floor(Math.random() * 100000),
            role: 'doctor',
            status: 'pending',
            hospitalId: targetHospital.id,
            rating: 4.9,
            patients: 0,
            experience: '5+ Years', // Default
            availability: {
                available: ['09:00 AM', '10:00 AM', '11:00 AM'],
                busy: []
            },
            ...docData
        };

        // Update All Doctors
        const updatedDocs = [...allDoctors, newDoc];
        setAllDoctors(updatedDocs);
        localStorage.setItem('healthlink_doctors', JSON.stringify(updatedDocs));

        // Also add to the specific Hospital's doctor list (Legacy support for UI)
        const updatedHospitals = allHospitals.map(h => {
            if (h.id === targetHospital.id) {
                return { ...h, doctors: [...(h.doctors || []), newDoc] };
            }
            return h;
        });
        setAllHospitals(updatedHospitals);
        localStorage.setItem('healthlink_hospitals', JSON.stringify(updatedHospitals));

        return { success: true };
    };

    const loginHospital = (code, pin) => {
        const hospital = allHospitals.find(h => h.code === code);
        if (hospital) return { success: true, hospital: { ...hospital, role: 'hospital' } };

        // Demo Fallback
        if (code.startsWith('HOSP-DEMO')) {
            return { success: true, hospital: { name: 'Demo Hospital', code, role: 'hospital', id: 'demo-hosp' } };
        }
        return { success: false, message: 'Invalid Hospital Code' };
    };

    const loginDoctor = (code, password) => {
        const doc = allDoctors.find(d => d.code === code && d.password === password);
        if (doc) return { success: true, doctor: doc };

        // Demo Fallback
        if (code === 'DOC-DEMO' && password === '1234') {
            return { success: true, doctor: { name: 'Dr. Sarah', code, role: 'doctor', id: 'd1', status: 'approved' } };
        }
        return { success: false, message: 'Invalid ID or Passkey' };
    };

    const loginMedicalStore = (code, pin) => {
        const store = allMedicalStores.find(s => s.code === code);
        if (store) return { success: true, store: { ...store, role: 'medical_store' } };
        return { success: false, message: 'Invalid Store Code' };
    };

    // --- Helper Functions ---

    const bookAppointment = (appointmentData) => {
        // Check availability
        const isBusy = doctorSchedule[appointmentData.doctorId]?.busyTimes?.includes(appointmentData.time);
        if (isBusy) return { success: false, message: 'Doctor is already booked at this time.' };

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

        // Update Busy Schedule
        const newSchedule = { ...doctorSchedule };
        if (!newSchedule[appointmentData.doctorId]) newSchedule[appointmentData.doctorId] = { busyTimes: [] };
        newSchedule[appointmentData.doctorId].busyTimes.push(appointmentData.time);
        setDoctorSchedule(newSchedule);

        return { success: true, appointment: newAppt };
    };

    const checkDuplicateAddress = (address, type) => {
        const facilities = type === 'hospital' ? allHospitals : allMedicalStores;
        return facilities.some(f => f.address.toLowerCase().trim() === address.toLowerCase().trim());
    };

    // Keep existing functions...
    const updateAppointmentStatus = (apptId, newStatus) => {
        const updatedAppts = appointments.map(appt => {
            if (appt.id === apptId) {
                let updates = { status: newStatus };
                if (newStatus === 'Accepted' && appt.visitType === 'online' && !appt.meetingLink) {
                    updates.meetingLink = `/call/${appt.id}`;
                }
                return { ...appt, ...updates };
            }
            return appt;
        });
        setAppointments(updatedAppts);
        localStorage.setItem('healthlink_appointments', JSON.stringify(updatedAppts));
    };

    const addPrescription = (pxData) => {
        const newRx = { id: 'RX-' + Date.now(), ...pxData, timestamp: new Date().toISOString() };
        const updatedAppts = appointments.map(a => a.id === pxData.appointmentId ? { ...a, status: 'Prescribed', prescription: newRx } : a);
        setAppointments(updatedAppts);
        localStorage.setItem('healthlink_appointments', JSON.stringify(updatedAppts));
        return newRx;
    };

    const placeOrder = (oData) => {
        const newOrder = { id: 'ORD-' + Date.now(), userId: user.id, userName: user.name, status: 'Confirmed', timestamp: new Date().toISOString(), ...oData };
        const updatedOrders = [...orders, newOrder];
        setOrders(updatedOrders);
        localStorage.setItem('healthlink_orders', JSON.stringify(updatedOrders));
        return newOrder;
    };

    const updateOrderStatus = (oid, status) => {
        const updated = orders.map(o => o.id === oid ? { ...o, status } : o);
        setOrders(updated);
        localStorage.setItem('healthlink_orders', JSON.stringify(updated));
    };

    const updateProfile = (data) => {
        const updatedUser = { ...user, ...data };
        setUser(updatedUser);
        localStorage.setItem('healthlink_user', JSON.stringify(updatedUser));
        return { success: true };
    };

    const logout = () => { setUser(null); localStorage.removeItem('healthlink_user'); };
    const completeLogin = (u) => { setUser(u); localStorage.setItem('healthlink_user', JSON.stringify(u)); return true; };
    const approveDoctor = (did) => { /* Mock Approval Logic */ return { success: true } };
    const checkDoctorStatus = (ph) => { const d = allDoctors.find(doc => doc.phone === ph); return d ? { found: true, status: d.status, code: d.code } : { found: false }; };
    const setupDoctorPassword = (ph, pw) => {
        const updatedDocs = allDoctors.map(d => d.phone === ph ? { ...d, status: 'approved', password: pw } : d);
        setAllDoctors(updatedDocs);
        localStorage.setItem('healthlink_doctors', JSON.stringify(updatedDocs));
        return { success: true };
    };
    const resetDoctorPasskey = (id, ph, pw) => setupDoctorPassword(ph, pw);


    return (
        <AuthContext.Provider value={{
            user, loading, appointments, orders,

            // Dynamic Data Sources
            allHospitals, allDoctors, allMedicalStores,

            doctorStatus, doctorSchedule, autoApprove, notifications,
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
