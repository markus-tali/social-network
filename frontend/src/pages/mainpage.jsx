import React, {useState} from 'react';
import { CreatePost } from './createpost.jsx'
import Header from '../components/header.jsx';
import Footer from "../components/Footer";
import handleLogout from '../components/handeLogout'

export function Mainpage({onLogout} ) {
    const [isCreatingPost, setIsCreatingPost] = useState(false)

    const handlePostCreated = () => {
        setIsCreatingPost(false)
    }

    return (
        <div className="mainpage">
          <Header onLogout={onLogout}/>
            <main className='content'>
                {!isCreatingPost ? (
                    <p>Main content area</p>
                ) : (
                    <CreatePost onPostCreated={handlePostCreated} />
                )}
            </main>
            <Footer />
        </div>
    );
}
