import React, {useState, useEffect} from 'react'

const FollowersAndFollows = () => {
    const [followers, setFollowers] = useState([]);
    const[follows, setFollows] = useState([]);

    const getFollowers = async () => {
        try {
            const response = await fetch('http://localhost:8081/getfollowers', {
                method: 'GET',
                credentials: 'include', 
                headers: {
                'Content-Type': 'application/json'
                },
            });
            if (!response.ok) throw new Error("Failed to fetch followers");
            const data = await response.json();
            const uniqueFollowers = [...new Set(data.followers.map(f => f.follower_username))];
            setFollowers(uniqueFollowers);
        } catch (error) {
            console.error("Error fetching followers:", error);
        }
    };
    
    const getFollows = async () => {
        try {
            const response = await fetch('http://localhost:8081/getfollows', {
                method: 'GET',
                credentials: 'include',
                headers: {
                'Content-Type': 'application/json'
                },
            });
            if (!response.ok) throw new Error("Failed to fetch follows");
            const data = await response.json();
            const uniqueFollows = [...new Set(data.follows.map(f => f.followed_username))];
            setFollows(uniqueFollows);
        } catch (error) {
            console.error("Error fetching follows:", error);
        }
    };

    useEffect(() => {
        getFollowers();
        getFollows();
    }, []);


  return (
    <div>
       <h3>Followers</h3>
            <div id="followers-list">
                {followers.map((follower, index) => (
                    <p key={index}>{follower}</p>
                ))}
            </div>

            <h3>Following</h3>
            <div id="follows-list">
                {follows.map((follow, index) => (
                    <p key={index}>{follow}</p>
                ))}
            </div>
    </div>
  )
}

export default FollowersAndFollows
