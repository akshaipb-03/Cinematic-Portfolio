'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { gsap } from '@/lib/gsap'
import styles from '@/styles/sections/AboutSection.module.css'

const BIO =
  `Full-Stack Engineer with 4+ years of experience building scalable web and AI-powered systems using MERN, Next.js, and Python. I specialize in designing microservices, high-performance APIs, and production-ready architectures that handle real-world scale. From building data pipelines processing 100k+ SKUs to developing AI-driven platforms using FastAPI, LangChain, and vector databases — my focus is always on performance, scalability, and clean system design. I've worked across end-to-end product development — from frontend architecture and microfrontends to backend systems, caching layers, and asynchronous job processing using Redis and queues. I don't just build features — I build systems that scale, perform, and deliver measurable impact.`

const TABS = ['I AM', 'WHO I AM']

export default function AboutSection() {
  const sectionRef  = useRef(null)
  const photoRef    = useRef(null)
  const contentRef  = useRef(null)
  const intervalRef = useRef(null)
  const started     = useRef(false)

  const [typed,     setTyped]     = useState(0)
  const [done,      setDone]      = useState(false)
  const [activeTab, setActiveTab] = useState(0)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    gsap.set(photoRef.current,   { opacity: 0, x: -50 })
    gsap.set(contentRef.current, { opacity: 0, y:  40 })

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return
        started.current = true

        // Entrance animations
        gsap.to(photoRef.current, {
          opacity: 1, x: 0, duration: 0.9, ease: 'power3.out',
        })
        gsap.to(contentRef.current, {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.15,
        })

        // Typewriter
        let i = 0
        intervalRef.current = setInterval(() => {
          i += 1
          setTyped(i)
          if (i >= BIO.length) {
            clearInterval(intervalRef.current)
            setDone(true)
          }
        }, 11)
      },
      { threshold: 0.15 },
    )

    observer.observe(section)
    return () => {
      observer.disconnect()
      clearInterval(intervalRef.current)
    }
  }, [])

  return (
    <section ref={sectionRef} className={styles.section}>

      {/* ── Left: photo + signature ───────────────── */}
      <div ref={photoRef} className={styles.photoCol}>
        <div className={styles.photoFrame}>
          <Image
            src="/assets/hero.png"
            alt="Vaibhav Khushalani"
            fill
            className={styles.photoImg}
          />
        </div>
        <p className={styles.signature}>Vaibhav</p>
      </div>

      {/* ── Right: content ───────────────────────── */}
      <div ref={contentRef} className={styles.content}>

        {/* Tabs */}
        <div className={styles.tabs}>
          {TABS.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className={`${styles.tab} ${i === activeTab ? styles.tabActive : ''}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Bio text — typewriter */}
        <div className={styles.bioWrap}>
          <p className={styles.bio}>
            <span className={styles.typed}>{BIO.slice(0, typed)}</span>
            {!done && <span className={styles.cursor} aria-hidden="true" />}
            <span className={styles.untyped}>{BIO.slice(typed)}</span>
          </p>
        </div>

        {/* CTA */}
        <Button
          variant="outline"
          render={<a href="mailto:vaibhavkhush124@gmail.com">Email me →</a>}
          className={styles.emailBtn}
        />
      </div>
    </section>
  )
}
