import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ placeholder = "Search Hospitals, Doctors..." }) => {
    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#f1f2f6',
            padding: '12px 16px',
            borderRadius: 'var(--radius-lg)',
            gap: '12px',
            margin: 'var(--spacing-md) 0'
        }}>
            <Search size={20} color="var(--text-secondary)" />
            <input
                type="text"
                placeholder={placeholder}
                style={{
                    border: 'none',
                    background: 'transparent',
                    outline: 'none',
                    fontSize: '16px',
                    width: '100%',
                    color: 'var(--text-primary)'
                }}
            />
        </div>
    );
};

export default SearchBar;
