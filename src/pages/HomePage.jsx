import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { ArrowBigUp } from 'lucide-react';

function HomePage({ searchTerm, userId }) {
  const [posts, setPosts] = useState([]);
  const [sortBy, setSortBy] = useState('newest');
  const [selectedFlag, setSelectedFlag] = useState('all');

  useEffect(() => {
    fetchPosts();
  }, [searchTerm, sortBy, selectedFlag]);

  async function fetchPosts() {
    let query = supabase
      .from('posts')
      .select('*');

    if (searchTerm) {
      query = query.ilike('title', `%${searchTerm}%`);
    }

    if (selectedFlag !== 'all') {
      query = query.eq('flag', selectedFlag);
    }

    let { data, error } = await query;

    if (error) {
      console.error('Error fetching posts:', error);
    } else {
      // Sort posts based on selected sorting option
      const sortedPosts = data.sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.created_at) - new Date(a.created_at);
        } else if (sortBy === 'most_upvotes') {
          return (b.upvotes || 0) - (a.upvotes || 0);
        }
        return 0;
      });
      setPosts(sortedPosts);
    }
  }

  const handleUpvote = async (postId) => {
    const { data, error } = await supabase
      .from('posts')
      .update({ upvotes: (posts.find(p => p.id === postId).upvotes || 0) + 1 })
      .eq('id', postId);

    if (!error) {
      fetchPosts();
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6 mt-4">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="input mr-4"
        >
          <option value="newest">Newest</option>
          <option value="most_upvotes">Most Upvotes</option>
        </select>
        <select
          value={selectedFlag}
          onChange={(e) => setSelectedFlag(e.target.value)}
          className="input"
        >
          <option value="all">All Flags</option>
          <option value="Question">Question</option>
          <option value="Discussion">Discussion</option>
          <option value="Announcement">Announcement</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div key={post.id} className="post-card">
            <Link to={`/post/${post.id}`} className="block">
              {post.image_url && (
                <img src={post.image_url} alt="" className="post-image" />
              )}
              <div className="p-4">
                <h2 className="post-title">{post.title}</h2>
                <p className="post-content">{post.content}</p>
                {post.flag && (
                  <span className={`flag flag-${post.flag.toLowerCase()}`}>
                    {post.flag}
                  </span>
                )}
                <div className="post-meta">
                  <div className="flex items-center">
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        handleUpvote(post.id);
                      }}
                      className="flex items-center text-emerald-600 hover:text-emerald-700 mr-2"
                    >
                      <ArrowBigUp className="h-5 w-5" />
                      <span>{post.upvotes || 0}</span>
                    </button>
                    <span>Posted by: {post.user_id}</span>
                  </div>
                  <span>{new Date(post.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;