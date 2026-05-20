'use client'

import { useRef } from 'react'
import VideoIntro    from '@/components/sections/VideoIntro'
import HeroSection   from '@/components/sections/HeroSection'
import AboutSection  from '@/components/sections/AboutSection'

export default function Home() {
  const heroRef = useRef(null)

  return (
    /*
     * Single scroll container.
     * VideoIntro occupies first 100vh.
     * The sticky container is 200vh:
     *   – HeroSection: position sticky, stays frozen while About slides over it.
     *   – AboutSection: slides up from below covering Hero (z-index 2 > 1).
     */
    <main style={{ height: '100vh', overflowY: 'scroll' }}>
      <VideoIntro heroRef={heroRef} />

      <div style={{ position: 'relative', height: '200vh' }}>
        <HeroSection ref={heroRef} />
        <AboutSection />
      </div>
    </main>
  )
}
