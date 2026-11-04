import { useEffect, useRef, useState } from 'react'
import avowedImage from './assets/avowed.jpg'
import avowedCreditsImage from './assets/avowed-credits.jpg'
import bloomAndRageImage from './assets/bloom-and-rage.png'
import bloomAndRageCreditsImage from './assets/bloom-and-rage-credits.jpg'
import mindsEyeImage from './assets/mindseye.jpg'
import slimeRancherImage from './assets/slime-rancher-2.jpg'
import './App.css'

const places = [
  {
    name: 'Lost Records: Bloom & Rage',
    location: 'Narrative adventure',
    category: "DON'T NOD MONTREAL",
    number: '01',
    image: bloomAndRageImage,
    alt: 'Lost Records: Bloom & Rage key art featuring four friends in a forest',
    creditsImage: bloomAndRageCreditsImage,
    creditsAlt: 'Lost Records: Bloom & Rage localization credits listing Fernando Esquivel Hidalgo',
    color: '#c26d45',
  },
  {
    name: 'Avowed',
    location: 'Fantasy role playing',
    category: 'Obsidian Entertainment',
    number: '02',
    image: avowedImage,
    alt: 'Avowed key art showing a fantasy warrior and sword',
    creditsImage: avowedCreditsImage,
    creditsAlt: 'Avowed localization credits listing Fernando Esquivel for Spanish Latin America',
    color: '#56756f',
  },
  {
    name: 'MindsEye',
    location: 'Science fiction action adventure',
    category: 'Build a Rocket Boy',
    number: '03',
    image: mindsEyeImage,
    alt: 'MindsEye key art featuring two characters in a futuristic city',
    color: '#52798e',
  },
  {
    name: 'Slime Rancher 2',
    location: 'Life simulation adventure',
    category: 'Monomi Park',
    number: '04',
    image: slimeRancherImage,
    alt: 'Slime Rancher 2 key art with colorful slimes and its rancher',
    color: '#a76948',
  },
]

const navigationItems = [
  { label: 'MY PROFESSIONAL EXPERIENCE', href: '#capabilities' },
  { label: 'THE WORK', href: '#work' },
  { label: 'ABOUT', href: '#about' },
  { label: 'CONTACT', href: '#contact' },
]

const skillLevels = ['Basic', 'Beginner', 'Intermediate', 'Advanced']

const skills = [
  { name: 'MySQL', level: 'Advanced' },
  { name: 'HTML5', level: 'Advanced' },
  { name: 'CSS3', level: 'Advanced' },
  { name: 'Tailwind CSS', level: 'Advanced' },
  { name: 'Java', level: 'Beginner' },
  { name: 'Python', level: 'Basic' },
  { name: 'JavaScript', level: 'Beginner' },
]

