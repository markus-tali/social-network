import React, {useState} from 'react';
import handleLogout from './handeLogout.jsx'
import MyPage from '../pages/mypage.jsx';
import RightSidenav from '../components/rightsidenav.jsx';


const Header =  ({onLogout, isCreatingPost, toggleCreatePost, toggleMyPage, isMyPageVisible, currentUsername, toggleGroupPage}) => {
    const [showButtons, setShowButtons] = useState(false);

    const handleLogoutClick = () => {
        handleLogout(onLogout);
    };

    const toggleButtons = () => {
        setShowButtons(!showButtons);  
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
                        {isMyPageVisible ? 'Back' : 'UserPage'}
                    </button>
                </li>

                <li className='headerlist'>
                    <button className='headerButton' onClick={toggleCreatePost} > 
                        {isCreatingPost ? 'Close post' : 'Create Post'}
                        </button>
                </li>

                <li className='headerlist'>
                                <button className='headerButton' onClick={toggleGroupPage}> 
                                    {isMyPageVisible ? ' Close Groups' : 'Create Groups'}
                                </button>
                            </li>

                <li className='headerlist'>
                    <button className='headerButton' onClick={handleLogoutClick}>Log out</button>
                </li>

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