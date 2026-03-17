import { useRef, useEffect, useState } from 'react'

const FadeIn = ({ children, className = '', style = {}, tag: Tag = 'div' }) => {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setIsVisible(true)
        observer.unobserve(entry.target)
      },
      { threshold: 0.15 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <Tag
      ref={ref}
      className={`fade-in${isVisible ? ' visible' : ''} ${className}`}
      style={style}
    >
      {children}
    </Tag>
  )
}

export default FadeIn
