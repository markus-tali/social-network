import React, {useState} from 'react';
import handleLogout from './handeLogout.jsx'
import MyPage from '../pages/mypage.jsx';

const Header =  ({onLogout, isCreatingPost, toggleCreatePost, toggleMyPage, isMyPageVisible}) => {
    const handleLogoutClick = () => {
        handleLogout(onLogout);
    };

  
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
                    <button className='headerButton' onClick={toggleCreatePost} > 
                        {isCreatingPost ? 'Close post' : 'Create Post'}
                        </button>
                </li>
                <li className='headerlist'>
                    <button className='headerButton' onClick={handleLogoutClick}>Log out</button>
                </li>

            </ul>
        </nav>
    
    </header>

)}
export default Header