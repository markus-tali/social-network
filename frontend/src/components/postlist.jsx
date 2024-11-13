import React, { useState, useEffect } from 'react';
import CreateComment from './createComment';

function Postlist({refreshTrigger}) {
    const [posts, setPosts] = useState([]);
    const [comments, setComments] = useState([])

    // Fetch posts when the component loads
    useEffect(() => {
        fetchPosts();
        fetchComments()
    }, [refreshTrigger]);

    // Fetch posts from the backend
    const fetchPosts = async () => {
        try {
            const response = await fetch('http://localhost:8081/getposts');
            if (!response.ok) throw new Error("Failed to fetch posts");
            const postsData = await response.json();
            setPosts(postsData)
           
    
    
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    };

    const fetchComments = async () => {
        try {
            const response = await fetch('http://localhost:8081/getcomments',{
                method: 'GET',
                credentials: 'include'
            });
            const commentData = await response.json();
            commentData.forEach(comment => console.log("foreach", comment.id))
            setComments(commentData)

        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    };



    const handleCommentSubmit = async (content, postId, avatar) => {
        let form = new FormData
        form.append('content', content)
        form.append('postId', postId)
        form.append('avatar', avatar)
        if(avatar){
            form.append('avatar',  avatar)
        }

        try {
            const response = await fetch(`http://localhost:8081/createcomment`, {
                method: 'POST',
                credentials:'include',
                body: form
            });
            if (response.ok) {
                fetchComments()
            } else {
                console.error('Failed to submit comment');
            }
        } catch (error) {
            console.error('Error submitting comment:', error);
        }
    }


    return (
        <div className="posts">
            <h2 className='postsH2'>Posts</h2>
            {posts.length > 0 ? (
                <ul className='postsUl'>
                    {posts.map((post) => (
                        <li className='postsLi' key={post.id}>
                            
                            <h3 className='postsH3'>{post.title}</h3>
                            <p className='postsP'>{post.content}</p>

                            {post.avatar && post.avatar.length > 0 && ( <img className='postsAvatarImg' src={`http://localhost:8081/utils/avatar/${post.avatar}`} alt="picture" />)}


                            <p className='postsPostedBy'>Posted By: {post.username}</p>


                            <h3 className='commentSection'>Comments:</h3>
                            <ul className='commentSectionUl'>
                                {comments.map((comment) => (
                                comment.postId === post.id && (
                                <li className='commentBoxes' key={comment.id}>
                                    <p className='commentUsernames'>{comment.username} comment:</p>
                                    <p>{comment.content}</p>
                                    <p>{comment.createdAt}</p>
                                    {comment.avatar && comment.avatar.length > 0 && (
                                        <img
                                        className='commentPicture'
                                        src={`http://localhost:8081/utils/avatar/${comment.avatar}`}
                                        alt="comment picture"
                                        />
                                    )}
                                </li>
                                )
                            ))}
                            </ul>
                             <CreateComment onCommentSubmit={(comment,avatar) => handleCommentSubmit(comment, post.id, avatar)} fetchComments={fetchComments} />
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
