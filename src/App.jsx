import { useEffect, useRef, useState } from 'react'
import './App.css'

const places = [
  {
    name: 'The quiet coast',
    location: 'Amalfi Coast, Italy',
    category: 'SLOW LIVING',
    number: '01',
    image:
      'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1800&q=85',
    alt: 'A sunlit coastal village spilling down to a blue Mediterranean bay',
    color: '#c26d45',
  },
  {
    name: 'Into the wild',
    location: 'Dolomites, Italy',
    category: 'OPEN AIR',
    number: '02',
    image:
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1800&q=85',
    alt: 'Mountain peaks rising above a quiet alpine landscape',
    color: '#56756f',
  },
  {
    name: 'A softer blue',
    location: 'Paros, Greece',
    category: 'ISLAND TIME',
    number: '03',
    image:
      'https://images.unsplash.com/photo-1530789253388-582c481c54b0?auto=format&fit=crop&w=1800&q=85',
    alt: 'A small whitewashed island village framed by the sea',
    color: '#52798e',
  },
  {
    name: 'Room to breathe',
    location: 'Joshua Tree, California',
    category: 'WIDE OPEN',
    number: '04',
    image:
      'https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?auto=format&fit=crop&w=1800&q=85',
    alt: 'A desert road running toward distant sunlit mountains',
    color: '#a76948',
  },
]

const navigationItems = ['LINK 01', 'LINK 02', 'LINK 03', 'LINK 04']

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
                href="#discover"
                key={item}
                onClick={() => setIsMenuOpen(false)}
              >
                {item}
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

        <section id="home" className="intro px-6 text-center sm:px-10">
          <p className="eyebrow"><span>FIELD NOTES Nº 04</span> &nbsp;—&nbsp; A CHANGE OF SCENERY</p>
          <h1>
            Find your
            <br className="sm:hidden" /> somewhere.
          </h1>
          <p className="intro-copy">
            For the days you need a little less noise
            <br className="hidden sm:block" /> and a little more <em>here.</em>
          </p>
        </section>

        <section
          id="discover"
          className="carousel-section"
          aria-label="Featured places"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocus={() => setIsPaused(true)}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) setIsPaused(false)
          }}
        >
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
            aria-label="Explore four places"
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
                      <span className="card-count">{place.number} / 04</span>
                    </div>
                    <div className="card-caption">
                      <p>{place.location}</p>
                      <h2>{place.name}</h2>
                    </div>
                    <span className="card-sparkle" aria-hidden="true">✳</span>
                  </article>
                )
              })}
            </div>
          </div>

          <div className="carousel-controls mx-auto flex items-center justify-between px-6 sm:px-10">
            <p className="drag-hint"><span aria-hidden="true">↔</span> DRAG TO WANDER</p>
            <div className="slide-progress" role="group" aria-label="Choose a place">
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
              <button className="arrow-button" type="button" onClick={() => moveTo(-1)} aria-label="Previous place">
                <span aria-hidden="true">←</span>
              </button>
              <button className="arrow-button" type="button" onClick={() => moveTo(1)} aria-label="Next place">
                <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </section>

        <footer className="page-footer mt-auto flex flex-col items-center justify-between gap-3 px-6 sm:flex-row sm:px-10 lg:px-[7.5%]">
          <span>TAKE THE LONG WAY HOME.</span>
          <span className="footer-center">COLLECT MOMENTS, NOT MILES <span aria-hidden="true">✳</span></span>
          <span>MADE FOR THE IN-BETWEEN</span>
        </footer>
      </div>
    </main>
  )
}

export default App
