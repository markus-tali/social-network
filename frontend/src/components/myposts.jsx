import React, { useState, useEffect } from 'react'

const MyPosts = ({selectedUsername}) => {
    const [myPost, setMypost] = useState([])

    const getMyPosts = async () => {
        try {
            const response = await fetch('http://localhost:8081/getmyposts', {
                method: 'POST',
                credentials: 'include', 
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({username: selectedUsername})
            });
            if (!response.ok) throw new Error("Failed to fetch posts");
            const data = await response.json();
            setMypost(data.posts || []);
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    };

    useEffect(() => {
        getMyPosts();
    }, []);

  return (
    <div>
           <h3>My Posts</h3>
            <div id="posts-list">
                {myPost.length > 0 ? (
                    myPost.map((post, index) => (
                        <div key={index} className="post">
                            <h1>Creator: {post.username}</h1>
                            <h4>Title:{post.title}</h4> {/* Assuming each post has a title */}
                            <p>{post.content}</p> {/* Assuming each post has content */}
                                        <img
                                        src={`http://localhost:8081/utils/avatar/${post.avatar}`}
                                        alt="comment picture"
                                        />
                        </div>
                    ))
                ) : (
                    <p>No posts available.</p>
                )}
            </div>
      
    </div>
  )
}

export default MyPosts
