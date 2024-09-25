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
            const response = await fetch('http://localhost:8081/getposts');
            const postsData = await response.json();
            
            const postsWithComments = await Promise.all(postsData.map(async (post) => {
                const comments = await fetchCommentsForPost(post.id);
                return { ...post, comments };
            }));
    
            setPosts(postsWithComments);
    
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    };


    const handleCommentSubmit = async (content, postId) => {
        console.log("IN COMMENT", content)
        console.log("IN COMMENT", postId)
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
                        <li key={post.id}>
                            
                            <h3>{post.title}</h3>
                            <p>{post.content}</p>

                            {post.avatar && post.avatar.length > 0 && ( <img src={`http://localhost:8081/utils/avatar/${post.Avatar}`} alt="picture" />)}

                            
                            <p>{post.Username}</p>


                             <CreateComment onCommentSubmit={(comment) => handleCommentSubmit(comment, post.id)} />

                             {post.comments && post.comments.length > 0 && (
                                <ul>
                                    {post.comments.map((comment) => (
                                        <li key={comment.id}>
                                            <p>{comment.username}: {comment.content}</p>
                                        </li>
                                    ))}
                                </ul>
                            )}
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
