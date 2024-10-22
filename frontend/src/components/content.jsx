import React from 'react';
import CreatePost from '../pages/createpost.jsx';

function PostCreation({ isCreatingPost, handlePostCreated }) {
  return (
    <main className='content'>
      {isCreatingPost && (
        <CreatePost
          onPostCreated={() => {
            handlePostCreated();
          }}
        />
      )}
    </main>
  );
}

export default PostCreation;