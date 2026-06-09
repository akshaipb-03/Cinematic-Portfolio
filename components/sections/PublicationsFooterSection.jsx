
'use client'

import { useEffect, useRef, Fragment } from 'react'
import Image from 'next/image'
import * as THREE from 'three'
import { gsap } from '@/lib/gsap'
import {
  FaGithub, FaLinkedinIn, FaEnvelope,
} from 'react-icons/fa'
import { FiArrowUpRight, FiChevronDown } from 'react-icons/fi'
import profile from '@/data/profile.json'
import content from '@/data/content.json'
import styles from '@/styles/sections/PublicationsFooterSection.module.css'

const SOCIAL_ICONS = {
  GitHub:   <FaGithub    size={13} />,
  LinkedIn: <FaLinkedinIn  size={13} />,
}

const MOBILE_SOCIAL_ICONS = {
  GitHub:   <FaGithub    size={20} />,
  LinkedIn: <FaLinkedinIn  size={20} />,
}
const HERO_SOCIAL_LABELS = ['GitHub', 'LinkedIn']

const VID_VERT = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const VID_FRAG = `
  uniform sampler2D uVideo;
  uniform float uOpacity;
  uniform float uVideoAspect;
  uniform float uCanvasAspect;
  varying vec2 vUv;
  void main() {
    vec2 uv = vUv;
    if (uCanvasAspect > uVideoAspect) {
      float s = uVideoAspect / uCanvasAspect;
      uv.y = (vUv.y - 0.5) * s + 0.5;
    } else {
      float s = uCanvasAspect / uVideoAspect;
      uv.x = (vUv.x - 0.5) * s + 0.5;
    }
    vec4 tex = texture2D(uVideo, uv);
    float fadeY =
      smoothstep(0.0, 0.05, uv.y) *
      smoothstep(1.0, 0.95, uv.y);
    float alpha = fadeY * uOpacity;
    float lum = dot(tex.rgb, vec3(0.299, 0.587, 0.114));
    vec3 col = mix(vec3(lum), tex.rgb, 0.72);
    float vx = smoothstep(0.0, 0.38, abs(uv.x - 0.5) * 2.0);
    vec3 dark = vec3(0.008, 0.008, 0.008);
    col = mix(col, dark, vx * 0.82);
    col *= 0.68;
    gl_FragColor = vec4(col, alpha);
  }
`

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
}

