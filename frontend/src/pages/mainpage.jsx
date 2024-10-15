import React, {useState} from 'react';
import Header from '../components/header.jsx';
import Footer from "../components/footer.jsx";
import PostCreation from '../components/content.jsx';
import Postlist from '../components/postlist.jsx';
import RightSidenav from '../components/rightsidenav.jsx';

 function Mainpage({onLogout, currentUsername} ) {
    const [isCreatingPost, setIsCreatingPost] = useState(false)
    const [shouldRefreshPosts, setShouldRefreshPosts] = useState(false)


    const handlePostCreated = () => {
        console.log("Refreshing posts...")
        setIsCreatingPost(false)
        setShouldRefreshPosts(prev => !prev);
    }

    return (
        <div className="mainpage">
          <Header onLogout={onLogout} setIsCreatingPost={setIsCreatingPost}/>
          <PostCreation
        isCreatingPost={isCreatingPost}
        handlePostCreated={handlePostCreated}
        fetchPosts={handlePostCreated}
            />
            <Postlist refreshTrigger={shouldRefreshPosts}/>

            <div className="right-sidebar" style={{ flex: 1 }}>
                    <RightSidenav fromUsername={currentUsername}/>
                </div>

            <Footer />
        </div>
    );
}
export default Mainpage