import React, {useState, } from 'react';

const CreateComment = ({onCommentSubmit}) => {

    const [comment, setComment] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if(comment.trim()){
            onCommentSubmit(comment)
            setComment('');
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
      <button type="submit">Submit Comment</button>
    </form>
    </div>
  )
}
export default CreateComment
