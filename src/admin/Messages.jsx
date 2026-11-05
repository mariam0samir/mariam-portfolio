import { useEffect, useState } from 'react'
import { listAll, updateRow, deleteRow } from '../lib/api'

export default function Messages() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState('')

  async function load() {
    setLoading(true)
    try { setRows(await listAll('messages', 'created_at')) } catch (e) { setMsg(e.message) }
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const unread = rows.filter((r) => !r.is_read).length
  return (
    <section>
      <header className="ad-head"><div><h2>Messages</h2><p>{rows.length} total, {unread} unread</p></div></header>
      {msg && <p className="ad-flash">{msg}</p>}
      {loading && <p className="ad-muted">Loading…</p>}
      {!loading && rows.length === 0 && <div className="ad-empty"><p>No messages yet. Messages from the contact form on your site show up here.</p></div>}
      <ul className="ad-msgs">
        {rows.map((r) => (
          <li key={r.id} className={r.is_read ? '' : 'is-new'}>
            <header>
              <b>{r.name}</b>
              <a href={`mailto:${r.email}`}>{r.email}</a>
              <time dateTime={r.created_at}>{new Date(r.created_at).toLocaleString()}</time>
            </header>
            <p>{r.body}</p>
            <div className="ad-actions">
              <a className="ad-btn" href={`mailto:${r.email}?subject=${encodeURIComponent('Re: your message')}`}>Reply by email</a>
              <button onClick={async () => { await updateRow('messages', r.id, { is_read: !r.is_read }); load() }}>{r.is_read ? 'Mark unread' : 'Mark read'}</button>
              <button className="danger" onClick={async () => { if (window.confirm('Delete this message?')) { await deleteRow('messages', r.id); load() } }}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
