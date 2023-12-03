'use client';

import EyeTexture from '@/media/eye-texture.png';
import { useRef, useEffect } from 'react';
import { type EyeDirection as EyeDirectionType } from '@/lib/dto';
import {
  WebGLRenderer,
  PCFSoftShadowMap,
  Scene,
  PerspectiveCamera,
  Mesh,
  SphereGeometry,
  MeshBasicMaterial,
  Euler,
  TextureLoader,
} from 'three';
import gsap from 'gsap';

interface EyeDirectionProps {
  eyeDirection: EyeDirectionType;
}

export default function EyeDirection({ eyeDirection }: EyeDirectionProps) {
  const containerRef = useRef<HTMLElement>();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cameraRef = useRef<PerspectiveCamera>();
  const rendererRef = useRef<WebGLRenderer>();
  const sceneRef = useRef<Scene>();
  const leftEyeRef = useRef<Mesh>();
  const rightEyeRef = useRef<Mesh>();

  const requestAnimationFrameId = useRef<number>();

  // Handle eye direction
  const updateEyesDirection = () => {
    if (!leftEyeRef.current || !rightEyeRef.current) return;

    const { Pitch, Yaw } = eyeDirection; // values are assumed in radians
    const eyeRotation = new Euler(Pitch, Yaw, 0);

    // GSAP tween for smooth animation
    gsap.to(leftEyeRef.current.rotation, {
      x: eyeRotation.x,
      y: eyeRotation.y,
      duration: 0.3,
      ease: 'power2.inOut',
    });

    gsap.to(rightEyeRef.current.rotation, {
      x: eyeRotation.x,
      y: eyeRotation.y,
      duration: 0.3,
      ease: 'power2.inOut',
    });
  };

  // Handle container resize
  const handleResize = () => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas || !cameraRef.current || !rendererRef.current)
      return;

    const { width, height } = container.getBoundingClientRect();

    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    cameraRef.current.aspect = width / height;
    cameraRef.current.updateProjectionMatrix();

    rendererRef.current.setSize(width, height);
  };

  // Render loop
  const animate = () => {
    if (!sceneRef.current || !cameraRef.current || !rendererRef.current) return;

    requestAnimationFrameId.current = requestAnimationFrame(animate);
    rendererRef.current.render(sceneRef.current, cameraRef.current);
  };

  useEffect(() => updateEyesDirection(), [eyeDirection]);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (requestAnimationFrameId.current !== undefined) {
      cancelAnimationFrame(requestAnimationFrameId.current);
      requestAnimationFrameId.current = undefined;
    }

    animate();

    return () => {
      if (requestAnimationFrameId.current !== undefined) {
        cancelAnimationFrame(requestAnimationFrameId.current);
      }
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const ctx = canvas?.getContext('webgl2');

    if (!container || canvas === null || ctx === null) return;
    const { width, height } = container.getBoundingClientRect();

    rendererRef.current = new WebGLRenderer({
      canvas,
      context: ctx,
      antialias: true,
      alpha: true,
    });

    const renderer = rendererRef.current;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFSoftShadowMap;

    sceneRef.current = new Scene();
    cameraRef.current = new PerspectiveCamera(50, width / height, 0.1, 1000);
    cameraRef.current.position.z = 1;
    const scene = sceneRef.current;

    // Create a texture loader for the eye texture
    const textureLoader = new TextureLoader();

    // Load the eye texture
    const eyeTexture = textureLoader.load(EyeTexture.src);

    // Create a material with the eye texture
    const eyeMaterial = new MeshBasicMaterial({ map: eyeTexture });

    // Create a sphere for the left eye
    const leftEyeGeometry = new SphereGeometry(0.2, 32, 32);
    const leftEye = new Mesh(leftEyeGeometry, eyeMaterial);
    leftEye.position.x = -0.35;
    scene.add(leftEye);

    // Create a sphere for the right eye
    const rightEyeGeometry = new SphereGeometry(0.2, 32, 32);
    const rightEye = new Mesh(rightEyeGeometry, eyeMaterial);
    rightEye.position.x = 0.35;
    scene.add(rightEye);

    leftEyeRef.current = leftEye;
    rightEyeRef.current = rightEye;
  }, []);

  return (
    <div
      className="w-1/3 aspect-video absolute top-0 left-0 m-2 bg-muted/50"
      ref={(el) => (containerRef.current = el as HTMLElement)}
    >
      <canvas ref={canvasRef}></canvas>
    </div>
  );
}
