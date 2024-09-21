import React from 'react';
import CreatePost from '../pages/createpost.jsx';

function Content ({ isCreatingPost, handlePostCreated}){
  return(
<main className='content'>
{!isCreatingPost ? (
    <p>Main content area</p>
) : (
    <CreatePost onPostCreated={handlePostCreated} />
)}
</main>
  )
}

export default Content