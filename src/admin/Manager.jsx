import { useEffect, useState } from 'react'
import { listAll, insertRow, updateRow, deleteRow, move } from '../lib/api'
import { Field } from './Fields'

// Generic list + form for projects, skills and experience
export default function Manager({ table, title, itemLabel, fields, primary, secondary, thumb, groupBy }) {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)   // row object or {} for new
  const [msg, setMsg] = useState('')

  async function load() {
    setLoading(true)
    try { setRows(await listAll(table)) } catch (e) { setMsg(`Couldn’t load ${title.toLowerCase()}: ${e.message}`) }
    setLoading(false)
  }
  useEffect(() => { load() }, [table])

  function blank() {
    const r = {}; fields.forEach((f) => { if (f.default !== undefined) r[f.key] = f.default })
    return r
  }

  async function save(e) {
    e.preventDefault()
    const missing = fields.find((f) => f.required && !String(editing[f.key] ?? '').trim())
    if (missing) { setMsg(`Add the ${missing.label.toLowerCase()} before saving.`); return }
    const row = {}
    fields.forEach((f) => {
      let v = editing[f.key]
      if (f.type === 'tags') v = (v || []).map((s) => s.trim()).filter(Boolean)
      if (v === '') v = null
      row[f.key] = v
    })
    try {
      if (editing.id) await updateRow(table, editing.id, row)
      else await insertRow(table, { ...row, sort_order: (rows.reduce((m, r) => Math.max(m, r.sort_order || 0), 0) + 1) })
      setMsg(editing.id ? `${cap(itemLabel)} updated.` : `${cap(itemLabel)} added.`)
      setEditing(null); load()
    } catch (err) { setMsg(`Couldn’t save: ${err.message}`) }
  }

  async function remove(r) {
    if (!window.confirm(`Delete “${r[primary]}”? This can’t be undone.`)) return
    try { await deleteRow(table, r.id); setMsg(`${cap(itemLabel)} deleted.`); load() }
    catch (err) { setMsg(`Couldn’t delete: ${err.message}`) }
  }

  async function toggle(r) {
    try { await updateRow(table, r.id, { active: !r.active }); load() } catch (err) { setMsg(err.message) }
  }

  async function shift(list, i, dir) {
    try { await move(table, list, i, dir); load() } catch (err) { setMsg(err.message) }
  }

  const groups = groupBy
    ? Object.entries(rows.reduce((a, r) => { (a[r[groupBy]] ||= []).push(r); return a }, {}))
    : [[null, rows]]

  return (
    <section>
      <header className="ad-head">
        <div>
          <h2>{title}</h2>
          <p>{rows.length} {rows.length === 1 ? itemLabel : `${itemLabel}s`}</p>
        </div>
        <button className="ad-btn ad-btn-primary" onClick={() => { setMsg(''); setEditing(blank()) }}>Add {itemLabel}</button>
      </header>
      {msg && <p className="ad-flash" role="status">{msg}</p>}
      {loading && <p className="ad-muted">Loading…</p>}
      {!loading && rows.length === 0 && (
        <div className="ad-empty">
          <p>No {itemLabel}s yet.</p>
          <button className="ad-btn ad-btn-primary" onClick={() => setEditing(blank())}>Add your first {itemLabel}</button>
        </div>
      )}

      {groups.map(([g, list]) => (
        <div key={g || 'all'} className="ad-group">
          {g && <h3 className="ad-group-title">{g}</h3>}
          <ul className="ad-list">
            {list.map((r, i) => (
              <li key={r.id} className={r.active === false ? 'is-hidden' : ''}>
                {thumb && <span className="ad-thumb">{r[thumb] ? <img src={r[thumb]} alt="" /> : null}</span>}
                <div className="ad-item">
                  <b>{r[primary]}</b>
                  <small>{secondary?.(r)}{r.active === false && ' · Hidden'}</small>
                </div>
                <div className="ad-actions">
                  <button aria-label="Move up" title="Move up" onClick={() => shift(list, i, -1)} disabled={i === 0}>↑</button>
                  <button aria-label="Move down" title="Move down" onClick={() => shift(list, i, 1)} disabled={i === list.length - 1}>↓</button>
                  <button onClick={() => toggle(r)}>{r.active === false ? 'Show' : 'Hide'}</button>
                  <button onClick={() => { setMsg(''); setEditing({ ...r }) }}>Edit</button>
                  <button className="danger" onClick={() => remove(r)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}

      {editing && (
        <div className="ad-modal" role="dialog" aria-modal="true" aria-label={editing.id ? `Edit ${itemLabel}` : `Add ${itemLabel}`} onMouseDown={(e) => e.target === e.currentTarget && setEditing(null)}>
          <form className="ad-sheet" onSubmit={save}>
            <header>
              <h3>{editing.id ? `Edit ${itemLabel}` : `Add ${itemLabel}`}</h3>
              <button type="button" className="ad-x" aria-label="Close" onClick={() => setEditing(null)}>×</button>
            </header>
            <div className="ad-fields">
              {fields.map((f) => (
                <Field key={f.key} f={f} value={editing[f.key]} onChange={(v) => setEditing({ ...editing, [f.key]: v })} />
              ))}
            </div>
            <footer>
              <button type="button" className="ad-btn ad-btn-quiet" onClick={() => setEditing(null)}>Cancel</button>
              <button className="ad-btn ad-btn-primary">{editing.id ? 'Save changes' : `Add ${itemLabel}`}</button>
            </footer>
          </form>
        </div>
      )}
    </section>
  )
}

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1)
