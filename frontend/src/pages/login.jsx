import React, { useState } from 'react';
import  setupWebSocket  from "../components/websocket.jsx";

const Login = ({onLogin, checkSession}) => {
    const [loginData, setLoginData] = useState({
        usernameOrEmail: '',
        password: '',
    })
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginData({
            ...loginData,
            [name]: value,
        });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:8081/login", {
                method: 'POST',
                credentials:'include',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify(loginData)
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Network response was not ok');
            }
            const userData = await response.json()
            onLogin(userData);
            await checkSession()
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };
    return (
        <div className='loginMain'>
            <h1 className='loginH1'>SOCIAL NETWORK</h1>

            <form className='loginForm' onSubmit={handleSubmit}>
            <h2 className='loginH2'>Login</h2>
                <label className='emailLabel'>
                Username or Email:
                    <input
                    className='userInput'
                    type='text'
                    name='usernameOrEmail'
                    value={loginData.usernameOrEmail}
                    onChange={handleChange}
                    required
                    />
                </label>
                <label className='passLabel'>
                Password:
                    <input
                    className='passInput'
                    type='password'
                    name='password'
                    value={loginData.password}
                    onChange={handleChange}
                    required
                    />
                </label>
                <button className='loginButton' type='submit'>Login</button>
            </form>
        </div>
    );
}
export default Login