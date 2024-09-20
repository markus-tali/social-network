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
        avatar: '',
    });

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'file' ? files[0] : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Form submitted:", formData);

        const formDataToSend = new FormData();
        for (const key in formData) {
            if (formData[key] !== null){
                formDataToSend.append(key, formData[key])
            }
        }
            try {
                const response = await fetch("http://localhost:8081/register", {
                method: 'POST',
                body: formDataToSend
                });

                if(!response.ok) {
                    const errorMessage = await response.text();  // Get the error message
                    throw new Error(`Network response was not ok: ${errorMessage}`);
                }
                const result = await response.text();
                console.log('Form submitted successfully:', result)
            }catch(error) {
                console.error ('Error submitting form:', error)
            }
    };



    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
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
