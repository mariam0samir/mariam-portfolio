export default function Education({ items }) {
  return (
    <section className="sec" id="education">
      <div className="wrap">
        <header className="sec-head">
          <p className="eyebrow">Learning &amp; credentials</p>
          <h2 className="sec-title">Education</h2>
        </header>
        <div className="edu-grid">
          {items.map((e) => (
            <article key={e.id} className="card edu-card">
              <div className="edu-top">
                <span className="edu-icon" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M2 9l10-5 10 5-10 5L2 9z" /><path d="M6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" /></svg>
                </span>
                <div>
                  <h3>{e.title}</h3>
                  {e.subtitle && <p className="edu-sub">{e.subtitle}</p>}
                </div>
              </div>
              {e.institution && <p className="edu-inst">{e.institution}</p>}
              {e.tags?.length > 0 && <ul className="pills">{e.tags.map((t) => <li key={t}>{t}</li>)}</ul>}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
