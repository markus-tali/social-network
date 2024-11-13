import React, { useState, useEffect } from 'react';
import  Register from "./pages/register.jsx";
import Login  from "./pages/login.jsx";
import  Mainpage  from "./pages/mainpage.jsx";
import  ToggleButton  from "./components/toggleButton.jsx"; 
import setupWebSocket from "./components/websocket.jsx";

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showLogin, setShowLogin] = useState(true);
    const [userData, setUserData] = useState(null)
    const[username, setUsername] = useState(null)
    const [messages, setMessages] = useState([])
    const [socket, setSocket] = useState(null)
    
    const handleIncomingMessage = (message) => {
        setMessages((prevMessages) => [...prevMessages, message.content])
    }
    
    useEffect(() => {
        checkSession();
    },[])
    
    useEffect(() => {
        if (isLoggedIn) {
            const newSocket = setupWebSocket(handleIncomingMessage);
            setSocket(newSocket);
            return () => {
                if (newSocket.readyState === WebSocket.OPEN) {
                    newSocket.close();
                }
            };
        }
    }, [isLoggedIn]);
    

      useEffect(() => {
        if(!isLoggedIn){
            document.body.classList.add('no-scroll')
        }else{
            document.body.classList.remove('no-scroll')
        }
      },[isLoggedIn]);

    //checks sessions
    const checkSession = async () => {
         try {
             const response = await fetch('http://localhost:8081/session', {
                method: 'POST',
                credentials:'include',
                headers: {'Content-Type':'application/json'},
             });


             if (response.ok) {
                 const data = await response.json();
                 if (data.isLoggedIn) {
                     setIsLoggedIn(true); 
                     setUserData(data)
                     setUsername(data.Username)
                 } else {
                     console.error('Session invalid or not found')
                 }
             }
         } catch (error) {
             console.error('Error checking session:', error);
         }
     };
    const handleLogin = async (userDataFromLogin) => {
        await checkSession()
        setIsLoggedIn(true);
        setUserData(userDataFromLogin)
        setUsername(userDataFromLogin.Username)
        localStorage.setItem('isLoggedIn', 'true');
    };

    const handleLogout = () => {
        setIsLoggedIn(false)
        setUsername(null)
        localStorage.removeItem('isLoggedIn')
    }
    const handleToggle = () => {
        setShowLogin((prev) => !prev);
    };

    return (
        <div className='appMain'>
            {!isLoggedIn ? (
                <div className='loginContainerinApp'>
                    {showLogin ? (
                        <Login onLogin={handleLogin} checkSession={checkSession} />
                    ) : (
                        <Register onRegister={() => setIsRegistered(true)} />
                    )}
                    <ToggleButton showLogin={showLogin} onToggle={handleToggle} /> 
                </div>
            ) : (
                <Mainpage  onLogout={handleLogout} currentUsername={username} userData={userData} websocket={socket}/>
            )}
            {isLoggedIn}
        </div>
    );
};

export default App