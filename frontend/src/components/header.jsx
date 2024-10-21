import React, {useState} from 'react';
import handleLogout from './handeLogout.jsx'
import MyPage from '../pages/mypage.jsx';

const Header =  ({onLogout, setIsCreatingPost, toggleMyPage, isMyPageVisible}) => {
    const handleLogoutClick = () => {
        handleLogout(onLogout);
    };

    const handleCreatePostClick = () => {
        setIsCreatingPost(true)
    }


    return(


    <header className='headerformain'>
        <nav className='headernav'>
            <ul className='headerul'>
                <li className='headerlist'><a href="#home">Home</a></li>
                <li className='headerlist'><a href="#about">About</a></li>
                <li className='headerlist'>
                    <button className='headerButton' onClick={toggleMyPage}>
                        {isMyPageVisible ? 'Back' : 'MyPage'}
                    </button>
                </li>
                <li className='headerlist'>
                    <button className='headerButton' onClick={handleCreatePostClick}> Create Post</button>
                </li>
                <li className='headerlist'>
                    <button className='headerButton' onClick={handleLogoutClick}>Log out</button>
                </li>

            </ul>
        </nav>
    {isMyPageVisible && (
        <MyPage />
    )}
    </header>

)}
export default Header