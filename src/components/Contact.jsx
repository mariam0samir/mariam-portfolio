import { useState } from 'react'
import { sendMessage } from '../lib/api'

const digits = (s) => { let d = (s || '').replace(/[^\d]/g, ''); if (d.startsWith('00')) d = d.slice(2); if (d.length === 11 && d.startsWith('01')) d = '2' + d; return d }
const ICONS = {
  GitHub: <path d="M12 2a10 10 0 00-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.3-3.4-1.3-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.6 1 1.6 1 .9 1.6 2.4 1.1 3 .9.1-.7.4-1.1.6-1.4-2.2-.3-4.6-1.1-4.6-5a3.9 3.9 0 011-2.7 3.6 3.6 0 01.1-2.7s.8-.3 2.8 1a9.6 9.6 0 015 0c2-1.3 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7a3.9 3.9 0 011 2.7c0 3.9-2.4 4.7-4.6 5 .4.3.7.9.7 1.9V21c0 .3.2.6.7.5A10 10 0 0012 2z" fill="currentColor" stroke="none" />,
  LinkedIn: <><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 014 0v4M12 10v7" /></>,
  WhatsApp: <><path d="M4 20l1.3-3.9A8 8 0 1112 20a8 8 0 01-3.9-1L4 20z" /><path d="M9 9.5c.3 1.6 1.9 3.3 3.5 3.8l1-.9 1.5.7c-.2 1-1 1.4-1.8 1.4-2.6-.3-4.9-2.6-5.2-5.2 0-.8.4-1.6 1.4-1.8l.7 1.5-.9.5z" /></>,
  Email: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></>,
}

export default function Contact({ profile }) {
  const [form, setForm] = useState({ name: '', email: '', body: '' })
  const [status, setStatus] = useState({ state: 'idle', text: '' })

  const reach = [
    profile.github && ['GitHub', profile.github],
    profile.linkedin && ['LinkedIn', profile.linkedin],
    profile.whatsapp && ['WhatsApp', `https://wa.me/${digits(profile.whatsapp)}`],
    profile.email && ['Email', `mailto:${profile.email}`],
  ].filter(Boolean)

  async function submit(e) {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim() || !form.body.trim()) {
      setStatus({ state: 'error', text: 'Add your name, email and a message so I can reply.' }); return
    }
    setStatus({ state: 'sending', text: '' })
    try {
      await sendMessage({ name: form.name.trim(), email: form.email.trim(), body: form.body.trim() })
      setForm({ name: '', email: '', body: '' })
      setStatus({ state: 'sent', text: 'Message sent. I’ll get back to you soon.' })
    } catch {
      setStatus({ state: 'error', text: 'The message didn’t go through. Try again, or email me directly.' })
    }
  }

  return (
    <section className="sec" id="contact">
      <div className="wrap narrow-sm">
        <header className="sec-head">
          <h2 className="sec-title">Get In Touch</h2>
        </header>
        <form className="card contact-form" onSubmit={submit} noValidate>
          <label className="sr-only" htmlFor="c-name">Name</label>
          <input id="c-name" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} autoComplete="name" maxLength={120} />
          <label className="sr-only" htmlFor="c-email">Email</label>
          <input id="c-email" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} autoComplete="email" maxLength={200} />
          <label className="sr-only" htmlFor="c-msg">Message</label>
          <textarea id="c-msg" rows={6} placeholder="Message" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} maxLength={4000} />
          <button className="btn btn-solid btn-block" type="submit" disabled={status.state === 'sending'}>
            {status.state === 'sending' ? 'Sending…' : 'Send Message'}
          </button>
          {status.text && <p className={`form-status is-${status.state}`} role="status">{status.text}</p>}
        </form>

        {reach.length > 0 && (
          <ul className="reach">
            {reach.map(([label, href]) => (
              <li key={label}>
                <a className="card reach-card" href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{ICONS[label]}</svg>
                  <span>{label}</span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
