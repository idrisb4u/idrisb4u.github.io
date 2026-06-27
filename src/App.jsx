import React, { useState } from 'react';
import { 
  Briefcase, GraduationCap, Award, Cpu, 
  Linkedin, Mail, Phone, MapPin, 
  ArrowRight, Shield, Sliders, TrendingUp, Layers, CheckCircle2,
  MessageSquare
} from 'lucide-react';
import { PROFILE_DATA } from './context';
import Chatbot from './components/Chatbot';

const getCompanyLogo = (company) => {
  const cleanCompany = company.toLowerCase();
  if (cleanCompany.includes('eaton')) {
    return (
      <img src="/assets/eaton_logo.png" alt="Eaton Logo" style={{ height: '22px', objectFit: 'contain', display: 'inline-block', verticalAlign: 'middle' }} />
    );
  }
  if (cleanCompany.includes('mphasis')) {
    return (
      <img src="/assets/mphasis_logo.png" alt="Mphasis Logo" style={{ height: '22px', objectFit: 'contain', display: 'inline-block', verticalAlign: 'middle' }} />
    );
  }
  if (cleanCompany.includes('oracle')) {
    return (
      <img src="/assets/oracle_logo.png" alt="Oracle Logo" style={{ height: '18px', objectFit: 'contain', display: 'inline-block', verticalAlign: 'middle' }} />
    );
  }
  if (cleanCompany.includes('csc')) {
    return (
      <img src="/assets/csc_logo.png" alt="CSC Logo" style={{ height: '20px', objectFit: 'contain', display: 'inline-block', verticalAlign: 'middle' }} />
    );
  }
  return null;
};

