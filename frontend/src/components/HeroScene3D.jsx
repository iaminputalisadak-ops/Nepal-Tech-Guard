import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';

// Floating geometric shape with subtle glow
function FloatingShape({ shape = 'box', position, scale = 1, color, speed = 0.3 }) {
  const meshRef = useRef();
  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.elapsedTime;
      meshRef.current.rotation.x = t * speed * 0.3;
      meshRef.current.rotation.y = t * speed * 0.5;
      meshRef.current.position.y = position[1] + Math.sin(t * 0.8) * 0.15;
    }
  });

  const geometry = () => {
    switch (shape) {
      case 'torus': return <torusKnotGeometry args={[0.5, 0.15, 64, 16]} />;
      case 'octahedron': return <octahedronGeometry args={[0.6, 0]} />;
      case 'dodecahedron': return <dodecahedronGeometry args={[0.5, 0]} />;
      case 'icosahedron': return <icosahedronGeometry args={[0.5, 0]} />;
      default: return <boxGeometry args={[0.6, 0.6, 0.6]} />;
    }
  };

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      {geometry()}
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.15}
        metalness={0.4}
        roughness={0.6}
        transparent
        opacity={0.85}
      />
    </mesh>
  );
}

// Ambient particles
function Particles() {
  const count = 80;
  const positions = new Float32Array(count * 3);
  const ref = useRef();
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 15;
  }
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.04} color="#3b82f6" transparent opacity={0.4} sizeAttenuation />
    </points>
  );
}

// Main scene
function Scene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <pointLight position={[-5, -5, 5]} color="#6366f1" intensity={0.5} />
      <pointLight position={[5, 0, -5]} color="#3b82f6" intensity={0.3} />
      <Particles />
      <FloatingShape shape="torus" position={[-2, 0.5, -3]} scale={0.8} color="#3b82f6" speed={0.2} />
      <FloatingShape shape="octahedron" position={[2.5, -0.3, -4]} scale={0.6} color="#6366f1" speed={0.25} />
      <FloatingShape shape="dodecahedron" position={[0, 1.2, -5]} scale={0.5} color="#22c55e" speed={0.15} />
      <FloatingShape shape="icosahedron" position={[-1.5, -0.8, -2]} scale={0.4} color="#a855f7" speed={0.3} />
      <FloatingShape shape="box" position={[1.8, 0.6, -3.5]} scale={0.45} color="#0ea5e9" speed={0.2} />
    </>
  );
}

export default function HeroScene3D() {
  const [ready, setReady] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const mqMobile = window.matchMedia('(max-width: 768px)');
    const check = () => setReady(!mq.matches && !mqMobile.matches);
    check();
    mq.addEventListener('change', check);
    mqMobile.addEventListener('change', check);
    return () => {
      mq.removeEventListener('change', check);
      mqMobile.removeEventListener('change', check);
    };
  }, []);

  if (!ready) return null;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={['transparent']} />
        <Scene />
      </Canvas>
    </div>
  );
}
