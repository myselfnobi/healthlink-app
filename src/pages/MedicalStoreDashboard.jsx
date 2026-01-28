import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import {
    Package, Truck, CheckCircle, Clock,
    ArrowLeft, LogOut, DollarSign, ShoppingBag,
    TrendingUp, User, MapPin, Star, Settings, Image as ImageIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MedicalStoreDashboard = () => {
    const { user, orders, updateOrderStatus, updateProfile, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'settings'
    const [filter, setFilter] = useState('all');
    const [availableItems, setAvailableItems] = useState({});

    // Profile State
    const [profileForm, setProfileForm] = useState({
        name: user.name,
        address: user.address || '',
        phone: user.phone || user.primaryPhone || '',
        secondaryPhone: user.secondaryPhone || '',
        inChargeName: user.inChargeName || ''
    });
    const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });

    const myOrders = orders.filter(o => o.storeName === user.name || o.storeId === user.id);

    const filteredOrders = myOrders.filter(o => {
        if (filter === 'all') return true;
        return o.status === filter;
    });

    const stats = {
        totalOrders: myOrders.length,
        totalRevenue: myOrders.reduce((acc, curr) => acc + (curr.total || 475), 0),
        pendingOrders: myOrders.filter(o => o.status === 'Confirmed' || o.status === 'Preparing').length
    };

    const toggleAvailability = (orderId, index) => {
        setAvailableItems(prev => ({
            ...prev,
            [orderId]: {
                ...(prev[orderId] || {}),
                [index]: !prev[orderId]?.[index]
            }
        }));
    };

    const isAllAvailable = (order) => {
        const items = order.items || ['Amoxicillin 500mg', 'Paracetamol 650mg'];
        return items.every((_, i) => availableItems[order.id]?.[i]);
    };

    const handleUpdateProfile = (e) => {
        e.preventDefault();
        setProfileMsg({ type: '', text: '' });
        const res = updateProfile(profileForm);
        if (res.success) {
            setProfileMsg({ type: 'success', text: 'Store profile updated successfully!' });
        } else {
            setProfileMsg({ type: 'error', text: res.message });
        }
    };

    const simulateMapPicker = () => {
        const locs = ['17.4483° N, 78.3915° E', '17.3850° N, 78.4867° E'];
        const pick = locs[Math.floor(Math.random() * locs.length)];
        alert(`Google Maps Link Established!\nCoordinates: ${pick}`);
        updateProfile({ location: pick });
    };

    const simulateImgUpload = () => {
        const imgs = ['https://images.unsplash.com/photo-1586015555751-63bb77f4322a?auto=format&fit=crop&q=80&w=400'];
        updateProfile({ image: imgs[0] });
        alert('Store storefront image updated!');
    };

    return (
        <div style={{ padding: '24px', backgroundColor: '#f8f9fa', minHeight: '100vh', maxWidth: '1200px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h2 style={{ fontSize: '14px', color: '#10b981', fontWeight: 'bold', marginBottom: '4px' }}>Welcome back,</h2>
                    <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937' }}>{user.name}</h1>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#10b981' }}>{user.code} • Partner</p>
                        <p style={{ fontSize: '12px', color: '#64748b' }}>{user.phone}</p>
                    </div>
                    <Button variant="danger" onClick={logout} size="sm">
                        <LogOut size={16} />
                    </Button>
                </div>
            </div>

            {/* Dashboard Tabs */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', borderBottom: '1px solid #e2e8f0' }}>
                <button
                    onClick={() => setActiveTab('orders')}
                    style={{
                        padding: '12px 24px',
                        borderBottom: activeTab === 'orders' ? '2px solid #10b981' : 'none',
                        fontWeight: 'bold', color: activeTab === 'orders' ? '#10b981' : '#64748b',
                        background: 'none', border: 'none', cursor: 'pointer'
                    }}
                >
                    Management
                </button>
                <button
                    onClick={() => setActiveTab('settings')}
                    style={{
                        padding: '12px 24px',
                        borderBottom: activeTab === 'settings' ? '2px solid #10b981' : 'none',
                        fontWeight: 'bold', color: activeTab === 'settings' ? '#10b981' : '#64748b',
                        background: 'none', border: 'none', cursor: 'pointer'
                    }}
                >
                    Store Settings
                </button>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'orders' ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key="orders">
                        {/* Stats Cards */}
                        <div style={{ display: 'flex', gap: '20px', marginBottom: '32px', flexWrap: 'wrap' }}>
                            <StatCard icon={<ShoppingBag size={24} color="#3b82f6" />} title="Total Orders" value={stats.totalOrders} color="#e0f2fe" />
                            <StatCard icon={<DollarSign size={24} color="#10b981" />} title="Gross Revenue" value={`₹${stats.totalRevenue.toFixed(2)}`} color="#d1fae5" />
                            <StatCard icon={<TrendingUp size={24} color="#f59e0b" />} title="Pending Action" value={stats.pendingOrders} color="#fef3c7" />
                        </div>

                        {/* Filter Tabs */}
                        <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', overflowX: 'auto', paddingBottom: '8px' }}>
                            {['all', 'Confirmed', 'Preparing', 'Out for delivery', 'Delivered'].map(t => (
                                <button
                                    key={t}
                                    onClick={() => setFilter(t)}
                                    style={{
                                        padding: '8px 16px', borderRadius: '20px', border: '1px solid #e2e8f0',
                                        backgroundColor: filter === t ? '#10b981' : 'white',
                                        color: filter === t ? 'white' : '#64748b', fontWeight: '600', fontSize: '14px', cursor: 'pointer'
                                    }}
                                >
                                    {t === 'all' ? 'All Orders' : t}
                                </button>
                            ))}
                        </div>

                        {/* Orders List */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {filteredOrders.length > 0 ? filteredOrders.map(order => (
                                <div key={order.id} style={{ backgroundColor: 'white', borderRadius: '20px', padding: '24px', boxShadow: 'var(--shadow-sm)', border: '1px solid #f1f5f9' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                                        <div style={{ display: 'flex', gap: '16px' }}>
                                            <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '12px' }}><Package size={24} color="#6366f1" /></div>
                                            <div>
                                                <h3 style={{ fontWeight: 'bold', fontSize: '18px', color: '#1e293b' }}>{order.id}</h3>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px' }}>
                                                    <span style={{ fontSize: '13px', color: '#64748b' }}>{order.userName}</span>
                                                    <span style={{ fontSize: '13px', color: '#64748b' }}>{order.address || 'Hitech City'}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <p style={{ fontWeight: 'bold', fontSize: '18px', color: '#10b981' }}>₹{order.total?.toFixed(2) || '493.50'}</p>
                                            <StatusBadge status={order.status} />
                                        </div>
                                    </div>

                                    {/* Verification Flow */}
                                    <div style={{ backgroundColor: '#f8fafc', borderRadius: '16px', padding: '20px', marginBottom: '20px' }}>
                                        <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#475569', marginBottom: '12px' }}>Requested Medicines:</p>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            {(order.items || ['Amoxicillin 500mg', 'Paracetamol 650mg']).map((item, idx) => (
                                                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <span style={{ fontSize: '14px' }}>{item}</span>
                                                    <button
                                                        onClick={() => toggleAvailability(order.id, idx)}
                                                        disabled={order.status !== 'Confirmed'}
                                                        style={{
                                                            fontSize: '11px', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer',
                                                            backgroundColor: availableItems[order.id]?.[idx] ? '#dcfce7' : '#f1f5f9',
                                                            color: availableItems[order.id]?.[idx] ? '#15803d' : '#64748b',
                                                            border: 'none'
                                                        }}
                                                    >
                                                        {availableItems[order.id]?.[idx] ? '✓ Available' : 'Verify'}
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                                        {order.status === 'Confirmed' && (
                                            <Button size="sm" onClick={() => updateOrderStatus(order.id, 'Preparing')} disabled={!isAllAvailable(order)}>
                                                Accept Order
                                            </Button>
                                        )}
                                        {order.status === 'Preparing' && <Button size="sm" style={{ backgroundColor: '#f59e0b' }} onClick={() => updateOrderStatus(order.id, 'Out for delivery')}>Dispatch</Button>}
                                        {order.status === 'Out for delivery' && <Button size="sm" variant="outline" onClick={() => updateOrderStatus(order.id, 'Delivered')}>Completed</Button>}
                                    </div>
                                </div>
                            )) : <p style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>No orders found.</p>}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key="settings">
                        <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '32px', boxShadow: 'var(--shadow-sm)' }}>
                            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '24px' }}>Store Profile & Media</h2>
                            <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
                                <div style={{ flex: '0 0 200px' }}>
                                    <div style={{ width: '200px', height: '200px', borderRadius: '16px', backgroundColor: '#f1f5f9', overflow: 'hidden', marginBottom: '16px' }}>
                                        <img src={user.image || 'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?auto=format&fit=crop&q=80&w=400'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Store" />
                                    </div>
                                    <Button size="sm" variant="outline" onClick={simulateImgUpload} style={{ width: '100%' }}>Update Photos</Button>
                                </div>
                                <form onSubmit={handleUpdateProfile} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {profileMsg.text && (
                                        <div style={{ padding: '12px', borderRadius: '8px', backgroundColor: profileMsg.type === 'success' ? '#dcfce7' : '#fef2f2', color: profileMsg.type === 'success' ? '#15803d' : '#ef4444', fontSize: '14px' }}>
                                            {profileMsg.text}
                                        </div>
                                    )}
                                    <input placeholder="Store Name" value={profileForm.name} onChange={e => setProfileForm({ ...profileForm, name: e.target.value })} style={inputStyle} />
                                    <input placeholder="Pharmacist In-charge" value={profileForm.inChargeName} onChange={e => setProfileForm({ ...profileForm, inChargeName: e.target.value })} style={inputStyle} />
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <input placeholder="Store Address" value={profileForm.address} onChange={e => setProfileForm({ ...profileForm, address: e.target.value })} style={{ ...inputStyle, flex: 1 }} />
                                        <Button type="button" variant="outline" onClick={simulateMapPicker}>📍 Map</Button>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <input placeholder="Primary Phone" value={profileForm.phone} onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })} style={{ ...inputStyle, flex: 1 }} />
                                        <input placeholder="Secondary Phone" value={profileForm.secondaryPhone} onChange={e => setProfileForm({ ...profileForm, secondaryPhone: e.target.value })} style={{ ...inputStyle, flex: 1 }} />
                                    </div>
                                    <Button type="submit" style={{ alignSelf: 'flex-start' }}>Save Store Info</Button>
                                </form>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const inputStyle = { padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none' };

const StatCard = ({ icon, title, value, color }) => (
    <div style={{ flex: 1, minWidth: '240px', backgroundColor: 'white', padding: '24px', borderRadius: '16px', boxShadow: 'var(--shadow-sm)', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ width: '56px', height: '56px', borderRadius: '12px', backgroundColor: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
        <div><p style={{ color: '#64748b', fontSize: '14px' }}>{title}</p><h3 style={{ fontSize: '24px', fontWeight: 'bold' }}>{value}</h3></div>
    </div>
);

const StatusBadge = ({ status }) => {
    const config = { 'Confirmed': '#3b82f6', 'Preparing': '#f59e0b', 'Out for delivery': '#64748b', 'Delivered': '#10b981' };
    return <span style={{ color: config[status], fontSize: '12px', fontWeight: 'bold' }}>{status}</span>;
};

export default MedicalStoreDashboard;
