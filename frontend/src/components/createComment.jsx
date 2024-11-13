import React, {useState, useRef } from 'react';

const CreateComment = ({onCommentSubmit, fetchComments}) => {

    const [comment, setComment] = useState('');
    const [avatar, setavatar] = useState(null);
    const fileInputRef = useRef(null);

    const handleAvatarChange = (e) => {
      const file = e.target.files[0]
      console.log("Handleavatar",file)
      setavatar(file);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if(comment.trim()){
            onCommentSubmit(comment, avatar)
            setComment('');
            setavatar(null)
            // Clear the file input field
      if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Reset the file input
      }
        }else{
            alert('Please enter comment')
        }
    }
  return (
    <div>
    <form className='commentForm' onSubmit={handleSubmit}>
      <textarea
      className='commentTextArea'
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write your comment..."
        rows="4"
        cols="50"
      />
      <br />
      <input
      className='commentFileInput'
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                ref={fileInputRef}
                />
      <button className='commentButton' type="submit">Submit Comment</button>
    </form>
    </div>
  )
}
export default CreateComment
