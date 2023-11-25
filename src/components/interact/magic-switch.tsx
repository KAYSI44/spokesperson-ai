'use client';

import styles from '@/styles/magic-switch.module.scss';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import {
  Mesh,
  SphereGeometry,
  MeshPhongMaterial,
  Object3DEventMap,
  PerspectiveCamera,
  WebGLRenderer,
  Scene,
  Color,
  PCFSoftShadowMap,
  DirectionalLight,
  Shape,
  ExtrudeGeometry,
  AmbientLight,
} from 'three';

interface MagicSwitchProps {
  toggled?: boolean;
  onToggle?: (state: boolean) => void;
}

export default function MagicSwitch({ toggled, onToggle }: MagicSwitchProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const sphereRef =
    useRef<Mesh<SphereGeometry, MeshPhongMaterial, Object3DEventMap>>();
  const cameraRef = useRef<PerspectiveCamera>();
  const rendererRef = useRef<WebGLRenderer>();
  const sceneRef = useRef<Scene>();
  const mouseXRef = useRef<number>(0);
  const mouseYRef = useRef<number>(0);

  const dotColor = '#AAAAB7';
  const activeColor = '#36363C';

  const handleInputChange = (checked: boolean) => {
    onToggle?.(checked);

    const sphere = sphereRef.current;
    if (sphere === undefined) return;

    if (checked) {
      gsap.to(sphere.scale, {
        x: 0.9,
        y: 0.9,
        z: 0.9,
        duration: 0.6,
        ease: 'elastic.out(1, .75)',
      });
      gsap.to(sphere.position, {
        x: 26,
        z: 4,
        duration: 0.6,
        ease: 'elastic.out(1, .75)',
      });
      const newColor = new Color(activeColor);
      gsap.to(sphere.material.color, {
        r: newColor.r,
        g: newColor.g,
        b: newColor.b,
        duration: 0.3,
      });
      return;
    }
    gsap.to(sphere.scale, {
      x: 0.8,
      y: 0.8,
      z: 0.8,
      duration: 0.6,
      ease: 'elastic.out(1, .75)',
    });
    gsap.to(sphere.position, {
      x: 0,
      z: 0,
      duration: 0.6,
      ease: 'elastic.out(1, .75)',
    });
    const newColor = new Color(dotColor);
    gsap.to(sphere.material.color, {
      r: newColor.r,
      g: newColor.g,
      b: newColor.b,
      duration: 0.3,
    });
  };

  const renderSwitch = () => {
    requestAnimationFrame(renderSwitch);

    const renderer = rendererRef.current;
    const camera = cameraRef.current;
    const scene = sceneRef.current;

    const mouseX = mouseXRef.current;
    const mouseY = mouseYRef.current;

    if (!(scene && camera && renderer)) return;

    camera.position.x += (mouseX - camera.position.x) * 0.25;
    camera.position.y += (-mouseY - camera.position.y) * 0.25;

    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  };

  useEffect(() => {
    const width = 108;
    const height = 68;
    const backgroundColor = '#F4F4F8';

    const roundedRect = (
      ctx: Shape,
      x: number,
      y: number,
      width: number,
      height: number,
      radius: number,
    ) => {
      ctx.moveTo(x, y + radius);
      ctx.lineTo(x, y + height - radius);
      ctx.quadraticCurveTo(x, y + height, x + radius, y + height);
      ctx.lineTo(x + width - radius, y + height);
      ctx.quadraticCurveTo(
        x + width,
        y + height,
        x + width,
        y + height - radius,
      );
      ctx.lineTo(x + width, y + radius);
      ctx.quadraticCurveTo(x + width, y, x + width - radius, y);
      ctx.lineTo(x + radius, y);
      ctx.quadraticCurveTo(x, y, x, y + radius);
    };

    const directionLight = (
      opacity: number,
      x: number,
      y: number,
      z: number,
      color = 0xffffff,
    ) => {
      const light = new DirectionalLight(color, opacity);
      light.position.set(x, y, z);
      light.castShadow = true;

      const d = 4000;
      light.shadow.camera.left = -d;
      light.shadow.camera.right = d;
      light.shadow.camera.top = d * 0.25;
      light.shadow.camera.bottom = -d;

      light.shadow.mapSize.width = 1024;
      light.shadow.mapSize.height = 1024;

      return light;
    };

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('webgl2');

    if (canvas === null || ctx === null) return;

    rendererRef.current = new WebGLRenderer({
      canvas,
      context: ctx,
      antialias: true,
      alpha: true,
    });

    const renderer = rendererRef.current;

    if (!canvas) return;

    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFSoftShadowMap;

    sceneRef.current = new Scene();
    cameraRef.current = new PerspectiveCamera(45, width / height, 0.1, 1000);

    const scene = sceneRef.current;
    const camera = cameraRef.current;

    camera.position.z = 120;

    const rectangle = new Shape();
    roundedRect(rectangle, -36, -20, 72, 40, 20);

    const backgroundShape = new ExtrudeGeometry(rectangle, {
      curveSegments: 20,
      depth: 2,
      bevelEnabled: true,
      bevelSegments: 20,
      steps: 12,
      bevelSize: 6,
      bevelThickness: 6,
    });

    const background = new Mesh(
      backgroundShape,
      new MeshPhongMaterial({
        color: new Color(backgroundColor),
        shininess: 40,
      }),
    );
    background.receiveShadow = true;

    scene.add(background);

    const dotShape = new SphereGeometry(14, 32, 32);

    sphereRef.current = new Mesh(
      dotShape,
      new MeshPhongMaterial({
        color: new Color(dotColor),
        shininess: 10,
      }),
    );

    const sphere = sphereRef.current;

    sphere.castShadow = true;

    scene.add(sphere);

    dotShape.translate(-16, 0, 24);
    sphere.scale.set(0.8, 0.8, 0.8);

    scene.add(directionLight(0.1, 0, 0, 100));
    scene.add(directionLight(0.9, 0, 80, 30));
    scene.add(directionLight(0.2, 0, -80, 60));
    scene.add(directionLight(0.3, -120, -120, -1));
    scene.add(directionLight(0.3, 120, -120, -1));

    scene.add(new AmbientLight(0x626267));

    const handlePointerMove = (e: PointerEvent) => {
      if (e.target === null) return;
      const target = e.target as HTMLElement;

      const mouseX =
        (e.clientX -
          target.getBoundingClientRect().left -
          target.offsetWidth / 2) *
        -0.8;

      const mouseY =
        (e.clientY -
          target.getBoundingClientRect().top -
          target.offsetHeight / 2) *
        -0.8;

      mouseXRef.current = mouseX;
      mouseYRef.current = mouseY;

      camera.position.x += (mouseX - camera.position.x) * 0.25;
      camera.position.y += (-mouseY - camera.position.y) * 0.25;
      camera.lookAt(scene.position);
      renderer.render(scene, camera);
    };

    const handlePointerLeave = () => {
      camera.position.x = 0;
      camera.position.y = 0;
      renderer.render(scene, camera);
    };

    const handlePointer = (e: PointerEvent, z: number) => {
      gsap.to(background.position, {
        z,
        duration: 0.15,
      });
    };

    const handlePointerDown = (e: PointerEvent) => {
      handlePointer(e, -4);
    };

    const handlePointerUp = (e: PointerEvent) => {
      handlePointer(e, 0);
    };

    canvas.addEventListener('pointermove', handlePointerMove, false);
    canvas.addEventListener('pointerleave', handlePointerLeave, false);
    canvas.addEventListener('pointerdown', handlePointerDown, false);
    canvas.addEventListener('pointerup', handlePointerUp, false);

    return () => {
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerleave', handlePointerLeave);
      canvas.removeEventListener('pointerdown', handlePointerDown);
      canvas.removeEventListener('pointerup', handlePointerUp);
    };
  }, []);

  useEffect(() => {
    renderSwitch();
    handleInputChange(toggled === undefined ? false : toggled);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <label className={styles['switch']}>
      <input
        type="checkbox"
        checked={toggled}
        onChange={(e) => handleInputChange(e.target.checked)}
      />
      <canvas ref={canvasRef}></canvas>
    </label>
  );
}
