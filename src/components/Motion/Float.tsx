import React from 'react'
import { motion } from 'framer-motion'

interface FloatProps {
  children: React.ReactNode
  duration?: number
  distance?: number
  delay?: number
  className?: string
  style?: React.CSSProperties
}

const Float: React.FC<FloatProps> = ({
  children,
  duration = 6,
  distance = 12,
  delay = 0,
  className,
  style,
}) => {
  return (
    <motion.div
      className={className}
      style={style}
      animate={{
        y: [-distance, distance, -distance],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
    >
      {children}
    </motion.div>
  )
}

export default Float
