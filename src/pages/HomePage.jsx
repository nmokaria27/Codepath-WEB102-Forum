import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import PostCard from '../components/PostCard';

function HomePage({ searchTerm, userId }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');
  const [flagFilter, setFlagFilter] = useState('all');

  useEffect(() => {
    fetchPosts();
  }, [searchTerm, sortBy, flagFilter]);

  async function fetchPosts() {
    setLoading(true);
    let query = supabase
      .from('posts')
      .select('*');

    if (searchTerm) {
      query = query.ilike('title', `%${searchTerm}%`);
    }

    if (flagFilter !== 'all') {
      query = query.eq('flag', flagFilter);
    }

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
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="input"
        >
          <option value="newest">Newest</option>
          <option value="popular">Most Popular</option>
        </select>
        <select
          value={flagFilter}
          onChange={(e) => setFlagFilter(e.target.value)}
          className="input"
        >
          <option value="all">All Flags</option>
          <option value="Question">Question</option>
          <option value="Discussion">Discussion</option>
          <option value="Announcement">Announcement</option>
        </select>
      </div>

      {loading ? (
        <div className="loading">Loading posts...</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} onUpvote={handleUpvote} userId={userId} />
          ))}
        </div>
      )}
    </div>
  );
}

export default HomePage;