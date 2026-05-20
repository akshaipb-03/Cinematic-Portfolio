'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'

export default function VideoIntro({ heroRef }) {
  const videoRef = useRef(null)

  useEffect(() => {
    if (!videoRef.current) return
    gsap.fromTo(videoRef.current, { opacity: 0 }, { opacity: 1, duration: 0.8, ease: 'power2.out' })
  }, [])

  function handleEnded() {
    heroRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      className="relative flex-shrink-0"
      style={{
        height: '100vh',
        scrollSnapAlign: 'start',
        background: '#000',
        overflow: 'hidden',
      }}
    >
      <video
        ref={videoRef}
        data-testid="intro-video"
        src="/assets/about-me.mp4"
        autoPlay={true}
        muted={true}
        playsInline={true}
        onEnded={handleEnded}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
    </section>
  )
}
