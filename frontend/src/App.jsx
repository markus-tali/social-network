import React, { useState, useEffect } from 'react';
import  Register from "./pages/register.jsx";
import Login  from "./pages/login.jsx";
import  Mainpage  from "./pages/mainpage.jsx";
import  ToggleButton  from "./components/toggleButton.jsx"; 
import setupWebSocket from "./components/websocket.jsx";

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showLogin, setShowLogin] = useState(true);
    const[username, setUsername] = useState(null)
    const [messages, setMessages] = useState([])

    const handleIncomingMessage = (message) => {
        setMessages((prevMessages) => [...prevMessages, message.content])
    }

    useEffect(() => {
        console.log("checking seessoin")
        checkSession();
        console.log("sesoins chekes")
    },[])

    useEffect(() => {
        let socket
        if (isLoggedIn) {
          const socket = setupWebSocket(handleIncomingMessage);
        }
          return () => {
            if (socket && socket.readyState === WebSocket.OPEN) {
              socket.close();
            }
          };
        
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
                 method: 'GET',
                 credentials: 'include',  
             });


             if (response.ok) {
                 const data = await response.json();
                 if (data.isLoggedIn) {
                     setIsLoggedIn(true); 
                     setUsername(data.username)
                 } else {
                     console.error('Session invalid or not found')
                 }
             }
         } catch (error) {
             console.error('Error checking session:', error);
         }
     };
    const handleLogin = async () => {
        await checkSession()
        setIsLoggedIn(true);
        setUsername(username)
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
                <Mainpage  onLogout={handleLogout} currentUsername={username} />
            )}
            {isLoggedIn}
        </div>
    );
};

export default App