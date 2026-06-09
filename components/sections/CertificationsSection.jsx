'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { gsap } from '@/lib/gsap'
import profile from '@/data/profile.json'
import styles from '@/styles/sections/CertificationsSection.module.css'

const CERTS = profile.certifications || []

export default function CertificationsSection() {
  const sectionRef = useRef(null)
  const gridRef = useRef(null)
  const cardRefs = useRef([])
  const titleRef = useRef(null)
  const countRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const scroller = document.querySelector('main')
    if (!scroller) return

    const cards = cardRefs.current.filter(Boolean)
    let isActive = false

    function resetAnim() {
      gsap.killTweensOf(titleRef.current)
      gsap.killTweensOf(countRef.current)
      gsap.killTweensOf(cards)
      gsap.set(titleRef.current, { opacity: 0, y: 30 })
      gsap.set(countRef.current, { opacity: 0, y: 20 })
      gsap.set(cards, { opacity: 0, y: 40 })
    }

    function playAnim() {
      resetAnim()
      const tl = gsap.timeline()
      tl.to(titleRef.current, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' })
        .to(countRef.current, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.4')
        .to(cards, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.08
        }, '-=0.3')
    }

    resetAnim()

    function onScroll() {
      const inRange = Math.abs(scroller.scrollTop - section.offsetTop) < window.innerHeight * 0.5
      if (inRange && !isActive) {
        isActive = true
        playAnim()
      }
      if (!inRange && isActive) {
        isActive = false
        resetAnim()
      }
    }

    scroller.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      scroller.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.bgImg} aria-hidden>
        <Image
          src="/assets/footer-mobile 2.webp"
          alt=""
          fill
          quality={100}
          sizes="100vw"
          className={styles.bgImgEl}
        />
      </div>

      <div className={styles.header}>
        <span ref={titleRef} className={styles.label}>Certifications</span>
        <span ref={countRef} className={styles.labelRight}>0{CERTS.length} Credentials</span>
      </div>

      <div className={styles.content}>
        <div ref={gridRef} className={styles.grid}>
          {CERTS.map((cert, i) => (
            <div
              key={cert.id}
              ref={el => { cardRefs.current[i] = el }}
              className={styles.card}
            >
              <div className={styles.cardHead}>
                <div className={styles.logoBox}>
                  {cert.logo}
                </div>
                <span className={styles.date}>{cert.date}</span>
              </div>

              <div className={styles.info}>
                <h3 className={styles.title}>{cert.title}</h3>
                <span className={styles.issuer}>{cert.issuer}</span>
              </div>

              <div className={styles.cardFooter}>
                <span className={styles.credId}>ID: {cert.credentialId}</span>
                {cert.link && (
                  <a
                    href={cert.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.verifyLink}
                  >
                    <span>Verify</span>
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                      <path d="M2 10L10 2M10 2H4M10 2V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
