'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import profile from '@/data/profile.json'
import styles from '@/styles/sections/ContactSection.module.css'

const LINKS = [
  {
    key: 'github',
    label: 'GitHub',
    value: profile.socials.find(s => s.label === 'GitHub')?.href?.replace('https://', '') ?? 'github.com',
    href: profile.socials.find(s => s.label === 'GitHub')?.href ?? '#',
    icon: '⌥',
    iconClass: styles.github,
  },
  {
    key: 'linkedin',
    label: 'LinkedIn',
    value: profile.socials.find(s => s.label === 'LinkedIn')?.href?.replace('https://', '') ?? 'linkedin.com',
    href: profile.socials.find(s => s.label === 'LinkedIn')?.href ?? '#',
    icon: 'in',
    iconClass: styles.linkedin,
  },
  {
    key: 'mail',
    label: 'Email',
    value: profile.email,
    href: `mailto:${profile.email}`,
    icon: '✉',
    iconClass: styles.mail,
  },
]

export default function ContactSection() {
  const sectionRef  = useRef(null)
  const eyebrowRef  = useRef(null)
  const headlineRef = useRef(null)
  const taglineRef  = useRef(null)
  const ctaRef      = useRef(null)
  const cardRefs    = useRef([])
  const footerRef   = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const scroller = document.querySelector('main')
    if (!scroller) return

    const animTargets = [
      eyebrowRef.current,
      headlineRef.current,
      taglineRef.current,
      ctaRef.current,
      ...cardRefs.current.filter(Boolean),
      footerRef.current,
    ].filter(Boolean)

    function resetAnim() {
      gsap.killTweensOf(animTargets)
      gsap.set(eyebrowRef.current,  { opacity: 0, y: 16 })
      gsap.set(headlineRef.current, { opacity: 0, y: 30 })
      gsap.set(taglineRef.current,  { opacity: 0, y: 20 })
      gsap.set(ctaRef.current,      { opacity: 0, y: 16 })
      gsap.set(cardRefs.current.filter(Boolean), { opacity: 0, x: 30 })
      gsap.set(footerRef.current,   { opacity: 0 })
    }

    function playAnim() {
      resetAnim()
      const tl = gsap.timeline()
      tl.to(eyebrowRef.current,  { opacity: 1, y: 0, duration: 0.65, ease: 'power4.out' })
        .to(headlineRef.current, { opacity: 1, y: 0, duration: 0.85, ease: 'power4.out' }, '-=0.45')
        .to(taglineRef.current,  { opacity: 1, y: 0, duration: 0.7,  ease: 'power4.out' }, '-=0.6')
        .to(ctaRef.current,      { opacity: 1, y: 0, duration: 0.6,  ease: 'power4.out' }, '-=0.5')
        .to(cardRefs.current.filter(Boolean), {
            opacity: 1, x: 0, duration: 0.7, ease: 'power4.out', stagger: 0.1,
          }, '-=0.55')
        .to(footerRef.current,   { opacity: 1, duration: 0.5 }, '-=0.3')
    }

    resetAnim()
    let isActive = false

    function onScroll() {
      const inRange = Math.abs(scroller.scrollTop - section.offsetTop) < window.innerHeight * 0.5
      if (inRange && !isActive)  { isActive = true;  playAnim()  }
      if (!inRange && isActive)  { isActive = false; resetAnim() }
    }

    scroller.addEventListener('scroll', onScroll, { passive: true })
    return () => scroller.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      style={{ backgroundImage: "url('/assets/footer-1.png')" }}
    >
      <div className={styles.grain} aria-hidden />
      <div className={styles.topLine} aria-hidden />

      {/* main content grid */}
      <div className={styles.inner}>
        {/* ── left ── */}
        <div className={styles.left}>
          <p ref={eyebrowRef} className={styles.eyebrow}>Get in touch</p>

          <h2 ref={headlineRef} className={styles.headline}>
            Let's build
            <span className={styles.headlineAccent}>something great.</span>
          </h2>

          <p ref={taglineRef} className={styles.tagline}>
            {profile.tagline}
          </p>

          <div ref={ctaRef} className={styles.ctaRow}>
            <a
              href={`mailto:${profile.email}`}
              className={styles.btnPrimary}
            >
              <span>✉</span> Email me
            </a>
            <a
              href={profile.socials.find(s => s.label === 'LinkedIn')?.href ?? '#'}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btnSecondary}
            >
              LinkedIn ↗
            </a>
          </div>
        </div>

        {/* ── right ── */}
        <div className={styles.right}>
          {LINKS.map(({ key, label, value, href, icon, iconClass }, i) => (
            <a
              key={key}
              href={href}
              target={href.startsWith('mailto') ? undefined : '_blank'}
              rel="noopener noreferrer"
              className={styles.linkCard}
              ref={el => { cardRefs.current[i] = el }}
            >
              <span className={`${styles.linkIcon} ${iconClass}`}>{icon}</span>
              <span className={styles.linkText}>
                <span className={styles.linkLabel}>{label}</span>
                <span className={styles.linkValue}>{value}</span>
              </span>
              <span className={styles.linkArrow}>→</span>
            </a>
          ))}
        </div>
      </div>

      {/* footer strip */}
      <div ref={footerRef} className={styles.footerStrip}>
        <span className={styles.copyright}>
          © {new Date().getFullYear()} {profile.name.full} · All rights reserved
        </span>
        <span className={styles.scrollHint}>Scroll to loop</span>
      </div>
    </section>
  )
}
