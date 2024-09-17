import React, { useState } from 'react';

    export const Login = () => {
        const [formData, setFormData] = useState({
            usernameOrEmail: '',
            password: '',
        })
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Form submitted:", formData);

        try {
            const response = await fetch("http://localhost:8081/login", {
                method: 'POST',
                body:JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Network response was not ok');
            }

            const result = await response.text();
            console.log('Login successful:', formData);
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
                    value={formData.usernameOrEmail}
                    onChange={handleChange}
                    required
                    />
                </label>
                <label>
                Password:
                    <input
                    type='password'
                    name='password'
                    value={formData.password}
                    onChange={handleChange}
                    required
                    />
                </label>
                <button type='submit'>Login</button>
            </form>
        </div>
    );
}
