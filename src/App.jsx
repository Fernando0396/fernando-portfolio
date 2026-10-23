import { useEffect, useRef, useState } from 'react'
import avowedImage from './assets/avowed.jpg'
import bloomAndRageImage from './assets/bloom-and-rage.png'
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
    color: '#c26d45',
  },
  {
    name: 'Avowed',
    location: 'Fantasy role playing',
    category: 'Obsidian Entertainment',
    number: '02',
    image: avowedImage,
    alt: 'Avowed key art showing a fantasy warrior and sword',
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

function App() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isBrandClicked, setIsBrandClicked] = useState(false)
  const dragStart = useRef(null)
  const carouselRef = useRef(null)
  const brandAnimationTimer = useRef(null)

  useEffect(() => {
    if (isPaused || isDragging) return undefined

    const timer = window.setInterval(() => {
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
    setActiveIndex((index) => (index + direction + places.length) % places.length)
  }

  const handlePointerDown = (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    dragStart.current = { x: event.clientX, pointerId: event.pointerId }
    setIsDragging(true)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (event) => {
    if (!dragStart.current || dragStart.current.pointerId !== event.pointerId) return
    setDragOffset(event.clientX - dragStart.current.x)
  }

  const handlePointerUp = (event) => {
    if (!dragStart.current || dragStart.current.pointerId !== event.pointerId) return

    const distance = event.clientX - dragStart.current.x
    if (Math.abs(distance) > 55) moveTo(distance < 0 ? 1 : -1)
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
            id="main-navigation"
            className={`header-nav ${isMenuOpen ? 'is-open' : ''}`}
            aria-label="Main navigation"
          >
            {navigationItems.map((item) => (
              <div
                className={`nav-item${item.label === 'CONTACT' ? ' nav-item-contact' : ''}`}
                key={item.label}
              >
                <a
                  className="nav-link"
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </a>
                {item.label === 'CONTACT' && (
                  <div className="contact-submenu" aria-label="Contact options">
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
            onClick={() => setIsMenuOpen((open) => !open)}
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
            <article className="capability-card scroll-reveal">
              <h3>Amazon Alexa AI services</h3>
              <p>Transcriptions behavioral services for Alexa's LLM</p>
            </article>
            <article className="capability-card scroll-reveal">
              <h3>Xbox testing for Certification</h3>
              <p>Testing Xbox titles against certification requirements.</p>
            </article>
            <article className="capability-card scroll-reveal">
              <h3>Localization software testing</h3>
              <p>Checking localized software for language quality, functionality, and consistency.</p>
            </article>
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
                return (
                  <article
                    className={`place-card ${isActive ? 'is-active' : ''}`}
                    key={place.number}
                    aria-current={isActive ? 'true' : undefined}
                    aria-label={`${place.number} of ${places.length}: ${place.name}, ${place.location}`}
                    style={{ '--card-accent': place.color }}
                  >
                    <img className="place-image" src={place.image} alt={place.alt} draggable="false" />
                    <div className="card-shade" />
                    <div className="card-topline">
                      <span className="card-category">{place.category}</span>
                    </div>
                    <div className="card-caption">
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
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Show ${place.name}`}
                  aria-current={index === activeIndex ? 'true' : undefined}
                />
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="portfolio-section about-section px-6 sm:px-10" aria-label="About">
          <div className="about-copy scroll-reveal">
            <p>
              I've always been someone who notices the little details: the references in
              movies and games, the nods and homages to other great artists and media,
              and the care put into software that makes users feel an emotional attachment.
              I notice the details that prove a developer cares. Any misspelled word, any
              process in need of an upgrade, any development that needs a keen eye. That's
              where I shine.
            </p>
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
                <p>LinkedIn profile coming soon</p>
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
