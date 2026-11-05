// small coloured badge per skill (first letters) — no icon library needed
const HUES = { react: 190, javascript: 50, typescript: 210, html: 15, css: 225, tailwind: 185, supabase: 150, postgres: 215, git: 12, vite: 270, vercel: 0, node: 120, next: 0, redux: 265, sass: 330 }
function hueFor(name) {
  const n = name.toLowerCase()
  for (const k in HUES) if (n.includes(k)) return HUES[k]
  let h = 0; for (const c of n) h = (h * 31 + c.charCodeAt(0)) % 360
  return h
}
function Badge({ name }) {
  const h = hueFor(name)
  const txt = name.replace(/[^A-Za-z0-9]/g, '').slice(0, 2) || '•'
  return <i className="sk-badge" style={{ background: `hsl(${h} 70% 55% / .18)`, color: `hsl(${h} 80% 72%)` }} aria-hidden="true">{txt}</i>
}

export default function Skills({ skills }) {
  const groups = skills.reduce((a, s) => { (a[s.category] ||= []).push(s); return a }, {})
  return (
    <section className="sec sec-alt" id="skills">
      <div className="wrap">
        <header className="sec-head">
          <p className="eyebrow">Tools I work with</p>
          <h2 className="sec-title">Skills</h2>
          <p className="sec-sub">Technologies I use to build responsive interfaces and the dashboards behind them.</p>
        </header>
        <div className="sk-grid">
          {Object.entries(groups).map(([cat, list]) => (
            <article key={cat} className="card sk-card">
              <h3>{cat}</h3>
              <ul>
                {list.map((s) => (
                  <li key={s.id} className="sk-chip">
                    <Badge name={s.name} />
                    <span>{s.name}</span>
                    {s.level != null && <small>{s.level}%</small>}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
