import { useState } from 'react'
import { supabase } from '../supabaseClient'

export default function Auth() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)

  const handleAuth = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { error } = isSignUp
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password })
    
    if (error) alert(error.message)
    else if (isSignUp) alert('Check your email for the confirmation link!')
    setLoading(false)
  }

  return (
    <div className="card max-w-md mx-auto">
      <h2 className="card-title">{isSignUp ? 'Sign Up' : 'Sign In'}</h2>
      <form onSubmit={handleAuth} className="space-y-4">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-full" disabled={loading}>
          {loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Sign In')}
        </button>
      </form>
      <p className="text-center mt-4">
        {isSignUp ? 'Already have an account?' : "Don't have an account?"}
        <button className="btn btn-ghost" onClick={() => setIsSignUp(!isSignUp)}>
          {isSignUp ? 'Sign In' : 'Sign Up'}
        </button>
      </p>
    </div>
  )
}
// import { useState } from 'react'
// import { supabase } from '../supabaseClient';

// export async function signUpWithEmail(email, password) {
//   try {
//     const { data, error } = await supabase.auth.signUp({
//       email,
//       password,
//       options: {
//         emailRedirectTo: `${window.location.origin}/auth/callback`
//       }
//     });

//     if (error) {
//       throw error;
//     }

//     return { data, error: null };
//   } catch (error) {
//     console.error('Error signing up:', error.message);
//     return { data: null, error: error.message };
//   }
// }

// export async function signInWithEmail(email, password) {
//   try {
//     const { data, error } = await supabase.auth.signInWithPassword({
//       email,
//       password
//     });

//     if (error) {
//       throw error;
//     }

//     return { data, error: null };
//   } catch (error) {
//     console.error('Error signing in:', error.message);
//     return { data: null, error: error.message };
//   }
// }