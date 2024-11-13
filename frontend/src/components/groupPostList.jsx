import React, {useState, useEffect} from 'react'
import CreateComment from './createComment';

const GroupPostList = ({group, refreshTrigger}) => {
    const [posts, setPosts] = useState([]);
    const [comments, setComments] = useState([])

    console.log("These are the comments: ", comments)
    console.log("this is group", group.id)

     // Fetch posts when the component loads
     useEffect(() => {
        fetchGroupPosts()
        fetchComments()
    }, [refreshTrigger, group.id]);

    const fetchGroupPosts = async () => {
        try {
                    const groupID = parseInt(group.id, 10)
                    if (isNaN(groupID)) {
                        console.error('Invalid group ID:', group.id);
                        return;
                    }
                    console.log("this is now groupid ,pls work:" , groupID)
                    const response = await fetch(`http://localhost:8081/getgroupposts`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include',
                        body: JSON.stringify({ group_id: groupID }),
                    });
                    const data = await response.json();

                    setPosts(data.posts || []);
                } catch (error) {
                    console.log('Error fetching group posts:', error);
                }
            };
        
            useEffect(() => {
                fetchGroupPosts();
            }, [group.id]);
     const fetchComments = async () => {
        try {
            const response = await fetch('http://localhost:8081/getcomments', {
                method: 'GET',
                credentials: 'include',
            });
            const commentData = await response.json();
            setComments(commentData || []);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };
        

    const handleCommentSubmit = async (content, postId, avatar) => {
        let form = new FormData
        form.append('content', content)
        form.append('postId', postId)
        form.append('avatar', avatar)
    
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

      console.log("THese are the posts: ", posts )  
  return (
    <div>
         <h2>Group posts</h2>
         <ul>
                {posts.map((post, index) => (
                    <li key={index}>
                        <h3>{post.title}</h3>
                        <p>{post.content}</p>

                        {post.avatar && post.avatar.length > 0 && ( <img className='postsAvatarImg' src={`http://localhost:8081/utils/avatar/${post.avatar}`} alt="picture" />)}
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
                            <CreateComment  onCommentSubmit={(comment,avatar) => handleCommentSubmit(comment, post.id, avatar)}   fetchComments={fetchComments}/>
                            </ul>
                    </li>
                ))}
            </ul>
      
    </div>
  )
}

export default GroupPostList
