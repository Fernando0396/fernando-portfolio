import { useCallback, useEffect, useRef, useState } from 'react'

const stats = [
  { value: '6+', label: 'Years of design and build experience' },
  { value: '18', label: 'Projects launched across web and product teams' },
  { value: '92%', label: 'Clients who return for follow-up work' },
]

const work = [
  {
    title: 'Slime Rancher 2',
    type: 'Brand + Product Design',
    description:
      'Designed a cleaner conversion funnel and landing page system for a growing SaaS brand.',
    gradient: 'from-fuchsia-500 via-violet-500 to-purple-900',
    badge: 'Launch campaign',
  },
  {
    title: 'Avowed',
    type: 'E-commerce Experience',
    description:
      'Refined the shopping experience with a mobile-first redesign that improved engagement and retention.',
    gradient: 'from-purple-500 via-indigo-500 to-sky-900',
    badge: 'Store revamp',
  },
  {
    title: 'Lost Records: Bloom and Rage',
    type: 'Dashboard UX',
    description:
      'Built a simplified reporting dashboard that made complex analytics easier to understand for busy teams.',
    gradient: 'from-indigo-500 via-violet-500 to-fuchsia-900',
    badge: 'Analytics flow',
  },
  {
    title: 'MindsEye',
    type: 'Creative Portfolio',
    description:
      'Developed a refined portfolio experience that made the brand feel premium and easier to explore.',
    gradient: 'from-pink-500 via-fuchsia-500 to-violet-900',
    badge: 'Portfolio build',
  },
]

