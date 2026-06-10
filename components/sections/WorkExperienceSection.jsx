'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { gsap } from '@/lib/gsap'
import profile from '@/data/profile.json'
import styles from '@/styles/sections/WorkExperienceSection.module.css'

const EXPS = profile.experience

export default function WorkExperienceSection() {
  const sectionRef        = useRef(null)
  const lineRef           = useRef(null)
  const dotRefs           = useRef([])
  const cardRefs          = useRef([])
  const tlRef             = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section || !lineRef.current) return

    const scroller = document.querySelector('main')
    if (!scroller) return

    let isActive = false

    function resetAnim() {
      tlRef.current?.kill()
      gsap.set(lineRef.current,      { scaleX: 0, transformOrigin: 'left center' })
      dotRefs.current.forEach(el  => el && gsap.set(el,  { scale: 0, opacity: 0 }))
      cardRefs.current.forEach(el => el && gsap.set(el, { opacity: 0, y: 28 }))
    }

    function playAnim() {
      resetAnim()
      const n  = EXPS.length
      const tl = gsap.timeline()
      tlRef.current = tl
      tl.to(lineRef.current, { scaleX: 1, duration: 1.6, ease: 'power2.inOut' }, 0)
      EXPS.forEach((_, i) => {
        const t = i === 0 ? 0.08 : 0.08 + (i / (n - 1)) * 1.44
        tl.to(dotRefs.current[i],  { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(2)' }, t)
        tl.to(cardRefs.current[i], { opacity: 1, y: 0,    duration: 0.6, ease: 'power3.out'  }, t + 0.14)
      })
    }

    resetAnim()

    function onScroll() {
      const inRange = Math.abs(scroller.scrollTop - section.offsetTop) < window.innerHeight * 0.5
      if (inRange && !isActive)  { isActive = true;  playAnim() }
      if (!inRange && isActive)  { isActive = false; resetAnim() }
    }

    scroller.addEventListener('scroll', onScroll, { passive: true })
    return () => scroller.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section ref={sectionRef} className={styles.section}>

      <div className={styles.bgImg} aria-hidden>
        <Image
          src="/assets/about 2.webp"
          alt=""
          fill
          quality={100}
          sizes="100vw"
          className={styles.bgImgEl}
        />
      </div>

      <div className={styles.header}>
        <h2 className={styles.label}>Work Experience</h2>
        <span className={styles.labelRight}>0{EXPS.length} Companies</span>
      </div>

      <div className={styles.timeline}>
        <div className={styles.timelineBody}>

          {/* Snake connector */}
          <div ref={lineRef} className={styles.snakeLine} />

          {/* Entry columns */}
          <div className={styles.entries}>
            {EXPS.map((exp, i) => (
              <div
                key={exp.id}
                className={styles.entry}
              >

                <div
                  ref={el => { dotRefs.current[i] = el }}
                  className={styles.dot}
                >
                  <span className={styles.dotNum}>0{i + 1}</span>
                </div>

                <div
                  ref={el => { cardRefs.current[i] = el }}
                  className={styles.card}
                >
                  <div className={styles.cardHead}>
                    <span className={styles.period}>{exp.period} - {exp.periodEnd}</span>
                    <span className={styles.typeTag}>{exp.type}</span>
                    {exp.location && <span className={styles.location}>{exp.location}</span>}
                  </div>
                  <h3 className={styles.company}>{exp.company}</h3>
                  <p  className={styles.role}>{exp.role}</p>
                  <ul
                    className={styles.bullets}
                  >
                    {exp.bullets.map((b, bi) => (
                      <li key={bi} className={styles.bullet}>{b}</li>
                    ))}
                  </ul>
                  <div className={styles.stack}>
                    {exp.tech.map(t => (
                      <span key={t} className={styles.tag}>{t}</span>
                    ))}
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      </div>

    </section>
  )
}
