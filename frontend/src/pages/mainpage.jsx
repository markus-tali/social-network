import React, {useState} from 'react';
import Header from '../components/header.jsx';
import Footer from "../components/footer.jsx";
import PostCreation from '../components/content.jsx';
import Postlist from '../components/postlist.jsx';
import RightSidenav from '../components/rightsidenav.jsx';

 function Mainpage({onLogout} ) {
    const [isCreatingPost, setIsCreatingPost] = useState(false)
    const [shouldRefreshPosts, setShouldRefreshPosts] = useState(false)


    const handlePostCreated = () => {
        setIsCreatingPost(false)
        setShouldRefreshPosts(!shouldRefreshPosts);
    }

    return (
        <div className="mainpage">
          <Header onLogout={onLogout} setIsCreatingPost={setIsCreatingPost}/>
          <PostCreation
        isCreatingPost={isCreatingPost}
        handlePostCreated={handlePostCreated}
            />
            <Postlist refreshTrigger={shouldRefreshPosts}/>

            <div className="right-sidebar" style={{ flex: 1 }}>
                    <RightSidenav />
                </div>

            <Footer />
        </div>
    );
}
export default Mainpage