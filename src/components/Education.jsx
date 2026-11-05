import { useEffect, useState } from 'react'

const CAP = <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M2 9l10-5 10 5-10 5L2 9z" /><path d="M6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" /></svg>

export default function Education({ items }) {
  const [open, setOpen] = useState(null)
  useEffect(() => {
    if (!open) return
    const k = (e) => e.key === 'Escape' && setOpen(null)
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [open])

  return (
    <section className="sec" id="education">
      <div className="wrap">
        <header className="sec-head">
          <p className="eyebrow">Learning &amp; credentials</p>
          <h2 className="sec-title">Education</h2>
        </header>
        <div className="edu-grid">
          {items.map((e) => (
            <article key={e.id} className={`card edu-card ${e.image_url ? 'has-cert' : ''}`}>
              {e.image_url && <img className="edu-bg" src={e.image_url} alt="" loading="lazy" />}
              <div className="edu-top">
                <span className="edu-icon" aria-hidden="true">{CAP}</span>
                <div>
                  <h3>{e.title}</h3>
                  {e.subtitle && <p className="edu-sub">{e.subtitle}</p>}
                </div>
              </div>
              {e.institution && <p className="edu-inst">{e.institution}</p>}
              {e.tags?.length > 0 && <ul className="pills">{e.tags.map((t) => <li key={t}>{t}</li>)}</ul>}
              {e.image_url && (
                <button type="button" className="edu-view" onClick={() => setOpen(e)}>
                  View certificate <span aria-hidden="true">↗</span>
                </button>
              )}
            </article>
          ))}
        </div>
      </div>

      {open && (
        <div className="cert-modal" role="dialog" aria-modal="true" aria-label={`${open.title} certificate`} onClick={() => setOpen(null)}>
          <figure onClick={(ev) => ev.stopPropagation()}>
            <img src={open.image_url} alt={`${open.title} certificate — ${open.institution || ''}`} />
            <figcaption>{open.title}{open.institution ? ` · ${open.institution}` : ''}</figcaption>
            <button type="button" className="cert-x" aria-label="Close" onClick={() => setOpen(null)} autoFocus>×</button>
          </figure>
        </div>
      )}
    </section>
  )
}
