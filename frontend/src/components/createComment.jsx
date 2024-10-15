import React, {useState, } from 'react';

const CreateComment = ({onCommentSubmit, fetchComments}) => {

    const [comment, setComment] = useState('');
    const [avatar, setavatar] = useState(null);
    

    const handleAvatarChange = (e) => {
      const file = e.target.files[0]
      console.log("Handleavatar",file)
      setavatar(file);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if(comment.trim()){
          console.log("Submitting avatar and comment:", comment, avatar)
            onCommentSubmit(comment, avatar)
            setComment('');
            setavatar(null)
        }else{
            alert('Please enter comment')
        }
    }
  return (
    <div>
    <form onSubmit={handleSubmit}>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write your comment..."
        rows="4"
        cols="50"
      />
      <br />
      <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                />
      <button type="submit">Submit Comment</button>
    </form>
    </div>
  )
}
export default CreateComment
