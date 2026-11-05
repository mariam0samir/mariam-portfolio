import { useEffect, useState } from 'react'

// 01012345678 → 201012345678 (Egypt), +20 101… → 20101…
export function waNumber(raw) {
  let d = String(raw || '').replace(/\D/g, '')
  if (d.startsWith('00')) d = d.slice(2)
  if (d.length === 11 && d.startsWith('01')) d = '2' + d
  return d
}

export default function Footer({ profile }) {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const on = () => setShow(window.scrollY > 700)
    on(); window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} {profile.full_name || 'Mariam Samir'}. Built with React + Supabase</p>
      {(profile.whatsapp || profile.phone) && (
        <a className="wa-fab" href={`https://wa.me/${waNumber(profile.whatsapp || profile.phone)}?text=${encodeURIComponent(`Hi ${(profile.full_name || 'Mariam').split(' ')[0]}, I saw your portfolio and I'd like to talk about a project.`)}`}
           target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp">
          <svg width="28" height="28" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16.04 3C9.4 3 4 8.38 4 15.01c0 2.12.56 4.19 1.61 6.01L4 29l8.17-1.58a12.03 12.03 0 0 0 3.87.64h.01C22.68 28.06 28 22.68 28 16.04 28 9.4 22.68 3 16.04 3zm0 22.9c-1.24 0-2.46-.22-3.6-.65l-.26-.1-4.85.94.96-4.7-.17-.28A9.86 9.86 0 0 1 6.16 15c0-5.45 4.43-9.88 9.89-9.88 5.45 0 9.8 4.47 9.8 9.92 0 5.45-4.36 10.86-9.81 10.86zm5.42-7.4c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15s-.77.96-.94 1.16c-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.01-1.04 2.47s1.06 2.87 1.21 3.07c.15.2 2.09 3.19 5.06 4.47.71.31 1.26.49 1.69.62.71.23 1.36.2 1.87.12.57-.08 1.75-.72 2-1.41.25-.69.25-1.28.17-1.41-.07-.12-.27-.2-.57-.35z"/></svg>
          <span className="wa-tip">Chat on WhatsApp</span>
        </a>
      )}
      <a href="#top" className={`to-top ${show ? 'is-shown' : ''}`} aria-label="Back to top">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true"><path d="M12 19V5m0 0l-6 6m6-6l6 6" /></svg>
      </a>
    </footer>
  )
}
