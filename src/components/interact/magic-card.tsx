import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import styles from '@/styles/magic-card.module.scss';
import Link from 'next/link';

interface MagicCardChildrenPops {
  children?: ReactNode;
}

interface MagicCardPops {
  children?: ReactNode;
  className?: string;
  href: string;
}

export default function MagicCard({
  children,
  className,
  href,
}: MagicCardPops) {
  return (
    <Link href={href}>
      <div className={cn(styles['card'], 'w-64 h-72', className)}>
        {children}
        <div className={styles['shine']}></div>
        <div className={styles['background']}>
          <div className={styles['tiles']}>
            <div className={`${styles['tile']} ${styles['tile-1']}`}></div>
            <div className={`${styles['tile']} ${styles['tile-2']}`}></div>
            <div className={`${styles['tile']} ${styles['tile-3']}`}></div>
            <div className={`${styles['tile']} ${styles['tile-4']}`}></div>

            <div className={`${styles['tile']} ${styles['tile-5']}`}></div>
            <div className={`${styles['tile']} ${styles['tile-6']}`}></div>
            <div className={`${styles['tile']} ${styles['tile-7']}`}></div>
            <div className={`${styles['tile']} ${styles['tile-8']}`}></div>

            <div className={`${styles['tile']} ${styles['tile-9']}`}></div>
            <div className={`${styles['tile']} ${styles['tile-10']}`}></div>
          </div>

          <div className={`${styles['line']} ${styles['line-1']}`}></div>
          <div className={`${styles['line']} ${styles['line-2']}`}></div>
          <div className={`${styles['line']} ${styles['line-3']}`}></div>
        </div>
      </div>
    </Link>
  );
}

MagicCard.Icon = function MagicCardIcon({ children }: MagicCardChildrenPops) {
  return <span className={styles['icon']}>{children}</span>;
};

MagicCard.Title = function MagicCardTitle({ children }: MagicCardChildrenPops) {
  return <h4>{children}</h4>;
};

MagicCard.Description = function MagicCardDescription({
  children,
}: MagicCardChildrenPops) {
  return <p>{children}</p>;
};
