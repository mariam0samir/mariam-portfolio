import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Dashboard from './Dashboard'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e) {
    e.preventDefault(); setBusy(true); setError('')
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
    if (error) setError('Email or password is incorrect.')
    setBusy(false)
  }

  return (
    <div className="ad-login">
      <form onSubmit={submit} className="ad-login-card">
        <span className="ad-mark">MS</span>
        <h1>Portfolio dashboard</h1>
        <label>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required /></label>
        <label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required /></label>
        {error && <p className="ad-error" role="alert">{error}</p>}
        <button className="ad-btn ad-btn-primary" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
        <a className="ad-back" href="/">Back to portfolio</a>
      </form>
    </div>
  )
}

export default function AdminApp() {
  const [session, setSession] = useState(undefined)
  const [isAdmin, setIsAdmin] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!session) { setIsAdmin(null); return }
    supabase.rpc('is_admin').then(({ data }) => setIsAdmin(!!data))
  }, [session])

  if (session === undefined) return <div className="ad-login"><p>Loading…</p></div>
  if (!session) return <Login />
  if (isAdmin === null) return <div className="ad-login"><p>Checking access…</p></div>
  if (!isAdmin) {
    return (
      <div className="ad-login">
        <div className="ad-login-card">
          <h1>No dashboard access</h1>
          <p>The account <b>{session.user.email}</b> isn’t in the admin list. Add it to the <code>admin_users</code> table in Supabase, then sign in again.</p>
          <button className="ad-btn" onClick={() => supabase.auth.signOut()}>Sign out</button>
        </div>
      </div>
    )
  }
  return <Dashboard email={session.user.email} />
}
