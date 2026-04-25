import { useScroll, useTransform, motion } from 'framer-motion'
import { useRef } from 'react'

interface AnimatedCharProps {
  char: string
  scrollYProgress: any
  index: number
  total: number
}

function AnimatedChar({ char, scrollYProgress, index, total }: AnimatedCharProps) {
  const start = index / total
  const end = Math.min(start + 0.15, 1)
  const opacity = useTransform(scrollYProgress, [start, end], [0.45, 1])

  return (
    <motion.span style={{ opacity }} className="inline-block whitespace-pre">
      {char}
    </motion.span>
  )
}

interface AnimatedLetterProps {
  text: string
  className?: string
}

export default function AnimatedLetter({ text, className = '' }: AnimatedLetterProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.85', 'end 0.25'],
  })

  const chars = text.split('')

  return (
    <div ref={containerRef} className={`leading-[1.8] ${className}`}>
      {chars.map((char, i) => (
        <AnimatedChar
          key={i}
          char={char}
          scrollYProgress={scrollYProgress}
          index={i}
          total={chars.length}
        />
      ))}
    </div>
  )
}
