import { useEffect, useRef } from "react";
import * as THREE from "three";
import Dashboard from "./pages/Dashboard";

function App() {
  const mountRef = useRef(null);

  useEffect(() => {
    // Reference ko variable mein capture karo cleanup ke liye
    const currentRef = mountRef.current;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    if (currentRef) {
      currentRef.appendChild(renderer.domElement);
    }

    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 2000;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 10;
    }

    particlesGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(posArray, 3)
    );

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.02,
      color: 0xff00ff,
    });

    const particlesMesh = new THREE.Points(
      particlesGeometry,
      particlesMaterial
    );

    scene.add(particlesMesh);
    camera.position.z = 5;

    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      particlesMesh.rotation.y += 0.0008;
      particlesMesh.rotation.x += 0.0004;
      renderer.render(scene, camera);
    };

    animate();

    // 🔥 CLEANUP SECTION (FIXED)
    return () => {
      cancelAnimationFrame(animationFrameId);
      if (currentRef && renderer.domElement) {
        currentRef.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full text-white bg-black overflow-hidden">
      {/* Three.js Canvas Container */}
      <div
        ref={mountRef}
        className="absolute inset-0 z-0"
      />

      {/* Dark overlay for better UI contrast */}
      <div className="absolute inset-0 bg-black/70 z-10 pointer-events-none"></div>

      {/* Real Content */}
      <div className="relative z-20">
        <Dashboard />
      </div>
    </div>
  );
}

export default App;