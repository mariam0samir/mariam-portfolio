import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { saveProfile } from '../lib/api'
import { Field } from './Fields'

const FIELDS = [
  { key: 'full_name', label: 'Name', type: 'text', required: true },
  { key: 'title', label: 'Job title', type: 'text' },
  { key: 'bio', label: 'Short bio (shown under your name)', type: 'textarea' },
  { key: 'location', label: 'Location', type: 'text' },
  { key: 'avatar_url', label: 'Photo (round, in the header)', type: 'image', folder: 'profile' },
  { key: 'about_photo_url', label: 'About photo (optional — uses the header photo if empty)', type: 'image', folder: 'profile' },
  { key: 'about_title', label: 'About — opening sentence', type: 'textarea' },
  { key: 'about_text', label: 'About — paragraphs (leave an empty line between paragraphs)', type: 'textarea' },
  { key: 'stat_projects', label: 'Number of projects (empty = count from Projects)', type: 'number' },
  { key: 'stat_years', label: 'Years of experience', type: 'number' },
  { key: 'stat_extra_value', label: 'Extra number (e.g. 100%)', type: 'text' },
  { key: 'stat_extra_label', label: 'Extra number label (e.g. Dedication)', type: 'text' },
  { key: 'cv_url', label: 'CV (PDF)', type: 'file', folder: 'cv', accept: 'application/pdf' },
  { key: 'available', label: 'Show “Available for new projects”', type: 'check' },
  { key: 'email', label: 'Email', type: 'text' },
  { key: 'whatsapp', label: 'WhatsApp number (with country code, e.g. +2010…)', type: 'text' },
  { key: 'phone', label: 'Phone', type: 'text' },
  { key: 'linkedin', label: 'LinkedIn link', type: 'url' },
  { key: 'github', label: 'GitHub link', type: 'url' },
]

export default function ProfileForm() {
  const [row, setRow] = useState(null)
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    supabase.from('profile').select('*').eq('id', 1).maybeSingle()
      .then(({ data }) => setRow(data || { full_name: 'Mariam Samir', available: true }))
  }, [])

  async function save(e) {
    e.preventDefault(); setBusy(true); setMsg('')
    try {
      const out = {}; FIELDS.forEach((f) => { out[f.key] = row[f.key] === '' ? null : row[f.key] })
      setRow(await saveProfile(out)); setMsg('Profile saved. The site shows the new details on the next refresh.')
    } catch (err) { setMsg(`Couldn’t save: ${err.message}`) }
    setBusy(false)
  }

  if (!row) return <p className="ad-muted">Loading…</p>
  return (
    <section>
      <header className="ad-head"><div><h2>Profile & contact</h2><p>What visitors see in the header and the contact section.</p></div></header>
      {msg && <p className="ad-flash" role="status">{msg}</p>}
      <form className="ad-card ad-fields ad-fields-2" onSubmit={save}>
        {FIELDS.map((f) => <Field key={f.key} f={f} value={row[f.key]} onChange={(v) => setRow({ ...row, [f.key]: v })} />)}
        <div className="ad-form-foot"><button className="ad-btn ad-btn-primary" disabled={busy}>{busy ? 'Saving…' : 'Save profile'}</button></div>
      </form>
    </section>
  )
}
