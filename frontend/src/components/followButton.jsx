import React, { useState, useEffect } from 'react';


const FollowButton = ({ user, currentUser,  onFollow, onUnfollow }) => {
    console.log("currentuser in isfollwing:", currentUser, user)
    const isInitiallyFollowing = user.FollowedBy.includes(currentUser);
    const isPrivate = user.IsPrivate;

    const [isFollowing, setIsFollowing] = useState(isInitiallyFollowing);

    useEffect(() => {
        setIsFollowing(isInitiallyFollowing);
    }, [isInitiallyFollowing]);

    console.log("isfollowing", isFollowing)

    const handleFollowClick = async () => {
        if (isFollowing) {
            await onUnfollow(currentUser, user.Username);
            setIsFollowing(false)
        } else {
            await onFollow(currentUser, user.Username);
            setIsFollowing(true)
        }
    };

    return (
        <button onClick={handleFollowClick}>
            {isFollowing ? "Unfollow" : `Follow ${isPrivate ? "(Request)" : ""}`}
        </button>
    );
};

export default FollowButton