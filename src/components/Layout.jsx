import { useTheme } from './ThemeProvider';
import { Link } from 'react-router-dom';

export default function Layout({ children }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="container">
      <header className="header">
        <Link to="/" className="header-logo">GameHub</Link>
        <button onClick={toggleTheme} className="theme-toggle">
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </header>
      <main className="main">{children}</main>
    </div>
  );
}