function App() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [showingCreditsFor, setShowingCreditsFor] = useState(null)
  const [isPaused, setIsPaused] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isContactMenuOpen, setIsContactMenuOpen] = useState(false)
  const [isBrandClicked, setIsBrandClicked] = useState(false)
  const dragStart = useRef(null)
  const carouselRef = useRef(null)
  const navigationRef = useRef(null)
  const brandAnimationTimer = useRef(null)

  useEffect(() => {
    if (isPaused || isDragging) return undefined

    const timer = window.setInterval(() => {
      setShowingCreditsFor(null)
      setActiveIndex((index) => (index + 1) % places.length)
    }, 10000)

    return () => window.clearInterval(timer)
  }, [isDragging, isPaused])

  useEffect(() => {
    const revealItems = document.querySelectorAll('.scroll-reveal')

    if (!('IntersectionObserver' in window)) {
      revealItems.forEach((item) => item.classList.add('is-visible'))
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle('is-visible', entry.isIntersecting)
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -32px 0px' },
    )

    revealItems.forEach((item) => observer.observe(item))

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isContactMenuOpen) return undefined

    const closeOnOutsidePointer = (event) => {
      if (!navigationRef.current?.contains(event.target)) {
        setIsContactMenuOpen(false)
      }
    }

    document.addEventListener('pointerdown', closeOnOutsidePointer)
    return () => document.removeEventListener('pointerdown', closeOnOutsidePointer)
  }, [isContactMenuOpen])

  useEffect(
    () => () => {
      window.clearTimeout(brandAnimationTimer.current)
    },
    [],
  )

  const handleBrandClick = (event) => {
    event.preventDefault()
    window.clearTimeout(brandAnimationTimer.current)
    setIsBrandClicked(false)
    window.requestAnimationFrame(() => setIsBrandClicked(true))
    brandAnimationTimer.current = window.setTimeout(() => setIsBrandClicked(false), 700)
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    })
  }

  const moveTo = (direction) => {
    setShowingCreditsFor(null)
    setActiveIndex((index) => (index + direction + places.length) % places.length)
  }

  const toggleCredits = (index) => {
    setActiveIndex(index)
    setShowingCreditsFor((current) => current === index ? null : index)
  }

  const handlePointerDown = (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    const creditsButton = event.target.closest('.credits-image-toggle')
    dragStart.current = {
      x: event.clientX,
      pointerId: event.pointerId,
      creditsIndex: creditsButton ? Number(creditsButton.dataset.creditIndex) : null,
    }
    setIsDragging(true)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (event) => {
    if (!dragStart.current || dragStart.current.pointerId !== event.pointerId) return
    setDragOffset(event.clientX - dragStart.current.x)
  }

  const handlePointerUp = (event) => {
    if (!dragStart.current || dragStart.current.pointerId !== event.pointerId) return

    const { creditsIndex, x } = dragStart.current
    const distance = event.clientX - x
    if (Math.abs(distance) > 55) {
      moveTo(distance < 0 ? 1 : -1)
    } else if (creditsIndex !== null && Math.abs(distance) < 12) {
      toggleCredits(creditsIndex)
    }
    dragStart.current = null
    setDragOffset(0)
    setIsDragging(false)
  }

  const handlePointerCancel = () => {
    dragStart.current = null
    setDragOffset(0)
    setIsDragging(false)
  }

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      moveTo(1)
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      moveTo(-1)
    }
  }

  return (
    <>
      <main className="min-h-screen overflow-hidden bg-[#100a24] text-[#f9efff]">
      <div className="site-shell mx-auto flex min-h-screen max-w-[1126px] flex-col">
        <header className="topbar flex items-center justify-between px-5 sm:px-8 lg:px-10">
          <div className="brand flex items-center gap-2.5">
            <a
              className={`brand-icon${isBrandClicked ? ' is-clicked' : ''}`}
              href="#capabilities"
              aria-label="Back to top"
              onClick={handleBrandClick}
            >
              <svg className="brand-mark" viewBox="0 0 16 12" aria-hidden="true" shapeRendering="crispEdges">
                <path d="M2 0h2v1h1v1h6V1h1V0h2v1h1v2h1v5h-2v2h-2V9H4v1H2V8H0V3h1V1h1z" />
                <path className="brand-mark-eye brand-mark-eye-left" d="M3 4h2v2H3z" />
                <path className="brand-mark-eye brand-mark-eye-right" d="M9 4h2v2H9z" />
              </svg>
            </a>
            <span>Fernando Esquivel H.</span>
          </div>
          <nav
            ref={navigationRef}
            id="main-navigation"
            className={`header-nav ${isMenuOpen ? 'is-open' : ''}`}
            aria-label="Main navigation"
          >
            {navigationItems.map((item) => (
              <div
                className={`nav-item${item.label === 'CONTACT' ? ' nav-item-contact' : ''}`}
                key={item.label}
              >
                {item.label === 'CONTACT' ? (
                  <button
                    className="nav-link nav-contact-toggle"
                    type="button"
                    aria-expanded={isContactMenuOpen}
                    aria-controls="contact-submenu"
                    onClick={() => setIsContactMenuOpen((open) => !open)}
                  >
                    {item.label}
                  </button>
                ) : (
                  <a
                    className="nav-link"
                    href={item.href}
                    onClick={() => {
                      setIsMenuOpen(false)
                      setIsContactMenuOpen(false)
                    }}
                  >
                    {item.label}
                  </a>
                )}
                {item.label === 'CONTACT' && (
                  <div
                    className={`contact-submenu${isContactMenuOpen ? ' is-open' : ''}`}
                    id="contact-submenu"
                    aria-label="Contact options"
                    aria-hidden={!isContactMenuOpen}
                  >
                    <a className="contact-submenu-link" href="tel:+50687196676">
                      +506 8719-6676
                    </a>
                    <a className="contact-submenu-link" href="mailto:fernando30_96@hotmail.com">
                      fernando30_96@hotmail.com
                    </a>
                    <a
                      className="contact-submenu-link"
                      href={`${import.meta.env.BASE_URL}my-cv.pdf`}
                      download="Fernando-Esquivel-CV.pdf"
                    >
                      My CV
                    </a>
                  </div>
                )}
              </div>
            ))}
          </nav>
          <button
            className={`menu-toggle ${isMenuOpen ? 'is-open' : ''}`}
            type="button"
            aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMenuOpen}
            aria-controls="main-navigation"
            onClick={() => {
              setIsMenuOpen((open) => !open)
              setIsContactMenuOpen(false)
            }}
          >
            <span />
            <span />
            <span />
          </button>
        </header>

        <section id="capabilities" className="portfolio-section capabilities-section px-6 sm:px-10">
          <div className="section-heading">
            <h1>My professional experience</h1>
          </div>
          <div className="capability-list">
            <details className="capability-card scroll-reveal" open>
              <summary>
                <span className="capability-title" role="heading" aria-level="2">Amazon Alexa AI services</span>
                <span className="capability-dates">2019-2022 &amp; 2025-Present</span>
              </summary>
              <p>
                AI Data Annotation focused on Transcriptions to train AI Language Models by
                carefully categorizing critical data utilizing internal Guidelines, following
                required safety and privacy standards.
              </p>
              <p>
                AI Content Auditor focused on Quality checks for AI responses and user-asked
                questions to teach AI Language Modules how to asses for better answers, better
                understand user inputs and ensure internal standards are met.
              </p>
            </details>
            <details className="capability-card scroll-reveal" open>
              <summary>
                <span className="capability-title" role="heading" aria-level="2">Xbox testing for Certification</span>
                <span className="capability-dates">2023-2024</span>
              </summary>
              <p>
                Videogame QA manual testing utilizing diverse reporting tools heavily influenced
                by team communication, detailed bug writing and auditing, attention to detail and
                time management. Wide knowledge of the videogame industry as well.
              </p>
            </details>
            <details className="capability-card scroll-reveal" open>
              <summary>
                <span className="capability-title" role="heading" aria-level="2">Localization software testing</span>
                <span className="capability-dates">2024-2025</span>
              </summary>
              <p>
                Videogame Localization QA utilizing diverse reporting tools heavily influenced
                by team communication, detailed bug writing and auditing, attention to detail and
                time management. Wide knowledge of the videogame industry as well.
              </p>
            </details>
          </div>
        </section>

        <section
          id="work"
          className="carousel-section portfolio-section scroll-reveal"
          aria-label="Localization QA - Lionbridge"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocus={() => setIsPaused(true)}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) setIsPaused(false)
          }}
        >
          <div className="section-heading px-6 sm:px-10">
            <div>
              <h2>Localization QA - Lionbridge</h2>
            </div>
            <p className="section-description">
              A selection of some videogames I'm credited for my work as LQA for English to Latin American Spanish translations.
            </p>
          </div>
          <div
            ref={carouselRef}
            className={`carousel-viewport ${isDragging ? 'is-dragging' : ''}`}
            style={{ '--active-index': activeIndex, '--drag-offset': `${dragOffset}px` }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
            onKeyDown={handleKeyDown}
            role="region"
            aria-roledescription="carousel"
            aria-label="Explore four localization QA credits"
            tabIndex={0}
          >
            <div className="carousel-track">
              {places.map((place, index) => {
                const isActive = index === activeIndex
                const isShowingCredits = showingCreditsFor === index
                return (
                  <article
                    className={`place-card ${isActive ? 'is-active' : ''}${isShowingCredits ? ' is-showing-credits' : ''}`}
                    key={place.number}
                    aria-current={isActive ? 'true' : undefined}
                    aria-label={`${place.number} of ${places.length}: ${place.name}, ${place.location}`}
                    style={{ '--card-accent': place.color }}
                  >
                    <img className="place-image" src={place.image} alt={place.alt} draggable="false" />
                    {place.creditsImage && (
                      <>
                        <img
                          className={`place-image credits-image${isShowingCredits ? ' is-visible' : ''}`}
                          src={place.creditsImage}
                          alt={place.creditsAlt}
                          draggable="false"
                        />
                        <button
                          className="credits-image-toggle"
                          data-credit-index={index}
                          type="button"
                          aria-label={`${isShowingCredits ? 'Show' : 'View'} ${place.name} ${isShowingCredits ? 'artwork' : 'localization credits'}`}
                          aria-pressed={isShowingCredits}
                          onClick={(event) => {
                            if (event.detail === 0) toggleCredits(index)
                          }}
                        />
                      </>
                    )}
                    <div className="card-shade" />
                    <div className="card-topline" aria-hidden="true">
                      <span className="card-category">{place.category}</span>
                    </div>
                    <div className="card-caption" aria-hidden="true">
                      <h3>{place.name}</h3>
                      <p>{place.location}</p>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>

          <div className="carousel-controls mx-auto flex items-center justify-center px-6 sm:px-10">
            <div className="slide-progress" role="group" aria-label="Choose a localization QA credit">
              {places.map((place, index) => (
                <button
                  className={`progress-dot ${index === activeIndex ? 'is-active' : ''}`}
                  key={place.number}
                  type="button"
                  onClick={() => {
                    setShowingCreditsFor(null)
                    setActiveIndex(index)
                  }}
                  aria-label={`Show ${place.name}`}
                  aria-current={index === activeIndex ? 'true' : undefined}
                />
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="portfolio-section about-section px-6 sm:px-10" aria-label="About">
          <h2 className="about-heading">About me</h2>
          <div className="about-copy scroll-reveal">
            <p>
              I've always been someone who notices the little details: the references in
              movies and games, the nods and homages to other great artists and media,
              and the care put into software that makes users feel an emotional attachment.
              I notice the details that prove a developer cares. Any misspelled word, any
              process in need of an upgrade, any development that needs a keen eye. That's
              where I shine.
            </p>
            <div className="skills-panel">
              <h3>Skills</h3>
              <ul className="skills-list">
                {skills.map((skill) => {
                  const levelIndex = skillLevels.indexOf(skill.level)
                  return (
                    <li className="skill-item" key={skill.name}>
                      <div className="skill-label">
                        <span>{skill.name}</span>
                        <span>{skill.level}</span>
                      </div>
                      <div
                        className="skill-meter"
                        role="meter"
                        aria-label={`${skill.name} skill level`}
                        aria-valuemin={1}
                        aria-valuemax={skillLevels.length}
                        aria-valuenow={levelIndex + 1}
                        aria-valuetext={skill.level}
                      >
                        {skillLevels.map((level, index) => (
                          <span
                            className={`skill-meter-segment${index <= levelIndex ? ' is-filled' : ''}`}
                            key={level}
                            aria-hidden="true"
                          />
                        ))}
                      </div>
                      <div className="skill-meter-labels" aria-hidden="true">
                        {skillLevels.map((level) => <span key={level}>{level}</span>)}
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
          <div
            className="about-image-placeholder scroll-reveal"
            role="img"
            aria-label="Image placeholder"
          />
        </section>

        <section id="contact" className="portfolio-section contact-section scroll-reveal px-6 sm:px-10">
          <h2>Get in contact with me:</h2>
          <div className="contact-methods" aria-label="Contact information">
            <article className="contact-method">
              <svg className="contact-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m4 7 8 6 8-6" />
              </svg>
              <div>
                <h3>Email</h3>
                <a href="mailto:fernando30_96@hotmail.com">fernando30_96@hotmail.com</a>
              </div>
            </article>
            <article className="contact-method">
              <svg className="contact-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M7 3h3l2 5-2.2 1.6a15 15 0 0 0 4.6 4.6L16 12l5 2v3c0 1.1-.9 2-2 2C10.7 19 5 13.3 5 6c0-1.7.9-3 2-3Z" />
              </svg>
              <div>
                <h3>Phone</h3>
                <a href="tel:+50687196676">+506 8719-6676</a>
              </div>
            </article>
            <article className="contact-method">
              <svg className="contact-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M5.2 3.5a2.2 2.2 0 1 0 0 4.4 2.2 2.2 0 0 0 0-4.4ZM3.3 9.4h3.8v11.1H3.3V9.4Zm6.1 0H13v1.5h.1c.5-.9 1.7-1.9 3.6-1.9 3.9 0 4.6 2.5 4.6 5.7v5.8h-3.8v-5.1c0-1.2 0-2.8-1.8-2.8s-2.1 1.3-2.1 2.7v5.2H9.4V9.4Z" />
              </svg>
              <div>
                <h3>LinkedIn</h3>
                <a
                  href="https://www.linkedin.com/in/fernando-esquivel-hidalgo-13b31a174/"
                  target="_blank"
                  rel="noreferrer"
                >
                  LinkedIn profile
                </a>
              </div>
            </article>
          </div>
        </section>

        <footer className="page-footer mt-auto flex flex-col items-center justify-between gap-3 px-6 sm:flex-row sm:px-10 lg:px-10">
          <span>PORTFOLIO — 2026</span>
        </footer>
      </div>
      </main>
    </>
  )
}

export default App
