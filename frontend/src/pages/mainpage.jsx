import React from 'react';
import { handleLogout } from '../components/handeLogout';

export function Mainpage({onLogout }) {

    const handleLogoutClick = () => {
        handleLogout(onLogout);
    };

    return (
        <div className="mainpage">
            <header className='headerformain'>
                <nav>
                    <ul>
                        <li><a href="#home">Home</a></li>
                        <li><a href="#about">About</a></li>
                        <li><a href="#users">Users</a></li>
                        <li>
                        <button > Create Post</button>
                        </li>
                        <li>
                            <button onClick={handleLogoutClick}>Log out</button>
                        </li>
                    </ul>
                </nav>
            </header>
            <main className='content'>
                <p>Main content area</p>
            </main>
            <footer>
                <p>&copy; 2024. Trailer Park Bois</p>
            </footer>
        </div>
    );
}
