import { useState, useEffect } from "react"
import FollowButton from "../components/followButton.jsx";
import setupWebSocket from "../components/websocket";
import FollowersAndFollows from "../components/followersAndFollows";
import MyPosts from "../components/myposts.jsx";

const MyPage = ({userData, currentUsername, onFollow, onUnfollow }) => {
const [isPrivate, setIsPrivate] = useState(userData.isPrivate || false);
const [isFollowingPrivateUser, setIsFollowingPrivateUser] = useState(false);
const [refreshData, setRefreshData] = useState(false);

useEffect(() => {
  const socket = setupWebSocket((message) => {
      if (message.Type === "acceptFollowRequest" && message.To === currentUsername) {
          setIsFollowingPrivateUser(true);
          setRefreshData(true);
      }
  });

  // Cleanup function to close the WebSocket connection when the component unmounts
  return () => {
      if (socket) socket.close();
  };
}, [currentUsername]);







  useEffect(() => {

    if (userData && typeof userData.IsPrivate !== "undefined") {
        setIsPrivate(userData.IsPrivate);
    } else {
        setIsPrivate(false); // Default to false if isPrivate is not available
    }
}, [userData]);


  const handleToggleChange = async () => {
    const newPrivacy = !isPrivate;
    setIsPrivate(newPrivacy);
    
    try {
      const response = await fetch("http://localhost:8081/toggleuserprivacy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: userData.Username,
          isPrivate: newPrivacy
        })
      });
  
      if (!response.ok) {
        throw new Error("Failed to update privacy");
      }

      const responseData = await response.json();
      setIsPrivate(responseData.isPrivate); // Kasuta vastust backendist
      
    } catch (error) {
      console.error("Error updating privacy:", error);
    }
  };
  
  const isCurrentUser = userData.Username === currentUsername;

  useEffect(() => {
    // Fetch the follow status for the current user and the profile user
    const fetchFollowStatus = async () => {
      try {
        const response = await fetch("http://localhost:8081/checkfollowstatus", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fromUsername: currentUsername,
            toUsername: userData.Username,
          }),
        });
        const data = await response.json();
        setIsFollowingPrivateUser(data.isFollowing);
      } catch (error) {
        console.error("Error fetching follow status:", error);
      }
    };
  
    fetchFollowStatus();
  }, [currentUsername, userData.Username]);

  useEffect(() => {
    if (refreshData) {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`http://localhost:8081/getuserdata`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        username: userData.Username,
                    }),
                });
                const updatedUserData = await response.json();
                setIsPrivate(updatedUserData.isPrivate);
            } catch (error) {
                console.error("Error refreshing user data:", error);
            } finally {
                setRefreshData(false); // Reset refreshData to avoid looping
            }
        };

        fetchUserData();
    }
}, [refreshData, userData.Username]);
  
  return (
     <div className="mypage">
      <div className="toggle-container">
        {isPrivate && !isCurrentUser && !isFollowingPrivateUser ? (
          <>
            <p>Username: {userData.Username}</p>
            <img
              src={`http://localhost:8081/utils/avatar/${userData.Avatar}`}
              alt="User avatar"
            />
          </>
        ) : (
          <>
            <p>My name: {userData.Username}</p>
            <p>FirstName: {userData.Firstname}</p>
            <p>LastName: {userData.Lastname}</p>
            <p>NickName: {userData.Nickname}</p>
            <p>About Me: {userData.AboutMe}</p>
            <p>DateOfBirth: {userData.DateOfBirth}</p>
            <p>Email: {userData.Email}</p>
      <FollowersAndFollows />
      <MyPosts selectedUsername={userData.Username}/>

           
            <img
              src={`http://localhost:8081/utils/avatar/${userData.Avatar}`}
              alt="User avatar"
            />
          </>
        )}

        {isCurrentUser && (
          <div>
            <label className="switch">
              <input
                type="checkbox"
                onChange={handleToggleChange}
                checked={isPrivate}
              />
              <span className="slider round"></span>
            </label>
            <span className="toggle-label">
              {isPrivate ? "Private Mode" : "Public Mode"}
            </span>
          </div>
        )}
         {isCurrentUser ? (
          <p>You cannot follow yourself</p>
        ) :  (
          <FollowButton
            user={userData}
            currentUser={currentUsername}
            isInitiallyFollowing={isFollowingPrivateUser}
            onFollow={onFollow}
            onUnfollow={onUnfollow}
          />
        )}
      </div>
    </div>
  );
};
export default MyPage
