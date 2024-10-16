import React from 'react';

 const ToggleButton = ({ showLogin, onToggle }) => {
    return (
        <button className='toggleButton' onClick={onToggle}>
            {showLogin ? 'Switch to Register' : 'Switch to Login'}
        </button>
    );
};
export default ToggleButton
