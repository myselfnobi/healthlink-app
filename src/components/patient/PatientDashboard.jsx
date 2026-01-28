import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import MapComponent from '../MapComponent';
import { MapPin, Search, Navigation, Building2 } from 'lucide-react';

const PatientDashboard = () => {
  const { user } = useAuth();
  const [hospitals] = useState(() => {
    const stored = JSON.parse(localStorage.getItem('healthlink_hospitals') || '[]');
    return stored.map(h => ({
      position: h.location ? mungeCoords(h.location) : [17.4483, 78.3915],
      title: h.name,
      description: h.address
    }));
  });

  const [currentLocName, setCurrentLocName] = useState("Detecting...");

  function mungeCoords(coordStr) {
    // Simple parser for "17.4483° N, 78.3915° E" format
    const parts = coordStr.split(',');
    if (parts.length < 2) return [17.4483, 78.3915];
    const lat = parseFloat(parts[0]);
    const lng = parseFloat(parts[1]);
    return [lat, lng];
  }
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="p-4" style={{ background: 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)', color: 'white' }}>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-lg font-bold">Good Morning, {user?.name || 'Guest'}</h1>
            <p className="text-sm" style={{ opacity: 0.9 }}>Welcome to HealthLink</p>
            <div className="flex items-center mt-1" style={{ fontSize: '11px', opacity: 0.8 }}>
              <MapPin size={12} style={{ marginRight: '4px' }} />
              <span>{currentLocName}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🔔</button>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2ecc71', fontWeight: 'bold' }}>
              {user?.name?.charAt(0) || 'U'}
            </div>
          </div>
        </div>
        <div className="mt-4" style={{ position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search doctors, hospitals..."
            className="w-full p-3 rounded-xl"
            style={{ paddingLeft: '40px', border: 'none', color: '#1e293b', fontSize: '14px' }}
          />
        </div>
      </header>

      {/* Map Section - Real Locations */}
      <section className="p-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-bold" style={{ color: '#1e293b' }}>Hospitals Near You</h2>
          <button style={{ fontSize: '12px', color: '#2ecc71', fontWeight: 'bold' }}>Refresh</button>
        </div>
        <div style={{ height: '300px', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', position: 'relative' }}>
          <MapComponent
            markers={hospitals}
            onLocationFound={() => setCurrentLocName("Your Current Location")}
          />
          <div style={{ position: 'absolute', bottom: '16px', right: '16px', zIndex: 1000 }}>
            <div style={{ backgroundColor: 'white', padding: '8px 16px', borderRadius: '30px', boxShadow: '0 4px 10px rgba(0,0,0,0.2)', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', color: '#1e293b' }}>
              <Building2 size={16} color="#2ecc71" />
              {hospitals.length} Facilities Found
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="p-4">
        <h2 className="text-lg font-bold mb-2">Quick Actions</h2>
        <div className="grid grid-cols-3 gap-4">
          <button className="bg-coral text-white p-4 rounded-md">Video Consult</button>
          <button className="bg-teal text-white p-4 rounded-md">Book Visit</button>
          <button className="bg-purple text-white p-4 rounded-md">Lab Tests</button>
          <button className="bg-green text-white p-4 rounded-md">Pharmacy</button>
        </div>
      </section>

      {/* Doctor Categories */}
      <section className="p-4">
        <h2 className="text-lg font-bold mb-2">Doctor Categories</h2>
        <div className="grid grid-cols-5 gap-4">
          <button className="bg-blue text-white p-4 rounded-md">General</button>
          <button className="bg-red text-white p-4 rounded-md">Heart</button>
          <button className="bg-yellow text-white p-4 rounded-md">Child</button>
          <button className="bg-orange text-white p-4 rounded-md">Eyes</button>
          <button className="bg-gray text-white p-4 rounded-md">More</button>
        </div>
      </section>

      {/* Navigation Bar */}
      <nav className="fixed bottom-0 w-full bg-white p-4 flex justify-around">
        <button className="text-coral">Home</button>
        <button className="text-coral">Appointments</button>
        <button className="text-coral">Store</button>
        <button className="text-coral">Profile</button>
      </nav>
    </div>
  );
};

export default PatientDashboard;