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
            const postsData = await response.json();
            console.log(postsData)
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
            console.log('I am here!')
            commentData.forEach(comment => console.log("foreach", comment.id))
            console.log("this is commentdata",commentData)
            setComments(commentData)
           
    
    
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    };



    const handleCommentSubmit = async (content, postId, avatar) => {
        console.log("IN COMMENT", content)
        console.log("IN COMMENT AVATAR:", avatar)
        let form = new FormData
        form.append('content', content)
        form.append('postId', postId)
        form.append('avatar', avatar)
        console.log("postid frrom postlist:", postId)
        console.log('THis is avatar', avatar)
        if(avatar){
            form.append('avatar',  avatar)
        }
        console.log("avatar:", avatar)

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

                            {post.avatar && post.avatar.length > 0 && ( <img src={`http://localhost:8081/utils/avatar/${post.avatar}`} alt="picture" />)}

                            
                            <p>{post.username}</p>
                            <ul>
  {comments.map((comment) => (
    comment.postId === post.id && (
      <li key={comment.id}>
        <p>{comment.username} comment:</p>
        <p>{comment.content}</p>
        <p>{comment.createdAt}</p>
        {comment.avatar && comment.avatar.length > 0 && (
          <img
            src={`http://localhost:8081/utils/avatar/${comment.avatar}`}
            alt="comment picture"
          />
        )}
      </li>
    )
  ))}
</ul>



                             <CreateComment onCommentSubmit={(comment,avatar) => handleCommentSubmit(comment,post.id, avatar)} />

                            
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