const skills = ['React', 'Tailwind CSS', 'UI Design', 'Brand Systems', 'Frontend Architecture', 'User Research']

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [position, setPosition] = useState(-340 * work.length * 2)
  const carouselRef = useRef(null)
  const positionRef = useRef(-340 * work.length * 2)
  const dragStartX = useRef(0)
  const dragStartPosition = useRef(0)
  const itemWidth = useRef(340)

  const navItems = [
    { name: 'About', href: '#about' },
    { name: 'Work', href: '#work' },
    { name: 'Contact', href: '#contact' },
  ]

  const displayItems = [...work, ...work, ...work, ...work, ...work]

  const setCarouselPosition = useCallback((nextPosition) => {
    positionRef.current = nextPosition
    setPosition(nextPosition)
  }, [])

  const normalizePosition = useCallback((value) => {
    const fullWidth = itemWidth.current * work.length
    if (!fullWidth) return value

    let next = value
    while (next > -fullWidth) next -= fullWidth
    while (next < -fullWidth * 3) next += fullWidth
    return next
  }, [])

  const moveByCards = useCallback((direction) => {
    const step = direction * itemWidth.current
    const rawNext = positionRef.current + step
    const next = normalizePosition(rawNext)
    setCarouselPosition(next)
  }, [normalizePosition, setCarouselPosition])

  const resetCardTilt = (card) => {
    if (!card) return
    card.style.removeProperty('--card-rotate-x')
    card.style.removeProperty('--card-rotate-y')
    card.style.removeProperty('--card-shift-x')
    card.style.removeProperty('--card-shift-y')
    card.style.removeProperty('--card-glow-x')
    card.style.removeProperty('--card-glow-y')
  }

  const handleCardPointerMove = (event) => {
    if (event.pointerType !== 'mouse' || isDragging) return

    const card = event.currentTarget
    const rect = card.getBoundingClientRect()
    if (!rect.width || !rect.height) return

    const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width))
    const y = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height))
    const horizontalWeight = x - 0.5
    const verticalWeight = y - 0.5

    card.style.setProperty('--card-rotate-x', `${(-verticalWeight * 18).toFixed(2)}deg`)
    card.style.setProperty('--card-rotate-y', `${(horizontalWeight * 20).toFixed(2)}deg`)
    card.style.setProperty('--card-shift-x', `${(horizontalWeight * 8).toFixed(2)}px`)
    card.style.setProperty('--card-shift-y', `${(verticalWeight * 8).toFixed(2)}px`)
    card.style.setProperty('--card-glow-x', `${(x * 100).toFixed(2)}%`)
    card.style.setProperty('--card-glow-y', `${(y * 100).toFixed(2)}%`)
  }

  const handleCardPointerLeave = (event) => {
    resetCardTilt(event.currentTarget)
  }

  useEffect(() => {
    const updateWidth = () => {
      const firstCard = carouselRef.current?.querySelector('article')
      const track = carouselRef.current?.firstElementChild
      const gap = track ? Number.parseFloat(window.getComputedStyle(track).columnGap) || 16 : 16
      const previousFullWidth = itemWidth.current * work.length
      const nextWidth = firstCard ? firstCard.getBoundingClientRect().width + gap : 340
      itemWidth.current = nextWidth

      if (!firstCard) return

      const nextFullWidth = nextWidth * work.length
      const offset = ((positionRef.current + previousFullWidth * 2) % previousFullWidth + previousFullWidth) % previousFullWidth
      setCarouselPosition(-nextFullWidth * 2 + (offset / previousFullWidth) * nextFullWidth)
    }

    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => window.removeEventListener('resize', updateWidth)
  }, [])

  useEffect(() => {
    if (isDragging) return undefined

    const step = isHovering ? 0.72 : 0.9
    const delay = isHovering ? 28 : 22

    const timer = window.setInterval(() => {
      const rawNext = positionRef.current - step
      const next = normalizePosition(rawNext)
      setCarouselPosition(next)
    }, delay)

    return () => window.clearInterval(timer)
  }, [isDragging, isHovering, normalizePosition, setCarouselPosition])

  const handlePointerDown = (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    const card = event.target instanceof Element ? event.target.closest('.carousel-card') : null
    resetCardTilt(card)
    setIsDragging(true)
    dragStartX.current = event.clientX
    dragStartPosition.current = positionRef.current
    event.currentTarget.setPointerCapture?.(event.pointerId)
  }

  const handlePointerMove = (event) => {
    if (!isDragging) return
    const delta = event.clientX - dragStartX.current
    setCarouselPosition(normalizePosition(dragStartPosition.current + delta))
  }

  const handlePointerUp = () => {
    if (!isDragging) return
    setIsDragging(false)
  }

  const handlePointerLeave = () => {
    if (!isDragging) return
    setIsDragging(false)
  }

  return (
    <div className="min-h-screen bg-[#12061d] text-fuchsia-50">
      <header className="mx-auto max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
        <nav className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 px-3 py-3 backdrop-blur-sm transition-colors duration-200 sm:px-4 md:rounded-full">
          <div className="flex items-center justify-between gap-2 sm:gap-3">
            <div className="flex min-w-0 items-center gap-2 sm:gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-fuchsia-400 text-sm font-bold text-fuchsia-950">
                FE
              </div>
              <div className="min-w-0">
                <p className="text-[9px] font-semibold leading-tight tracking-[0.12em] text-fuchsia-200 uppercase sm:text-xs md:text-sm">
                  <span className="block sm:inline">Fernando Esquivel</span>
                  {' '}
                  <span className="block sm:inline">Hidalgo</span>
                </p>
              </div>
            </div>

            <div className="hidden items-center gap-2 text-sm text-fuchsia-200 md:flex">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="rounded-full px-3 py-2 transition hover:bg-fuchsia-500/20 hover:text-white"
                >
                  {item.name}
                </a>
              ))}
            </div>

            <div className="hidden md:block">
              <a
                href="#contact"
                className="rounded-full border border-fuchsia-400/60 bg-fuchsia-400/10 px-4 py-2 text-sm font-medium text-fuchsia-100 transition hover:border-fuchsia-300 hover:bg-fuchsia-400/20"
              >
                Contact
              </a>
            </div>

            <button
              type="button"
              aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              onClick={() => setIsMenuOpen((open) => !open)}
              className="ml-auto inline-flex shrink-0 items-center justify-center rounded-xl border border-white/10 bg-fuchsia-900/80 p-2 text-fuchsia-100 transition hover:border-fuchsia-300/50 hover:text-white md:hidden"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                {isMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                ) : (
                  <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" strokeLinejoin="round" />
                )}
              </svg>
            </button>
          </div>

          {isMenuOpen && (
            <div className="mt-3 space-y-2 border-t border-white/10 bg-fuchsia-950/20 pt-3 md:hidden">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block rounded-xl px-3 py-2 text-sm text-fuchsia-100 transition hover:bg-fuchsia-500/20 hover:text-white"
                >
                  {item.name}
                </a>
              ))}
              <a
                href="#contact"
                onClick={() => setIsMenuOpen(false)}
                className="mt-2 block rounded-full border border-fuchsia-400/60 bg-fuchsia-400/10 px-4 py-2 text-center text-sm font-medium text-fuchsia-100 transition hover:border-fuchsia-300 hover:bg-fuchsia-400/20"
              >
                Contact
              </a>
            </div>
          )}
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
        <section className="grid items-center gap-10 py-8 sm:py-12 md:grid-cols-2 md:gap-12 md:py-20">
          <div>
            <span className="inline-flex items-center rounded-full border border-fuchsia-400/30 bg-fuchsia-400/10 px-3 py-1 text-[10px] font-semibold tracking-[0.2em] text-fuchsia-100 uppercase sm:text-xs">
              Available for select projects
            </span>

            <h1 className="mt-6 max-w-xl text-3xl font-black tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
              I design digital experiences that help brands grow.
            </h1>

            <p className="mt-6 max-w-lg text-base leading-7 text-fuchsia-100 sm:text-lg sm:leading-8">
              I’m a product designer and frontend developer building thoughtful interfaces for startups, service businesses, and creative teams.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#work"
                className="rounded-full bg-fuchsia-400 px-5 py-3 text-sm font-semibold text-fuchsia-950 transition hover:bg-fuchsia-300"
              >
                View projects
              </a>
              <a
                href="#about"
                className="rounded-full border border-white/15 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/5"
              >
                About me
              </a>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <p className="mt-2 text-xs leading-5 text-slate-300">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 -z-10 rounded-full bg-fuchsia-500/20 blur-3xl" />
            <div className="rounded-[2rem] border border-white/10 bg-fuchsia-900/80 p-4 shadow-2xl shadow-fuchsia-950/40 backdrop-blur-sm sm:p-5">
              <div className="rounded-[1.5rem] border border-white/10 bg-gradient-to-br from-fuchsia-800 via-purple-900 to-indigo-950 p-5 sm:p-6">
                <div className="flex items-center justify-between text-[11px] text-fuchsia-200 sm:text-xs">
                  <span>Portfolio Snapshot</span>
                  <span className="rounded-full border border-pink-400/40 bg-pink-500/10 px-2 py-1 text-pink-200">
                    2025
                  </span>
                </div>

                <div className="mt-8 space-y-5">
                  <div className="rounded-2xl border border-fuchsia-400/30 bg-fuchsia-500/10 p-4">
                    <p className="text-sm text-fuchsia-200">Top priority</p>
                    <h2 className="mt-2 text-2xl font-bold text-white">Product strategy</h2>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-sm text-fuchsia-200">Conversion</p>
                      <p className="mt-2 text-3xl font-bold text-white">+34%</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-sm text-fuchsia-200">Retention</p>
                      <p className="mt-2 text-3xl font-bold text-white">+18%</p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-fuchsia-950/70 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-fuchsia-100">Clients served</span>
                      <span className="text-sm text-fuchsia-200">48</span>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-fuchsia-800">
                      <div className="h-full w-[78%] rounded-full bg-gradient-to-r from-fuchsia-400 to-purple-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="grid gap-8 py-12 md:grid-cols-[1.1fr_0.9fr] md:py-16">
          <div>
            <p className="text-sm font-semibold tracking-[0.2em] text-fuchsia-200 uppercase">About</p>
            <h2 className="mt-4 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
              I help teams turn ideas into clear, memorable experiences.
            </h2>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-fuchsia-100">
            <p>
              My process blends strategy, storytelling, and clean implementation. I work closely with founders and teams to define what matters most and turn that into products people want to use.
            </p>
          </div>
        </section>

        <section id="work" className="py-8">
          <div className="pb-8">
            <p className="text-sm font-semibold tracking-[0.2em] text-fuchsia-200 uppercase">Selected work</p>
            <h2 className="mt-4 text-2xl font-bold text-white sm:text-3xl">Recent projects</h2>
          </div>

          <div className="relative">
            <button
              type="button"
              aria-label="Previous project"
              onClick={() => moveByCards(1)}
              className="carousel-arrow absolute left-2 top-1/2 z-30 inline-flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-fuchsia-300/50 bg-gradient-to-br from-fuchsia-400/30 to-purple-700/40 text-2xl font-light text-fuchsia-50 shadow-[0_8px_24px_rgba(76,29,149,0.35)] backdrop-blur-md transition sm:left-4"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="m14.5 5-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <div
              ref={carouselRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerLeave}
              onPointerCancel={handlePointerUp}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              className="carousel-viewport"
            >
              <div
                className="carousel-track flex gap-4 transition-none md:gap-5"
                style={{ transform: `translate3d(${position}px, 0, 0)` }}
              >
                {displayItems.map((item, index) => (
                  <article
                    key={`${item.title}-${index}`}
                    onPointerMove={handleCardPointerMove}
                    onPointerLeave={handleCardPointerLeave}
                    className="carousel-card group relative min-w-[85%] overflow-hidden rounded-[1.75rem] border border-white/10 bg-gradient-to-b from-fuchsia-900 to-purple-950 p-3 hover:border-fuchsia-400/40 hover:shadow-lg hover:shadow-fuchsia-950/20 sm:min-w-[46%] xl:min-w-[31%]"
                  >
                    <div className={`relative h-48 overflow-hidden rounded-[1.25rem] bg-gradient-to-br ${item.gradient}`}>
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.26),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.12),transparent_30%)]" />
                      <div className="relative flex h-full flex-col justify-between p-4">
                        <span className="w-fit rounded-full border border-white/20 bg-black/10 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-white/80">
                          {item.badge}
                        </span>
                        <div className="flex items-center justify-between text-white/80">
                          <span className="text-xs uppercase tracking-[0.2em]">Case study</span>
                          <span className="text-xl">→</span>
                        </div>
                      </div>
                    </div>

                    <div className="px-1 pb-1 pt-5">
                      <p className="text-xs font-medium tracking-[0.18em] text-fuchsia-200 uppercase">{item.type}</p>
                      <h3 className="mt-4 text-2xl font-bold text-white">{item.title}</h3>
                      <p className="mt-4 text-fuchsia-100">{item.description}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <button
              type="button"
              aria-label="Next project"
              onClick={() => moveByCards(-1)}
              className="carousel-arrow absolute right-2 top-1/2 z-30 inline-flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-fuchsia-300/50 bg-gradient-to-br from-fuchsia-400/30 to-purple-700/40 text-2xl font-light text-fuchsia-50 shadow-[0_8px_24px_rgba(76,29,149,0.35)] backdrop-blur-md transition sm:right-4"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="m9.5 5 7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </section>

        <section className="py-16">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8">
            <p className="text-sm font-semibold tracking-[0.2em] text-fuchsia-200 uppercase">Capabilities</p>
            <div className="mt-6 flex flex-wrap gap-3">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-white/10 bg-fuchsia-900 px-4 py-2 text-sm text-fuchsia-100"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="py-8">
          <div className="rounded-[2rem] border border-fuchsia-400/20 bg-gradient-to-r from-fuchsia-500/10 via-purple-900 to-indigo-950 p-8 text-center md:p-12">
            <p className="text-sm font-semibold tracking-[0.2em] text-fuchsia-200 uppercase">Contact</p>
            <h2 className="mt-4 text-2xl font-bold text-white sm:text-3xl md:text-4xl">Let&apos;s build something memorable.</h2>
            <p className="mx-auto mt-4 max-w-2xl text-fuchsia-100">
              Looking for a designer/developer who can balance polish, clarity, and business goals? I&apos;d love to hear about your project.
            </p>
            <a
              href="mailto:fernando@example.com"
              className="mt-8 inline-flex rounded-full bg-fuchsia-400 px-6 py-3 text-sm font-semibold text-fuchsia-950 transition hover:bg-fuchsia-300"
            >
              fernando@example.com
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 py-6 text-center text-sm text-slate-400">
        © 2025 Fernando Esquivel Hidalgo — Product designer & frontend developer
      </footer>
    </div>
  )
}

export default App
