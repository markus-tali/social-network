import React, { useState } from 'react';
import  setupWebSocket  from "../components/websocket.jsx";
const Login = ({onLogin}) => {
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
        console.log("Form submitted:", loginData);
        try {
            console.log(JSON.stringify(loginData))
            const response = await fetch("http://localhost:8081/login", {
                method: 'POST',
                credentials:'include',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify(loginData)
            });
            console.log(response)
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Network response was not ok');
            }
     
            setupWebSocket();
            onLogin();
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };
    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <label>
                Username or Email:
                    <input
                    type='text'
                    name='usernameOrEmail'
                    value={loginData.usernameOrEmail}
                    onChange={handleChange}
                    required
                    />
                </label>
                <label>
                Password:
                    <input
                    type='password'
                    name='password'
                    value={loginData.password}
                    onChange={handleChange}
                    required
                    />
                </label>
                <button type='submit'>Login</button>
            </form>
        </div>
    );
}
export default Login