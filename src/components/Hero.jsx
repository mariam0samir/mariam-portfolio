import { cvLink } from '../lib/api'
import { useEffect, useState } from 'react'

// types the job title once, then keeps a blinking caret
function useTyped(text) {
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!text) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setN(text.length); return }
    setN(0)
    const id = setInterval(() => setN((k) => (k >= text.length ? (clearInterval(id), k) : k + 1)), 55)
    return () => clearInterval(id)
  }, [text])
  return text ? text.slice(0, n) : ''
}

export function Stats({ profile, projectsCount, boxed = false }) {
  const items = [
    [profile.stat_projects ?? projectsCount, 'Projects', '+'],
    profile.stat_years != null && [profile.stat_years, 'Years Exp', '+'],
    profile.stat_extra_value && [profile.stat_extra_value, profile.stat_extra_label || '', ''],
  ].filter(Boolean)
  return (
    <ul className={boxed ? 'stat-boxes' : 'stats'}>
      {items.map(([v, label, suf]) => (
        <li key={label}>
          <b>{v}{typeof v === 'number' && <sup>{suf}</sup>}</b>
          <span>{label}</span>
        </li>
      ))}
    </ul>
  )
}

export default function Hero({ profile, projectsCount }) {
  const [first] = (profile.full_name || 'Mariam Samir').split(' ')
  const typed = useTyped(profile.title || '')

  return (
    <section className="hero" id="top">
      <div className="hero-grid-bg" aria-hidden="true" />
      <div className="wrap hero-row">
        <div className="hero-copy">
          {profile.available && <p className="badge">Available for hire <i aria-hidden="true" /></p>}
          <p className="hello">Hi, I’m</p>
          <h1 className="hero-name">{first}</h1>
          {profile.title && <p className="hero-title" aria-label={profile.title}><span aria-hidden="true">{typed}</span><i className="caret" aria-hidden="true" /></p>}
          {profile.bio && <p className="hero-bio">{profile.bio}</p>}
          <div className="hero-actions">
            <a className="btn btn-solid" href="#projects">View Work</a>
            <a className="btn btn-outline" href="#contact">Hire Me</a>
            {profile.cv_url && (
              <a className="btn btn-dark" href={cvLink(profile.cv_url)} download>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true"><path d="M12 4v12m0 0l-5-5m5 5l5-5M5 20h14" /></svg>
                Download CV
              </a>
            )}
          </div>
          <Stats profile={profile} projectsCount={projectsCount} />
        </div>

        <div className="hero-art" aria-hidden={!profile.avatar_url}>
          <div className="orbit orbit-1" /><div className="orbit orbit-2" />
          <span className="orbit-dot d1" /><span className="orbit-dot d2" /><span className="orbit-dot d3" />
          <div className="avatar">
            {profile.avatar_url
              ? <img src={profile.avatar_url} alt={profile.full_name} />
              : <span className="avatar-initials">{(profile.full_name || 'M S').split(' ').map((w) => w[0]).join('').slice(0, 2)}</span>}
          </div>
        </div>
      </div>
      <a className="scroll-cue" href="#about">Scroll</a>
    </section>
  )
}
