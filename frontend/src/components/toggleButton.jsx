import React from 'react';

export const ToggleButton = ({ showLogin, onToggle }) => {
    return (
        <button onClick={onToggle}>
            {showLogin ? 'Switch to Register' : 'Switch to Login'}
        </button>
    );
};