export default function App() {
  const [activeTab, setActiveTab] = useState('experience');
  const [expandedExperience, setExpandedExperience] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="app-container">
      {/* Left Pane - Profile Contents */}
      <main className="main-content">
        
        {/* Header Hero Section */}
        <section style={{ marginBottom: '40px', display: 'flex', gap: '30px', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Main Headshot Image */}
          <div style={{ position: 'relative' }}>
            <div style={{
              width: '150px',
              height: '150px',
              borderRadius: '30px',
              overflow: 'hidden',
              border: '3px solid var(--accent-cyan)',
              boxShadow: '0 0 20px rgba(37, 99, 235, 0.15)'
            }}>
              <img 
                src={PROFILE_DATA.photos.photo1} 
                alt={PROFILE_DATA.name} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  // Fallback if image fails to load
                  e.target.src = "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&fit=crop&q=80";
                }}
              />
            </div>
            <div style={{
              position: 'absolute',
              bottom: '-5px',
              right: '-5px',
              backgroundColor: 'var(--bg-primary)',
              padding: '6px',
              borderRadius: '50%'
            }}>
              <div className="pulse-dot"></div>
            </div>
          </div>

          <div style={{ flex: 1, minWidth: '300px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span style={{ 
                fontSize: '0.75rem', 
                backgroundColor: 'rgba(6, 182, 212, 0.1)', 
                color: 'var(--accent-cyan)', 
                padding: '4px 12px', 
                borderRadius: '20px',
                fontWeight: 600,
                border: '1px solid rgba(6, 182, 212, 0.2)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                Enterprise AI Transformation
              </span>
            </div>
            
            <h1 className="text-gradient" style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '10px' }}>
              {PROFILE_DATA.name}
            </h1>
            
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', fontWeight: 500, marginBottom: '16px' }}>
              {PROFILE_DATA.headline}
            </p>

            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={14} style={{ color: 'var(--accent-cyan)' }} /> {PROFILE_DATA.location}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Mail size={14} style={{ color: 'var(--accent-cyan)' }} /> {PROFILE_DATA.email}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Phone size={14} style={{ color: 'var(--accent-cyan)' }} /> {PROFILE_DATA.phone}
              </span>
              <a 
                href={PROFILE_DATA.linkedin} 
                target="_blank" 
                rel="noreferrer" 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px', 
                  color: 'var(--accent-cyan)', 
                  textDecoration: 'none',
                  fontWeight: 500
                }}
                onMouseOver={(e) => e.currentTarget.style.textDecoration = 'underline'}
                onMouseOut={(e) => e.currentTarget.style.textDecoration = 'none'}
              >
                <Linkedin size={14} /> LinkedIn Profile
              </a>
            </div>
          </div>
        </section>

        {/* Bio Card */}
        <section className="glass-card" style={{ marginBottom: '45px' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '12px', color: 'var(--accent-cyan)' }}>Executive Summary</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem', lineHeight: 1.7 }}>
            {PROFILE_DATA.executiveProfile}
          </p>
        </section>

        {/* Differentiating Strengths Grid */}
        <section style={{ marginBottom: '45px' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Award size={22} style={{ color: 'var(--accent-purple)' }} /> Differentiating Strengths
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {PROFILE_DATA.strengths.map((str, idx) => (
              <div key={idx} className="glass-card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  {idx === 0 && <Layers size={20} style={{ color: 'var(--accent-cyan)' }} />}
                  {idx === 1 && <Sliders size={20} style={{ color: 'var(--accent-cyan)' }} />}
                  {idx === 2 && <TrendingUp size={20} style={{ color: 'var(--accent-cyan)' }} />}
                  {idx === 3 && <CheckCircle2 size={20} style={{ color: 'var(--accent-cyan)' }} />}
                  {idx === 4 && <Shield size={20} style={{ color: 'var(--accent-cyan)' }} />}
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>{str.title}</h3>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{str.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tabbed details */}
        <section style={{ marginBottom: '45px' }}>
          <div className="tabs-container">
            <button 
              className={`tab-btn ${activeTab === 'experience' ? 'active' : ''}`}
              onClick={() => setActiveTab('experience')}
            >
              <Briefcase size={16} style={{ marginRight: '6px', display: 'inline' }} />
              Professional Experience
            </button>
            <button 
              className={`tab-btn ${activeTab === 'skills' ? 'active' : ''}`}
              onClick={() => setActiveTab('skills')}
            >
              <Cpu size={16} style={{ marginRight: '6px', display: 'inline' }} />
              Skills Matrix
            </button>
            <button 
              className={`tab-btn ${activeTab === 'education' ? 'active' : ''}`}
              onClick={() => setActiveTab('education')}
            >
              <GraduationCap size={16} style={{ marginRight: '6px', display: 'inline' }} />
              Education & Credentials
            </button>
          </div>

          {/* Experience Timeline */}
          {activeTab === 'experience' && (
            <div className="timeline">
              {PROFILE_DATA.experience.map((exp, idx) => (
                <div key={idx} className="timeline-item">
                  <div className={`timeline-dot ${expandedExperience === idx ? 'active' : ''}`}></div>
                  <div 
                    className="glass-card" 
                    style={{ 
                       cursor: 'pointer',
                       borderLeft: expandedExperience === idx ? '3px solid var(--accent-cyan)' : '1px solid var(--border-color)',
                       background: expandedExperience === idx ? 'var(--bg-secondary)' : 'var(--bg-card)'
                    }}
                    onClick={() => setExpandedExperience(idx)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '8px' }}>
                      <div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{exp.role}</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                          {getCompanyLogo(exp.company)}
                          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>— {exp.company}</span>
                        </div>
                      </div>
                      <span style={{ 
                        fontSize: '0.8rem', 
                        backgroundColor: 'var(--bg-tab)', 
                        padding: '4px 10px', 
                        borderRadius: '12px',
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-secondary)'
                      }}>
                        {exp.period}
                      </span>
                    </div>

                    {expandedExperience === idx ? (
                      <div style={{ marginTop: '15px' }}>
                        <ul style={{ paddingLeft: '18px', listStyleType: 'disc', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '15px' }}>
                          {exp.highlights.map((hl, hlIdx) => (
                            <li key={hlIdx} style={{ marginBottom: '8px' }}>{hl}</li>
                          ))}
                        </ul>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                          {exp.skills.map((skill, skIdx) => (
                            <span key={skIdx} className="skill-tag">{skill}</span>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--accent-cyan)', marginTop: '8px' }}>
                        <span>Click to view details & achievements</span>
                        <ArrowRight size={12} />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Skills Categorized */}
          {activeTab === 'skills' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {Object.entries(PROFILE_DATA.skillsGrouped).map(([category, list], idx) => (
                <div key={idx} className="glass-card">
                  <h3 style={{ fontSize: '1.1rem', color: 'var(--accent-cyan)', marginBottom: '15px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                    {category}
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {list.map((skill, sIdx) => (
                      <span 
                        key={sIdx} 
                        style={{
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid var(--border-color)',
                          color: 'var(--text-secondary)',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          fontSize: '0.85rem',
                          transition: 'var(--transition-smooth)'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.4)';
                          e.currentTarget.style.color = 'var(--text-primary)';
                          e.currentTarget.style.background = 'rgba(6, 182, 212, 0.03)';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.borderColor = 'var(--border-color)';
                          e.currentTarget.style.color = 'var(--text-secondary)';
                          e.currentTarget.style.background = 'var(--bg-suggestion)';
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Education & Certs */}
          {activeTab === 'education' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              
              {/* Certifications Card */}
              <div className="glass-card">
                <h3 style={{ fontSize: '1.1rem', color: 'var(--accent-cyan)', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Award size={18} /> Professional Certifications
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
                  {PROFILE_DATA.certifications.map((cert, cIdx) => (
                    <div 
                      key={cIdx} 
                      style={{
                        padding: '12px 16px',
                        borderRadius: '10px',
                        background: 'var(--bg-tab)',
                        border: '1px solid var(--border-color)',
                        fontSize: '0.88rem',
                        color: 'var(--text-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                      }}
                    >
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-cyan)' }}></div>
                      {cert}
                    </div>
                  ))}
                </div>
              </div>

              {/* Education Card */}
              <div className="glass-card">
                <h3 style={{ fontSize: '1.1rem', color: 'var(--accent-cyan)', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <GraduationCap size={18} /> Education
                </h3>
                {PROFILE_DATA.education.map((edu, eIdx) => (
                  <div key={eIdx}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
                      <div>
                        <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>{edu.degree}</h4>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{edu.school}</p>
                      </div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{edu.period}</span>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}
        </section>

      </main>

      {/* Right Pane - Chatbot Agent */}
      <Chatbot isMobileOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      {/* Mobile Floating Action Button (FAB) */}
      <button 
        className="chat-fab" 
        onClick={() => setIsChatOpen(true)}
        aria-label="Open chat assistant"
      >
        <MessageSquare size={24} />
      </button>
    </div>
  );
}
