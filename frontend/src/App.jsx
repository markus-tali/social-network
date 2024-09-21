import React, { useState } from 'react';
import  Register from "./pages/register.jsx";
import Login  from "./pages/login.jsx";
import  Mainpage  from "./pages/mainpage.jsx";
import  ToggleButton  from "./components/toggleButton.jsx"; 

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showLogin, setShowLogin] = useState(true);

    // const getCookie = (name) => {
    //     const value = `; ${document.cookie}`;
    //     const parts = value.split(`; ${name}=`);
    //     if (parts.length === 2) return parts.pop().split(';').shift();
    // };

    // useEffect(() => {
    //     const accessToken = getCookie('accessToken');  // Assuming your login cookie is called 'isLoggedIn'
    //     console.log(accessToken, "cookiez")
    //     if (accessToken) {
    //         setIsLoggedIn(true);
    //     }
    // }, []);

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
                    <ToggleButton showLogin={showLogin} onToggle={handleToggle} /> {/* Use ToggleButton here */}
                </>
            ) : (
                <Mainpage  onLogout={handleLogout} />
            )}
            {isLoggedIn}
        </>
    );
};

export default App