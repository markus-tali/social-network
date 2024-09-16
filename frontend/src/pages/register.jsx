import React, { useState } from 'react';

export  const Register = () => {
    const [formData, setFormData] = useState({
        dateofBirth: '',
        username: '',
        password: '',
        firstName: '',
        lastName: '',
        email: '',
        aboutMe: '',
        nickname: '',
        avatar: null,
    });

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'file' ? files[0] : value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form submitted:", formData);
    };

    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    First name:
                    <input 
                        type='text'
                        name='firstName'
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Last name:
                    <input 
                        type='text'
                        name='lastName'
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Username:
                    <input 
                        type='text'
                        name='username'
                        value={formData.username}
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
                <label>
                    Email:
                    <input 
                        type='email'
                        name='email'
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Date of birth:
                    <input 
                        type='date'
                        name='dateofBirth'
                        value={formData.dateofBirth}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    About Me:
                    <textarea 
                        name='aboutMe'
                        value={formData.aboutMe}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Nickname:
                    <textarea 
                        name='nickname'
                        value={formData.nickname}
                        onChange={handleChange}
                    />
                </label>
                <label>
                    Avatar:
                    <input 
                        type='file'
                        name='avatar'
                        onChange={handleChange}
                    />
                </label>
                <button type='submit'>Register</button>
            </form>
        </div>
    );
};

