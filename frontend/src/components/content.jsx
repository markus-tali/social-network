import React from 'react';
import Postlist from './postlist.jsx';
import CreatePost from '../pages/createpost.jsx';

function PostCreation ({ isCreatingPost, handlePostCreated}){
  return(
<main className='content'>
{!isCreatingPost ? (
    <p>Main content area</p>
) : (
  <CreatePost
  onPostCreated={() => {
    handlePostCreated(); // Call parent method after post creation
  }}
/>
)}
</main>
  )
}

export default PostCreation