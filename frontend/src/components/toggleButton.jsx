import React from 'react';

 const ToggleButton = ({ showLogin, onToggle }) => {
    return (
        <button className='toggleButton' onClick={onToggle}>
            {showLogin ? 'New here? Create an account' : 'Have an account?Sign in!'}
        </button>
    );
};
export default ToggleButton
