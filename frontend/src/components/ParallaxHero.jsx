import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

/**
 * Wraps hero content with subtle mouse-follow parallax for depth
 */
export default function ParallaxHero({ children, className = '' }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 30, stiffness: 100 };
  const moveX = useSpring(useTransform(x, [-1, 1], [-8, 8]), springConfig);
  const moveY = useSpring(useTransform(y, [-1, 1], [-8, 8]), springConfig);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const relX = (e.clientX - centerX) / (rect.width / 2);
    const relY = (e.clientY - centerY) / (rect.height / 2);
    x.set(Math.max(-1, Math.min(1, relX)));
    y.set(Math.max(-1, Math.min(1, relY)));
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 1000 }}
    >
      <motion.div style={{ x: moveX, y: moveY, rotateX: 0, rotateY: 0 }}>
        {children}
      </motion.div>
    </div>
  );
}
