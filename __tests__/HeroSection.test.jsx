import { render, screen } from '@testing-library/react'
import HeroSection from '@/components/sections/HeroSection'

// next/image mock — required since next/image needs Next.js context
jest.mock('next/image', () =>
  function MockImage({ alt, ...props }) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img alt={alt} {...props} />
  }
)

// IntersectionObserver mock — jsdom doesn't implement it
global.IntersectionObserver = jest.fn(() => ({
  observe: jest.fn(),
  disconnect: jest.fn(),
  unobserve: jest.fn(),
}))

describe('HeroSection', () => {
  it('renders first name', () => {
    render(<HeroSection />)
    expect(screen.getByText('Vaibhav')).toBeInTheDocument()
  })

  it('renders last name', () => {
    render(<HeroSection />)
    expect(screen.getByText('Khushalani')).toBeInTheDocument()
  })

  it('renders role text', () => {
    render(<HeroSection />)
    expect(screen.getByText('Software Developer')).toBeInTheDocument()
  })

  it('renders greeting', () => {
    render(<HeroSection />)
    expect(screen.getByText("Hi, I'm")).toBeInTheDocument()
  })

  it('renders location text', () => {
    render(<HeroSection />)
    expect(screen.getByText(/Based on India/)).toBeInTheDocument()
    expect(screen.getByText(/Available worldwide/)).toBeInTheDocument()
  })

  it('renders hero image', () => {
    render(<HeroSection />)
    expect(screen.getByAltText('Vaibhav Khushalani')).toBeInTheDocument()
  })
})
