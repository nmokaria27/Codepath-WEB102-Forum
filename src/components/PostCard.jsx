import React from 'react';
import { Link } from 'react-router-dom';

function PostCard({ post, userId }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="p-4">
        <Link to={`/post/${post.id}`}>
          <h2 className="text-xl font-semibold mb-2 hover:text-emerald-500">{post.title}</h2>
        </Link>
        <p className="text-gray-600 dark:text-gray-300 mb-4">{post.content.substring(0, 150)}...</p>
        {post.image_url && (
          <img src={post.image_url} alt="Post" className="w-full h-48 object-cover rounded-md mb-4" />
        )}
        {post.video_url && (
          <div className="aspect-w-16 aspect-h-9 mb-4">
            <iframe
              src={post.video_url}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
        )}
        <div className="flex items-center justify-between mt-4 text-sm">
          <span className="text-gray-500 dark:text-gray-400">Posted by: {post.user_id}</span>
          {post.flag && (
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800">
              {post.flag}
            </span>
          )}
          <span className="text-gray-500 dark:text-gray-400">{new Date(post.created_at).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
}

export default PostCard;