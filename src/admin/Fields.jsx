import { useState } from 'react'
import { uploadFile } from '../lib/api'

export function Field({ f, value, onChange }) {
  const id = `f-${f.key}`
  if (f.type === 'check') {
    return (
      <label className="ad-check" htmlFor={id}>
        <input id={id} type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} />
        <span>{f.label}</span>
      </label>
    )
  }
  if (f.type === 'image' || f.type === 'file') return <Upload f={f} value={value} onChange={onChange} />
  return (
    <label className="ad-field" htmlFor={id}>
      <span>{f.label}{f.required && <b aria-hidden="true"> *</b>}</span>
      {f.type === 'textarea'
        ? <textarea id={id} rows={5} value={value || ''} onChange={(e) => onChange(e.target.value)} />
        : <input id={id}
            type={f.type === 'number' ? 'number' : f.type === 'url' ? 'url' : 'text'}
            value={f.type === 'tags' ? (value || []).join(', ') : (value ?? '')}
            onChange={(e) => onChange(f.type === 'tags'
              ? e.target.value.split(',').map((s) => s.trimStart())
              : f.type === 'number' ? (e.target.value === '' ? null : Number(e.target.value)) : e.target.value)}
            placeholder={f.type === 'url' ? 'https://' : undefined} />}
      {f.hint && <small>{f.hint}</small>}
    </label>
  )
}

function Upload({ f, value, onChange }) {
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  async function pick(e) {
    const file = e.target.files?.[0]; if (!file) return
    setBusy(true); setErr('')
    try { onChange(await uploadFile(file, f.folder || 'files')) }
    catch { setErr('Upload failed. Check that you are signed in as admin and the file is under 50 MB.') }
    setBusy(false); e.target.value = ''
  }
  const isImg = f.type === 'image'
  return (
    <div className="ad-field">
      <span>{f.label}</span>
      <div className="ad-upload">
        {value && isImg && <img src={value} alt="" />}
        {value && !isImg && <a href={value} target="_blank" rel="noreferrer">Open current file</a>}
        <label className="ad-btn">
          {busy ? 'Uploading…' : value ? 'Replace' : 'Upload'}
          <input type="file" accept={isImg ? 'image/*' : f.accept || '*/*'} onChange={pick} hidden disabled={busy} />
        </label>
        {value && <button type="button" className="ad-btn ad-btn-quiet" onClick={() => onChange(null)}>Remove</button>}
      </div>
      {err && <small className="ad-error">{err}</small>}
    </div>
  )
}
