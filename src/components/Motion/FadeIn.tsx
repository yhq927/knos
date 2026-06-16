import React, { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

interface FadeInProps {
  children: React.ReactNode
  direction?: 'up' | 'down' | 'left' | 'right'
  delay?: number
  duration?: number
  distance?: number
  className?: string
  style?: React.CSSProperties
  once?: boolean
}

const directionMap = {
  up: { y: 40, x: 0 },
  down: { y: -40, x: 0 },
  left: { x: 40, y: 0 },
  right: { x: -40, y: 0 },
}

const FadeIn: React.FC<FadeInProps> = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.6,
  distance = 40,
  className,
  style,
  once = true,
}) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, margin: '-60px' })
  const offset = directionMap[direction]

  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      initial={{
        opacity: 0,
        x: offset.x ? (offset.x > 0 ? distance : -distance) : 0,
        y: offset.y ? (offset.y > 0 ? distance : -distance) : 0,
      }}
      animate={
        isInView
          ? { opacity: 1, x: 0, y: 0 }
          : {
              opacity: 0,
              x: offset.x ? (offset.x > 0 ? distance : -distance) : 0,
              y: offset.y ? (offset.y > 0 ? distance : -distance) : 0,
            }
      }
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  )
}

export default FadeIn
