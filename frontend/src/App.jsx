import React, { useState, useEffect } from 'react';
import  Register from "./pages/register.jsx";
import Login  from "./pages/login.jsx";
import  Mainpage  from "./pages/mainpage.jsx";
import  ToggleButton  from "./components/toggleButton.jsx"; 

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showLogin, setShowLogin] = useState(true);


    //checks sessions
    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await fetch('http://localhost:8081/session', {
                    method: 'GET',
                    credentials: 'include',  
                });
                
                if (response.ok) {
                    const data = await response.json();
                    if (data.isLoggedIn) {
                        setIsLoggedIn(true); 
                    } else {
                        console.error('Session invalid or not found')
                    }
                }
            } catch (error) {
                console.error('Error checking session:', error);
            }
        };

        checkSession();
    }, []);

    const handleLogin = () => {
        setIsLoggedIn(true);
        localStorage.setItem('isLoggedIn', 'true');
    };

    const handleLogout = () => {
        setIsLoggedIn(false)
        localStorage.removeItem('isLoggedIn')
    }
    const handleToggle = () => {
        setShowLogin((prev) => !prev);
    };

    return (
        <>
            {!isLoggedIn ? (
                <>
                    {showLogin ? (
                        <Login onLogin={handleLogin} />
                    ) : (
                        <Register onRegister={() => setIsRegistered(true)} />
                    )}
                    <ToggleButton showLogin={showLogin} onToggle={handleToggle} /> 
                </>
            ) : (
                <Mainpage  onLogout={handleLogout} />
            )}
            {isLoggedIn}
        </>
    );
};

export default App