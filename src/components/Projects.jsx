import { useEffect, useRef, useState } from 'react'

// Picture for a project: the uploaded screenshot if there is one, otherwise a live
// screenshot of the site's home page (after its loading screen finishes),
// otherwise the GitHub repo preview card.
function sources(p) {
  const list = []
  if (p.image_url) list.push(p.image_url)
  if (p.live_url && /^https?:\/\//.test(p.live_url)) {
    const u = encodeURIComponent(p.live_url)
    list.push(`https://api.microlink.io/?url=${u}&screenshot=true&meta=false&embed=screenshot.url&viewport.width=1280&viewport.height=800&waitUntil=networkidle0&waitForTimeout=6000`)
    list.push(`https://s.wordpress.com/mshots/v1/${u}?w=1280&h=800`)
    list.push(`https://image.thum.io/get/wait/8/width/1200/crop/800/${p.live_url}`)
  }
  const gh = p.repo_url && p.repo_url.match(/github\.com\/([^/]+)\/([^/#?]+)/)
  if (gh) list.push(`https://opengraph.githubassets.com/1/${gh[1]}/${gh[2].replace(/\.git$/, '')}`)
  return list
}

const SERVER_ICON = (
  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
    <rect x="3" y="4" width="18" height="7" rx="2" /><rect x="3" y="13" width="18" height="7" rx="2" /><path d="M7 7.5h.01M7 16.5h.01" />
  </svg>
)

function Shot({ project, className, fallback }) {
  const list = sources(project)
  const [i, setI] = useState(0)
  useEffect(() => setI(0), [project.id])
  if (i >= list.length) return fallback || null
  return <img className={className} src={list[i]} alt="" draggable="false" onError={() => setI(i + 1)} />
}

const pad = (n) => String(n).padStart(2, '0')

export default function Projects({ projects }) {
  const n = projects.length
  const [i, setI] = useState(0)
  const [details, setDetails] = useState(null)
  const go = (k) => setI(((k % n) + n) % n)
  const drag = useRef(null)
  const p = projects[i]
  const href = p.live_url || p.repo_url
  const others = n > 1 ? Array.from({ length: Math.min(3, n - 1) }, (_, k) => (i + k + 1) % n) : []

  useEffect(() => {
    if (!details) return
    const k = (e) => e.key === 'Escape' && setDetails(null)
    window.addEventListener('keydown', k)
    return () => window.removeEventListener('keydown', k)
  }, [details])

  const onDown = (e) => { if (e.target.closest('a,button')) return; drag.current = e.clientX ?? e.touches?.[0]?.clientX }
  const onUp = (e) => {
    if (drag.current == null) return
    const x = e.clientX ?? e.changedTouches?.[0]?.clientX
    const dx = x - drag.current; drag.current = null
    if (Math.abs(dx) > 50) go(i + (dx < 0 ? 1 : -1))
  }

  return (
    <section className="sec sec-alt" id="projects">
      <div className="wrap">
        <header className="sec-head">
          <h2 className="sec-title">Featured Projects</h2>
          {n > 1 && <p className="sec-sub">Drag or use the arrows to explore</p>}
        </header>

        <div className="ps" role="region" aria-roledescription="carousel" aria-label="Projects" tabIndex={0}
             onKeyDown={(e) => { if (e.key === 'ArrowRight') go(i + 1); if (e.key === 'ArrowLeft') go(i - 1) }}
             onMouseDown={onDown} onMouseUp={onUp} onTouchStart={onDown} onTouchEnd={onUp}>
          <div className="ps-bg" key={p.id}>
            <Shot project={p} className="ps-bg-img" fallback={<span className="ps-bg-empty" aria-hidden="true">&lt;/&gt;</span>} />
          </div>
          <div className="ps-shade" aria-hidden="true" />

          <div className="ps-body" key={'b' + p.id} aria-live="polite">
            <span className="ps-num">{pad(i + 1)}</span>
            {(p.role || p.year) && <p className="ps-kind">{[p.role, p.year].filter(Boolean).join(' · ')}</p>}
            <h3 className="ps-title">{p.title}</h3>
            {p.summary && <p className="ps-sum">{p.summary}</p>}
            {p.tech?.length > 0 && <ul className="ps-tech">{p.tech.slice(0, 4).map((t) => <li key={t}>{t}</li>)}</ul>}
            <div className="ps-actions">
              <button type="button" className="ps-btn ps-btn-main" onClick={() => setDetails(p)}>View Details</button>
              {href && <a className="ps-btn ps-btn-ghost" href={href} target="_blank" rel="noreferrer">View Project</a>}
            </div>
          </div>

          {others.length > 0 && (
            <ul className="ps-thumbs" aria-label="Other projects">
              {others.map((k) => (
                <li key={projects[k].id}>
                  <button type="button" onClick={() => go(k)} aria-label={`Show ${projects[k].title}`} title={projects[k].title}>
                    <Shot project={projects[k]} className="ps-thumb-img" fallback={<span className="ps-thumb-empty">{SERVER_ICON}</span>} />
                  </button>
                </li>
              ))}
            </ul>
          )}

          {n > 1 && (
            <div className="ps-arrows">
              <button type="button" aria-label="Previous project" onClick={() => go(i - 1)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M16 5L7 12l9 7V5z" /></svg>
              </button>
              <button type="button" aria-label="Next project" onClick={() => go(i + 1)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M8 5l9 7-9 7V5z" /></svg>
              </button>
            </div>
          )}
        </div>

        {n > 1 && (
          <div className="ps-foot">
            <span className="ps-count">{pad(i + 1)} / {pad(n)}</span>
            <div className="ps-dots">
              {projects.map((q, k) => (
                <button key={q.id} type="button" className={k === i ? 'is-on' : ''} aria-label={`Show ${q.title}`} aria-current={k === i} onClick={() => go(k)} />
              ))}
            </div>
          </div>
        )}
      </div>

      {details && (
        <div className="pd-modal" role="dialog" aria-modal="true" aria-label={details.title} onClick={() => setDetails(null)}>
          <article className="pd-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="pd-shot"><Shot project={details} className="pd-img" fallback={<span className="pd-empty">&lt;/&gt;</span>} /></div>
            <div className="pd-body">
              {(details.role || details.year) && <p className="ps-kind">{[details.role, details.year].filter(Boolean).join(' · ')}</p>}
              <h3>{details.title}</h3>
              {(details.description || details.summary) && <p className="pd-desc">{details.description || details.summary}</p>}
              {details.tech?.length > 0 && <ul className="ps-tech">{details.tech.map((t) => <li key={t}>{t}</li>)}</ul>}
              <div className="ps-actions">
                {details.live_url && <a className="ps-btn ps-btn-main" href={details.live_url} target="_blank" rel="noreferrer">View Project</a>}
                {details.repo_url && <a className="ps-btn ps-btn-ghost" href={details.repo_url} target="_blank" rel="noreferrer">View Code</a>}
              </div>
            </div>
            <button type="button" className="pd-x" aria-label="Close" onClick={() => setDetails(null)} autoFocus>×</button>
          </article>
        </div>
      )}
    </section>
  )
}
