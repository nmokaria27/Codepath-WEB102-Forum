import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { supabase } from './supabaseClient.js';
import Auth from './components/Auth';
import CreatePost from './components/CreatePost';
import UpdatePostPage from './pages/UpdatePostPage';
import HomePage from './pages/HomePage';
import PostPage from './pages/PostPage';
import { ThemeProvider, useTheme } from './components/ThemeProvider';
import SearchBar from './components/SearchBar';
import ColorSchemeSelector from './components/ColorSchemeSelector';
import './styles.css';

function Header({ session, signOut, onSearch }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-emerald-500 text-white">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">GameForum</Link>
        <SearchBar onSearch={onSearch} />
        <nav className="flex items-center space-x-4">
          <button onClick={toggleTheme} className="bg-white text-emerald-500 px-3 py-1 rounded-md">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          {session ? (
            <>
              <Link to="/create" className="bg-white text-emerald-500 px-3 py-1 rounded-md">Create Post</Link>
              <button className="bg-white text-emerald-500 px-3 py-1 rounded-md" onClick={signOut}>Sign Out</button>
            </>
          ) : (
            <Link to="/auth" className="bg-white text-emerald-500 px-3 py-1 rounded-md">Sign In</Link>
          )}
        </nav>
      </div>
    </header>
  );
}

function App() {
  const [session, setSession] = useState(null);
  const [userId, setUserId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        const userId = session.user.id;
        setUserId(userId);
      } else {
        const randomUserId = Math.random().toString(36).substring(2, 15);
        setUserId(randomUserId);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        const userId = session.user.id;
        setUserId(userId);
      } else {
        const randomUserId = Math.random().toString(36).substring(2, 15);
        setUserId(randomUserId);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
          <Header session={session} signOut={() => supabase.auth.signOut()} onSearch={handleSearch} />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<HomePage searchTerm={searchTerm} userId={userId} />} />
              <Route path="/auth" element={!session ? <Auth /> : <Navigate to="/" />} />
              <Route path="/create" element={<CreatePost userId={userId} />} />
              <Route path="/post/:id" element={<PostPage userId={userId} />} />
              <Route path="/update/:id" element={<UpdatePostPage userId={userId} />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;