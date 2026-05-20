'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from '@/lib/gsap'
import { Button } from '@/components/ui/button'
import styles from '@/styles/sections/VideoIntro.module.css'

export default function VideoIntro({ heroRef }) {
  const videoRef = useRef(null)
  const [muted, setMuted] = useState(true)

  useEffect(() => {
    if (!videoRef.current) return
    const tween = gsap.fromTo(videoRef.current, { opacity: 0 }, { opacity: 1, duration: 0.8, ease: 'power2.out' })
    return () => tween.kill()
  }, [])

  function handleEnded() {
    heroRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className={styles.section}>
      {/* Blurred bg layer — fills black bars from letterboxing */}
      <video
        src="/assets/about-me.mp4"
        autoPlay
        muted
        playsInline
        aria-hidden="true"
        className={styles.bgVideo}
      />

      {/* Main video — sharp, aspect-ratio preserved */}
      <video
        ref={videoRef}
        data-testid="intro-video"
        src="/assets/about-me.mp4"
        autoPlay
        muted={muted}
        playsInline
        onEnded={handleEnded}
        className={styles.mainVideo}
      />

      <Button
        variant="ghost"
        onClick={() => setMuted(m => !m)}
        className={`${styles.muteBtn} rounded-full text-xs font-semibold tracking-widest uppercase px-4 h-9`}
      >
        {muted ? '🔇  TAP FOR SOUND' : '🔊  SOUND ON'}
      </Button>
    </section>
  )
}
