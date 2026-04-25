import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

interface WordsPullUpProps {
  text: string
  className?: string
  wordClassName?: string
  stagger?: number
  delay?: number
}

export default function WordsPullUp({ text, className = '', wordClassName = '', stagger = 0.08, delay = 0 }: WordsPullUpProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const words = text.split(' ')

  return (
    <span ref={ref} className={`inline-flex flex-wrap gap-x-[0.25em] overflow-hidden ${className}`}>
      {words.map((word, i) => (
        <span key={i} className="overflow-hidden inline-block">
          <motion.span
            className={`inline-block ${wordClassName}`}
            initial={{ y: '100%', opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : { y: '100%', opacity: 0 }}
            transition={{
              duration: 0.7,
              delay: delay + i * stagger,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </span>
  )
}