export default function PublicationsFooterSection() {
  const wrapperRef = useRef(null)
  const stickyRef  = useRef(null)

  // image
  const imageWrapRef    = useRef(null)
  const imageOverlayRef = useRef(null)

  // image-only interstitial
  const interstitialRef = useRef(null)

  // footer
  const canvasRef         = useRef(null)
  const videoSrcRef       = useRef(null)
  const footerContentRef  = useRef(null)
  const leftRef           = useRef(null)
  const rightRef          = useRef(null)
  const bigNameRef        = useRef(null)
  const bottomBarRef      = useRef(null)

  useEffect(() => {
    const wrapper       = wrapperRef.current
    const sticky        = stickyRef.current
    const canvas        = canvasRef.current
    const videoEl       = videoSrcRef.current
    const scroller      = document.querySelector('main')
    if (!wrapper || !sticky || !scroller) return

    const isMobile = window.innerWidth < 768

    let renderer, vidUni, rafId, videoPlaying = false
    let onMouseMove = () => {}, onResize = () => {}

    if (!isMobile && canvas && videoEl) {
      // ── Three.js video setup ────────────────────────────────
      const W = sticky.offsetWidth
      const H = sticky.offsetHeight

      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setSize(W, H)
      renderer.setClearColor(0x000000, 0)

      const scene  = new THREE.Scene()
      const camera = new THREE.OrthographicCamera(-W / 2, W / 2, H / 2, -H / 2, 0.1, 100)
      camera.position.z = 10

      videoEl.src       = '/assets/about-me 2.mp4'
      videoEl.muted     = true
      videoEl.playsInline = true
      videoEl.loop      = true
      videoEl.preload   = 'auto'

      const vidTex = new THREE.VideoTexture(videoEl)
      vidTex.minFilter = THREE.LinearFilter
      vidTex.magFilter = THREE.LinearFilter

      vidUni = {
        uVideo:       { value: vidTex },
        uOpacity:     { value: 0 },
        uVideoAspect: { value: 16 / 9 },
        uCanvasAspect: { value: W / H },
      }
      videoEl.addEventListener('loadedmetadata', () => {
        if (videoEl.videoWidth && videoEl.videoHeight)
          vidUni.uVideoAspect.value = videoEl.videoWidth / videoEl.videoHeight
      }, { once: true })
      const vidMat = new THREE.ShaderMaterial({
        uniforms: vidUni,
        vertexShader: VID_VERT,
        fragmentShader: VID_FRAG,
        transparent: true,
      })
      const vidMesh = new THREE.Mesh(new THREE.PlaneGeometry(W * 1.08, H * 1.08), vidMat)
      vidMesh.position.z = 1
      scene.add(vidMesh)

      const mx = { tx: 0, ty: 0, x: 0, y: 0 }
      onMouseMove = function(e) {
        const r = sticky.getBoundingClientRect()
        mx.tx = (e.clientX - r.left) / r.width  - 0.5
        mx.ty = (e.clientY - r.top)  / r.height - 0.5
      }
      sticky.addEventListener('mousemove', onMouseMove)

      onResize = function() {
        const w = sticky.offsetWidth
        const h = sticky.offsetHeight
        renderer.setSize(w, h)
        camera.left   = -w / 2; camera.right  = w / 2
        camera.top    =  h / 2; camera.bottom = -h / 2
        camera.updateProjectionMatrix()
        vidUni.uCanvasAspect.value = w / h
      }
      window.addEventListener('resize', onResize)

      function tick() {
        rafId = requestAnimationFrame(tick)
        mx.x += (mx.tx - mx.x) * 0.04
        mx.y += (mx.ty - mx.y) * 0.04
        vidMesh.position.x = mx.x * 14
        vidMesh.position.y = mx.y * -8
        vidTex.needsUpdate = true
        renderer.render(scene, camera)
      }
      tick()
    }

    // ── Initial image position (full-width background) ───────
    function setImageLeft() {
      const vw = window.innerWidth
      gsap.set(imageWrapRef.current, { width: vw, x: 0, opacity: 1 })
      if (imageOverlayRef.current) gsap.set(imageOverlayRef.current, { opacity: 1 })
    }

    // ── Scroll-driven animation ───────────────────────────────
    // Wrapper is 200vh (was 300vh when pub section existed)
    // Now: 1 viewport of scroll travel
    function onScroll() {
      const vh   = window.innerHeight
      const dist = -wrapper.getBoundingClientRect().top

      // 200vh wrapper → 1 viewport of scroll travel
      const p = Math.max(0, Math.min(1, dist / vh))

      const vw = window.innerWidth

      if (isMobile) {
        // Mobile interstitial fades in then out
        const interIn  = Math.max(0, Math.min(1, (p - 0.05) / 0.25))
        const interOut = Math.max(0, Math.min(1, (p - 0.55) / 0.20))
        gsap.set(interstitialRef.current, { opacity: interIn * (1 - interOut), pointerEvents: 'none' })

      } else {
        // ── Phase 1: image shrinks full-width → centered (p 0 → 0.55) ──
        const imgRaw = Math.max(0, Math.min(1, p / 0.55))
        const imgP   = easeInOut(imgRaw)

        const startW  = vw
        const endW    = vw * 0.46
        const w       = startW + imgP * (endW - startW)
        const centerX = imgP * (vw - w) / 2

        // Dark overlay fades as image shrinks
        if (imageOverlayRef.current) {
          gsap.set(imageOverlayRef.current, { opacity: 1 - imgP })
        }

        // ── Interstitial: fades in and out ──
        const interIn  = Math.max(0, Math.min(1, (p - 0.05) / 0.20))
        const interOut = Math.max(0, Math.min(1, (p - 0.45) / 0.18))
        gsap.set(interstitialRef.current, { opacity: interIn * (1 - interOut), pointerEvents: 'none' })

        // ── Phase 2: sine-eased crossfade image → video (p 0.52 → 0.85) ──
        const xfadeRaw = Math.max(0, Math.min(1, (p - 0.52) / 0.33))
        const xfade    = 0.5 - 0.5 * Math.cos(Math.PI * xfadeRaw)

        gsap.set(imageWrapRef.current, { width: w, x: centerX, opacity: 1 - xfade })
        if (vidUni) vidUni.uOpacity.value = xfade

        if (xfade > 0.04 && !videoPlaying) {
          videoPlaying = true
          videoEl.play().catch(() => {})
        } else if (xfade <= 0.04 && videoPlaying) {
          videoPlaying = false
          videoEl.pause()
          videoEl.currentTime = 0
        }
      }

      // ── Footer text fades in ──────────────────────────────
      const footerStart = isMobile ? 0.60 : 0.68
      const footerRange = isMobile ? 0.25 : 0.32
      const footerFade = Math.max(0, Math.min(1, (p - footerStart) / footerRange))
      gsap.set(footerContentRef.current, { opacity: footerFade, pointerEvents: footerFade > 0.05 ? 'auto' : 'none' })
    }

    setImageLeft()
    scroller.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    return () => {
      if (rafId) cancelAnimationFrame(rafId)
      scroller.removeEventListener('scroll', onScroll)
      sticky.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', onResize)
      if (renderer) renderer.dispose()
    }
  }, [])

  const year = new Date().getFullYear()

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      <div ref={stickyRef} className={styles.sticky}>

        {/* ── Video canvas (footer background - desktop) ── */}
        <canvas ref={canvasRef} className={styles.glCanvas} />
        <video ref={videoSrcRef} className={styles.hiddenVideo} />

        {/* ── Mobile background image (footer phase - mobile only) ── */}
        <div className={styles.mobileFooterBg}>
          <Image
            src="/assets/footer-mobile 2.webp"
            alt=""
            fill
            quality={100}
            className={styles.mobileFooterBgImg}
            sizes="100vw"
            priority={false}
          />
        </div>

        {/* ── Mobile permanent dark overlay ── */}
        <div className={styles.mobileDarkOverlay} aria-hidden />

        {/* ── Floating image: starts full-width, shrinks to center ── */}
        <div ref={imageWrapRef} className={styles.imageWrap}>
          <Image
            src="/assets/footer 2.png"
            alt=""
            fill
            quality={100}
            className={styles.imageEl}
            sizes="(max-width: 767px) 100vw, 50vw"
            priority={false}
          />
          <div ref={imageOverlayRef} className={styles.imageOverlay} />
        </div>

        {/* ── Image-only interstitial (step 1) ── */}
        <div ref={interstitialRef} className={styles.interstitial} aria-hidden>

          <div className={styles.interstitialLeft}>
            <div className={styles.interStat}>
              <span className={styles.interLabel}>{content.interstitial.availabilityLabel}</span>
              <span className={styles.interBig}>{profile.location.availability}</span>
            </div>
            <div className={styles.interDividerH} />
            <div className={styles.interStat}>
              <span className={styles.interLabel}>{content.interstitial.basedInLabel}</span>
              <span className={styles.interBig}>{profile.location.based}</span>
            </div>
          </div>

          <div className={styles.interstitialRight}>
            {profile.stats.map((stat, i) => (
              <Fragment key={stat.label}>
                {i > 0 && <div className={styles.interDividerV} />}
                <div className={styles.interNum}>
                  <span className={styles.interCount}>{stat.value}</span>
                  <span className={styles.interNumLabel}>
                    {(content.interstitial.statLabels[i] ?? stat.label).split('\n').map((line, j) => (
                      <Fragment key={j}>{line}{j === 0 && <br />}</Fragment>
                    ))}
                  </span>
                </div>
              </Fragment>
            ))}
          </div>

          <div className={styles.interstitialBottom}>
            <span className={styles.interScrollText}>Continue</span>
            <span className={styles.interScrollLine} />
          </div>

        </div>

        {/* ── Radial vignette (footer phase) ── */}
        <div className={styles.vignetteOverlay} aria-hidden />

        {/* ── Footer content ── */}
        <div ref={footerContentRef} className={styles.footerContent}>

          {/* ── Mobile: hero-like layout ── */}
          <div className={styles.mobileLayout}>
            <div className={styles.mobileBrand}>
              <span className={styles.mobileRoleDot} />
              <span className={styles.mobileRoleText}>{profile.roles?.short?.toUpperCase()}</span>
            </div>
            <h2 className={styles.mobileName}>
              {profile.name?.first?.toUpperCase()}
              <br />
              <span className={styles.mobileNameGhost}>{profile.name?.last?.toUpperCase()}</span>
            </h2>
            <p className={styles.mobileDesc}>{profile.description}</p>
            <div className={styles.mobileCtas}>
              <a href={`mailto:${profile.email}`} className={styles.mobileTalkBtn}>
                Let&apos;s talk <FiArrowUpRight />
              </a>
            </div>
            <div className={styles.mobileSocialRow}>
              {HERO_SOCIAL_LABELS.map((label, i) => {
                const s = profile.socials.find(s => s.label === label)
                if (!s) return null
                return (
                  <Fragment key={label}>
                    {i > 0 && <div className={styles.mobileSocialDivider} aria-hidden />}
                    <a href={s.href} target="_blank" rel="noopener noreferrer" className={styles.mobileSocialLink} aria-label={label}>
                      <span className={styles.mobileSocialIconEl}>{MOBILE_SOCIAL_ICONS[label]}</span>
                      <span className={styles.mobileSocialLabelEl}>{label.toUpperCase()}</span>
                    </a>
                  </Fragment>
                )
              })}
            </div>
            <div className={styles.mobileScrollHint} aria-hidden>
              <FiChevronDown size={18} />
              <span className={styles.mobileScrollText}>Scroll to explore</span>
            </div>
          </div>

          <div className={styles.mainGrid}>

            <div ref={leftRef} className={styles.leftCol}>
              <div className={styles.identityBlock}>
                <p className={styles.greetLine}>
                  <span className={styles.greetDot} />
                  {getGreeting()}
                </p>
                <p className={styles.roleLabel}>{profile.roles.short}</p>
                <h2 className={styles.nameHeading}>
                  {profile.name.first}
                  <br />
                  <span className={styles.nameGhost}>{profile.name.last}</span>
                </h2>
              </div>

              <div className={styles.footerInfo}>
                <p className={styles.footerDescription}>{profile.description}</p>
                <div className={styles.footerLinks}>
                  {profile.socials.slice(0, 4).map((s, i) => (
                    <span key={s.label} className={styles.footerLinkWrap}>
                      {i > 0 && <span className={styles.footerPipe}>|</span>}
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.footerLink}
                      >
                        {SOCIAL_ICONS[s.label] && (
                          <span className={styles.socialIcon}>{SOCIAL_ICONS[s.label]}</span>
                        )}
                        {s.label}
                      </a>
                    </span>
                  ))}
                </div>
                <a href={`mailto:${profile.email}`} className={styles.footerMail}>
                  <FaEnvelope size={12} />
                  {profile.email}
                </a>
              </div>
            </div>

            <div className={styles.centerSpace} />

            <div ref={rightRef} className={styles.rightCol}>
              <div className={styles.ctaBlock}>
                <p className={styles.ctaEyebrow}>{content.footer.eyebrow}</p>
                <p className={styles.ctaHeading}>
                  {content.footer.ctaLines.map((line, i) => (
                    <span key={i}>{line}<br /></span>
                  ))}
                  <span className={styles.ctaAccent}>{content.footer.ctaAccent}</span>
                </p>
                <a href={`mailto:${profile.email}`} className={styles.talkBtn}>
                  Let&apos;s talk →
                </a>
              </div>
            </div>

          </div>

          <div ref={bigNameRef} className={styles.signatureWrap}>
            <h2 className={styles.signatureText}>{profile.name.full.toUpperCase()}</h2>
          </div>

          <div ref={bottomBarRef} className={styles.bottomBar}>
            <div className={styles.bottomLeft}>
              <div className={styles.monogram}>
                <span className={styles.monoLetters}>APB</span>
                <span className={styles.monoDot} />
              </div>
              <span className={styles.leftDivider} />
              <div className={styles.copyBlock}>
                <p className={styles.copy}>© {year} {profile.name.full.toUpperCase()}</p>
                <p className={styles.copyAll}>ALL RIGHTS RESERVED</p>
              </div>
            </div>
            <div className={styles.bottomRight}>
              <span className={styles.builtWith}>
                DESIGNED &amp; DEVELOPED
                <br />
                WITH PRECISION.
              </span>
              <span className={styles.barDivider} />
              <span className={styles.sunIcon}>✺</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
