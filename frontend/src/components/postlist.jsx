import React, { useState, useEffect } from 'react';
import CreateComment from './createComment';

function Postlist({refreshTrigger}) {
    const [posts, setPosts] = useState([]);

    // Fetch posts when the component loads
    useEffect(() => {
        fetchPosts();
    }, [refreshTrigger]);

    // Fetch posts from the backend

   const fetchPosts = async () => {
        try {
            const response = await fetch('http://localhost:8081/getposts'); // Assuming you have an API endpoint for posts
            const data = await response.json();
            console.log(data)
            setPosts(data); 
            console.log(data)

        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    };

    const handleCommentSubmit = async (content, postId) => {
        console.log("IN COMMENT", content)
        let form = new FormData
        form.append('content', content)
        form.append('postId', postId)
        try {
            const response = await fetch(`http://localhost:8081/createcomment`, {
                method: 'POST',
                credentials:'include',
                body: form
            });
            if (response.ok) {
                console.log('Comment submitted:', content);
                fetchPosts()
            } else {
                console.error('Failed to submit comment');
            }
        } catch (error) {
            console.error('Error submitting comment:', error);
        }
    }


    return (
        <div className="posts">
            <h2>Posts</h2>
            {posts.length > 0 ? (
                <ul>
                    {posts.map((post) => (
                        <li key={post.ID  ? post.ID : 99}>
                            
                            <h3>{post.Title}</h3>
                            <p>{post.Content}</p>
                            {post.Avatar.length > 0 && <img src={`http://localhost:8081/utils/avatar/${post.Avatar}`} alt="picture" />}
                            <p>{post.Username}</p>


                             <CreateComment onCommentSubmit={(comment) => handleCommentSubmit(comment, post.ID)} />

                        </li>
                    ))}
                </ul>
            ) : (
                <p>No posts to display</p>
            )}
        </div>
    );
}

export default Postlist;
