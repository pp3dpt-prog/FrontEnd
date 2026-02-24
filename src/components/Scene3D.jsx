import React, { Suspense } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, Stage, Center } from '@react-three/drei';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';

function Model({ url }) {
  const geom = useLoader(STLLoader, url);
  
  return (
    <mesh geometry={geom}>
      {/* Ouro metálico */}
      <meshStandardMaterial color="#d4af37" metalness={0.7} roughness={0.2} />
    </mesh>
  );
}

export default function Scene3D({ stlUrl }) {
  return (
    <div style={{ width: '100%', height: '400px', background: '#050505', borderRadius: '8px' }}>
      <Canvas shadows camera={{ position: [0, 0, 100], fov: 50 }}>
        {/* Luzes escritas em formato JSX correto */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} />

        <Suspense fallback={null}>
          <Stage environment="city" intensity={0.6}>
            <Center>
              {stlUrl && <Model url={stlUrl} />}
            </Center>
          </Stage>
        </Suspense>
        <OrbitControls makeDefault />
      </Canvas>
    </div>
  );
}