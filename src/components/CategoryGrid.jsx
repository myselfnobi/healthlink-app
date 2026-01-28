import React from 'react';
import { Stethoscope, Heart, Baby, Grid, Eye } from 'lucide-react';

const CategoryGrid = ({ onSelect, selectedId }) => {
    const categories = [
        { id: 'general', name: 'General', icon: <Stethoscope size={24} />, color: '#e0f2fe', iconColor: '#0284c7' }, // Light Blue
        { id: 'heart', name: 'Heart', icon: <Heart size={24} />, color: '#ffe4e6', iconColor: '#e11d48' },   // Light Red
        { id: 'child', name: 'Child', icon: <Baby size={24} />, color: '#dcfce7', iconColor: '#16a34a' },    // Light Green
        { id: 'eyes', name: 'Eyes', icon: <Eye size={24} />, color: '#fffbeb', iconColor: '#f59e0b' },      // Light Orange
        { id: 'more', name: 'More', icon: <Grid size={24} />, color: '#f3e8ff', iconColor: '#9333ea' },      // Light Purple
    ];

    return (
        <div style={{ marginBottom: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', color: '#1f2937' }}>Doctor Categories</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => onSelect && onSelect(cat.id)}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '8px',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        <div style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '20px',
                            backgroundColor: cat.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: cat.iconColor,
                            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                            border: selectedId === cat.id ? `2px solid ${cat.iconColor}` : 'none',
                            transform: selectedId === cat.id ? 'scale(1.1)' : 'scale(1)',
                            transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                        }}>
                            {cat.icon}
                        </div>
                        <span style={{
                            fontSize: '11px',
                            fontWeight: selectedId === cat.id ? 'bold' : '500',
                            color: selectedId === cat.id ? cat.iconColor : '#4b5563'
                        }}>
                            {cat.name}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CategoryGrid;
