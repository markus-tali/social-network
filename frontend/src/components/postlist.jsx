import React, { useState, useEffect } from 'react';
import createComment from './createComment';

function Postlist() {
    const [posts, setPosts] = useState([]);

    // Fetch posts when the component loads
    useEffect(() => {
        fetchPosts();
    }, []);

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

    const handleCommentSubmit = async (comment, postId) => {
        try {
            const response = await fetch(`http://localhost:8081/posts/${postId}/createcomment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ comment })
            });
            if (response.ok) {
                console.log('Comment submitted:', comment);
                // You can refresh the post's comments or update state here if necessary
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
                    {posts.map((post, index) => (
                        <li key={index}>
                            
                            <h3>{post.Title}</h3>
                            <p>{post.Content}</p>
                            {post.Avatar.length > 0 && <img src={`http://localhost:8081/utils/avatar/${post.Avatar}`} alt="picture" />}
                            <p>{post.Username}</p>

                            <createComment />

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
