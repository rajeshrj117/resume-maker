import React from 'react';
import { ResumeData, ThemeColor, FontSettings, FONT_SIZES } from '../types';

interface Props {
  data: ResumeData;
  theme: ThemeColor;
  templateId: number;
  fontSettings: FontSettings;
}

const PhotoCircle: React.FC<{
  photo?: string;
  name: string;
  size?: number;
  theme: ThemeColor;
  bordered?: boolean;
}> = ({ photo, name, size = 80, theme, bordered = true }) => {
  if (photo) {
    return (
      <img
        src={photo}
        alt={name}
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          objectFit: 'cover',
          border: bordered ? `3px solid ${theme.primary}` : 'none',
          flexShrink: 0,
          display: 'block',
        }}
      />
    );
  }
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: theme.primary,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: size * 0.4,
        fontWeight: 700,
        flexShrink: 0,
      }}
    >
      {(name || '?').charAt(0).toUpperCase()}
    </div>
  );
};

const AllTemplates: React.FC<Props> = ({ data, theme, templateId, fontSettings }) => {
  const {
    personalInfo: p,
    summary,
    experiences,
    education,
    skills,
    projects,
    certifications,
  } = data;

  const C = theme;
  const F = FONT_SIZES[fontSettings.size];
  const ff = fontSettings.family;

  const tagStyle = (bg: string, color: string): React.CSSProperties => ({
    display: 'inline-block',
    padding: '2px 7px',
    margin: '1px 2px 1px 0',
    borderRadius: '3px',
    fontSize: `${F.small}px`,
    backgroundColor: bg,
    color: color,
    fontWeight: 500,
    lineHeight: 1.4,
    whiteSpace: 'nowrap' as const,
  });

  const Wrapper: React.FC<{
    children: React.ReactNode;
    style?: React.CSSProperties;
  }> = ({ children, style }) => (
    <div
      id="resume-document"
      style={{
        width: '210mm',
        minHeight: '297mm',
        maxHeight: '297mm',
        margin: '0 auto',
        backgroundColor: 'white',
        boxSizing: 'border-box',
        fontFamily: ff,
        color: '#1f2937',
        fontSize: `${F.body}px`,
        overflow: 'hidden',
        ...style,
      }}
    >
      {children}
    </div>
  );

  // ============ TEMPLATE 0: Modern Accent ============
  if (templateId === 0) {
    return (
      <Wrapper style={{ padding: '24px 28px' }}>
        <header
          style={{
            borderBottom: `2.5px solid ${C.primary}`,
            paddingBottom: '12px',
            marginBottom: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <PhotoCircle photo={p.photo} name={p.fullName} size={70} theme={C} />
          <div style={{ flex: 1 }}>
            <h1
              style={{
                fontSize: `${F.h1}px`,
                fontWeight: 800,
                color: C.dark,
                margin: 0,
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
              }}
            >
              {p.fullName || 'Your Name'}
            </h1>
            <p
              style={{
                fontSize: `${F.h2}px`,
                color: C.primary,
                fontWeight: 600,
                margin: '3px 0 6px',
              }}
            >
              {p.jobTitle || 'Desired Job Title'}
            </p>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '10px',
                fontSize: `${F.small}px`,
                color: '#64748b',
              }}
            >
              {p.email && <span>✉ {p.email}</span>}
              {p.phone && <span>✆ {p.phone}</span>}
              {p.location && <span>⌖ {p.location}</span>}
              {p.linkedin && <span style={{ color: C.primary }}>{p.linkedin}</span>}
            </div>
          </div>
        </header>

        {summary && (
          <section style={{ marginBottom: '12px' }}>
            <h2
              style={{
                fontSize: `${F.h2}px`,
                fontWeight: 800,
                color: C.dark,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                margin: '0 0 5px',
              }}
            >
              Professional Summary
            </h2>
            <p style={{ fontSize: `${F.body}px`, lineHeight: 1.5, color: '#475569', margin: 0 }}>
              {summary}
            </p>
          </section>
        )}

        {experiences.length > 0 && (
          <section style={{ marginBottom: '12px' }}>
            <h2
              style={{
                fontSize: `${F.h2}px`,
                fontWeight: 800,
                color: C.dark,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: '8px',
                borderBottom: `1px solid ${C.light}`,
                paddingBottom: '3px',
              }}
            >
              Work Experience
            </h2>
            {experiences.map(exp => (
              <div key={exp.id} style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <h3
                    style={{ fontSize: `${F.h3}px`, fontWeight: 700, margin: 0, color: '#0f172a' }}
                  >
                    {exp.position}
                  </h3>
                  <span style={{ fontSize: `${F.small}px`, color: '#64748b', fontWeight: 600 }}>
                    {exp.duration}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: `${F.small}px`,
                    color: C.primary,
                    fontWeight: 600,
                    margin: '2px 0 4px',
                  }}
                >
                  {exp.company}
                  {exp.location ? ` · ${exp.location}` : ''}
                </p>
                <ul
                  style={{
                    margin: 0,
                    paddingLeft: '14px',
                    fontSize: `${F.body}px`,
                    color: '#475569',
                    lineHeight: 1.45,
                  }}
                >
                  {exp.highlights
                    .filter(h => h)
                    .map((h, i) => (
                      <li key={i} style={{ marginBottom: '1px' }}>
                        {h}
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </section>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
          <div>
            {education.length > 0 && (
              <section style={{ marginBottom: '10px' }}>
                <h2
                  style={{
                    fontSize: `${F.h2}px`,
                    fontWeight: 800,
                    color: C.dark,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    marginBottom: '6px',
                  }}
                >
                  Education
                </h2>
                {education.map(edu => (
                  <div key={edu.id} style={{ marginBottom: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <h4
                        style={{ fontSize: `${F.body}px`, fontWeight: 700, margin: 0 }}
                      >
                        {edu.degree}
                      </h4>
                      <span style={{ fontSize: `${F.small}px`, color: '#64748b' }}>
                        {edu.duration}
                      </span>
                    </div>
                    <p style={{ fontSize: `${F.small}px`, color: C.primary, margin: '1px 0 0' }}>
                      {edu.school}
                    </p>
                  </div>
                ))}
              </section>
            )}

            {projects.length > 0 && (
              <section>
                <h2
                  style={{
                    fontSize: `${F.h2}px`,
                    fontWeight: 800,
                    color: C.dark,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    marginBottom: '6px',
                  }}
                >
                  Projects
                </h2>
                {projects.map(pr => (
                  <div key={pr.id} style={{ marginBottom: '6px' }}>
                    <h4 style={{ fontSize: `${F.body}px`, fontWeight: 700, margin: 0 }}>
                      {pr.title}
                    </h4>
                    <p style={{ fontSize: `${F.small}px`, color: '#475569', margin: '1px 0' }}>
                      {pr.description}
                    </p>
                    <p style={{ fontSize: `${F.small - 1}px`, color: C.primary, margin: 0 }}>
                      {pr.technologies.join(' · ')}
                    </p>
                  </div>
                ))}
              </section>
            )}
          </div>

          <div>
            {skills.map(
              group =>
                group.items.length > 0 && (
                  <section key={group.id} style={{ marginBottom: '10px' }}>
                    <h3
                      style={{
                        fontSize: `${F.small}px`,
                        fontWeight: 700,
                        color: C.primary,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        marginBottom: '4px',
                      }}
                    >
                      {group.category}
                    </h3>
                    <div>
                      {group.items.map((s, i) => (
                        <span key={i} style={tagStyle(C.light, C.dark)}>
                          {s}
                        </span>
                      ))}
                    </div>
                  </section>
                )
            )}

            {certifications.length > 0 && (
              <section>
                <h3
                  style={{
                    fontSize: `${F.small}px`,
                    fontWeight: 700,
                    color: C.primary,
                    textTransform: 'uppercase',
                    marginBottom: '4px',
                  }}
                >
                  Certifications
                </h3>
                {certifications.map(c => (
                  <div
                    key={c.id}
                    style={{ fontSize: `${F.small}px`, color: '#475569', marginBottom: '2px' }}
                  >
                    • {c.name}
                  </div>
                ))}
              </section>
            )}
          </div>
        </div>
      </Wrapper>
    );
  }

  // ============ TEMPLATE 1: Professional Executive ============
  if (templateId === 1) {
    return (
      <Wrapper
        style={{
          padding: '32px 40px',
          fontFamily: ff.includes('serif') ? ff : 'Georgia, serif',
        }}
      >
        <header
          style={{
            textAlign: 'center',
            borderBottom: `3px double ${C.primary}`,
            paddingBottom: '14px',
            marginBottom: '14px',
          }}
        >
          {p.photo && (
            <div style={{ marginBottom: '8px' }}>
              <PhotoCircle photo={p.photo} name={p.fullName} size={60} theme={C} />
            </div>
          )}
          <h1
            style={{
              fontSize: `${F.h1}px`,
              fontWeight: 700,
              color: '#0f172a',
              letterSpacing: '0.05em',
              margin: 0,
            }}
          >
            {p.fullName || 'Your Name'}
          </h1>
          <p
            style={{
              fontSize: `${F.h2 + 1}px`,
              color: C.primary,
              fontStyle: 'italic',
              margin: '4px 0',
            }}
          >
            {p.jobTitle || 'Desired Position'}
          </p>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '14px',
              fontSize: `${F.small}px`,
              color: '#64748b',
            }}
          >
            {p.email && <span>{p.email}</span>}
            {p.phone && <span>· {p.phone}</span>}
            {p.location && <span>· {p.location}</span>}
          </div>
        </header>

        {summary && (
          <p
            style={{
              fontSize: `${F.body}px`,
              lineHeight: 1.55,
              color: '#334155',
              textAlign: 'center',
              fontStyle: 'italic',
              margin: '0 0 14px',
              padding: '0 30px',
            }}
          >
            {summary}
          </p>
        )}

        {experiences.length > 0 && (
          <section style={{ marginBottom: '12px' }}>
            <h2
              style={{
                fontSize: `${F.h2}px`,
                fontWeight: 700,
                color: C.dark,
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                borderBottom: `2px solid ${C.primary}`,
                paddingBottom: '3px',
                marginBottom: '8px',
              }}
            >
              Professional Experience
            </h2>
            {experiences.map(exp => (
              <div key={exp.id} style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <h3
                    style={{ fontSize: `${F.h3}px`, fontWeight: 700, margin: 0 }}
                  >
                    {exp.position.toUpperCase()}
                  </h3>
                  <span
                    style={{
                      fontSize: `${F.small}px`,
                      color: '#64748b',
                      fontStyle: 'italic',
                    }}
                  >
                    {exp.duration}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: `${F.small + 0.5}px`,
                    fontStyle: 'italic',
                    color: C.primary,
                    margin: '1px 0 4px',
                  }}
                >
                  {exp.company}, {exp.location}
                </p>
                <ul
                  style={{
                    margin: 0,
                    paddingLeft: '16px',
                    fontSize: `${F.body}px`,
                    color: '#475569',
                    lineHeight: 1.5,
                    fontFamily: ff,
                  }}
                >
                  {exp.highlights
                    .filter(h => h)
                    .map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                </ul>
              </div>
            ))}
          </section>
        )}

        {education.length > 0 && (
          <section style={{ marginBottom: '12px' }}>
            <h2
              style={{
                fontSize: `${F.h2}px`,
                fontWeight: 700,
                color: C.dark,
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                borderBottom: `2px solid ${C.primary}`,
                paddingBottom: '3px',
                marginBottom: '6px',
              }}
            >
              Education
            </h2>
            {education.map(edu => (
              <div
                key={edu.id}
                style={{ marginBottom: '5px', display: 'flex', justifyContent: 'space-between' }}
              >
                <div>
                  <h4 style={{ fontSize: `${F.h3}px`, fontWeight: 700, margin: 0 }}>
                    {edu.school}
                  </h4>
                  <p
                    style={{
                      fontSize: `${F.small + 0.5}px`,
                      fontStyle: 'italic',
                      margin: '1px 0',
                      color: '#475569',
                    }}
                  >
                    {edu.degree}
                  </p>
                </div>
                <span style={{ fontSize: `${F.small}px`, color: '#64748b' }}>{edu.duration}</span>
              </div>
            ))}
          </section>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {skills.length > 0 && (
            <section>
              <h2
                style={{
                  fontSize: `${F.h2}px`,
                  fontWeight: 700,
                  color: C.dark,
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  borderBottom: `2px solid ${C.primary}`,
                  paddingBottom: '3px',
                  marginBottom: '5px',
                }}
              >
                Skills
              </h2>
              {skills.map(
                g =>
                  g.items.length > 0 && (
                    <p
                      key={g.id}
                      style={{
                        fontSize: `${F.body}px`,
                        color: '#475569',
                        margin: '2px 0',
                        fontFamily: ff,
                      }}
                    >
                      <strong>{g.category}:</strong> {g.items.join(', ')}
                    </p>
                  )
              )}
            </section>
          )}
          {certifications.length > 0 && (
            <section>
              <h2
                style={{
                  fontSize: `${F.h2}px`,
                  fontWeight: 700,
                  color: C.dark,
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  borderBottom: `2px solid ${C.primary}`,
                  paddingBottom: '3px',
                  marginBottom: '5px',
                }}
              >
                Certifications
              </h2>
              {certifications.map(c => (
                <p
                  key={c.id}
                  style={{ fontSize: `${F.body}px`, color: '#475569', margin: '2px 0', fontFamily: ff }}
                >
                  {c.name} — {c.issuer}
                </p>
              ))}
            </section>
          )}
        </div>
      </Wrapper>
    );
  }

  // ============ TEMPLATE 2: Creative Dynamic (Sidebar) ============
  if (templateId === 2) {
    return (
      <Wrapper style={{ padding: 0, display: 'flex' }}>
        <aside
          style={{
            width: '34%',
            backgroundColor: C.dark,
            color: 'white',
            padding: '24px 18px',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '14px' }}>
            <PhotoCircle
              photo={p.photo}
              name={p.fullName}
              size={85}
              theme={{ ...C, primary: 'white' }}
            />
          </div>
          <h1
            style={{
              fontSize: `${F.h1 - 6}px`,
              fontWeight: 800,
              margin: '0 0 3px',
              textAlign: 'center',
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
            }}
          >
            {p.fullName || 'Your Name'}
          </h1>
          <p
            style={{
              fontSize: `${F.small}px`,
              textAlign: 'center',
              color: C.light,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: '14px',
            }}
          >
            {p.jobTitle || 'Job Title'}
          </p>

          <div
            style={{
              borderTop: '1px solid rgba(255,255,255,0.2)',
              paddingTop: '10px',
              marginBottom: '12px',
            }}
          >
            <h3
              style={{
                fontSize: `${F.small - 1}px`,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                color: 'rgba(255,255,255,0.6)',
                marginBottom: '6px',
              }}
            >
              Contact
            </h3>
            <div style={{ fontSize: `${F.small}px`, lineHeight: 1.7, opacity: 0.95 }}>
              {p.email && (
                <div style={{ wordBreak: 'break-all', marginBottom: '2px' }}>{p.email}</div>
              )}
              {p.phone && <div style={{ marginBottom: '2px' }}>{p.phone}</div>}
              {p.location && <div style={{ marginBottom: '2px' }}>{p.location}</div>}
              {p.linkedin && <div>{p.linkedin}</div>}
            </div>
          </div>

          {skills.map(
            g =>
              g.items.length > 0 && (
                <div key={g.id} style={{ marginBottom: '10px' }}>
                  <h3
                    style={{
                      fontSize: `${F.small - 1}px`,
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.15em',
                      color: 'rgba(255,255,255,0.6)',
                      marginBottom: '5px',
                    }}
                  >
                    {g.category}
                  </h3>
                  <div>
                    {g.items.map((s, i) => (
                      <span key={i} style={tagStyle('rgba(255,255,255,0.15)', 'white')}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )
          )}

          {certifications.length > 0 && (
            <div>
              <h3
                style={{
                  fontSize: `${F.small - 1}px`,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  color: 'rgba(255,255,255,0.6)',
                  marginBottom: '5px',
                }}
              >
                Certifications
              </h3>
              {certifications.map(c => (
                <div
                  key={c.id}
                  style={{ fontSize: `${F.small}px`, marginBottom: '3px', opacity: 0.9 }}
                >
                  ★ {c.name}
                </div>
              ))}
            </div>
          )}
        </aside>

        <main
          style={{ width: '66%', padding: '24px 22px', boxSizing: 'border-box' }}
        >
          {summary && (
            <section
              style={{
                marginBottom: '12px',
                padding: '10px 12px',
                backgroundColor: C.light,
                borderLeft: `3px solid ${C.primary}`,
                borderRadius: '0 5px 5px 0',
              }}
            >
              <h2
                style={{
                  fontSize: `${F.small}px`,
                  fontWeight: 700,
                  color: C.dark,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  margin: '0 0 4px',
                }}
              >
                About Me
              </h2>
              <p
                style={{ fontSize: `${F.body}px`, lineHeight: 1.5, color: '#334155', margin: 0 }}
              >
                {summary}
              </p>
            </section>
          )}

          {experiences.length > 0 && (
            <section style={{ marginBottom: '12px' }}>
              <h2
                style={{
                  fontSize: `${F.h2 + 1}px`,
                  fontWeight: 800,
                  color: '#0f172a',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: '8px',
                }}
              >
                Experience
              </h2>
              {experiences.map(exp => (
                <div
                  key={exp.id}
                  style={{
                    marginBottom: '10px',
                    paddingLeft: '12px',
                    borderLeft: `2px solid ${C.light}`,
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      left: '-4px',
                      top: '3px',
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: C.primary,
                    }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h3
                      style={{
                        fontSize: `${F.h3}px`,
                        fontWeight: 700,
                        margin: 0,
                        color: '#0f172a',
                      }}
                    >
                      {exp.position}
                    </h3>
                    <span style={{ ...tagStyle(C.light, C.dark), fontWeight: 600 }}>
                      {exp.duration}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: `${F.small}px`,
                      color: C.primary,
                      fontWeight: 600,
                      margin: '1px 0 4px',
                    }}
                  >
                    {exp.company}
                    {exp.location ? ` · ${exp.location}` : ''}
                  </p>
                  <ul
                    style={{
                      margin: 0,
                      paddingLeft: '12px',
                      fontSize: `${F.body}px`,
                      color: '#475569',
                      lineHeight: 1.5,
                    }}
                  >
                    {exp.highlights
                      .filter(h => h)
                      .map((h, i) => (
                        <li key={i}>{h}</li>
                      ))}
                  </ul>
                </div>
              ))}
            </section>
          )}

          {education.length > 0 && (
            <section style={{ marginBottom: '10px' }}>
              <h2
                style={{
                  fontSize: `${F.h2 + 1}px`,
                  fontWeight: 800,
                  color: '#0f172a',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: '6px',
                }}
              >
                Education
              </h2>
              {education.map(edu => (
                <div
                  key={edu.id}
                  style={{
                    marginBottom: '4px',
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <h4 style={{ fontSize: `${F.h3}px`, fontWeight: 700, margin: 0 }}>
                      {edu.degree}
                    </h4>
                    <p style={{ fontSize: `${F.small}px`, color: C.primary, margin: '1px 0 0' }}>
                      {edu.school}
                    </p>
                  </div>
                  <span style={{ fontSize: `${F.small}px`, color: '#64748b' }}>
                    {edu.duration}
                  </span>
                </div>
              ))}
            </section>
          )}

          {projects.length > 0 && (
            <section>
              <h2
                style={{
                  fontSize: `${F.h2 + 1}px`,
                  fontWeight: 800,
                  color: '#0f172a',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: '6px',
                }}
              >
                Projects
              </h2>
              {projects.map(pr => (
                <div key={pr.id} style={{ marginBottom: '5px' }}>
                  <h4 style={{ fontSize: `${F.h3}px`, fontWeight: 700, margin: 0 }}>{pr.title}</h4>
                  <p style={{ fontSize: `${F.small}px`, color: '#475569', margin: '1px 0' }}>
                    {pr.description}
                  </p>
                </div>
              ))}
            </section>
          )}
        </main>
      </Wrapper>
    );
  }

  // ============ TEMPLATE 3: Minimal Clean ============
  if (templateId === 3) {
    return (
      <Wrapper style={{ padding: '36px 44px' }}>
        <header style={{ marginBottom: '18px' }}>
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}
          >
            {p.photo && (
              <PhotoCircle
                photo={p.photo}
                name={p.fullName}
                size={48}
                theme={C}
                bordered={false}
              />
            )}
            <div>
              <h1
                style={{
                  fontSize: `${F.h1 - 4}px`,
                  fontWeight: 300,
                  color: '#0f172a',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  margin: 0,
                }}
              >
                {p.fullName || 'Your Name'}
              </h1>
              <p
                style={{
                  fontSize: `${F.small + 1}px`,
                  color: '#64748b',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  margin: '2px 0 0',
                }}
              >
                {p.jobTitle || 'Title'}
              </p>
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              gap: '14px',
              fontSize: `${F.small}px`,
              color: '#94a3b8',
              borderTop: '1px solid #e5e7eb',
              paddingTop: '6px',
            }}
          >
            {p.email && <span>{p.email}</span>}
            {p.phone && <span>{p.phone}</span>}
            {p.location && <span>{p.location}</span>}
          </div>
        </header>

        {summary && (
          <p
            style={{
              fontSize: `${F.body}px`,
              lineHeight: 1.65,
              color: '#475569',
              fontWeight: 300,
              margin: '0 0 18px',
            }}
          >
            {summary}
          </p>
        )}

        {experiences.length > 0 && (
          <section style={{ marginBottom: '18px' }}>
            <h2
              style={{
                fontSize: `${F.small}px`,
                fontWeight: 600,
                color: '#94a3b8',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                marginBottom: '10px',
              }}
            >
              Experience
            </h2>
            {experiences.map(exp => (
              <div
                key={exp.id}
                style={{
                  marginBottom: '12px',
                  display: 'grid',
                  gridTemplateColumns: '100px 1fr',
                  gap: '14px',
                }}
              >
                <span
                  style={{
                    fontSize: `${F.small}px`,
                    color: C.primary,
                    fontWeight: 600,
                    paddingTop: '1px',
                  }}
                >
                  {exp.duration}
                </span>
                <div>
                  <h3
                    style={{
                      fontSize: `${F.h3}px`,
                      fontWeight: 600,
                      color: '#0f172a',
                      margin: 0,
                    }}
                  >
                    {exp.position}
                  </h3>
                  <p style={{ fontSize: `${F.small}px`, color: '#64748b', margin: '1px 0 3px' }}>
                    {exp.company}
                  </p>
                  <ul
                    style={{
                      margin: 0,
                      paddingLeft: '14px',
                      fontSize: `${F.body}px`,
                      color: '#475569',
                      lineHeight: 1.55,
                      fontWeight: 300,
                    }}
                  >
                    {exp.highlights
                      .filter(h => h)
                      .map((h, i) => (
                        <li key={i}>{h}</li>
                      ))}
                  </ul>
                </div>
              </div>
            ))}
          </section>
        )}

        {education.length > 0 && (
          <section style={{ marginBottom: '14px' }}>
            <h2
              style={{
                fontSize: `${F.small}px`,
                fontWeight: 600,
                color: '#94a3b8',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                marginBottom: '8px',
              }}
            >
              Education
            </h2>
            {education.map(edu => (
              <div
                key={edu.id}
                style={{
                  marginBottom: '6px',
                  display: 'grid',
                  gridTemplateColumns: '100px 1fr',
                  gap: '14px',
                }}
              >
                <span
                  style={{ fontSize: `${F.small}px`, color: C.primary, fontWeight: 600 }}
                >
                  {edu.duration}
                </span>
                <div>
                  <h4 style={{ fontSize: `${F.body}px`, fontWeight: 600, margin: 0 }}>
                    {edu.degree}
                  </h4>
                  <p style={{ fontSize: `${F.small}px`, color: '#64748b', margin: '1px 0 0' }}>
                    {edu.school}
                  </p>
                </div>
              </div>
            ))}
          </section>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '14px' }}>
          {skills.length > 0 && (
            <>
              <h2
                style={{
                  fontSize: `${F.small}px`,
                  fontWeight: 600,
                  color: '#94a3b8',
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                  margin: 0,
                }}
              >
                Skills
              </h2>
              <div>
                {skills.map(
                  g =>
                    g.items.length > 0 && (
                      <p
                        key={g.id}
                        style={{
                          fontSize: `${F.body}px`,
                          color: '#475569',
                          margin: '2px 0',
                          fontWeight: 300,
                        }}
                      >
                        {g.items.join(' · ')}
                      </p>
                    )
                )}
              </div>
            </>
          )}
        </div>
      </Wrapper>
    );
  }

  // ============ TEMPLATE 4: Premium Sidebar ============
  if (templateId === 4) {
    return (
      <Wrapper style={{ padding: 0, display: 'flex' }}>
        <aside
          style={{
            width: '34%',
            backgroundColor: '#0f172a',
            color: 'white',
            padding: '28px 20px',
            boxSizing: 'border-box',
          }}
        >
          {p.photo && (
            <div style={{ marginBottom: '14px', textAlign: 'center' }}>
              <PhotoCircle photo={p.photo} name={p.fullName} size={85} theme={C} />
            </div>
          )}
          <h1
            style={{
              fontSize: `${F.h1 - 6}px`,
              fontWeight: 800,
              margin: '0 0 3px',
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
            }}
          >
            {p.fullName || 'Your Name'}
          </h1>
          <p
            style={{
              fontSize: `${F.small}px`,
              color: C.primary,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              margin: '0 0 18px',
            }}
          >
            {p.jobTitle || 'Job Title'}
          </p>

          <section style={{ marginBottom: '14px' }}>
            <h3
              style={{
                fontSize: `${F.small}px`,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                color: '#94a3b8',
                marginBottom: '6px',
                borderBottom: '1px solid #334155',
                paddingBottom: '3px',
              }}
            >
              Contact
            </h3>
            <div style={{ fontSize: `${F.small}px`, lineHeight: 1.7, opacity: 0.95 }}>
              {p.email && <div style={{ wordBreak: 'break-all' }}>{p.email}</div>}
              {p.phone && <div>{p.phone}</div>}
              {p.location && <div>{p.location}</div>}
              {p.linkedin && <div style={{ color: C.primary }}>{p.linkedin}</div>}
            </div>
          </section>

          {skills.map(
            g =>
              g.items.length > 0 && (
                <section key={g.id} style={{ marginBottom: '12px' }}>
                  <h3
                    style={{
                      fontSize: `${F.small}px`,
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.15em',
                      color: '#94a3b8',
                      marginBottom: '5px',
                      borderBottom: '1px solid #334155',
                      paddingBottom: '3px',
                    }}
                  >
                    {g.category}
                  </h3>
                  <div>
                    {g.items.map((s, i) => (
                      <span key={i} style={tagStyle('#1e293b', '#e2e8f0')}>
                        {s}
                      </span>
                    ))}
                  </div>
                </section>
              )
          )}

          {certifications.length > 0 && (
            <section>
              <h3
                style={{
                  fontSize: `${F.small}px`,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  color: '#94a3b8',
                  marginBottom: '5px',
                  borderBottom: '1px solid #334155',
                  paddingBottom: '3px',
                }}
              >
                Certifications
              </h3>
              {certifications.map(c => (
                <div
                  key={c.id}
                  style={{ fontSize: `${F.small}px`, marginBottom: '4px', lineHeight: 1.4 }}
                >
                  <strong>{c.name}</strong>
                  <br />
                  <span style={{ opacity: 0.7 }}>
                    {c.issuer} ({c.date})
                  </span>
                </div>
              ))}
            </section>
          )}
        </aside>

        <main style={{ width: '66%', padding: '28px 24px', boxSizing: 'border-box' }}>
          {summary && (
            <section
              style={{
                marginBottom: '14px',
                padding: '10px 14px',
                backgroundColor: C.light,
                borderLeft: `3px solid ${C.primary}`,
                borderRadius: '0 6px 6px 0',
              }}
            >
              <h2
                style={{
                  fontSize: `${F.small}px`,
                  fontWeight: 800,
                  color: C.dark,
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  margin: '0 0 4px',
                }}
              >
                About Me
              </h2>
              <p
                style={{ fontSize: `${F.body}px`, lineHeight: 1.5, color: '#334155', margin: 0 }}
              >
                {summary}
              </p>
            </section>
          )}

          {experiences.length > 0 && (
            <section style={{ marginBottom: '14px' }}>
              <h2
                style={{
                  fontSize: `${F.h2 + 1}px`,
                  fontWeight: 800,
                  color: '#0f172a',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: '8px',
                  borderBottom: '2px solid #f1f5f9',
                  paddingBottom: '3px',
                }}
              >
                Experience
              </h2>
              {experiences.map(exp => (
                <div
                  key={exp.id}
                  style={{ marginBottom: '10px', position: 'relative', paddingLeft: '14px' }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: '4px',
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: '#0f172a',
                    }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h3
                      style={{
                        fontSize: `${F.h3}px`,
                        fontWeight: 700,
                        margin: 0,
                        color: '#0f172a',
                      }}
                    >
                      {exp.position}
                    </h3>
                    <span
                      style={{ fontSize: `${F.small}px`, color: C.primary, fontWeight: 700 }}
                    >
                      {exp.duration}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: `${F.small}px`,
                      color: '#64748b',
                      fontWeight: 600,
                      margin: '1px 0 4px',
                    }}
                  >
                    {exp.company} | {exp.location}
                  </p>
                  <ul
                    style={{
                      margin: 0,
                      paddingLeft: '12px',
                      fontSize: `${F.body}px`,
                      color: '#475569',
                      lineHeight: 1.5,
                    }}
                  >
                    {exp.highlights
                      .filter(h => h)
                      .map((h, i) => (
                        <li key={i} style={{ marginBottom: '1px' }}>
                          {h}
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
            </section>
          )}

          {projects.length > 0 && (
            <section style={{ marginBottom: '12px' }}>
              <h2
                style={{
                  fontSize: `${F.h2 + 1}px`,
                  fontWeight: 800,
                  color: '#0f172a',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: '6px',
                  borderBottom: '2px solid #f1f5f9',
                  paddingBottom: '3px',
                }}
              >
                Featured Work
              </h2>
              {projects.map(pr => (
                <div key={pr.id} style={{ marginBottom: '6px' }}>
                  <h4 style={{ fontSize: `${F.h3}px`, fontWeight: 700, margin: 0 }}>
                    {pr.title}
                  </h4>
                  <p style={{ fontSize: `${F.body}px`, color: '#475569', margin: '1px 0 3px' }}>
                    {pr.description}
                  </p>
                  <div>
                    {pr.technologies.map((t, i) => (
                      <span key={i} style={tagStyle(C.light, C.dark)}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </section>
          )}

          {education.length > 0 && (
            <section>
              <h2
                style={{
                  fontSize: `${F.h2 + 1}px`,
                  fontWeight: 800,
                  color: '#0f172a',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: '6px',
                  borderBottom: '2px solid #f1f5f9',
                  paddingBottom: '3px',
                }}
              >
                Education
              </h2>
              {education.map(edu => (
                <div
                  key={edu.id}
                  style={{
                    marginBottom: '5px',
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <h4 style={{ fontSize: `${F.h3}px`, fontWeight: 700, margin: 0 }}>
                      {edu.degree}
                    </h4>
                    <p style={{ fontSize: `${F.small}px`, color: '#64748b', margin: '1px 0 0' }}>
                      {edu.school}
                    </p>
                  </div>
                  <span
                    style={{ fontSize: `${F.small}px`, color: C.primary, fontWeight: 600 }}
                  >
                    {edu.duration}
                  </span>
                </div>
              ))}
            </section>
          )}
        </main>
      </Wrapper>
    );
  }

  // ============ TEMPLATE 5: Tech Terminal ============
  if (templateId === 5) {
    return (
      <Wrapper
        style={{
          padding: '24px 28px',
          fontFamily: 'Menlo, Monaco, monospace',
          backgroundColor: '#fafafa',
        }}
      >
        <header
          style={{
            backgroundColor: '#0f172a',
            padding: '16px 18px',
            borderRadius: '6px',
            marginBottom: '14px',
            color: '#4ade80',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
          }}
        >
          {p.photo && (
            <PhotoCircle
              photo={p.photo}
              name={p.fullName}
              size={50}
              theme={{ ...C, primary: '#4ade80' }}
            />
          )}
          <div>
            <h1 style={{ fontSize: `${F.h1 - 6}px`, color: 'white', margin: 0 }}>
              // {p.fullName || 'Your Name'}
            </h1>
            <p style={{ fontSize: `${F.body}px`, margin: '3px 0' }}>
              const role = &quot;{p.jobTitle || 'Engineer'}&quot;;
            </p>
            <div style={{ fontSize: `${F.small}px`, color: '#94a3b8' }}>
              {p.email && <span>email: &quot;{p.email}&quot; </span>}
              {p.phone && <span>phone: &quot;{p.phone}&quot;</span>}
            </div>
          </div>
        </header>

        {summary && (
          <section style={{ marginBottom: '12px' }}>
            <h2 style={{ fontSize: `${F.h2}px`, color: C.primary, marginBottom: '4px' }}>
              {'/* About */'}
            </h2>
            <p
              style={{ fontSize: `${F.body}px`, color: '#475569', lineHeight: 1.55, margin: 0 }}
            >
              {summary}
            </p>
          </section>
        )}

        {experiences.length > 0 && (
          <section style={{ marginBottom: '12px' }}>
            <h2 style={{ fontSize: `${F.h2}px`, color: C.primary, marginBottom: '6px' }}>
              {'/* Experience */'}
            </h2>
            {experiences.map(exp => (
              <div
                key={exp.id}
                style={{
                  marginBottom: '8px',
                  paddingLeft: '12px',
                  borderLeft: `2px solid ${C.primary}`,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <h3 style={{ fontSize: `${F.h3}px`, fontWeight: 700, margin: 0 }}>
                    {exp.company}
                  </h3>
                  <span style={{ fontSize: `${F.small}px`, color: '#64748b' }}>
                    {exp.duration}
                  </span>
                </div>
                <p style={{ fontSize: `${F.body}px`, color: C.primary, margin: '1px 0 3px' }}>
                  {exp.position}
                </p>
                <ul
                  style={{
                    margin: 0,
                    paddingLeft: '14px',
                    fontSize: `${F.body}px`,
                    color: '#475569',
                    lineHeight: 1.5,
                  }}
                >
                  {exp.highlights
                    .filter(h => h)
                    .map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                </ul>
              </div>
            ))}
          </section>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {education.length > 0 && (
            <section>
              <h2 style={{ fontSize: `${F.h2}px`, color: C.primary, marginBottom: '5px' }}>
                {'/* Education */'}
              </h2>
              {education.map(edu => (
                <div key={edu.id} style={{ marginBottom: '4px' }}>
                  <p style={{ fontSize: `${F.body}px`, fontWeight: 700, margin: 0 }}>
                    {edu.degree}
                  </p>
                  <p style={{ fontSize: `${F.small}px`, color: '#64748b', margin: 0 }}>
                    {edu.school}
                  </p>
                </div>
              ))}
            </section>
          )}
          {skills.map(
            g =>
              g.items.length > 0 && (
                <section key={g.id}>
                  <h2 style={{ fontSize: `${F.h2}px`, color: C.primary, marginBottom: '5px' }}>
                    {`/* ${g.category} */`}
                  </h2>
                  <div>
                    {g.items.map((s, i) => (
                      <span key={i} style={tagStyle('#e5e7eb', '#1f2937')}>
                        {s}
                      </span>
                    ))}
                  </div>
                </section>
              )
          )}
        </div>
      </Wrapper>
    );
  }

  // ============ TEMPLATE 20: Voice Pro ============
  if (templateId === 20) {
    return (
      <Wrapper style={{ padding: 0, display: 'flex' }}>
        <aside
          style={{
            width: '34%',
            backgroundColor: '#516682',
            color: 'white',
            padding: '24px 20px',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'center' }}>
            {p.photo ? (
              <div
                style={{
                  width: '120px',
                  height: '140px',
                  backgroundColor: 'white',
                  padding: '4px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                }}
              >
                <img
                  src={p.photo}
                  alt={p.fullName}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            ) : (
              <div
                style={{
                  width: '120px',
                  height: '140px',
                  backgroundColor: '#e5e7eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#516682',
                  fontSize: '50px',
                  fontWeight: 700,
                }}
              >
                {(p.fullName || '?').charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <h2
            style={{
              fontSize: '16px',
              fontWeight: 400,
              letterSpacing: '0.3em',
              textAlign: 'center',
              marginBottom: '20px',
              color: 'white',
              borderBottom: '1px solid rgba(255,255,255,0.3)',
              paddingBottom: '10px',
            }}
          >
            CONTACT
          </h2>

          <div style={{ marginBottom: '24px' }}>
            {p.phone && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: `${F.body}px`,
                  marginBottom: '12px',
                }}
              >
                <span style={{ fontSize: '14px' }}>✆</span>
                <span>{p.phone}</span>
              </div>
            )}
            {p.email && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: `${F.body}px`,
                  marginBottom: '12px',
                  wordBreak: 'break-all',
                }}
              >
                <span style={{ fontSize: '14px' }}>✉</span>
                <span>{p.email}</span>
              </div>
            )}
            {p.linkedin && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: `${F.body}px`,
                  marginBottom: '12px',
                }}
              >
                <span style={{ fontSize: '14px' }}>⊙</span>
                <span>LinkedIn | Portfolio</span>
              </div>
            )}
            {p.location && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: `${F.body}px`,
                  marginBottom: '12px',
                }}
              >
                <span style={{ fontSize: '14px' }}>⌖</span>
                <span>{p.location}</span>
              </div>
            )}
          </div>

          {skills.some(s => s.items.length > 0) && (
            <>
              <h2
                style={{
                  fontSize: '16px',
                  fontWeight: 400,
                  letterSpacing: '0.3em',
                  textAlign: 'center',
                  marginBottom: '16px',
                  color: 'white',
                  borderBottom: '1px solid rgba(255,255,255,0.3)',
                  paddingBottom: '10px',
                }}
              >
                KEY SKILLS
              </h2>
              <ul style={{ listStyle: 'disc', paddingLeft: '20px', margin: 0 }}>
                {skills
                  .flatMap(g => g.items)
                  .slice(0, 8)
                  .map((s, i) => (
                    <li
                      key={i}
                      style={{ fontSize: `${F.body}px`, marginBottom: '8px', lineHeight: 1.4 }}
                    >
                      {s}
                    </li>
                  ))}
              </ul>
            </>
          )}
        </aside>

        <main
          style={{
            width: '66%',
            padding: '36px 36px 24px',
            boxSizing: 'border-box',
            backgroundColor: 'white',
            position: 'relative',
          }}
        >
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <h1
              style={{
                fontSize: '38px',
                fontWeight: 800,
                color: '#516682',
                margin: 0,
                letterSpacing: '-0.01em',
              }}
            >
              {p.fullName || 'Your Name'}
            </h1>
            {summary && (
              <p
                style={{
                  fontSize: `${F.body}px`,
                  color: '#475569',
                  marginTop: '12px',
                  lineHeight: 1.5,
                  padding: '0 8px',
                }}
              >
                {summary}
              </p>
            )}
            <div style={{ height: '1px', backgroundColor: '#cbd5e1', marginTop: '14px' }} />
          </div>

          {experiences.length > 0 && (
            <section style={{ marginBottom: '18px' }}>
              <div
                style={{
                  backgroundColor: '#a8b2c3',
                  padding: '8px 16px',
                  marginBottom: '14px',
                }}
              >
                <h2
                  style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: 'white',
                    letterSpacing: '0.15em',
                    margin: 0,
                  }}
                >
                  PROFESSIONAL EXPERIENCE
                </h2>
              </div>
              {experiences.map(exp => (
                <div key={exp.id} style={{ marginBottom: '14px', paddingLeft: '4px' }}>
                  <p
                    style={{ fontSize: `${F.small + 1}px`, color: '#64748b', margin: '0 0 2px' }}
                  >
                    {exp.duration}
                  </p>
                  <h3
                    style={{
                      fontSize: `${F.h3 + 1}px`,
                      fontWeight: 700,
                      margin: '0 0 6px',
                      color: '#1e293b',
                    }}
                  >
                    {exp.position}
                    {exp.company && (
                      <span style={{ fontWeight: 400 }}> | {exp.company}</span>
                    )}
                    {exp.location && (
                      <span style={{ fontWeight: 400 }}> | {exp.location}</span>
                    )}
                  </h3>
                  <ul
                    style={{
                      listStyle: 'disc',
                      paddingLeft: '20px',
                      margin: 0,
                      fontSize: `${F.body}px`,
                      color: '#475569',
                      lineHeight: 1.55,
                    }}
                  >
                    {exp.highlights
                      .filter(h => h)
                      .map((h, i) => (
                        <li key={i} style={{ marginBottom: '3px' }}>
                          {h}
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
            </section>
          )}

          {education.length > 0 && (
            <section style={{ marginBottom: '18px' }}>
              <div
                style={{
                  backgroundColor: '#a8b2c3',
                  padding: '8px 16px',
                  marginBottom: '14px',
                }}
              >
                <h2
                  style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: 'white',
                    letterSpacing: '0.15em',
                    margin: 0,
                  }}
                >
                  EDUCATION
                </h2>
              </div>
              {education.map(edu => (
                <div key={edu.id} style={{ marginBottom: '8px', paddingLeft: '4px' }}>
                  <h3
                    style={{
                      fontSize: `${F.h3}px`,
                      fontWeight: 700,
                      margin: 0,
                      color: '#1e293b',
                    }}
                  >
                    {edu.degree}
                  </h3>
                  <p style={{ fontSize: `${F.body}px`, color: '#475569', margin: '2px 0 0' }}>
                    {edu.school}
                    {edu.location ? `, ${edu.location}` : ''} | {edu.duration}
                  </p>
                </div>
              ))}
            </section>
          )}

          {certifications.length > 0 && (
            <section>
              <div
                style={{
                  backgroundColor: '#a8b2c3',
                  padding: '8px 16px',
                  marginBottom: '14px',
                }}
              >
                <h2
                  style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: 'white',
                    letterSpacing: '0.15em',
                    margin: 0,
                  }}
                >
                  CERTIFICATIONS
                </h2>
              </div>
              {certifications.map(c => (
                <p
                  key={c.id}
                  style={{
                    fontSize: `${F.body}px`,
                    color: '#475569',
                    margin: '4px 0 4px 4px',
                  }}
                >
                  {c.name}, {c.issuer}, {c.date}
                </p>
              ))}
            </section>
          )}
        </main>
      </Wrapper>
    );
  }

  // ============ TEMPLATE 21: Academic Split ============
  if (templateId === 21) {
    return (
      <Wrapper style={{ padding: '32px 36px', border: '1px solid #e5e7eb' }}>
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '20px',
            paddingBottom: '20px',
            borderBottom: '2px solid #1f2937',
          }}
        >
          <div>
            <h1
              style={{
                fontSize: '38px',
                fontWeight: 800,
                margin: 0,
                color: '#111827',
                letterSpacing: '-0.02em',
                lineHeight: 1,
              }}
            >
              {p.fullName || 'Your Name'}
            </h1>
            <p
              style={{
                fontSize: '12px',
                color: '#374151',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                margin: '6px 0 0',
                fontWeight: 500,
              }}
            >
              {p.jobTitle || 'Job Title'}
            </p>
          </div>
          <div
            style={{
              textAlign: 'right',
              fontSize: `${F.body}px`,
              color: '#374151',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            {p.phone && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: '8px',
                }}
              >
                <span style={{ color: '#6b7280' }}>✆</span>
                <span>{p.phone}</span>
              </div>
            )}
            {p.email && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: '8px',
                }}
              >
                <span style={{ color: '#6b7280' }}>✉</span>
                <span>{p.email}</span>
              </div>
            )}
            {p.location && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: '8px',
                }}
              >
                <span style={{ color: '#6b7280' }}>⌖</span>
                <span>{p.location}</span>
              </div>
            )}
            {p.linkedin && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: '8px',
                }}
              >
                <span style={{ color: '#6b7280' }}>in</span>
                <span>{p.linkedin}</span>
              </div>
            )}
          </div>
        </header>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2px 2.2fr', gap: '20px' }}>
          <div>
            {education.length > 0 && (
              <section style={{ marginBottom: '24px' }}>
                <h2
                  style={{
                    fontSize: '16px',
                    fontWeight: 800,
                    color: '#111827',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '12px',
                  }}
                >
                  EDUCATION
                </h2>
                {education.map(edu => (
                  <div key={edu.id} style={{ marginBottom: '12px' }}>
                    <p
                      style={{
                        fontSize: `${F.body}px`,
                        fontWeight: 700,
                        color: '#9ca3af',
                        textTransform: 'uppercase',
                        margin: '0 0 4px',
                        letterSpacing: '0.03em',
                      }}
                    >
                      {(edu.school || 'NAME').toUpperCase().slice(0, 12)} | {edu.duration || 'Year'}
                    </p>
                    <p
                      style={{
                        fontSize: `${F.body}px`,
                        color: '#374151',
                        margin: 0,
                        lineHeight: 1.4,
                      }}
                    >
                      {edu.degree}
                      <br />
                      {edu.school}
                      <br />
                      {edu.location}
                    </p>
                  </div>
                ))}
              </section>
            )}

            {skills.some(s => s.items.length > 0) && (
              <section style={{ marginBottom: '24px' }}>
                <h2
                  style={{
                    fontSize: '16px',
                    fontWeight: 800,
                    color: '#111827',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '12px',
                  }}
                >
                  SKILLS
                </h2>
                <ul
                  style={{
                    listStyle: 'disc',
                    paddingLeft: '18px',
                    margin: 0,
                    fontSize: `${F.body}px`,
                    color: '#374151',
                    lineHeight: 1.7,
                  }}
                >
                  {skills
                    .flatMap(g => g.items)
                    .slice(0, 12)
                    .map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                </ul>
              </section>
            )}

            {certifications.length > 0 && (
              <section>
                <h2
                  style={{
                    fontSize: '16px',
                    fontWeight: 800,
                    color: '#111827',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '12px',
                  }}
                >
                  AWARDS
                </h2>
                {certifications.map(c => (
                  <div key={c.id} style={{ marginBottom: '10px' }}>
                    <p
                      style={{
                        fontSize: `${F.body}px`,
                        fontWeight: 700,
                        color: '#9ca3af',
                        textTransform: 'uppercase',
                        margin: '0 0 2px',
                        letterSpacing: '0.03em',
                      }}
                    >
                      {c.date}
                    </p>
                    <p style={{ fontSize: `${F.body}px`, color: '#374151', margin: 0 }}>
                      <strong>{c.issuer}</strong> | {c.name}
                    </p>
                  </div>
                ))}
              </section>
            )}
          </div>

          <div style={{ width: '2px', backgroundColor: '#1f2937', minHeight: '500px' }} />

          <div>
            {summary && (
              <section style={{ marginBottom: '20px' }}>
                <h2
                  style={{
                    fontSize: '16px',
                    fontWeight: 800,
                    color: '#111827',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '8px',
                  }}
                >
                  CAREER OBJECTIVE
                </h2>
                <p
                  style={{
                    fontSize: `${F.body}px`,
                    lineHeight: 1.6,
                    color: '#374151',
                    margin: 0,
                  }}
                >
                  {summary}
                </p>
              </section>
            )}

            {experiences.length > 0 && (
              <section style={{ marginBottom: '20px' }}>
                <h2
                  style={{
                    fontSize: '16px',
                    fontWeight: 800,
                    color: '#111827',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '12px',
                  }}
                >
                  EXPERIENCE
                </h2>
                {experiences.map(exp => (
                  <div key={exp.id} style={{ marginBottom: '12px' }}>
                    <h3
                      style={{
                        fontSize: `${F.h3 + 1}px`,
                        fontWeight: 700,
                        margin: 0,
                        color: '#111827',
                      }}
                    >
                      {exp.position}
                    </h3>
                    <p
                      style={{
                        fontSize: `${F.small}px`,
                        fontWeight: 700,
                        color: '#9ca3af',
                        textTransform: 'uppercase',
                        margin: '2px 0 6px',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {exp.duration?.toUpperCase()}
                    </p>
                    <ul
                      style={{
                        listStyle: 'disc',
                        paddingLeft: '20px',
                        margin: 0,
                        fontSize: `${F.body}px`,
                        color: '#374151',
                        lineHeight: 1.55,
                      }}
                    >
                      {exp.highlights
                        .filter(h => h)
                        .map((h, i) => (
                          <li key={i} style={{ marginBottom: '3px' }}>
                            {h}
                          </li>
                        ))}
                    </ul>
                  </div>
                ))}
              </section>
            )}

            {projects.length > 0 && (
              <section>
                <h2
                  style={{
                    fontSize: '16px',
                    fontWeight: 800,
                    color: '#111827',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: '12px',
                  }}
                >
                  PROJECTS
                </h2>
                {projects.map(pr => (
                  <div key={pr.id} style={{ marginBottom: '10px' }}>
                    <h3
                      style={{
                        fontSize: `${F.h3 + 1}px`,
                        fontWeight: 700,
                        margin: 0,
                        color: '#111827',
                      }}
                    >
                      {pr.title}
                    </h3>
                    <p
                      style={{
                        fontSize: `${F.small}px`,
                        fontWeight: 700,
                        color: '#9ca3af',
                        textTransform: 'uppercase',
                        margin: '2px 0 6px',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {pr.technologies.join(', ').toUpperCase()}
                    </p>
                    <p
                      style={{
                        fontSize: `${F.body}px`,
                        color: '#374151',
                        margin: 0,
                        lineHeight: 1.55,
                      }}
                    >
                      {pr.description}
                    </p>
                  </div>
                ))}
              </section>
            )}
          </div>
        </div>
      </Wrapper>
    );
  }

  // ============ TEMPLATE 22: Boxed Modern ============
  if (templateId === 22) {
    return (
      <Wrapper style={{ padding: 0, backgroundColor: '#f3f4f6' }}>
        <header
          style={{
            backgroundColor: '#9ca3af',
            padding: '20px 28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <h1
              style={{
                fontSize: '26px',
                fontWeight: 800,
                color: 'white',
                margin: 0,
                letterSpacing: '0.05em',
              }}
            >
              {(p.fullName || 'Your Name').toUpperCase()}
            </h1>
            <p
              style={{
                fontSize: '12px',
                color: 'white',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                margin: '4px 0 0',
              }}
            >
              {p.jobTitle || 'Job Title'}
            </p>
          </div>
          <div
            style={{
              width: '70px',
              height: '70px',
              backgroundColor: 'white',
              padding: '3px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
            }}
          >
            {p.photo ? (
              <img
                src={p.photo}
                alt={p.fullName}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#d1d5db',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px',
                  fontWeight: 700,
                  color: '#6b7280',
                }}
              >
                {(p.fullName || '?').charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </header>

        <div style={{ padding: '20px 28px' }}>
          {summary && (
            <section
              style={{
                marginBottom: '16px',
                backgroundColor: '#e5e7eb',
                padding: '14px 18px',
              }}
            >
              <h2
                style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  color: '#374151',
                  margin: '0 0 8px',
                  letterSpacing: '0.05em',
                }}
              >
                PROFILE
              </h2>
              <p
                style={{
                  fontSize: `${F.body}px`,
                  lineHeight: 1.5,
                  color: '#374151',
                  margin: 0,
                  fontStyle: 'italic',
                }}
              >
                {summary}
              </p>
            </section>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '14px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {skills.some(s => s.items.length > 0) && (
                <section style={{ backgroundColor: '#e5e7eb', padding: '14px 16px' }}>
                  <h2
                    style={{
                      fontSize: '16px',
                      fontWeight: 700,
                      color: '#374151',
                      margin: '0 0 8px',
                      letterSpacing: '0.05em',
                    }}
                  >
                    SKILLS
                  </h2>
                  <ul
                    style={{
                      listStyle: 'disc',
                      paddingLeft: '16px',
                      margin: 0,
                      fontSize: `${F.body}px`,
                      color: '#374151',
                      lineHeight: 1.6,
                      fontStyle: 'italic',
                    }}
                  >
                    {skills
                      .flatMap(g => g.items)
                      .slice(0, 8)
                      .map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                  </ul>
                </section>
              )}

              {education.length > 0 && (
                <section style={{ backgroundColor: '#e5e7eb', padding: '14px 16px' }}>
                  <h2
                    style={{
                      fontSize: '16px',
                      fontWeight: 700,
                      color: '#374151',
                      margin: '0 0 8px',
                      letterSpacing: '0.05em',
                    }}
                  >
                    EDUCATION
                  </h2>
                  {education.map(edu => (
                    <div key={edu.id} style={{ marginBottom: '8px' }}>
                      <p
                        style={{
                          fontSize: `${F.body}px`,
                          fontWeight: 700,
                          color: '#374151',
                          margin: 0,
                          textTransform: 'uppercase',
                        }}
                      >
                        {edu.degree}
                      </p>
                      <p
                        style={{
                          fontSize: `${F.body}px`,
                          color: '#374151',
                          margin: '2px 0',
                          fontStyle: 'italic',
                        }}
                      >
                        {edu.school}
                      </p>
                      <p style={{ fontSize: `${F.small}px`, color: '#6b7280', margin: 0 }}>
                        {edu.duration}
                      </p>
                    </div>
                  ))}
                </section>
              )}

              <section style={{ backgroundColor: '#e5e7eb', padding: '14px 16px' }}>
                <h2
                  style={{
                    fontSize: '16px',
                    fontWeight: 700,
                    color: '#374151',
                    margin: '0 0 8px',
                    letterSpacing: '0.05em',
                  }}
                >
                  CONTACT
                </h2>
                <div
                  style={{
                    fontSize: `${F.body}px`,
                    color: '#374151',
                    lineHeight: 1.5,
                    fontStyle: 'italic',
                  }}
                >
                  {p.phone && <p style={{ margin: '2px 0' }}>{p.phone}</p>}
                  {p.email && (
                    <p style={{ margin: '2px 0', wordBreak: 'break-all' }}>{p.email}</p>
                  )}
                  {p.location && <p style={{ margin: '2px 0' }}>{p.location}</p>}
                  {p.website && <p style={{ margin: '2px 0' }}>{p.website}</p>}
                </div>
              </section>
            </div>

            <div>
              {experiences.length > 0 && (
                <section style={{ backgroundColor: 'white', padding: '14px 18px' }}>
                  <h2
                    style={{
                      fontSize: '18px',
                      fontWeight: 700,
                      color: '#374151',
                      margin: '0 0 12px',
                      letterSpacing: '0.05em',
                    }}
                  >
                    EXPERIENCE
                  </h2>
                  {experiences.map(exp => (
                    <div key={exp.id} style={{ marginBottom: '14px' }}>
                      <h3
                        style={{
                          fontSize: `${F.h3 + 1}px`,
                          fontWeight: 700,
                          color: '#374151',
                          margin: 0,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                        }}
                      >
                        {exp.position}
                      </h3>
                      <p
                        style={{
                          fontSize: `${F.body}px`,
                          color: '#6b7280',
                          margin: '2px 0 6px',
                          fontStyle: 'italic',
                        }}
                      >
                        {exp.company}
                      </p>
                      <ul
                        style={{
                          listStyle: 'disc',
                          paddingLeft: '18px',
                          margin: 0,
                          fontSize: `${F.body}px`,
                          color: '#374151',
                          lineHeight: 1.55,
                          fontStyle: 'italic',
                        }}
                      >
                        {exp.highlights
                          .filter(h => h)
                          .map((h, i) => (
                            <li key={i} style={{ marginBottom: '2px' }}>
                              {h}
                            </li>
                          ))}
                      </ul>
                    </div>
                  ))}
                </section>
              )}
            </div>
          </div>
        </div>
      </Wrapper>
    );
  }

  // ============ TEMPLATE 23: Engineer Blue ============
  if (templateId === 23) {
    return (
      <Wrapper style={{ padding: 0, display: 'flex' }}>
        <aside
          style={{
            width: '34%',
            backgroundColor: '#1e3a5f',
            color: 'white',
            padding: '24px 20px',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
            {p.photo ? (
              <div
                style={{
                  width: '110px',
                  height: '120px',
                  backgroundColor: 'white',
                  padding: '4px',
                }}
              >
                <img
                  src={p.photo}
                  alt={p.fullName}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            ) : (
              <div
                style={{
                  width: '110px',
                  height: '120px',
                  backgroundColor: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#1e3a5f',
                  fontSize: '50px',
                  fontWeight: 700,
                }}
              >
                {(p.fullName || '?').charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <h2
            style={{
              fontSize: '16px',
              fontWeight: 700,
              color: 'white',
              textAlign: 'center',
              letterSpacing: '0.15em',
              marginBottom: '14px',
              marginTop: '20px',
            }}
          >
            CONTACT
          </h2>
          <div
            style={{
              backgroundColor: '#2c4a6e',
              padding: '12px 14px',
              marginBottom: '20px',
              textAlign: 'center',
              fontSize: `${F.body}px`,
              lineHeight: 1.7,
            }}
          >
            {p.location && <p style={{ margin: '3px 0' }}>{p.location}</p>}
            {p.phone && <p style={{ margin: '3px 0' }}>{p.phone}</p>}
            {p.email && (
              <p style={{ margin: '3px 0', wordBreak: 'break-all' }}>{p.email}</p>
            )}
          </div>

          {education.length > 0 && (
            <>
              <h2
                style={{
                  fontSize: '16px',
                  fontWeight: 700,
                  color: 'white',
                  textAlign: 'center',
                  letterSpacing: '0.15em',
                  marginBottom: '14px',
                }}
              >
                EDUCATION
              </h2>
              <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                {education.map(edu => (
                  <div key={edu.id} style={{ marginBottom: '12px' }}>
                    <p
                      style={{
                        fontSize: `${F.body}px`,
                        fontWeight: 700,
                        margin: '0 0 2px',
                        color: 'white',
                      }}
                    >
                      {edu.degree}
                    </p>
                    <p style={{ fontSize: `${F.small}px`, color: '#cbd5e1', margin: '0 0 2px' }}>
                      {edu.school}, {edu.duration}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}

          {skills.some(s => s.items.length > 0) && (
            <>
              <h2
                style={{
                  fontSize: '16px',
                  fontWeight: 700,
                  color: 'white',
                  textAlign: 'center',
                  letterSpacing: '0.15em',
                  marginBottom: '14px',
                }}
              >
                SKILLS
              </h2>
              <div style={{ fontSize: `${F.body}px`, lineHeight: 1.6 }}>
                {skills
                  .flatMap(g => g.items)
                  .slice(0, 8)
                  .map((s, i) => (
                    <p key={i} style={{ margin: '4px 0', textAlign: 'left' }}>
                      • {s}
                    </p>
                  ))}
              </div>
            </>
          )}
        </aside>

        <main
          style={{ width: '66%', padding: 0, boxSizing: 'border-box', backgroundColor: 'white' }}
        >
          <div
            style={{
              backgroundColor: '#cfdbe8',
              padding: '32px 28px',
              marginBottom: '24px',
              textAlign: 'center',
              borderTop: '4px solid #1e3a5f',
              borderBottom: '4px solid #1e3a5f',
            }}
          >
            <h1
              style={{
                fontSize: '32px',
                fontWeight: 800,
                color: '#1e3a5f',
                margin: 0,
                letterSpacing: '0.1em',
              }}
            >
              {(p.fullName || 'YOUR NAME').toUpperCase()}
            </h1>
            <p
              style={{
                fontSize: '13px',
                color: '#1e3a5f',
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                margin: '8px 0 0',
                fontWeight: 600,
              }}
            >
              {p.jobTitle || 'PROFESSIONAL TITLE'}
            </p>
          </div>

          <div style={{ padding: '0 28px 24px' }}>
            {summary && (
              <section style={{ marginBottom: '20px' }}>
                <h2
                  style={{
                    fontSize: '20px',
                    fontWeight: 700,
                    color: '#1e3a5f',
                    margin: '0 0 8px',
                  }}
                >
                  PROFILE
                </h2>
                <p
                  style={{
                    fontSize: `${F.body}px`,
                    lineHeight: 1.5,
                    color: '#374151',
                    margin: 0,
                  }}
                >
                  {summary}
                </p>
              </section>
            )}

            {experiences.length > 0 && (
              <section style={{ marginBottom: '18px' }}>
                <h2
                  style={{
                    fontSize: '20px',
                    fontWeight: 700,
                    color: '#1e3a5f',
                    margin: '0 0 12px',
                  }}
                >
                  WORK EXPERIENCE
                </h2>
                {experiences.map(exp => (
                  <div key={exp.id} style={{ marginBottom: '14px' }}>
                    <h3
                      style={{
                        fontSize: `${F.h3 + 1}px`,
                        fontWeight: 700,
                        color: '#1e293b',
                        margin: 0,
                      }}
                    >
                      {exp.position}
                    </h3>
                    <p
                      style={{
                        fontSize: `${F.body}px`,
                        color: '#475569',
                        margin: '2px 0 6px',
                      }}
                    >
                      {exp.company}
                      {exp.duration ? `, ${exp.duration}` : ''}
                    </p>
                    <ul
                      style={{
                        listStyle: 'disc',
                        paddingLeft: '20px',
                        margin: 0,
                        fontSize: `${F.body}px`,
                        color: '#374151',
                        lineHeight: 1.55,
                      }}
                    >
                      {exp.highlights
                        .filter(h => h)
                        .map((h, i) => (
                          <li key={i} style={{ marginBottom: '2px' }}>
                            {h}
                          </li>
                        ))}
                    </ul>
                  </div>
                ))}
              </section>
            )}

            {projects.length > 0 && (
              <section>
                <h2
                  style={{
                    fontSize: '20px',
                    fontWeight: 700,
                    color: '#1e3a5f',
                    margin: '0 0 12px',
                  }}
                >
                  PROJECTS
                </h2>
                {projects.map(pr => (
                  <div key={pr.id} style={{ marginBottom: '8px' }}>
                    <h3
                      style={{
                        fontSize: `${F.h3}px`,
                        fontWeight: 700,
                        color: '#1e293b',
                        margin: 0,
                      }}
                    >
                      {pr.title}
                    </h3>
                    <p
                      style={{
                        fontSize: `${F.body}px`,
                        color: '#374151',
                        margin: '3px 0',
                        lineHeight: 1.5,
                      }}
                    >
                      {pr.description}
                    </p>
                  </div>
                ))}
              </section>
            )}
          </div>
        </main>
      </Wrapper>
    );
  }

  // ============ TEMPLATES 6–19: SimpleTemplate ============
  const SimpleTemplate = (variation: number) => {
    const isGradient = [6, 18].includes(variation);
    const isCenter = [7, 17].includes(variation);
    const isTimeline = variation === 8;
    const isGrid = variation === 9;
    const isVintage = variation === 10;
    const isDark = variation === 11;
    const isLines = variation === 12;
    const isColorBlock = variation === 13;
    const isCorporate = variation === 14;
    const isCompact = variation === 15;
    const isArtistic = variation === 16;
    const isEco = variation === 19;

    const bgColor = isDark ? '#0f172a' : isVintage ? '#fefce8' : isEco ? '#f0fdf4' : 'white';
    const textColor = isDark ? '#e2e8f0' : '#1f2937';
    const headerColor = isDark
      ? 'white'
      : isVintage
      ? '#78350f'
      : isEco
      ? '#166534'
      : '#0f172a';

    return (
      <Wrapper
        style={{
          padding: isCompact ? '20px 24px' : '28px 32px',
          backgroundColor: bgColor,
          color: textColor,
        }}
      >
        <header
          style={{
            marginBottom: '14px',
            ...(isGradient
              ? {
                  background: `linear-gradient(135deg, ${C.primary}, ${C.dark})`,
                  padding: '18px',
                  borderRadius: '8px',
                  color: 'white',
                }
              : {}),
            ...(isCenter
              ? {
                  textAlign: 'center' as const,
                  borderBottom: `2.5px solid ${C.primary}`,
                  paddingBottom: '14px',
                }
              : {}),
            ...(isColorBlock
              ? {
                  backgroundColor: C.primary,
                  color: 'white',
                  padding: '18px 28px',
                  margin: '-28px -32px 14px',
                  borderRadius: 0,
                }
              : {}),
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              justifyContent: isCenter ? 'center' : 'flex-start',
              flexDirection: isCenter ? 'column' : 'row',
            }}
          >
            <PhotoCircle
              photo={p.photo}
              name={p.fullName}
              size={isCompact ? 50 : 70}
              theme={isGradient || isColorBlock ? { ...C, primary: 'white' } : C}
            />
            <div style={{ textAlign: isCenter ? ('center' as const) : ('left' as const) }}>
              <h1
                style={{
                  fontSize: `${isCompact ? F.h1 - 4 : F.h1}px`,
                  fontWeight: 800,
                  margin: 0,
                  color:
                    isGradient || isColorBlock || isDark ? 'white' : headerColor,
                  letterSpacing: '-0.02em',
                  lineHeight: 1.1,
                }}
              >
                {p.fullName || 'Your Name'}
              </h1>
              <p
                style={{
                  fontSize: `${F.h2 + 1}px`,
                  color:
                    isGradient || isColorBlock
                      ? 'rgba(255,255,255,0.9)'
                      : C.primary,
                  fontWeight: 600,
                  margin: '3px 0 5px',
                }}
              >
                {p.jobTitle || 'Job Title'}
              </p>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '10px',
                  fontSize: `${F.small}px`,
                  color:
                    isGradient || isColorBlock || isDark
                      ? 'rgba(255,255,255,0.85)'
                      : '#64748b',
                  justifyContent: isCenter ? 'center' : 'flex-start',
                }}
              >
                {p.email && <span>{p.email}</span>}
                {p.phone && <span>{p.phone}</span>}
                {p.location && <span>{p.location}</span>}
              </div>
            </div>
          </div>
        </header>

        {summary && (
          <section
            style={{
              marginBottom: '12px',
              ...(isLines
                ? { borderLeft: `3px solid ${C.primary}`, paddingLeft: '12px' }
                : {}),
            }}
          >
            <h2
              style={{
                fontSize: `${F.h2}px`,
                fontWeight: 800,
                color: isDark ? C.primary : C.dark,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: '5px',
              }}
            >
              {isVintage ? '✦ Profile' : isEco ? '🌿 About' : 'Professional Summary'}
            </h2>
            <p
              style={{
                fontSize: `${F.body}px`,
                lineHeight: 1.5,
                color: isDark ? '#cbd5e1' : '#475569',
                margin: 0,
              }}
            >
              {summary}
            </p>
          </section>
        )}

        {experiences.length > 0 && (
          <section style={{ marginBottom: '12px' }}>
            <h2
              style={{
                fontSize: `${F.h2}px`,
                fontWeight: 800,
                color: isDark ? C.primary : C.dark,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: '8px',
                borderBottom: isCorporate ? `2px solid ${C.primary}` : 'none',
                paddingBottom: '3px',
              }}
            >
              {isVintage ? '✦ Experience' : 'Work Experience'}
            </h2>

            {isTimeline ? (
              experiences.map((exp, i) => (
                <div
                  key={exp.id}
                  style={{ display: 'flex', gap: '12px', marginBottom: '10px' }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      width: '50px',
                      flexShrink: 0,
                    }}
                  >
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: C.primary,
                      }}
                    />
                    {i < experiences.length - 1 && (
                      <div
                        style={{
                          width: '2px',
                          flex: 1,
                          backgroundColor: C.light,
                          marginTop: '3px',
                        }}
                      />
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <span
                      style={{ fontSize: `${F.small}px`, color: C.primary, fontWeight: 700 }}
                    >
                      {exp.duration}
                    </span>
                    <h3 style={{ fontSize: `${F.h3}px`, fontWeight: 700, margin: '1px 0' }}>
                      {exp.position}
                    </h3>
                    <p style={{ fontSize: `${F.small}px`, color: '#64748b', margin: '0 0 3px' }}>
                      {exp.company}
                    </p>
                    <ul
                      style={{
                        margin: 0,
                        paddingLeft: '14px',
                        fontSize: `${F.body}px`,
                        color: isDark ? '#cbd5e1' : '#475569',
                        lineHeight: 1.5,
                      }}
                    >
                      {exp.highlights
                        .filter(h => h)
                        .map((h, j) => (
                          <li key={j}>{h}</li>
                        ))}
                    </ul>
                  </div>
                </div>
              ))
            ) : (
              experiences.map(exp => (
                <div
                  key={exp.id}
                  style={{
                    marginBottom: '10px',
                    ...(isGrid || isArtistic
                      ? {
                          padding: '8px 10px',
                          backgroundColor: isDark ? '#1e293b' : '#f9fafb',
                          borderRadius: '5px',
                        }
                      : {}),
                    ...(isLines
                      ? {
                          borderLeft: `3px solid ${C.primary}`,
                          paddingLeft: '12px',
                        }
                      : {}),
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h3
                      style={{
                        fontSize: `${F.h3}px`,
                        fontWeight: 700,
                        margin: 0,
                        color: isDark ? 'white' : '#0f172a',
                      }}
                    >
                      {exp.position}
                    </h3>
                    <span
                      style={{ fontSize: `${F.small}px`, color: C.primary, fontWeight: 600 }}
                    >
                      {exp.duration}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: `${F.small}px`,
                      color: isDark ? '#94a3b8' : '#64748b',
                      fontWeight: 600,
                      margin: '1px 0 3px',
                    }}
                  >
                    {exp.company}
                    {exp.location ? ` · ${exp.location}` : ''}
                  </p>
                  <ul
                    style={{
                      margin: 0,
                      paddingLeft: '14px',
                      fontSize: `${F.body}px`,
                      color: isDark ? '#cbd5e1' : '#475569',
                      lineHeight: 1.5,
                    }}
                  >
                    {exp.highlights
                      .filter(h => h)
                      .map((h, i) => (
                        <li key={i}>{h}</li>
                      ))}
                  </ul>
                </div>
              ))
            )}
          </section>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {education.length > 0 && (
            <section>
              <h2
                style={{
                  fontSize: `${F.h2}px`,
                  fontWeight: 800,
                  color: isDark ? C.primary : C.dark,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: '5px',
                }}
              >
                Education
              </h2>
              {education.map(edu => (
                <div key={edu.id} style={{ marginBottom: '5px' }}>
                  <h4
                    style={{
                      fontSize: `${F.body}px`,
                      fontWeight: 700,
                      margin: 0,
                      color: isDark ? 'white' : '#0f172a',
                    }}
                  >
                    {edu.degree}
                  </h4>
                  <p style={{ fontSize: `${F.small}px`, color: C.primary, margin: '1px 0' }}>
                    {edu.school}
                  </p>
                  <span style={{ fontSize: `${F.small}px`, color: isDark ? '#94a3b8' : '#64748b' }}>
                    {edu.duration}
                  </span>
                </div>
              ))}
            </section>
          )}

          {skills.length > 0 && (
            <section>
              <h2
                style={{
                  fontSize: `${F.h2}px`,
                  fontWeight: 800,
                  color: isDark ? C.primary : C.dark,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: '5px',
                }}
              >
                Skills
              </h2>
              {skills.map(
                g =>
                  g.items.length > 0 && (
                    <div key={g.id} style={{ marginBottom: '5px' }}>
                      <h4
                        style={{
                          fontSize: `${F.small}px`,
                          fontWeight: 700,
                          color: isDark ? '#94a3b8' : '#64748b',
                          textTransform: 'uppercase',
                          marginBottom: '3px',
                        }}
                      >
                        {g.category}
                      </h4>
                      <div>
                        {g.items.map((s, i) => (
                          <span
                            key={i}
                            style={tagStyle(
                              isDark ? '#334155' : C.light,
                              isDark ? '#e2e8f0' : C.dark
                            )}
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )
              )}
            </section>
          )}
        </div>

        {projects.length > 0 && (
          <section style={{ marginTop: '12px' }}>
            <h2
              style={{
                fontSize: `${F.h2}px`,
                fontWeight: 800,
                color: isDark ? C.primary : C.dark,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: '6px',
              }}
            >
              Projects
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {projects.map(pr => (
                <div
                  key={pr.id}
                  style={{
                    padding: '8px',
                    backgroundColor: isDark ? '#1e293b' : C.light,
                    borderRadius: '5px',
                  }}
                >
                  <h4
                    style={{
                      fontSize: `${F.body}px`,
                      fontWeight: 700,
                      margin: 0,
                      color: isDark ? 'white' : C.dark,
                    }}
                  >
                    {pr.title}
                  </h4>
                  <p
                    style={{
                      fontSize: `${F.small}px`,
                      margin: '2px 0',
                      color: isDark ? '#cbd5e1' : '#475569',
                    }}
                  >
                    {pr.description}
                  </p>
                  <p style={{ fontSize: `${F.small}px`, color: C.primary, margin: 0 }}>
                    {pr.technologies.join(' · ')}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {certifications.length > 0 && (
          <section style={{ marginTop: '10px' }}>
            <h2
              style={{
                fontSize: `${F.h2}px`,
                fontWeight: 800,
                color: isDark ? C.primary : C.dark,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: '5px',
              }}
            >
              Certifications
            </h2>
            <div style={{ fontSize: `${F.body}px`, color: isDark ? '#cbd5e1' : '#475569' }}>
              {certifications.map(c => (
                <span key={c.id} style={{ marginRight: '10px' }}>
                  ★ <strong>{c.name}</strong> ({c.issuer})
                </span>
              ))}
            </div>
          </section>
        )}
      </Wrapper>
    );
  };

  return SimpleTemplate(templateId);
};

export default AllTemplates;