import { useState, useEffect } from "react"
import FollowButton from "../components/followButton.jsx";

const MyPage = ({userData, currentUsername, onFollow, onUnfollow }) => {
const [isPrivate, setIsPrivate] = useState(userData.isPrivate || false);

console.log("1st isPrivate: ", isPrivate)

  console.log("before: ", userData)


  useEffect(() => {
    console.log("User data on load:", userData.IsPrivate); // Log the whole userData object

    if (userData && typeof userData.IsPrivate !== "undefined") {
        setIsPrivate(userData.IsPrivate);
    } else {
        setIsPrivate(false); // Default to false if isPrivate is not available
    }
}, [userData]);

  console.log("2nd isPrivate: ", isPrivate)

  const handleToggleChange = async () => {
    const newPrivacy = !isPrivate;
    setIsPrivate(newPrivacy);
    console.log("3rd isPrivate: ", newPrivacy)
    
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
      console.log("response is: ", responseData)
      setIsPrivate(responseData.isPrivate); // Kasuta vastust backendist
      
    } catch (error) {
      console.error("Error updating privacy:", error);
    }
  };
  
  const isCurrentUser = userData.Username === currentUsername;


  
  

  return (
     <div className="mypage">
      <div className="toggle-container">
        {isPrivate && !isCurrentUser ? (
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
            <p>Followers: {userData.FollowedBy}</p>
            <p>Following: {userData.IsFollowing}</p>
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
        ) : (
          <FollowButton
            user={userData}
            currentUser={currentUsername}
            onFollow={onFollow}
            onUnfollow={onUnfollow}
          />
        )}
      </div>
    </div>
  );
};
export default MyPage
