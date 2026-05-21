'use client'

import { useEffect, useRef } from 'react'
import Navbar       from '@/components/ui/Navbar'
import VideoIntro   from '@/components/sections/VideoIntro'
import HeroSection  from '@/components/sections/HeroSection'
import AboutSection from '@/components/sections/AboutSection'

const SECTIONS = 3

export default function Home() {
  const mainRef = useRef(null)
  const idxRef  = useRef(0)
  const busyRef = useRef(false)

  useEffect(() => {
    const el = mainRef.current
    if (!el) return

    function goTo(idx) {
      idx = Math.max(0, Math.min(SECTIONS - 1, idx))
      if (idx === idxRef.current || busyRef.current) return
      idxRef.current = idx
      busyRef.current = true
      el.scrollTo({ top: idx * window.innerHeight, behavior: 'smooth' })
      setTimeout(() => { busyRef.current = false }, 900)
    }

    function onWheel(e) {
      e.preventDefault()
      if (busyRef.current) return
      goTo(idxRef.current + (e.deltaY > 0 ? 1 : -1))
    }

    let touchY = 0
    function onTouchStart(e) { touchY = e.touches[0].clientY }
    function onTouchEnd(e) {
      if (busyRef.current) return
      const dy = touchY - e.changedTouches[0].clientY
      if (Math.abs(dy) > 40) goTo(idxRef.current + (dy > 0 ? 1 : -1))
    }

    // Sync idx after any programmatic scroll (e.g. VideoIntro scroll button)
    function onScroll() {
      idxRef.current = Math.round(el.scrollTop / window.innerHeight)
    }

    el.addEventListener('wheel',      onWheel,      { passive: false })
    el.addEventListener('touchstart', onTouchStart, { passive: true  })
    el.addEventListener('touchend',   onTouchEnd,   { passive: true  })
    el.addEventListener('scroll',     onScroll,     { passive: true  })

    return () => {
      el.removeEventListener('wheel',      onWheel)
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchend',   onTouchEnd)
      el.removeEventListener('scroll',     onScroll)
    }
  }, [])

  return (
    <>
      <Navbar />
      <main ref={mainRef} style={{ height: '100vh', overflowY: 'scroll' }}>
        <div style={{ height: '300vh' }}>
          <VideoIntro />
          <HeroSection />
          <AboutSection />
        </div>
      </main>
    </>
  )
}
