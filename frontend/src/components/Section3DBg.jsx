import React from 'react';

/**
 * Professional 3D-style animated background for a section (CSS-only, performant).
 * Use as wrapper around section content.
 */
export default function Section3DBg({ children, className = '', style = {} }) {
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <section className={`section-3d-bg-wrap ${className}`.trim()} style={style}>
      <div className="section-3d-bg" aria-hidden="true">
        <div className="section-3d-bg-gradient section-3d-bg-gradient-1" />
        <div className="section-3d-bg-gradient section-3d-bg-gradient-2" />
        <div className="section-3d-bg-gradient section-3d-bg-gradient-3" />
        {!prefersReducedMotion && (
          <>
            <div className="section-3d-bg-grid" />
            <div className="section-3d-bg-orb section-3d-bg-orb-1" />
            <div className="section-3d-bg-orb section-3d-bg-orb-2" />
            <div className="section-3d-bg-orb section-3d-bg-orb-3" />
          </>
        )}
      </div>
      <div className="section-3d-bg-content">
        {children}
      </div>
    </section>
  );
}
