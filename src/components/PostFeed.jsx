import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';

function PostCard({ post, onUpvote }) {
  return (
    <div className="card">
      <Link to={`/post/${post.id}`}>
        <h2 className="text-xl font-semibold mb-2 hover:text-emerald-500">{post.title}</h2>
      </Link>
      <p className="text-gray-600 dark:text-gray-300 mb-4">{post.content.substring(0, 150)}...</p>
      {post.image_url && (
        <img src={post.image_url} alt="Post" className="w-full h-48 object-cover rounded-md mb-4" />
      )}
      <div className="flex items-center justify-between mt-4 text-sm">
        <button 
          onClick={() => onUpvote(post.id)} 
          className="button-secondary"
        >
          {post.upvotes} upvotes
        </button>
        <span className="text-gray-500 dark:text-gray-400">{new Date(post.created_at).toLocaleDateString()}</span>
      </div>
    </div>
  );
}

function PostFeed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchPosts();
  }, [sortBy]);

  async function fetchPosts() {
    setLoading(true);
    let query = supabase.from('posts').select('*');

    if (sortBy === 'popular') {
      query = query.order('upvotes', { ascending: false });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    const { data, error } = await query;
    if (error) console.error('Error fetching posts:', error);
    else setPosts(data || []);
    setLoading(false);
  }

  const handleUpvote = async (postId) => {
    const { data, error } = await supabase
      .from('posts')
      .update({ upvotes: posts.find(p => p.id === postId).upvotes + 1 })
      .eq('id', postId);

    if (!error) {
      setPosts(posts.map(post =>
        post.id === postId ? { ...post, upvotes: post.upvotes + 1 } : post
      ));
    }
  };

  return (
    <div>
      <div className="mb-6 flex space-x-4">
        <button
          onClick={() => setSortBy('newest')}
          className={sortBy === 'newest' ? 'button' : 'button-secondary'}
        >
          Newest
        </button>
        <button
          onClick={() => setSortBy('popular')}
          className={sortBy === 'popular' ? 'button' : 'button-secondary'}
        >
          Most Popular
        </button>
      </div>

      {loading ? (
        <p>Loading posts...</p>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} onUpvote={handleUpvote} />
          ))}
        </div>
      )}
    </div>
  );
}

export default PostFeed;