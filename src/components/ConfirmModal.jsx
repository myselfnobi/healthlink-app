import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, LogOut, X } from 'lucide-react';
import Button from './Button';

const ConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Confirm Logout",
    message = "Are you sure you want to exit? You will need to log in again to access your dashboard.",
    confirmText = "Logout",
    cancelText = "Cancel",
    type = "danger" // 'danger' | 'warning' | 'info'
}) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 9999,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '24px'
                }}>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'rgba(15, 23, 42, 0.6)',
                            backdropFilter: 'blur(8px)'
                        }}
                    />

                    {/* Modal Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        style={{
                            width: '100%',
                            maxWidth: '400px',
                            background: 'white',
                            borderRadius: '32px',
                            padding: '32px',
                            position: 'relative',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                            textAlign: 'center'
                        }}
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            style={{
                                position: 'absolute',
                                top: '20px',
                                right: '20px',
                                background: '#f1f5f9',
                                border: 'none',
                                width: '32px',
                                height: '32px',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                color: '#64748b'
                            }}
                        >
                            <X size={18} />
                        </button>

                        {/* Icon Header */}
                        <div style={{
                            width: '72px',
                            height: '72px',
                            borderRadius: '24px',
                            background: type === 'danger' ? '#fef2f2' : '#f0f9ff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 24px',
                            color: type === 'danger' ? '#ef4444' : '#3b82f6'
                        }}>
                            {type === 'danger' ? <LogOut size={32} /> : <AlertCircle size={32} />}
                        </div>

                        {/* Content */}
                        <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#0f172a', marginBottom: '12px', letterSpacing: '-0.5px' }}>
                            {title}
                        </h2>
                        <p style={{ fontSize: '15px', color: '#64748b', lineHeight: '1.6', marginBottom: '32px', fontWeight: '500' }}>
                            {message}
                        </p>

                        {/* Actions */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <Button
                                variant={type === 'danger' ? 'danger' : 'primary'}
                                size="block"
                                onClick={onConfirm}
                                style={{ height: '56px', borderRadius: '18px', fontSize: '16px', fontWeight: '800' }}
                            >
                                {confirmText}
                            </Button>
                            <Button
                                variant="outline"
                                size="block"
                                onClick={onClose}
                                style={{ height: '56px', borderRadius: '18px', fontSize: '16px', fontWeight: '700', border: '2px solid #e2e8f0', color: '#64748b' }}
                            >
                                {cancelText}
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ConfirmModal;
