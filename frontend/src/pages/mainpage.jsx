import React, {useState} from 'react';
import Header from '../components/header.jsx';
import Footer from "../components/footer.jsx";
import PostCreation from '../components/content.jsx';
import Postlist from '../components/postlist.jsx';
import RightSidenav from '../components/rightsidenav.jsx';
import MyPage from "../pages/mypage.jsx";
import CreatePost from './createpost.jsx';

 function Mainpage({onLogout, currentUsername} ) {
    const [isCreatingPost, setIsCreatingPost] = useState(false)
    const [shouldRefreshPosts, setShouldRefreshPosts] = useState(false)
    const [isMyPageVisible, setIsMyPageVisible] = useState(false); 
    

    const handlePostCreated = () => {
        console.log("Refreshing posts...")
        setIsCreatingPost(false)
        setShouldRefreshPosts(prev => !prev);
    }

    const toggleMyPage = () => {
        console.log("I am toggling Mypage")
        setIsMyPageVisible(prevState => !prevState); 
    };

   const toggleCreatePost = () => {
        setIsCreatingPost(prevState => !prevState);
    };


    return (
        <div className="mainpage">
            <Header 
                onLogout={onLogout} 
                isCreatingPost={isCreatingPost} 
                toggleCreatePost={toggleCreatePost} 
                toggleMyPage={toggleMyPage} 
                isMyPageVisible={isMyPageVisible} 
            />

            {!isMyPageVisible && (
                <div>
                    {isCreatingPost && (
                        <CreatePost onPostCreated={handlePostCreated} />
                    )}
                    <Postlist refreshTrigger={shouldRefreshPosts} />
                    <div className="right-sidebar">
                        <RightSidenav fromUsername={currentUsername} />
                    </div>
                </div>
            )}

            {isMyPageVisible && <MyPage />}

            <Footer />
        </div>
    );
}

export default Mainpage