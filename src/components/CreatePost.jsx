// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { supabase } from '../supabaseClient';

// function CreatePost({ userId }) {
//   const [title, setTitle] = useState('');
//   const [content, setContent] = useState('');
//   const [imageUrl, setImageUrl] = useState('');
//   const [videoUrl, setVideoUrl] = useState('');
//   const [secretKey, setSecretKey] = useState('');
//   const [flag, setFlag] = useState('');
//   const [image, setImage] = useState(null);
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     let uploadedImageUrl = imageUrl;

//     if (image) {
//       const file = image;
//       const fileExt = file.name.split('.').pop();
//       const fileName = `${Math.random()}.${fileExt}`;
//       const filePath = `${userId}/${fileName}`;

//       let { error: uploadError } = await supabase.storage
//         .from('post-images')
//         .upload(filePath, file);

//       if (uploadError) {
//         alert('Error uploading image');
//         return;
//       }

//       const { data } = supabase.storage.from('post-images').getPublicUrl(filePath);
//       uploadedImageUrl = data.publicUrl;
//     }

//     const { data, error } = await supabase
//       .from('posts')
//       .insert([
//         {
//           title,
//           content,
//           image_url: uploadedImageUrl,
//           video_url: videoUrl,
//           user_id: userId,
//           secret_key: secretKey,
//           flag
//         }
//       ]);

//     if (error) {
//       console.error('Error creating post:', error);
//     } else {
//       navigate('/');
//     }
//   };

//   return (
//     <div className="card">
//       <h1 className="card-title">Create a New Post</h1>
//       <form onSubmit={handleSubmit} className="form">
//         <div className="form-group">
//           <label htmlFor="title">Title</label>
//           <input
//             id="title"
//             type="text"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             required
//             className="input"
//           />
//         </div>
//         <div className="form-group">
//           <label htmlFor="content">Content</label>
//           <textarea
//             id="content"
//             value={content}
//             onChange={(e) => setContent(e.target.value)}
//             rows="4"
//             className="input"
//           ></textarea>
//         </div>
//         <div className="form-group">
//           <label htmlFor="image">Upload Image</label>
//           <input
//             id="image"
//             type="file"
//             onChange={(e) => setImage(e.target.files[0])}
//             accept="image/*"
//             className="input"
//           />
//         </div>
//         <div className="form-group">
//           <label htmlFor="imageUrl">Image URL (Optional)</label>
//           <input
//             id="imageUrl"
//             type="url"
//             value={imageUrl}
//             onChange={(e) => setImageUrl(e.target.value)}
//             className="input"
//           />
//         </div>
//         <div className="form-group">
//           <label htmlFor="videoUrl">Video URL (Optional)</label>
//           <input
//             id="videoUrl"
//             type="url"
//             value={videoUrl}
//             onChange={(e) => setVideoUrl(e.target.value)}
//             className="input"
//           />
//         </div>
//         <div className="form-group">
//           <label htmlFor="secretKey">Secret Key (for editing/deleting)</label>
//           <input
//             id="secretKey"
//             type="password"
//             value={secretKey}
//             onChange={(e) => setSecretKey(e.target.value)}
//             required
//             className="input"
//           />
//         </div>
//         <div className="form-group">
//           <label htmlFor="flag">Flag</label>
//           <select
//             id="flag"
//             value={flag}
//             onChange={(e) => setFlag(e.target.value)}
//             className="input"
//           >
//             <option value="">Select a flag</option>
//             <option value="Question">Question</option>
//             <option value="Discussion">Discussion</option>
//             <option value="Announcement">Announcement</option>
//           </select>
//         </div>
//         <button type="submit" className="button">
//           Create Post
//         </button>
//       </form>
//     </div>
//   );
// }

// export default CreatePost;
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
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    let finalImageUrl = imageUrl;

    try {
      if (image) {
        const fileExt = image.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${userId}/${fileName}`;

        const { error: uploadError, data } = await supabase.storage
          .from('post-images')
          .upload(filePath, image);

        if (uploadError) {
          throw uploadError;
        }

        // Get the public URL for the uploaded image
        const { data: { publicUrl } } = supabase.storage
          .from('post-images')
          .getPublicUrl(filePath);

        finalImageUrl = publicUrl;
      }

      const { error } = await supabase
        .from('posts')
        .insert([
          {
            title,
            content,
            image_url: finalImageUrl,
            video_url: videoUrl,
            user_id: userId,
            secret_key: secretKey,
            flag,
            upvotes: 0
          }
        ]);

      if (error) throw error;

      navigate('/');
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Error creating post. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5000000) { // 5MB limit
        alert('File size must be less than 5MB');
        return;
      }
      setImage(file);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="card max-w-2xl mx-auto">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">Create a New Post</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label" htmlFor="title">Title</label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input w-full"
                required
              />
            </div>

            <div>
              <label className="label" htmlFor="content">Content</label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="input w-full"
                rows="4"
                required
              />
            </div>

            <div>
              <label className="label" htmlFor="image">Upload Image</label>
              <input
                id="image"
                type="file"
                onChange={handleImageChange}
                accept="image/*"
                className="input w-full"
              />
            </div>

            <div>
              <label className="label" htmlFor="imageUrl">Image URL (Optional)</label>
              <input
                id="imageUrl"
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="input w-full"
              />
            </div>

            <div>
              <label className="label" htmlFor="videoUrl">Video URL (Optional)</label>
              <input
                id="videoUrl"
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="input w-full"
              />
            </div>

            <div>
              <label className="label" htmlFor="secretKey">Secret Key (for editing/deleting)</label>
              <input
                id="secretKey"
                type="password"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                className="input w-full"
                required
              />
            </div>

            <div>
              <label className="label" htmlFor="flag">Flag</label>
              <select
                id="flag"
                value={flag}
                onChange={(e) => setFlag(e.target.value)}
                className="input w-full"
                required
              >
                <option value="">Select a flag</option>
                <option value="Question">Question</option>
                <option value="Discussion">Discussion</option>
                <option value="Announcement">Announcement</option>
              </select>
            </div>

            <button
              type="submit"
              className="button w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Post'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreatePost;