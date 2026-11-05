import { useEffect, useState } from 'react'
import { supabase, BUCKET } from './supabase'

const unwrap = ({ data, error }) => {
  if (error) throw error
  return data
}

// ---------- public site ----------
export async function getPortfolio() {
  const [profile, skills, projects, experience, education] = await Promise.all([
    supabase.from('profile').select('*').eq('id', 1).maybeSingle(),
    supabase.from('skills').select('*').eq('active', true).order('category').order('sort_order'),
    supabase.from('projects').select('*').eq('active', true).order('featured', { ascending: false }).order('sort_order'),
    supabase.from('experience').select('*').eq('active', true).order('sort_order'),
    supabase.from('education').select('*').eq('active', true).order('sort_order'),
  ])
  return {
    profile: unwrap(profile) || {},
    skills: unwrap(skills) || [],
    projects: unwrap(projects) || [],
    experience: unwrap(experience) || [],
    education: education.error ? [] : (education.data || []),   // table added in v2
  }
}

export function usePortfolio() {
  const [state, setState] = useState({ loading: true, error: null, data: null })
  useEffect(() => {
    let alive = true
    getPortfolio()
      .then((data) => alive && setState({ loading: false, error: null, data }))
      .catch((error) => alive && setState({ loading: false, error, data: null }))
    return () => { alive = false }
  }, [])
  return state
}

export async function sendMessage({ name, email, body }) {
  return unwrap(await supabase.from('messages').insert({ name, email, body }))
}

// ---------- dashboard ----------
export const listAll = async (table, order = 'sort_order') =>
  unwrap(await supabase.from(table).select('*').order(order, { ascending: order === 'sort_order' }))

export const insertRow = async (table, row) => unwrap(await supabase.from(table).insert(row).select().single())
export const updateRow = async (table, id, row) => unwrap(await supabase.from(table).update(row).eq('id', id).select().single())
export const deleteRow = async (table, id) => unwrap(await supabase.from(table).delete().eq('id', id))

export async function saveProfile(row) {
  return unwrap(await supabase.from('profile').upsert({ ...row, id: 1, updated_at: new Date().toISOString() }).select().single())
}

export async function uploadFile(file, folder) {
  const ext = file.name.split('.').pop()
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
  unwrap(await supabase.storage.from(BUCKET).upload(path, file, { upsert: false, cacheControl: '3600' }))
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl
}

// swap sort_order with the neighbour (up = -1, down = +1)
export async function move(table, rows, index, dir) {
  const j = index + dir
  if (j < 0 || j >= rows.length) return
  const a = rows[index], b = rows[j]
  const ao = a.sort_order, bo = b.sort_order === ao ? ao + dir : b.sort_order
  await Promise.all([updateRow(table, a.id, { sort_order: bo }), updateRow(table, b.id, { sort_order: ao })])
}

// Supabase public files open in the browser by default; ?download= forces a real download
export function cvLink(url, name = 'Mariam-Samir-CV.pdf') {
  if (!url) return null
  if (url.includes('/storage/v1/object/public/')) return url + (url.includes('?') ? '&' : '?') + 'download=' + encodeURIComponent(name)
  return url
}
