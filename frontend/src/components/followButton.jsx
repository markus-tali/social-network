import React, { useState, useEffect } from 'react';


const FollowButton = ({ user, currentUser, isInitiallyFollowing,  onFollow, onUnfollow, websocket }) => {
    const isPrivate = user.IsPrivate;

    const [isFollowing, setIsFollowing] = useState(isInitiallyFollowing);

    useEffect(() => {
        setIsFollowing(isInitiallyFollowing);
    }, [isInitiallyFollowing]);


    const handleFollowClick = async () => {
        if (isFollowing) {
            await onUnfollow(currentUser, user.Username);
            setIsFollowing(false)
        } else {
            await onFollow(currentUser, user.Username);
            setIsFollowing(true)
            if (isPrivate) {
                const followRequestMessage = {
                    From: currentUser,
                    Type: "followRequest",
                    To: user.Username,
                    Date: new Date().toLocaleString(),
                };

                if (websocket && websocket.readyState === WebSocket.OPEN) {
                    websocket.send(JSON.stringify(followRequestMessage));
                }
            }
        }
    };

    return (
        <button onClick={ handleFollowClick}>
            {isFollowing ? "Unfollow" : `Follow ${isPrivate ? "(Request)" : ""}`}
        </button>
    );
};

export default FollowButton