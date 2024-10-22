import React, {useState} from 'react';
import handleLogout from './handeLogout.jsx'
import MyPage from '../pages/mypage.jsx';
import RightSidenav from '../components/rightsidenav.jsx';


const Header =  ({onLogout, isCreatingPost, toggleCreatePost, toggleMyPage, isMyPageVisible, currentUsername}) => {
    const [showButtons, setShowButtons] = useState(false);

    const handleLogoutClick = () => {
        handleLogout(onLogout);
    };

    const toggleButtons = () => {
        setShowButtons(!showButtons);  // Toggle the state when clicking the image button
    };

  
    return(


    <header className='headerformain'>
        <nav className='headernav'>
            <ul className='headerul'>

            <li className='headerlist'>
                        <button className='headerImageButton' onClick={toggleButtons}>
                            <img className='headerButtonImage' src='src/assets/headerButton.png' alt="Menu" />
                        </button>
            </li>

            {showButtons && (

                <div className='buttonShow'>

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
                <li className='headerlist'><a href="#home">Home</a></li>
                <li className='headerlist'><a href="#about">About</a></li>

                </div>
    )}
            </ul>
        </nav>
        <div className="right-sidebar">
                        <RightSidenav fromUsername={currentUsername} />
                    </div>
    
    </header>

)}
export default Header