import React from 'react';
import CreatePost from '../components/CreatePost';

function CreatePostPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Create a New Post</h1>
      <CreatePost />
    </div>
  );
}

export default CreatePostPage;