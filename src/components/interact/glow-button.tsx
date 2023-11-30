'use client'

import { cn } from '@/lib/utils';
import styles from '@/styles/glow-button.module.scss';
import { type ReactNode } from 'react';

interface GlowButtonProps {
  children?: ReactNode;
  enabled?: boolean;
  onClick?: () => void;
}

export default function GlowButton({
  children,
  enabled,
  onClick,
}: GlowButtonProps) {
  return (
    <button
      onClick={() => enabled !== false && onClick?.()}
      className={cn(styles['colorful-button'], styles['dark'], 'font-sans', enabled === false && 'opacity-40')}
    >
      <div className={styles['wrapper']}>
        <span>{children}</span>
        <div className={cn(styles['circle'], styles['circle-12'])}></div>
        <div className={cn(styles['circle'], styles['circle-11'])}></div>
        <div className={cn(styles['circle'], styles['circle-10'])}></div>
        <div className={cn(styles['circle'], styles['circle-9'])}></div>
        <div className={cn(styles['circle'], styles['circle-8'])}></div>
        <div className={cn(styles['circle'], styles['circle-7'])}></div>
        <div className={cn(styles['circle'], styles['circle-6'])}></div>
        <div className={cn(styles['circle'], styles['circle-5'])}></div>
        <div className={cn(styles['circle'], styles['circle-4'])}></div>
        <div className={cn(styles['circle'], styles['circle-3'])}></div>
        <div className={cn(styles['circle'], styles['circle-2'])}></div>
        <div className={cn(styles['circle'], styles['circle-1'])}></div>
      </div>
    </button>
  );
}
