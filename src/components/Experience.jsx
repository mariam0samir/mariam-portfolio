export default function Experience({ items }) {
  return (
    <section className="sec" id="experience">
      <div className="wrap narrow">
        <header className="sec-head">
          <p className="eyebrow">Training &amp; development</p>
          <h2 className="sec-title">Experience</h2>
          <p className="sec-sub">The path so far, most recent first.</p>
        </header>
        <ol className="tl">
          {items.map((e) => {
            const year = (e.end_label || e.start_label || '').match(/\d{4}/)?.[0] || (e.end_label ? '' : 'Now')
            return (
              <li key={e.id}>
                <span className="tl-year">{year}</span>
                <span className="tl-dot" aria-hidden="true" />
                <article className="card tl-card">
                  <h3>{e.role}</h3>
                  <p className="tl-meta">
                    {[e.company, e.location].filter(Boolean).join(', ')}
                    {(e.start_label || e.end_label) && <> · {e.start_label}{e.start_label && ' — '}{e.end_label || 'Present'}</>}
                  </p>
                  {e.description && <p className="tl-desc">{e.description}</p>}
                </article>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
