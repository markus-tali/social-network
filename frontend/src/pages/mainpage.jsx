import React, {useState} from 'react';
import Header from '../components/header.jsx';
import Footer from "../components/footer.jsx";
import PostCreation from '../components/content.jsx';
import Postlist from '../components/postlist.jsx';
import RightSidenav from '../components/rightsidenav.jsx';
import MyPage from "../pages/mypage.jsx";

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

    const goBack = () => {
        console.log("I am toggling away")
        setIsMyPageVisible(false); 
        console.log("I am toggling away")

    }

    return (
        <div className="mainpage">
          <Header onLogout={onLogout} setIsCreatingPost={setIsCreatingPost} toggleMyPage={toggleMyPage} goBack={goBack} isMyPageVisible={isMyPageVisible} />

            {!isMyPageVisible && (
                <div>
                    <PostCreation className='postCreation' isCreatingPost={isCreatingPost} handlePostCreated={handlePostCreated} fetchPosts={handlePostCreated}/>
                    <Postlist refreshTrigger={shouldRefreshPosts}/>
                    <div className="right-sidebar" >
                            <RightSidenav fromUsername={currentUsername}/>
                    </div>
                </div>
            )}

            {isMyPageVisible && <MyPage/>}

            <Footer />
        </div>
    );
}
export default Mainpage