import { useState } from 'react'

// Picture for a card: the uploaded screenshot if there is one, otherwise a live
// screenshot of the site's home page (after its loading screen finishes) (Vercel or any URL), otherwise the GitHub repo preview card.
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

function Shot({ project }) {
  const list = sources(project)
  const [i, setI] = useState(0)
  if (i >= list.length) return <span className="pj-empty" aria-hidden="true">&lt;/&gt;</span>
  return <img className="pj-bg" src={list[i]} alt="" loading="lazy" onError={() => setI(i + 1)} />
}

export default function Projects({ projects }) {
  const cols = projects.length >= 4 ? 'cols-4' : 'cols-3'
  return (
    <section className="sec sec-alt" id="projects">
      <div className="wrap">
        <header className="sec-head">
          <h2 className="sec-title">Featured Projects</h2>
          <p className="sec-sub">Click a project to open it</p>
        </header>

        <ul className={`pj-grid ${cols}`}>
          {projects.map((p, k) => {
            const href = p.live_url || p.repo_url
            const Tag = href ? 'a' : 'div'
            const linkProps = href ? { href, target: '_blank', rel: 'noreferrer' } : {}
            return (
              <li key={p.id}>
                <Tag className={`pj-card ${sources(p).length ? '' : 'no-img'}`} {...linkProps}>
                  <Shot project={p} />
                  <span className="pj-shade" aria-hidden="true" />
                  <span className="pj-num" aria-hidden="true">{String(k + 1).padStart(2, '0')}</span>
                  {href && (
                    <span className="pj-go" aria-hidden="true">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M7 17L17 7M9 7h8v8" /></svg>
                    </span>
                  )}
                  <span className="pj-body">
                    {(p.role || p.year) && <span className="pj-kind">{[p.role, p.year].filter(Boolean).join(' · ')}</span>}
                    <span className="pj-title">{p.title}</span>
                    {p.summary && <span className="pj-sum">{p.summary}</span>}
                    {p.tech?.length > 0 && (
                      <span className="pj-tech">{p.tech.slice(0, 3).map((t) => <i key={t}>{t}</i>)}</span>
                    )}
                  </span>
                </Tag>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
