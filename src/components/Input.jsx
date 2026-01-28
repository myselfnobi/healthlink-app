import React from 'react';

const Input = ({
    label,
    type = 'text',
    placeholder,
    value,
    onChange,
    id,
    required = false
}) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)', marginBottom: 'var(--spacing-md)' }}>
            {label && (
                <label
                    htmlFor={id}
                    style={{
                        fontSize: '14px',
                        fontWeight: 'var(--font-weight-medium)',
                        color: 'var(--text-secondary)'
                    }}
                >
                    {label}
                </label>
            )}
            <input
                id={id}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                style={{
                    padding: 'var(--spacing-md)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    fontSize: 'var(--font-size-base)',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    backgroundColor: 'var(--surface-color)',
                    color: 'var(--text-primary)'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
            />
        </div>
    );
};

export default Input;
