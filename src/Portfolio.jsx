import { usePortfolio } from './lib/api'
import Nav from './components/Nav'
import Hero from './components/Hero'
import About from './components/About'
import Experience from './components/Experience'
import Skills from './components/Skills'
import Education from './components/Education'
import Projects from './components/Projects'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function Portfolio() {
  const { loading, error, data } = usePortfolio()

  if (loading) return <div className="boot" aria-busy="true"><span className="boot-mark">&lt;MS /&gt;</span></div>
  if (error) {
    return (
      <div className="boot">
        <p className="boot-error">The portfolio could not load its content. Check the Supabase keys in your environment variables, then refresh.</p>
      </div>
    )
  }

  const { profile, skills, projects, experience, education } = data
  const has = { experience: experience.length > 0, skills: skills.length > 0, education: education.length > 0, projects: projects.length > 0 }
  return (
    <>
      <Nav has={has} cv={profile.cv_url} whatsapp={profile.whatsapp} phone={profile.phone} name={profile.full_name} />
      <main>
        <Hero profile={profile} projectsCount={projects.length} />
        <About profile={profile} projectsCount={projects.length} />
        {has.experience && <Experience items={experience} />}
        {has.skills && <Skills skills={skills} />}
        {has.education && <Education items={education} />}
        {has.projects && <Projects projects={projects} />}
        <Contact profile={profile} />
      </main>
      <Footer profile={profile} />
    </>
  )
}
