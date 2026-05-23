'use client'

import { useRef } from 'react'
import { gsap } from '@/lib/gsap'
import styles from '@/styles/sections/ScreenLoader.module.css'

// 18 triangular shards tiling 100% of screen (3×3 grid, 2 triangles per cell)
const SHARDS = [
  'polygon(0% 0%, 33% 0%, 0% 33%)',
  'polygon(33% 0%, 33% 33%, 0% 33%)',
  'polygon(33% 0%, 66% 0%, 33% 33%)',
  'polygon(66% 0%, 66% 33%, 33% 33%)',
  'polygon(66% 0%, 100% 0%, 66% 33%)',
  'polygon(100% 0%, 100% 33%, 66% 33%)',
  'polygon(0% 33%, 33% 33%, 0% 66%)',
  'polygon(33% 33%, 33% 66%, 0% 66%)',
  'polygon(33% 33%, 66% 33%, 33% 66%)',
  'polygon(66% 33%, 66% 66%, 33% 66%)',
  'polygon(66% 33%, 100% 33%, 66% 66%)',
  'polygon(100% 33%, 100% 66%, 66% 66%)',
  'polygon(0% 66%, 33% 66%, 0% 100%)',
  'polygon(33% 66%, 33% 100%, 0% 100%)',
  'polygon(33% 66%, 66% 66%, 33% 100%)',
  'polygon(66% 66%, 66% 100%, 33% 100%)',
  'polygon(66% 66%, 100% 66%, 66% 100%)',
  'polygon(100% 66%, 100% 100%, 66% 100%)',
]

function generateCracks(cx, cy) {
  const paths = []
  const n = 10
  const dim = Math.max(window.innerWidth, window.innerHeight)
  for (let i = 0; i < n; i++) {
    const baseAngle = (i / n) * Math.PI * 2
    let curAngle = baseAngle + (Math.random() - 0.5) * 0.5
    const totalLen = (0.15 + Math.random() * 0.25) * dim
    const segments = 2 + Math.floor(Math.random() * 2)
    let x = cx
    let y = cy
    let d = `M ${x} ${y}`
    for (let s = 0; s < segments; s++) {
      const segLen = (totalLen / segments) * (0.7 + Math.random() * 0.6)
      curAngle += (Math.random() - 0.5) * 0.45
      x += Math.cos(curAngle) * segLen
      y += Math.sin(curAngle) * segLen
      d += ` L ${x} ${y}`
    }
    paths.push(d)
  }
  return paths
}

export default function ScreenLoader({ onDismiss }) {
  const overlayRef = useRef(null)
  const btnRef     = useRef(null)

  function handleStart() {
    // Fire immediately — must stay inside the click gesture for Safari audio unlock
    window.dispatchEvent(new CustomEvent('loader-dismissed'))

    const btn = btnRef.current
    if (!btn) return
    btn.style.pointerEvents = 'none'

    const btnRect = btn.getBoundingClientRect()
    const cx = btnRect.left + btnRect.width  / 2
    const cy = btnRect.top  + btnRect.height / 2

    // ── Build crack SVG ──────────────────────────────────────
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:10001;'
    svg.setAttribute('viewBox', `0 0 ${window.innerWidth} ${window.innerHeight}`)
    document.body.appendChild(svg)

    const pathEls = generateCracks(cx, cy).map(d => {
      const el = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      el.setAttribute('d', d)
      el.setAttribute('stroke', 'rgba(255,255,255,0.72)')
      el.setAttribute('stroke-width', '1.5')
      el.setAttribute('fill', 'none')
      el.setAttribute('stroke-linecap', 'round')
      svg.appendChild(el)
      const len = el.getTotalLength()
      el.style.strokeDasharray  = len
      el.style.strokeDashoffset = len
      return el
    })

    // ── Crack animation → shatter ────────────────────────────
    gsap.to(pathEls, {
      strokeDashoffset: 0,
      duration: 0.28,
      ease: 'power2.out',
      stagger: 0.014,
      onComplete: shatter,
    })

    function shatter() {
      const overlay = overlayRef.current
      if (!overlay) return

      // Build shard container
      const container = document.createElement('div')
      container.style.cssText = 'position:fixed;inset:0;z-index:10000;pointer-events:none;'
      document.body.appendChild(container)

      const shardEls = SHARDS.map(clipPath => {
        const el = document.createElement('div')
        el.style.cssText = [
          'position:absolute;inset:0;',
          'background:rgba(8,8,8,0.82);',
          'backdrop-filter:blur(20px) saturate(1.4);',
          '-webkit-backdrop-filter:blur(20px) saturate(1.4);',
          `clip-path:${clipPath};`,
        ].join('')
        container.appendChild(el)
        return el
      })

      // Hide original overlay immediately
      overlay.style.opacity = '0'

      const vwHalf = window.innerWidth  / 2
      const vhHalf = window.innerHeight / 2

      gsap.to(shardEls, {
        x: (_, el) => {
          const r  = el.getBoundingClientRect()
          const sx = r.left + r.width / 2
          return (sx - vwHalf) * (1.2 + Math.random() * 1.8) + (Math.random() - 0.5) * 80
        },
        y: (_, el) => {
          const r  = el.getBoundingClientRect()
          const sy = r.top + r.height / 2
          return (sy - vhHalf) * (1.2 + Math.random() * 1.8) + Math.random() * 280
        },
        rotation: () => (Math.random() - 0.5) * 44,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.in',
        stagger: { amount: 0.18, from: 'random' },
        onComplete: () => {
          container.remove()
          svg.remove()
          window.dispatchEvent(new CustomEvent('loader-animation-done'))
          onDismiss()
        },
      })
    }
  }

  return (
    <div ref={overlayRef} className={styles.overlay}>
      <div className={styles.liquidBg} aria-hidden />
      <div className={styles.scanline}  aria-hidden />
      <p className={styles.monogram}>VAIBHAV KHUSHALANI</p>
      <button ref={btnRef} className={styles.startBtn} onClick={handleStart}>
        Start
      </button>
    </div>
  )
}
