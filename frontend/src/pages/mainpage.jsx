import React, {useState} from 'react';
import { handleLogout } from '../components/handeLogout';
import { CreatePost } from './createpost.jsx'

export function Mainpage({onLogout }) {
    const [isCreatingPost, setIsCreatingPost] = useState(false)

    const handleLogoutClick = () => {
        handleLogout(onLogout);
    };

    const handleCreatePostClick = () => {
        setIsCreatingPost(true)
    }
    const handlePostCreated = () => {
        setIsCreatingPost(false)
    }

    return (
        <div className="mainpage">
            <header className='headerformain'>
                <nav>
                    <ul>
                        <li><a href="#home">Home</a></li>
                        <li><a href="#about">About</a></li>
                        <li><a href="#users">Users</a></li>
                        <li>
                        <button onClick={handleCreatePostClick}> Create Post</button>
                        </li>
                        <li>
                            <button onClick={handleLogoutClick}>Log out</button>
                        </li>
                    </ul>
                </nav>
            </header>
            <main className='content'>
                {!isCreatingPost ? (
                    <p>Main content area</p>
                ) : (
                    <CreatePost onPostCreated={handlePostCreated} />
                )}
            </main>

            <footer>
                <p>&copy; 2024. Trailer Park Bois</p>
            </footer>
        </div>
    );
}
