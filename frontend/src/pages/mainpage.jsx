import React, {useState} from 'react';
import Header from '../components/header.jsx';
import Footer from "../components/footer.jsx";
import Content from '../components/content.jsx';

 function Mainpage({onLogout} ) {
    const [isCreatingPost, setIsCreatingPost] = useState(false)


    const handlePostCreated = () => {
        setIsCreatingPost(false)
    }

    return (
        <div className="mainpage">
          <Header onLogout={onLogout} setIsCreatingPost={setIsCreatingPost}/>
          <Content
        isCreatingPost={isCreatingPost}
        handlePostCreated={handlePostCreated}
            />
            <Footer />
        </div>
    );
}
export default Mainpage