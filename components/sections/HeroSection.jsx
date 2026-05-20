'use client'

import { useEffect, useRef, forwardRef } from 'react'
import Image from 'next/image'
import Navbar from '@/components/ui/Navbar'
import { gsap } from '@/lib/gsap'

const HeroSection = forwardRef(function HeroSection(props, ref) {
  const sectionRef = useRef(null)
  const greetRef = useRef(null)
  const roleRef = useRef(null)
  const firstName = useRef(null)
  const lastName = useRef(null)
  const photoRef = useRef(null)
  const locationRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const targets = [
      greetRef.current,
      roleRef.current,
      firstName.current,
      lastName.current,
      locationRef.current,
    ].filter(Boolean)

    gsap.set(targets, { opacity: 0, y: 30 })
    if (photoRef.current) gsap.set(photoRef.current, { opacity: 0, x: 80 })

    const tl = gsap.timeline({ paused: true })
    tl.to(greetRef.current, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' })
      .to(roleRef.current, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.3')
      .to(firstName.current, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.2')
      .to(lastName.current, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, '-=0.4')
      .to(photoRef.current, { opacity: 1, x: 0, duration: 0.7, ease: 'power2.out' }, '-=0.5')
      .to(locationRef.current, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.3')

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          tl.play()
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(section)

    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={node => {
        sectionRef.current = node
        if (typeof ref === 'function') ref(node)
        else if (ref) ref.current = node
      }}
      style={{
        height: '100vh',
        scrollSnapAlign: 'start',
        background: 'linear-gradient(to bottom, var(--hero-start) 0%, var(--hero-mid) 55%, var(--hero-end) 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Navbar />

      {/* Photo — absolute right, full height */}
      <div
        ref={photoRef}
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          height: '100%',
          width: '55%',
        }}
      >
        <Image
          src="/assets/hero.png"
          alt="Vaibhav Khushalani"
          fill
          priority
          style={{ objectFit: 'cover', objectPosition: 'center top' }}
        />
      </div>

      {/* Text content — left side */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          paddingLeft: '3rem',
          paddingBottom: '4rem',
        }}
      >
        <p
          ref={greetRef}
          style={{
            fontSize: 'var(--hero-role-size)',
            fontWeight: 400,
            color: 'var(--text-primary)',
            marginBottom: '0.15rem',
            letterSpacing: '0.02em',
          }}
        >
          Hi, I&apos;m
        </p>
        <p
          ref={roleRef}
          style={{
            fontSize: 'var(--hero-role-size)',
            fontWeight: 600,
            color: 'var(--text-primary)',
            marginBottom: '0.75rem',
            letterSpacing: '0.02em',
          }}
        >
          Software Developer
        </p>

        <p
          ref={firstName}
          style={{
            fontSize: 'var(--hero-name-size)',
            fontWeight: 900,
            color: 'var(--text-primary)',
            lineHeight: 0.95,
            letterSpacing: '-0.03em',
          }}
        >
          Vaibhav
        </p>
        <p
          ref={lastName}
          style={{
            fontSize: 'var(--hero-name-size)',
            fontWeight: 900,
            color: 'var(--text-primary)',
            lineHeight: 0.95,
            letterSpacing: '-0.03em',
          }}
        >
          Khushalani
        </p>
      </div>

      {/* Location — bottom right */}
      <div
        ref={locationRef}
        style={{
          position: 'absolute',
          bottom: '2.5rem',
          right: '2rem',
          zIndex: 2,
          textAlign: 'right',
        }}
      >
        <p
          style={{
            fontSize: '0.7rem',
            fontWeight: 600,
            color: 'var(--text-primary)',
            letterSpacing: '0.05em',
          }}
        >
          Based on India*
        </p>
        <p
          style={{
            fontSize: '0.7rem',
            fontWeight: 600,
            color: 'var(--text-primary)',
            letterSpacing: '0.05em',
          }}
        >
          Available worldwide
        </p>
      </div>
    </section>
  )
})

export default HeroSection
