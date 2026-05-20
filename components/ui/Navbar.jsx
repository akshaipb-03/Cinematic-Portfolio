'use client'

import { useEffect, useState } from 'react'
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from '@/components/ui/navigation-menu'
import { Button } from '@/components/ui/button'
import styles from '@/styles/ui/Navbar.module.css'

const NAV_ITEMS = ['HOME', 'ABOUT', 'WORKS', 'SERVICES', 'EXPERIENCE']

function getIST() {
  return new Date().toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  }).toUpperCase()
}

export default function Navbar() {
  const [time, setTime] = useState(getIST())

  useEffect(() => {
    const id = setInterval(() => setTime(getIST()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <header className={styles.header}>
      <span className={styles.time}>INDIA TIME - {time}</span>

      <NavigationMenu>
        <NavigationMenuList className="flex gap-6">
          {NAV_ITEMS.map(item => (
            <NavigationMenuItem key={item}>
              <NavigationMenuLink className={styles.navLink}>
                {item}
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>

      <Button
        variant="outline"
        render={<a href="mailto:vaibhavkhush124@gmail.com">Email me</a>}
        className={`${styles.emailBtn} rounded-full text-xs font-semibold px-5 h-8`}
      />
    </header>
  )
}
