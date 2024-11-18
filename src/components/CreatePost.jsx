import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function CreatePost({ userId }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [flag, setFlag] = useState('');
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    let uploadedImageUrl = imageUrl;

    if (image) {
      const file = image;
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      let { error: uploadError } = await supabase.storage
        .from('post-images')
        .upload(filePath, file);

      if (uploadError) {
        alert('Error uploading image');
        return;
      }

      const { data } = supabase.storage.from('post-images').getPublicUrl(filePath);
      uploadedImageUrl = data.publicUrl;
    }

    const { data, error } = await supabase
      .from('posts')
      .insert([
        {
          title,
          content,
          image_url: uploadedImageUrl,
          video_url: videoUrl,
          user_id: userId,
          secret_key: secretKey,
          flag
        }
      ]);

    if (error) {
      console.error('Error creating post:', error);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="card">
      <h1 className="card-title">Create a New Post</h1>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="4"
            className="input"
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="image">Upload Image</label>
          <input
            id="image"
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            accept="image/*"
            className="input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="imageUrl">Image URL (Optional)</label>
          <input
            id="imageUrl"
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="videoUrl">Video URL (Optional)</label>
          <input
            id="videoUrl"
            type="url"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            className="input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="secretKey">Secret Key (for editing/deleting)</label>
          <input
            id="secretKey"
            type="password"
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
            required
            className="input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="flag">Flag</label>
          <select
            id="flag"
            value={flag}
            onChange={(e) => setFlag(e.target.value)}
            className="input"
          >
            <option value="">Select a flag</option>
            <option value="Question">Question</option>
            <option value="Discussion">Discussion</option>
            <option value="Announcement">Announcement</option>
          </select>
        </div>
        <button type="submit" className="button">
          Create Post
        </button>
      </form>
    </div>
  );
}

export default CreatePost;