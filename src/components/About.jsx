import { Stats } from './Hero'

export default function About({ profile, projectsCount }) {
  const photo = profile.about_photo_url || profile.avatar_url
  const paras = (profile.about_text || '').split(/\n\s*\n/).filter(Boolean)
  return (
    <section className="sec sec-alt" id="about">
      <div className="wrap">
        <div className="about-row">
          <div>
            <p className="eyebrow eyebrow-line">A little about me</p>
            <h2 className="sec-title left">About Me</h2>
            {profile.about_title && <p className="about-lead">{profile.about_title}</p>}
            {paras.map((p, i) => <p key={i} className="about-text">{p}</p>)}
          </div>
          {photo && (
            <figure className="about-photo">
              <img src={photo} alt={profile.full_name} />
              <figcaption>
                <b>{profile.full_name}</b>
                {profile.title && <span>{profile.title}</span>}
              </figcaption>
            </figure>
          )}
        </div>
        <Stats profile={profile} projectsCount={projectsCount} boxed />
      </div>
    </section>
  )
}
