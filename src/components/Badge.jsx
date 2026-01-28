import React from 'react';

const Badge = ({ text, type = 'success', icon }) => {
    const colors = {
        success: { bg: '#e8f8f0', color: '#2ecc71' },
        warning: { bg: '#fff9db', color: '#f1c40f' },
        danger: { bg: '#ffe3e3', color: '#e74c3c' },
        neutral: { bg: '#f1f3f5', color: '#868e96' }
    };

    const style = colors[type] || colors.neutral;

    return (
        <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '11px',
            fontWeight: 'bold',
            backgroundColor: style.bg,
            color: style.color
        }}>
            {icon && icon}
            {text}
        </span>
    );
};

export default Badge;
