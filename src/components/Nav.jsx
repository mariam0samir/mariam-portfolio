import { useEffect, useState } from 'react'
import { cvLink } from '../lib/api'
import { waNumber } from './Footer'

const WA_ICON = <svg width="17" height="17" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.04 3C9.4 3 4 8.38 4 15.01c0 2.12.56 4.19 1.61 6.01L4 29l8.17-1.58a12.03 12.03 0 0 0 3.87.64h.01C22.68 28.06 28 22.68 28 16.04 28 9.4 22.68 3 16.04 3zm0 22.9c-1.24 0-2.46-.22-3.6-.65l-.26-.1-4.85.94.96-4.7-.17-.28A9.86 9.86 0 0 1 6.16 15c0-5.45 4.43-9.88 9.89-9.88 5.45 0 9.8 4.47 9.8 9.92 0 5.45-4.36 10.86-9.81 10.86zm5.42-7.4c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15s-.77.96-.94 1.16c-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47s1.06 2.87 1.21 3.07c.15.2 2.09 3.19 5.06 4.47.71.31 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.08 1.75-.72 2-1.41.25-.69.25-1.28.17-1.41-.07-.12-.27-.2-.57-.35z" /></svg>

export default function Nav({ has, cv, whatsapp, phone, name }) {
  const num = whatsapp || phone
  const wa = num && `https://wa.me/${waNumber(num)}?text=${encodeURIComponent(`Hi ${(name || 'Mariam').split(' ')[0]}, I saw your portfolio and I'd like to talk about a project.`)}`
  return <NavInner has={has} cv={cv} wa={wa} />
}

function NavInner({ has, cv, wa }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('top')

  const links = [
    ['top', 'Home'], ['about', 'About'],
    ...(has.experience ? [['experience', 'Experience']] : []),
    ...(has.skills ? [['skills', 'Skills']] : []),
    ...(has.education ? [['education', 'Education']] : []),
    ...(has.projects ? [['projects', 'Projects']] : []),
    ['contact', 'Contact'],
  ]

  useEffect(() => {
    const on = () => {
      setScrolled(window.scrollY > 10)
      let cur = 'top'
      for (const [id] of links) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top < 140) cur = id
      }
      setActive(cur)
    }
    on(); window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [links.length])

  return (
    <header className={`nav ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="wrap nav-row">
        <a href="#top" className="logo" aria-label="Back to top">&lt;MS /&gt;</a>
        <nav id="nav-links" className={`nav-links ${open ? 'is-open' : ''}`} aria-label="Sections">
          {links.map(([id, label]) => (
            <a key={id} href={`#${id}`} className={active === id ? 'is-active' : ''} aria-current={active === id ? 'true' : undefined} onClick={() => setOpen(false)}>{label}</a>
          ))}
          {cv && <a className="nav-cv-m" href={cvLink(cv)} download onClick={() => setOpen(false)}>Download CV</a>}
        </nav>
        <div className="nav-actions">
          <a className="nav-wa" href={wa || '#contact'} {...(wa ? { target: '_blank', rel: 'noreferrer' } : {})} aria-label="Chat on WhatsApp" title="Chat on WhatsApp">{WA_ICON}</a>
          {cv && (
            <a className="btn btn-outline btn-sm nav-cv" href={cvLink(cv)} download>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true"><path d="M12 4v12m0 0l-5-5m5 5l5-5M5 20h14" /></svg>
              CV
            </a>
          )}
          <a className={`btn btn-solid btn-sm nav-cta ${scrolled ? 'is-shown' : ''}`} href="#contact">Hire Me</a>
        </div>
        <button className="menu-btn" aria-expanded={open} aria-controls="nav-links" onClick={() => setOpen(!open)}>{open ? 'Close' : 'Menu'}</button>
      </div>
    </header>
  )
}
