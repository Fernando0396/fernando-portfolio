import { useEffect, useRef, useState } from 'react'
import avowedImage from './assets/avowed.jpg'
import bloomAndRageImage from './assets/bloom-and-rage.png'
import mindsEyeImage from './assets/mindseye.jpg'
import slimeRancherImage from './assets/slime-rancher-2.jpg'
import './App.css'

const places = [
  {
    name: 'Localization QA - Lionbridge',
    location: 'Narrative adventure',
    category: 'STORY',
    number: '01',
    image: bloomAndRageImage,
    alt: 'Lost Records: Bloom & Rage key art featuring four friends in a forest',
    color: '#c26d45',
  },
  {
    name: 'Avowed',
    location: 'Fantasy role-playing',
    category: 'FANTASY',
    number: '02',
    image: avowedImage,
    alt: 'Avowed key art showing a fantasy warrior and sword',
    color: '#56756f',
  },
  {
    name: 'MindsEye',
    location: 'Sci-fi action adventure',
    category: 'SCI-FI',
    number: '03',
    image: mindsEyeImage,
    alt: 'MindsEye key art featuring two characters in a futuristic city',
    color: '#52798e',
  },
  {
    name: 'Slime Rancher 2',
    location: 'Life simulation adventure',
    category: 'ADVENTURE',
    number: '04',
    image: slimeRancherImage,
    alt: 'Slime Rancher 2 key art with colorful slimes and its rancher',
    color: '#a76948',
  },
]

const navigationItems = [
  { label: 'ABOUT', href: '#about' },
  { label: 'CAPABILITIES', href: '#capabilities' },
  { label: 'WORK', href: '#work' },
  { label: 'CONTACT', href: '#contact' },
]

function App() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const dragStart = useRef(null)
  const carouselRef = useRef(null)

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
    <main className="min-h-screen overflow-hidden bg-[#100a24] text-[#f9efff]">
      <div className="site-shell mx-auto flex min-h-screen max-w-[1126px] flex-col">
        <header className="topbar flex items-center justify-between px-5 sm:px-8 lg:px-10">
          <a className="brand flex items-center gap-2.5" href="#home" aria-label="Portfolio home">
            <span className="brand-mark" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
            <span>portfolio</span>
          </a>
          <nav
            id="main-navigation"
            className={`header-nav ${isMenuOpen ? 'is-open' : ''}`}
            aria-label="Main navigation"
          >
            {navigationItems.map((item) => (
              <a
                className="nav-link"
                href={item.href}
                key={item.label}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </a>
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

        <section id="home" className="intro scroll-reveal px-6 text-center sm:px-10">
          <p className="eyebrow"><span>INDEPENDENT CREATIVE PORTFOLIO</span></p>
          <h1>
            Thoughtful ideas,
            <br /> made tangible.
          </h1>
          <p className="intro-copy">
            A little space for the work, the process,
            <br className="hidden sm:block" /> and the ideas in between.
          </p>
        </section>

        <section id="about" className="portfolio-section about-section px-6 sm:px-10">
          <div className="about-index scroll-reveal">
            <p className="section-kicker">A LITTLE ABOUT ME</p>
            <span className="about-sparkle" aria-hidden="true">✳</span>
          </div>
          <div className="about-copy scroll-reveal">
            <h2>Good work starts with curiosity.</h2>
            <p>
              I like bringing clear thinking and a thoughtful eye to ideas, turning them
              into digital experiences that feel considered, useful, and distinctly human.
            </p>
          </div>
        </section>

        <section id="capabilities" className="portfolio-section capabilities-section px-6 sm:px-10">
          <div className="section-heading scroll-reveal">
            <div>
              <p className="section-kicker">HOW I CAN HELP</p>
              <h2>From first thought to final detail.</h2>
            </div>
          </div>
          <div className="capability-list">
            <article className="capability-card scroll-reveal">
              <h3>Creative direction</h3>
              <p>Finding the idea, mood, and visual language that bring a project into focus.</p>
            </article>
            <article className="capability-card scroll-reveal">
              <h3>Digital design</h3>
              <p>Shaping clear, welcoming experiences across screens and devices.</p>
            </article>
            <article className="capability-card scroll-reveal">
              <h3>Front-end craft</h3>
              <p>Building responsive interfaces with care for the details and the people using them.</p>
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
              <p className="section-kicker">THE WORK</p>
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
                      <h2>{place.name}</h2>
                      <p>{place.location}</p>
                    </div>
                    <span className="card-sparkle" aria-hidden="true">✳</span>
                  </article>
                )
              })}
            </div>
          </div>

          <div className="carousel-controls mx-auto flex items-center justify-between px-6 sm:px-10">
            <p className="drag-hint"><span aria-hidden="true">↔</span> DRAG TO EXPLORE</p>
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
            <div className="arrow-controls flex items-center gap-2">
              <button className="arrow-button" type="button" onClick={() => moveTo(-1)} aria-label="Previous game">
                <span aria-hidden="true">←</span>
              </button>
              <button className="arrow-button" type="button" onClick={() => moveTo(1)} aria-label="Next game">
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </section>

        <section id="contact" className="portfolio-section contact-section scroll-reveal px-6 text-center sm:px-10">
          <p className="section-kicker">WHAT’S NEXT?</p>
          <h2>Have an idea in mind?</h2>
          <p>Let’s make something thoughtful together.</p>
          <span className="contact-note">CONTACT DETAILS COMING SOON <span aria-hidden="true">✳</span></span>
        </section>

        <footer className="page-footer mt-auto flex flex-col items-center justify-between gap-3 px-6 sm:flex-row sm:px-10 lg:px-10">
          <span>PORTFOLIO — 2026</span>
          <span className="footer-center">MADE WITH INTENTION <span aria-hidden="true">✳</span></span>
          <a href="#home">BACK TO TOP ↑</a>
        </footer>
      </div>
    </main>
  )
}

export default App
