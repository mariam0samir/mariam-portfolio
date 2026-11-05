import { useState } from 'react'
import { supabase } from '../lib/supabase'
import ProfileForm from './ProfileForm'
import Manager from './Manager'
import Messages from './Messages'

const PROJECT_FIELDS = [
  { key: 'title', label: 'Project name', type: 'text', required: true },
  { key: 'summary', label: 'One-line summary', type: 'text' },
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'image_url', label: 'Screenshot (optional — taken automatically from the Live link or GitHub repo if empty)', type: 'image', folder: 'projects' },
  { key: 'tech', label: 'Technologies (comma separated)', type: 'tags' },
  { key: 'role', label: 'My role', type: 'text' },
  { key: 'year', label: 'Year', type: 'number' },
  { key: 'live_url', label: 'Live link', type: 'url' },
  { key: 'repo_url', label: 'Code link (GitHub)', type: 'url' },
  { key: 'featured', label: 'Show as the main project at the top', type: 'check' },
  { key: 'active', label: 'Visible on the site', type: 'check', default: true },
]
const SKILL_FIELDS = [
  { key: 'name', label: 'Skill', type: 'text', required: true },
  { key: 'category', label: 'Group', type: 'text', required: true, default: 'Frontend Development', hint: 'Skills with the same group show in one card, e.g. Frontend Development, Backend & Data, Tools.' },
  { key: 'level', label: 'Level % (optional, 0–100)', type: 'number' },
  { key: 'active', label: 'Visible on the site', type: 'check', default: true },
]
const EXP_FIELDS = [
  { key: 'role', label: 'Job title', type: 'text', required: true },
  { key: 'company', label: 'Company', type: 'text', required: true },
  { key: 'location', label: 'Location', type: 'text' },
  { key: 'start_label', label: 'Started (e.g. Jan 2025)', type: 'text' },
  { key: 'end_label', label: 'Ended (leave empty if current)', type: 'text' },
  { key: 'description', label: 'What you did', type: 'textarea' },
  { key: 'active', label: 'Visible on the site', type: 'check', default: true },
]

const EDU_FIELDS = [
  { key: 'title', label: 'Degree / program', type: 'text', required: true },
  { key: 'subtitle', label: 'Subtitle (e.g. GPA, track)', type: 'text' },
  { key: 'institution', label: 'Institution', type: 'text' },
  { key: 'tags', label: 'Tags (comma separated)', type: 'tags' },
  { key: 'image_url', label: 'Certificate image (shown as the card background)', type: 'image', folder: 'certificates' },
  { key: 'active', label: 'Visible on the site', type: 'check', default: true },
]

const TABS = [
  ['projects', 'Projects'],
  ['skills', 'Skills'],
  ['experience', 'Experience'],
  ['education', 'Education'],
  ['profile', 'Profile & contact'],
  ['messages', 'Messages'],
]

export default function Dashboard({ email }) {
  const [tab, setTab] = useState('projects')
  return (
    <div className="ad">
      <aside className="ad-side">
        <span className="ad-mark">MS</span>
        <nav aria-label="Dashboard sections">
          {TABS.map(([k, label]) => (
            <button key={k} className={tab === k ? 'is-on' : ''} aria-current={tab === k ? 'page' : undefined} onClick={() => setTab(k)}>{label}</button>
          ))}
        </nav>
        <div className="ad-side-foot">
          <a href="/" target="_blank" rel="noreferrer">View site</a>
          <p title={email}>{email}</p>
          <button onClick={() => supabase.auth.signOut()}>Sign out</button>
        </div>
      </aside>
      <main className="ad-main">
        {tab === 'projects' && <Manager key="p" table="projects" title="Projects" itemLabel="project" fields={PROJECT_FIELDS} primary="title" secondary={(r) => [r.featured && 'Main project', r.year, (r.tech || []).slice(0, 3).join(', ')].filter(Boolean).join(' · ')} thumb="image_url" />}
        {tab === 'skills' && <Manager key="s" table="skills" title="Skills" itemLabel="skill" fields={SKILL_FIELDS} primary="name" secondary={(r) => [r.category, r.level != null && `${r.level}%`].filter(Boolean).join(' · ')} groupBy="category" />}
        {tab === 'experience' && <Manager key="e" table="experience" title="Experience" itemLabel="role" fields={EXP_FIELDS} primary="role" secondary={(r) => [r.company, [r.start_label, r.end_label || 'Present'].filter(Boolean).join(' — ')].filter(Boolean).join(' · ')} />}
        {tab === 'education' && <Manager key="ed" table="education" title="Education" itemLabel="entry" fields={EDU_FIELDS} primary="title" secondary={(r) => [r.institution, r.subtitle].filter(Boolean).join(' · ')} />}
        {tab === 'profile' && <ProfileForm />}
        {tab === 'messages' && <Messages />}
      </main>
    </div>
  )
}
