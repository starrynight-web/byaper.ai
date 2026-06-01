'use client'

import createGlobe from 'cobe'
import { useEffect, useRef } from 'react'

const DHAKA: [number, number] = [23.81, 90.41]

const destinations: [number, number][] = [
  [51.5072, -0.1276],   // Europe (London)
  [40.7128, -74.006],   // Americas (New York)
  [-33.8688, 151.2093], // Oceania (Sydney)
  [35.6762, 139.6503],  // East Asia (Tokyo)
  [-1.2921, 36.8219],   // Africa (Nairobi)
]

export default function CobeGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const phiRef = useRef(1.4) // start centered on South Asia
  const pointerRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    let width = container.offsetWidth || 500
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    // Set initial canvas size
    canvas.width = width * dpr
    canvas.height = width * dpr

    const globe = createGlobe(canvas, {
      devicePixelRatio: dpr,
      width: width * dpr,
      height: width * dpr,
      phi: phiRef.current,
      theta: 0.15,
      dark: 0,
      diffuse: 1.8,
      scale: 1,
      mapSamples: 18000,
      mapBrightness: 7,
      mapBaseBrightness: 0.05,
      baseColor: [1, 1, 1],
      markerColor: [0.0, 0.55, 0.25],
      glowColor: [0.95, 0.98, 0.95],
      opacity: 0.97,
      offset: [0, 0],
      markers: [
        { location: DHAKA, size: 0.07, color: [0.96, 0.16, 0.25] },
        ...destinations.map((location) => ({
          location,
          size: 0.05,
          color: [0.0, 0.55, 0.25] as [number, number, number],
        })),
      ],
      arcs: destinations.map((to, index) => ({
        from: DHAKA,
        to,
        color: (index % 2 === 0 ? [0.0, 0.55, 0.25] : [0.96, 0.16, 0.25]) as [number, number, number],
      })),
      arcColor: [0.0, 0.55, 0.25],
      arcWidth: 0.6,
      arcHeight: 0.4,
      markerElevation: 0.04,
    })

    // Animation loop — cobe v2 requires manual RAF loop
    let animFrame: number
    function animate() {
      phiRef.current += 0.004 + pointerRef.current * 0.0007
      globe.update({
        phi: phiRef.current,
        width: width * dpr,
        height: width * dpr,
      })
      animFrame = requestAnimationFrame(animate)
    }
    animFrame = requestAnimationFrame(animate)

    // Responsive resize
    const observer = new ResizeObserver(() => {
      if (!container) return
      width = container.offsetWidth || 500
      canvas.width = width * dpr
      canvas.height = width * dpr
    })
    observer.observe(container)

    return () => {
      cancelAnimationFrame(animFrame)
      observer.disconnect()
      globe.destroy()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="relative aspect-square w-full max-w-full"
      onPointerMove={(event) => {
        pointerRef.current = (event.clientX / window.innerWidth - 0.5) * 2
      }}
      onPointerLeave={() => {
        pointerRef.current = 0
      }}
    >
      <canvas
        ref={canvasRef}
        className="h-full w-full cursor-grab rounded-lg transition-transform duration-300 active:cursor-grabbing active:scale-[0.985]"
        style={{ contain: 'layout paint size' }}
        aria-label="Animated globe with arcs connecting Dhaka to global markets"
        role="img"
      />
    </div>
  )
}
