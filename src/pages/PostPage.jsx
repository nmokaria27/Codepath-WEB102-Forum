import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function PostPage({ userId }) {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedContent, setEditedContent] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [showSecretKeyDialog, setShowSecretKeyDialog] = useState(false);
  const [actionType, setActionType] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [id]);

  async function fetchPost() {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching post:', error);
    } else {
      setPost(data);
      setEditedTitle(data.title);
      setEditedContent(data.content);
    }
  }

  async function fetchComments() {
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('post_id', id)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching comments:', error);
    } else {
      setComments(data);
    }
  }

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from('comments')
      .insert([{ content: newComment, post_id: id, user_id: userId }]);

    if (error) {
      console.error('Error creating comment:', error);
    } else {
      setNewComment('');
      fetchComments();
    }
  };

  const handleEdit = async () => {
    if (post.secret_key === secretKey) {
      const { data, error } = await supabase
        .from('posts')
        .update({ title: editedTitle, content: editedContent })
        .eq('id', id);

      if (error) {
        console.error('Error updating post:', error);
      } else {
        setEditMode(false);
        fetchPost();
      }
    } else {
      alert('Incorrect secret key');
    }
    setShowSecretKeyDialog(false);
  };

  const handleDelete = async () => {
    if (post.secret_key === secretKey) {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting post:', error);
      } else {
        navigate('/');
      }
    } else {
      alert('Incorrect secret key');
    }
    setShowSecretKeyDialog(false);
  };

  const handleActionClick = (action) => {
    setActionType(action);
    setShowSecretKeyDialog(true);
  };

  const handleSecretKeySubmit = () => {
    if (actionType === 'edit') {
      handleEdit();
    } else if (actionType === 'delete') {
      handleDelete();
    }
  };

  if (!post) return <div className="loading">Loading</div>;

  return (
    <div className="container mx-auto px-4 py-8 main-content">
      <div className="card max-w-2xl mx-auto">
        {editMode ? (
          <div className="p-6 space-y-4">
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="input w-full"
            />
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              rows="4"
              className="input w-full"
            />
            <div className="flex space-x-2">
              <button onClick={() => handleActionClick('edit')} className="button">
                Save
              </button>
              <button onClick={() => setEditMode(false)} className="button-secondary">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{post.content}</p>
            {post.image_url && (
              <div className="mb-4">
                <img
                  src={post.image_url}
                  alt="Post"
                  className="post-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
            {post.video_url && (
              <div className="aspect-w-16 aspect-h-9 mb-4">
                <iframe
                  src={post.video_url}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full rounded-lg"
                />
              </div>
            )}
            <div className="post-meta">
              <span>Posted by: {post.user_id}</span>
              <span>{new Date(post.created_at).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button onClick={() => setEditMode(true)} className="button">
                Edit
              </button>
              <button onClick={() => handleActionClick('delete')} className="button-secondary">
                Delete
              </button>
            </div>
          </div>
        )}

        <div className="border-t border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Comments</h2>
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="card p-4">
                  <p className="mb-2">{comment.content}</p>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    By: {comment.user_id} on {new Date(comment.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
            <form onSubmit={handleCommentSubmit} className="mt-6">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="input w-full mb-4"
                rows="3"
              />
              <button type="submit" className="button">
                Post Comment
              </button>
            </form>
          </div>
        </div>
      </div>

      {showSecretKeyDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="card p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Enter Secret Key</h2>
            <input
              type="password"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              placeholder="Enter secret key"
              className="input w-full mb-4"
            />
            <div className="flex space-x-2">
              <button onClick={handleSecretKeySubmit} className="button">
                Submit
              </button>
              <button onClick={() => setShowSecretKeyDialog(false)} className="button-secondary">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PostPage;