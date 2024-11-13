import React, { useState } from 'react';

const Register = () => {
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
            }catch(error) {
                console.error ('Error submitting form:', error)
            }
    };



    return (
        <div className='registrationPage'>
            <h2 className='h2register'>Register</h2>
            <form className='registrationForm' onSubmit={handleSubmit}>
                <div className='userNameDiv'>
                <label className='usernameLabel'>
                    Username:
                    <input 
                        className='usernameInput'
                        type='text'
                        name='username'
                        value={formData.username}
                        onChange={handleChange}
                        required
                        />
                </label>
                </div>
                <div className='passwordDiv'>
                <label className='passLabel'>
                    Password:
                    <input 
                        className='passwordInput'
                        type='password'
                        name='password'
                        value={formData.password}
                        onChange={handleChange}
                        required
                        />
                </label>
                </div>
                <div className='firstnameDiv'>
                <label className='firstNameLabel'>
                    First name:
                    <input 
                        className='firstNameInput'
                        type='text'
                        name='firstName'
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        />
                </label>
                </div>
                <div className='lastNameDiv'>
                <label className='lastNameLabel'>
                    Last name:
                    <input 
                        className='lastNameInput'
                        type='text'
                        name='lastName'
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        />
                </label>
                </div>
                <div className='emailDiv'>
                <label className='emailLabel'>
                    Email:
                    <input 
                        className='emailInput'
                        type='email'
                        name='email'
                        value={formData.email}
                        onChange={handleChange}
                        required
                        />
                </label>
                </div>
                <div className='dateDiv'>
                <label className='dateLabel'>
                    Date of birth:
                    <input 
                        className='dateInput'
                        type='date'
                        name='dateofBirth'
                        value={formData.dateofBirth}
                        onChange={handleChange}
                        required
                        />
                </label>
                </div>
                <div className='aboutMeDiv'>
                <label className='aboutMeLabel'>
                    About Me:
                    <textarea 
                        className='aboutMeInput'
                        name='aboutMe'
                        value={formData.aboutMe}
                        onChange={handleChange}
                        />
                </label>
                </div>
                <div className='nicknameDiv'>
                <label className='nicknameLabel'>
                    Nickname:
                    <textarea 
                        className='nicknameInput'
                        name='nickname'
                        value={formData.nickname}
                        onChange={handleChange}
                        />
                </label>
                </div>
                <div className='avatarDiv'>
                <label className='AvatarLabel'>
                    Avatar:
                    <input 
                        className='AvatarInput'
                        type='file'
                        name='avatar'
                        accept='image/*'
                        onChange={handleChange}
                        />
                </label>
                </div>
                <div className='registerButtonDiv'>
                <button className='registerButton' type='submit'>Register</button>
                </div>
            </form>
        </div>
    );
};

export default Register