import React, {useState, useEffect} from 'react';
import Header from '../components/header.jsx';
import Footer from "../components/footer.jsx";
import Postlist from '../components/postlist.jsx';
import MyPage from "../pages/mypage.jsx";
import CreatePost from './createpost.jsx';
import GroupPage from "./grouppage.jsx";

 function Mainpage({onLogout, currentUsername, userData, websocket} ) {
    const [users, setUsers] = useState([]);

    const [isCreatingPost, setIsCreatingPost] = useState(false)
    const [shouldRefreshPosts, setShouldRefreshPosts] = useState(false)

    const [isMyPageVisible, setIsMyPageVisible] = useState(false); 
    const [isUserListVisible, setIsUserListVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const [isPrivate, setIsPrivate] = useState(userData.IsPrivate || false);

    const [isGroupPageVisible, setIsGroupPageVisible] = useState(false);

    

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:8081/getusers', {
                        method: 'GET',
                        credentials: 'include',
                    });
                    const data = await response.json();
                    if (data.users) {
                        setUsers(data.users);
                    } else {
                        console.log('No users found');
                    }
                } catch (error) {
                    console.log(error);
                }
            };
            useEffect(() => {
            fetchUsers();
        }, []); 
   
        

    const handlePostCreated = () => {
        setIsCreatingPost(false)
        setShouldRefreshPosts(prev => !prev);
    }

    const toggleUserList = () => {
        setIsUserListVisible(prevState => !prevState); // Kuvame kasutajate loendi
        setSelectedUser(null); // Tühjendame valitud kasutaja
        setIsMyPageVisible(false); // Lülitame profiili lehe välja
    };
    const toggleGroupPage = () => {
        setIsGroupPageVisible(prevState => !prevState);
        setIsUserListVisible(false);
        setIsMyPageVisible(false);
    };


    const handleUserClick = async (user) => {
        try {
            // Eeldame, et meil on URL `/getUserDetails` ja see aktsepteerib kasutaja ID-d.
            const response = await fetch(`http://localhost:8081/getselecteduser`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ username: user.username })
            });
            const userDetails = await response.json();
    
            if (userDetails) {
                setSelectedUser(userDetails); // Seame valitud kasutaja andmed
                setIsUserListVisible(false);   // Peidame kasutajate loendi
                setIsMyPageVisible(true);      // Kuvame profiili
            } else {
                console.log('User details not found');
            }
        } catch (error) {
            console.log("Error fetching user details:", error);
        }
    };
    
   const toggleCreatePost = () => {
        setIsCreatingPost(prevState => !prevState);
    };
    
    const handleFollow = async (currentUsername, username) => {
        try {
            const response = await fetch('http://localhost:8081/follow', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ follower: currentUsername, followed: username }),
            });
    
            if (response.ok) {
                console.log(`Successfully followed ${username}`);
            } else {
                console.error(`Failed to follow ${username}`);
            }
        } catch (error) {
            console.error("Error following user:", error);
        }
        console.log(`Following ${username}`);
    };

    const handleUnfollow = async (currentUsername, username) => {
        try {
            const response = await fetch('http://localhost:8081/unfollow', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Include cookies if needed
                body: JSON.stringify({ follower: currentUsername, followed: username }),
            });
    
            if (response.ok) {
                console.log(`Successfully unfollowed ${username}`);
            } else {
                console.error(`Failed to unfollow ${username}`);
            }
        } catch (error) {
            console.error("Error unfollowing user:", error);
        }
        console.log(`Unfollowing ${username}`);
    };

    return (
        <div className="mainpage">
            <Header 
                onLogout={onLogout} 
                isCreatingPost={isCreatingPost} 
                toggleCreatePost={toggleCreatePost} 
                toggleMyPage={toggleUserList}
                isMyPageVisible={isUserListVisible || isMyPageVisible || isGroupPageVisible} 
                currentUsername={currentUsername}
                toggleGroupPage={toggleGroupPage} 
                
            />
    
            <div className='chatBoxDiv'>
                {isGroupPageVisible ? (
                    <GroupPage userData = {userData} websocket={websocket}/> // Only show GroupPage if isGroupPageVisible is true
                ) : (
                    <>
                        {isUserListVisible && (
                            <div className="user-list">
                                <h2>Select a user to view their profile:</h2>
                                <ul className='user-listUl'>
                                    {users.map((user) => (
                                        <li  key={user.Id}>
                                            <button className='userProfileView' onClick={() => handleUserClick(user)}>
                                                {user.username}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
    
                        {isMyPageVisible && selectedUser && (
                            <MyPage 
                                userData={selectedUser} 
                                currentUsername={currentUsername} 
                                onFollow={handleFollow} 
                                onUnfollow={handleUnfollow}
                            /> 
                        )}
    
                        {!isMyPageVisible && !isUserListVisible && (
                            <div className='try'>
                                {isCreatingPost ? (
                                    <CreatePost onPostCreated={handlePostCreated} />
                                ) : (
                                    <Postlist refreshTrigger={shouldRefreshPosts} />
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>
    
        </div>
    );
    
}
export default Mainpage