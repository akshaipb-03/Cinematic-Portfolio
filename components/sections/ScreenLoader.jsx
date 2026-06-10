'use client'

import { useState } from 'react'
import styles from '@/styles/sections/ScreenLoader.module.css'

export default function ScreenLoader({ onDismiss }) {
  const [dismissing, setDismissing] = useState(false)

  function handleStart() {
    window.dispatchEvent(
      new CustomEvent('loader-dismissed')
    )
    setDismissing(true)

    setTimeout(() => {
      window.dispatchEvent(
        new CustomEvent('loader-animation-done')
      )
      onDismiss()
    }, 1000)
  }

  return (
    <>
      <div className={`${styles.overlay} ${dismissing ? styles.overlayDismissed : ''}`}>
        <div className={styles.liquidBg} aria-hidden />

        <p className={styles.monogram}>
          AKSHAI P B
        </p>

        <button
          className={styles.startBtn}
          onClick={handleStart}
        >
          Start
        </button>
      </div>

      {dismissing && (
        <>
          <div className={styles.splitTop} />
          <div className={styles.splitBottom} />
          <div className={styles.centerLine} />
        </>
      )}
    </>
  )
}