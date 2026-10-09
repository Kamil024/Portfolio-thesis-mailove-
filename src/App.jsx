import { useEffect, useMemo, useRef, useState } from 'react';

const galleryImages = Array.from({ length: 26 }, (_, index) => ({
  src: `/Photos/${index + 1}.png`,
  alt: `Portfolio photo ${index + 1}`,
}));

const contactLinks = [
  'macapobremai@gmail.com',
  'markvince10jalandoni@gmail.com',
  'abegailbetita59@gmail.com',
  'purisimajerymae@gmail.com',
  'renierybanez82@gmail.com',
  'jancediaboco208@gmail.com',
];

const initialToolPositions = {
  ruler: { x: 120, y: 150 },
  pen: { x: 1120, y: 200 },
  pencil: { x: 180, y: 650 },
  triangle: { x: 830, y: 690 },
  compass: { x: 1180, y: 760 },
};

function App() {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [toolPositions, setToolPositions] = useState(initialToolPositions);
  const [draggingId, setDraggingId] = useState(null);
  const dragRef = useRef(null);

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, []);

  useEffect(() => {
    const handlePointerMove = (event) => {
      if (!dragRef.current) return;

      const { id, offsetX, offsetY } = dragRef.current;
      setToolPositions((prev) => {
        const tool = prev[id];
        if (!tool) return prev;

        const nextX = Math.min(Math.max(18, event.clientX - offsetX), window.innerWidth - 260);
        const nextY = Math.min(Math.max(18, event.clientY - offsetY), window.innerHeight - 140);

        return {
          ...prev,
          [id]: { ...tool, x: nextX, y: nextY },
        };
      });
    };

    const handlePointerUp = () => {
      dragRef.current = null;
      setDraggingId(null);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, []);

  useEffect(() => {
    const handlePointerMove = (event) => {
      const cursor = document.getElementById('cursor-dot');
      if (!cursor) return;
      cursor.style.left = `${event.clientX}px`;
      cursor.style.top = `${event.clientY}px`;
    };

    const hoverTargets = document.querySelectorAll('a, button, .brand-logo, .showcase-card, .btn');
    const handleEnter = () => document.getElementById('cursor-dot')?.classList.add('is-hovering');
    const handleLeave = () => document.getElementById('cursor-dot')?.classList.remove('is-hovering');

    window.addEventListener('mousemove', handlePointerMove);
    hoverTargets.forEach((target) => {
      target.addEventListener('mouseenter', handleEnter);
      target.addEventListener('mouseleave', handleLeave);
    });

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      hoverTargets.forEach((target) => {
        target.removeEventListener('mouseenter', handleEnter);
        target.removeEventListener('mouseleave', handleLeave);
      });
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (selectedIndex === null) return;

      if (event.key === 'Escape') {
        setSelectedIndex(null);
        return;
      }

      if (event.key === 'ArrowRight') {
        setSelectedIndex((prev) => (prev + 1) % galleryImages.length);
      }

      if (event.key === 'ArrowLeft') {
        setSelectedIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex]);

  useEffect(() => {
    if (selectedIndex === null) {
      document.body.classList.remove('lightbox-open');
      return;
    }

    document.body.classList.add('lightbox-open');
  }, [selectedIndex]);

  const selectedImage = useMemo(
    () => (selectedIndex === null ? null : galleryImages[selectedIndex]),
    [selectedIndex]
  );

  const openLightbox = (index) => setSelectedIndex(index);
  const closeLightbox = () => setSelectedIndex(null);
  const goToNext = () => setSelectedIndex((prev) => (prev + 1) % galleryImages.length);
  const goToPrevious = () => setSelectedIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);

  return (
    <>
      <div className="cursor" id="cursor-dot" aria-hidden="true" />
      <div className={selectedImage ? 'lightbox visible' : 'lightbox'} id="lightbox" aria-hidden={selectedImage ? 'false' : 'true'}>
        <button className="lightbox-close" id="lightbox-close" aria-label="Close preview" onClick={closeLightbox}>
          ×
        </button>
        {selectedImage && (
          <>
            <button className="lightbox-nav prev" type="button" aria-label="Previous image" onClick={goToPrevious}>
              ‹
            </button>
            <img id="lightbox-image" src={selectedImage.src} alt={selectedImage.alt} />
            <button className="lightbox-nav next" type="button" aria-label="Next image" onClick={goToNext}>
              ›
            </button>
          </>
        )}
      </div>

      <div className="bg-grid" aria-hidden="true">
        <span className="art art-line" />
        <span className="art art-triangle" />
        <span className="art art-ruler" />
      </div>

      <div className="drafting-elements" aria-hidden="true">
        {Object.entries(toolPositions).map(([id, position]) => (
          <span
            key={id}
            className={`tool tool-${id} ${draggingId === id ? 'dragging' : ''}`}
            style={{ left: `${position.x}px`, top: `${position.y}px` }}
            onPointerDown={(event) => {
              const rect = event.currentTarget.getBoundingClientRect();
              dragRef.current = {
                id,
                offsetX: event.clientX - rect.left,
                offsetY: event.clientY - rect.top,
              };
              setDraggingId(id);
            }}
          />
        ))}
      </div>

      <header className="site-header">
        <div className="container nav-bar">
          <div className="brand">
            <a className="brand-logo" href="#top" aria-label="Back to top">
              <span className="brand-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 10.5 12 3l9 7.5" />
                  <path d="M5.5 9.8V21h13V9.8" />
                  <path d="M10 21v-6h4v6" />
                </svg>
              </span>
            </a>
            <span className="brand-name">Home</span>
          </div>

          <nav className="nav-links">
            <a href="#abstract">Abstract</a>
            <a href="#research">Research</a>
            <a href="#findings">Findings</a>
            <a href="#contact">Contact</a>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="container hero-grid">
            <div>
              <div className="hero-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 6.5 7.5 9 10 6.5 12 8.5 14 6.5 16.5 9 20 6.5v11.5H4z" />
                  <path d="M12 8.5v10" />
                </svg>
              </div>
              <p className="eyebrow">Master's Thesis Portfolio</p>
              <h1>
                <span>Transforming Spaces:</span> Designing a Multi-Purpose Arena (CHMSU PRISM)
              </h1>
              <p className="hero-copy">
                This portfolio introduces your thesis, outlines your research process,
                and highlights the outcomes of your academic work.
              </p>
              <div className="hero-actions">
                <a className="btn btn-primary" href="#abstract">Explore More</a>
                <a className="btn btn-secondary" href="#contact">Get in Touch</a>
              </div>
            </div>

            <div className="hero-card hero-snapshot">
              <h2>Thesis Snapshot</h2>
              <ul>
                <li><strong>Course/Program:</strong> BS Industrial Technology Major in Architectural Drafting</li>
                <li><strong>Contributors:</strong> 6 Members</li>
                <li><strong>Adviser:</strong> Dr. Federico V. Denisa Jr.</li>
                <li><strong>Status:</strong> Completed / Thesis Portfolio</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="abstract" className="section">
          <div className="container two-col">
            <div>
              <p className="section-tag">Overview</p>
              <h2>Abstract</h2>
            </div>
            <div>
              <p>
                This study focuses on the design and planning of the CHMSU Prism Arena at Carlos Hilado Memorial State University – Alijis, addressing the need for multi-purpose facilities to enhance student engagement and community activities. Aligned with institutional goals and the United Nations Sustainable Development Goals, the four-storey arena features sustainable architecture, incorporating energy-efficient systems, water conservation, locally sourced sustainable materials, accessibility, and flexible multi-functional spaces. It aims to support various functions and generate income through partnerships and venue rentals, embodying a sustainable, student-centered infrastructure that fosters environmental responsibility and holistic development on campus.
              </p>
            </div>
          </div>
        </section>

        <section id="research" className="section alt-section">
          <div className="container">
            <p className="section-tag">Research Framework</p>
            <h2>Problem, Objectives, and Approach</h2>
            <div className="card-grid">
              <article className="info-card">
                <h3>Research Problem</h3>
                <p>
                  The study addresses the need for a multi-purpose arena that can support student engagement, campus activities, and community functions while aligning with sustainable development goals and institutional goals.
                </p>
              </article>
              <article className="info-card">
                <h3>Objectives</h3>
                <ol className="objective-list">
                  <li>Design a four-storey multi-purpose arena.</li>
                  <li>
                    Prepare architectural visualization:
                    <ol className="objective-sublist">
                      <li>Architectural storyboard</li>
                      <li>Walk-through (3D) presentation</li>
                    </ol>
                  </li>
                  <li>
                    Produce an Architectural Set of Plan:
                    <ol className="objective-sublist">
                      <li>Building Perspectives (Interior and Exterior)</li>
                      <li>Floor Plan (Ground to Fourth)</li>
                      <li>Elevations</li>
                      <li>Sections</li>
                    </ol>
                  </li>
                  <li>Determine its acceptability test in terms of site location, design consideration, function, aesthetic, green design and sustainability, and budget.</li>
                </ol>
              </article>
              <article className="info-card">
                <h3>Methodology</h3>
                <p>
                  The research involved architectural design development, visualization, planning, and evaluation of the proposed multi-purpose arena through technical drawing and acceptability assessment.
                </p>
              </article>
            </div>

            <div className="contributors-block">
              <h3>Researchers</h3>
              <div className="researcher-grid">
                {[
                  ['Betita.jpg', 'Betita, Abegail E.'],
                  ['Diaboco.jpg', 'Diaboco, Jance C.'],
                  ['Jalandoni,.jpg', 'Jalandoni, Mark Vincent M.'],
                  ['Macapobre.jpg', 'Macapobre, Mai Love G.'],
                  ['Purisima.jpg', 'Purisima, Jery Mae B.'],
                  ['Ybañez.jpg', 'Ybañez, Renier V.'],
                ].map(([file, name]) => (
                  <figure className="researcher-card" key={name}>
                    <img src={`/Photos/${file}`} alt={name} />
                    <figcaption>{name}</figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="findings" className="section">
          <div className="container">
            <p className="section-tag">Key Outcomes</p>
            <h2>Findings and Contributions</h2>
            <div className="timeline">
              <div className="timeline-item">
                <span className="dot" />
                <div>
                  <h3>Main Contribution</h3>
                  <p>
                    This study presents a complete, sustainable architectural design for the proposed four-storey CHMSU Prism Arena at Carlos Hilado Memorial State University–Alijis, establishing a blueprint that boosts student engagement, aligns with UN Sustainable Development Goals, and generates revenue through community rentals. Utilizing a descriptive-developmental research design, the project integrated environmental site analyses with feedback from licensed industry experts, earning "Acceptable" to "Highly Acceptable" ratings for its blueprints, 3D walkthroughs, and sustainability metrics. Notably, the design incorporates a 100kW solar power system projected to save ₱420,000 monthly, recovering its ₱4,500,000 initial cost in just 1.1 years. Ultimately, this project delivers the crucial technical data and visual layouts needed for immediate structural engineering and campus master planning, while serving as a practical model for future eco-friendly, socially inclusive academic infrastructure.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section alt-section">
          <div className="container">
            <p className="section-tag">Portfolio Showcase</p>
            <h2>Photo Gallery</h2>
            <div className="showcase-grid" id="photo-gallery">
              {galleryImages.map((image, index) => (
                <div className="showcase-card" key={image.src}>
                  <div className="showcase-placeholder image-placeholder">
                    <img src={image.src} alt={image.alt} onClick={() => openLightbox(index)} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <p className="section-tag">Media</p>
            <h2>Video Gallery</h2>
            <div className="showcase-grid video-grid featured-video-grid">
              <div className="showcase-card featured-video-card">
                <div className="showcase-placeholder video-placeholder featured-video-placeholder">
                  <iframe
                    src="https://www.youtube.com/embed/KHgq-vIvC7g?rel=0"
                    title="CHMSU Prism walkthrough video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <p>Walkthrough / presentation reel for the CHMSU Prism project.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="section contact-section">
          <div className="container contact-box">
            <div>
              <p className="section-tag">Contact</p>
              <h2>Let’s connect</h2>
              <p>
                Reach out for collaborations, inquiries, or discussions about the CHMSU PRISM Arena design project.
              </p>
            </div>
            <div className="contact-links">
              {contactLinks.map((email) => (
                <a
                  key={email}
                  href={`https://mail.google.com/mail/?view=cm&fs=1&to=${email}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {email}
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container">
          <p>© <span id="year">{new Date().getFullYear()}</span> Jayson. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}

export default App;
