'use client'
import React, { useState, useEffect } from 'react'
import { SlArrowUp } from 'react-icons/sl'

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Function to check if user has scrolled down enough to show the button
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) { // Adjust 300 to your desired scroll position
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    // Event listener to check scroll position on scroll
    window.addEventListener('scroll', toggleVisibility)

    // Clean up the event listener when component unmounts
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Render the button only if isVisible state is true
  return (
    isVisible && (
      <button
        onClick={scrollToTop}
        className='btn rounded-full btn-primary fixed z-30 bottom-20 right-4'
        id='scrolltotop'
      >
        <SlArrowUp size={18} />
      </button>
    )
  )
}

export default ScrollToTop
